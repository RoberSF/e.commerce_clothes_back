import { Db } from "mongodb";
import { IPaginationOptions } from '../interfaces/pagination-options.interface';
import { pagination } from "./pagination";
import { ACTIVE_VALUES_FILTER, COLLECTIONS } from '../config/constants';

/**
 * Obtener el ID que vamos a utilizar en el nuevo usuario
 * @param database Base de datos con la que estamos trabajando de mongo
 * @param collection  Colección donde queremos buscar el último elemento
 * @param sort  Como queremos ordenarlo { <propiedad>: -1}
 */   
      
      
//**************************************************************************************************
//                 Comprobar el último usuario registrado para asignar ID                                                           
//**************************************************************************************************

export  const asingDocumentId = async (database: Db, collection: string, sort: object = {registerDate: -1} ) => {
            const lastElement = await database
            .collection(collection)
            .find()
            .limit(1)
            .sort(sort) // Ordenamos de manera descente
            .toArray(); // Para obtener una lista
          if (lastElement.length === 0) {
            return '1';
          } else {

            // El "+" hace que la operación sea en "número" y despues con String() lo pasamos a texto
            return String(+lastElement[0].id + 1);
          } 
} 


//**************************************************************************************************
//                      Encuentra un elemento de la calección de MongoDb                                                           
//**************************************************************************************************

export const findOneElement = async (database: Db, collection: string, filter: object) => {
    return database.collection(collection).findOne(filter);
};


//**************************************************************************************************
//                         Con esta inserta uno elemento                                                           
//**************************************************************************************************

export const inserOneElement = async (database: Db, collection: string, document:object) => {
      return await database.collection(collection).insertOne(document)
};



//**************************************************************************************************
//                        Inserta varios elementos/objetos                                                           
//**************************************************************************************************

export const inserManyElements = async (database: Db, collection: string, documents:Array<object>) => {
     return await database.collection(collection).insertMany(documents)
};



//**************************************************************************************************
//                   Lista elementos de una colección                                                                
//**************************************************************************************************

export const findElements = async(database: Db, collection: string, args:any = {}, paginationOptions: IPaginationOptions = {page: 1, pages: 1, itemsPage: -1, skip: 0, total: -1}) => {

  let filter = {}
  let filteredActive: object = {active: true};

  if(args.active === ACTIVE_VALUES_FILTER.ALL){
    filteredActive = {}
  } else if(args.active === ACTIVE_VALUES_FILTER.INACTIVE ) {
    filteredActive = {active: false}
  }
   return await database.collection(collection).find(filter)
       .filter(filteredActive)
       .skip(paginationOptions.skip)
       .limit(paginationOptions.itemsPage)
       .sort({id: -1})
       .toArray();
}


//**********************************************************************************************************************************************************
//                   Lista de elementos de una colección con paginación y filtro por plataforma
//       Esta función se rehutiliza para hacer búsqueda sólo con filtro active o si le mandamos un array de id(colors, sizes, categorias) 
// (En caso de que lista de usuarios, géneros etc no funcione, cambiar a findElements que sólo tiene filtro "active" )                                                  
//**********************************************************************************************************************************************************

export const findElementsSub = async(database: Db, collection: string, args:any,paginationOptions: IPaginationOptions = {page: 1, pages: 1, itemsPage: -1, skip: 0, total: -1}) => {

let filter = {};
let filteredActive: object = {active: {$ne: false}};
let itemId: Array<any> = [];
const asignId = args.itemId ? itemId = args.itemId : itemId = [];
let filterTogether = filteredActive


  if ( paginationOptions.total === -1){
    return await database.collection(collection).find(filter).toArray();
  }
  
  
  if(args.active === ACTIVE_VALUES_FILTER.ALL){
    filteredActive = {}
  } else if(args.active === ACTIVE_VALUES_FILTER.INACTIVE ) {
    filteredActive = {active: {$eq: false}}
  }
  

  switch (args.filter) {

    case 'sizeId':
      if (itemId && itemId !== undefined){
        filterTogether = {...filteredActive, ...{sizeId: {$in: itemId}}   } // { active: { '$ne': false }, platform_id: { '$in': [ '4', '18' ] } }
      }
      break;
    case 'colorId':
      if (itemId && itemId !== undefined){
        filterTogether = {...filteredActive, ...{colorId: {$in: itemId}}   } // { active: { '$ne': false }, platform_id: { '$in': [ '4', '18' ] } }
      }
      break;
    case 'categoriaId':
      if (itemId && itemId !== undefined){
        filterTogether = {...filteredActive, ...{categoria: {$in: itemId}} }// { active: { '$ne': false }, platform_id: { '$in': [ '4', '18' ] } }
      }
      break;
    default:
      break;
  }

  if (itemId.length <= 0 || itemId == undefined){
    filterTogether = {...filteredActive}
  }

  return await database.collection(collection).find(filter)
            .filter(filterTogether) // relacionado con los registros bloqueados
            .skip(paginationOptions.skip)
            .limit(paginationOptions.itemsPage)
            .sort({id: -1}) // Ordenamos de manera descente
            .toArray();
             // Para obtener una lista
}


//**************************************************************************************************
//                   Actuañizar elemento. Usado en genres                                                           
//**************************************************************************************************

export const updateOne = async(database: Db, collection: string, filter:object = {}, objectUpdated: object = {}) => {
  return await database.collection(collection).updateOne(filter, {$set: objectUpdated});
}


//**************************************************************************************************
//                Actualizar elemento. Usado en users                                                           
//**************************************************************************************************

export const updateFindOne = async(database: Db, collection: string, filter:object = {}, objectUpdated: object = {}) => {
  return await database.collection(collection).findOneAndUpdate(filter, objectUpdated);
}


//**************************************************************************************************
//                      Eliminar un elemento                                                           
//**************************************************************************************************

export const deleteOne = async(database: Db, collection: string, filter:object = {}) => {
  return await database.collection(collection).findOneAndDelete(filter)
}
//**************************************************************************************************
//                      Eliminar varios elementos                                                           
//**************************************************************************************************

export const deleteMany = async(database: Db, collection: string, filter:object = {}) => {
  return await database.collection(collection).deleteMany(filter)
}

//**************************************************************************************************
//                   Contar cuantos elementos hay en una colección                                                           
//**************************************************************************************************

export const countlements = async(database: Db, collection: string, filter: object = {}) => {
  return await database.collection(collection).countDocuments(filter);
}

//**************************************************************************************************
//                        $match y $sample MongoDB   
//                        Filtro por plataformas                                                         
//**************************************************************************************************



export const findElementsSubRandom = async(database: Db, collection: string, args:any, paginationOptions: IPaginationOptions = {page: 1, pages: 1, itemsPage: -1, skip: 0, total: -1}) => {


  // console.log('args',args);
  let filter = {};
  let filteredActive: object = {active: {$ne: false}};
  // let platform_id = args[1].platform_id;
  let platform_id: Array<string> = args[1].platform_id;
  let filterTogether = filteredActive

  
  
    if ( paginationOptions.total === -1){
      return await database.collection(collection).find(filter).toArray();
    }
    
    
    if(args[0].active === ACTIVE_VALUES_FILTER.ALL){
      filteredActive = {}
    } else if(args[0].active === ACTIVE_VALUES_FILTER.INACTIVE ) {
      filteredActive = {active: {$eq: false}}
    }
    
    // if (platform_id !== '' && platform_id !== undefined){
    if (platform_id.length > 0 && platform_id !== undefined){
  
      // filterTogether = {...filteredActive, ...{platform_id}}
      filterTogether = {...filteredActive, ...{platform_id: {$in: platform_id}}   }
      
    }
  
    // if (platform_id == '' || platform_id == undefined){
    if (platform_id.length <= 0 || platform_id == undefined){
  
      filterTogether = {...filteredActive}
    }
  
    if ( args[2].random == undefined || args[2].random == null || !args[2].random) {
      

      return await database.collection(collection).find(filter)
      .filter(filterTogether) // relacionado con los registros bloqueados
      .skip(paginationOptions.skip)
      .limit(paginationOptions.itemsPage)
      .sort({id: -1}) // Ordenamos de manera descente
      .toArray();
       // Para obtener una lista
    } else {


      const pipeline = [ 
        {$match: filterTogether}, // le mandaría todas las querys/filtros juntas
        {$sample: {size: paginationOptions.itemsPage}} //l eidgo el número de items random que quiero
      ];
      // console.log(pipeline);
        //**************************************************************************************************
        //  Consulta Database con $match y $sample. Tiene que ser una lista de objetos el agregate                                                          
        //**************************************************************************************************
        return await database.collection(collection).aggregate(pipeline)
            .skip(paginationOptions.skip)
            .limit(paginationOptions.itemsPage)
            .sort({id: -1})
            .toArray()
    }


  }




//**************************************************************************************************
//                            Filtrado por ofertas y número de stock
//  De X precio para abajo, de Stock para abajo y ordenados de menos a más por precio                                                           
//**************************************************************************************************

  export const findElementsOfferPrice = async(database: Db, collection: string, args:any,paginationOptions: IPaginationOptions = {page: 1, pages: 1, itemsPage: -1, skip: 0, total: -1}) => {

    let filter = {}
    let filteredActive: object = {$ne: false};
    let sortBy = 1;

    let otherFilters:object = {};


      if ( paginationOptions.total === -1){
        return await database.collection(collection).find(filter).toArray();
      }
      
      if(args[0].active === ACTIVE_VALUES_FILTER.ALL){
        filteredActive = {$ne: false}
      } else if(args[0].active === ACTIVE_VALUES_FILTER.INACTIVE ) {
        filteredActive = {$eq: false}
      }

      if(args[2].topPrice > 5 ) {

        otherFilters = { $and: [ {active: filteredActive}, {price: {$lte: args[2].topPrice } } ]  } 
      }
      
      // let pipeline = [ {$match: { $and: [ {active: filteredActive }, {price: {$lte: args[2].topPrice} } ] } }, {$sample: {size: paginationOptions.itemsPage} } ];
      let pipeline = [ {$match: otherFilters }, {$sample: {size: paginationOptions.itemsPage} }];
      

      if ( args[1].random == undefined || args[1].random == null || !args[1].random ) {

      pipeline = [ 
          {$match: otherFilters}// le mandaría todas las querys/filtros juntas
        ];


      return await database.collection(collection).aggregate(pipeline)
        .skip(paginationOptions.skip)
        .limit(paginationOptions.itemsPage)
        .sort({price: sortBy})
        .toArray()
      } else {

      return await database.collection(collection).aggregate(pipeline)
        .skip(paginationOptions.skip)
        .limit(paginationOptions.itemsPage)
        .sort({price: sortBy})
        .toArray()
      }

      
    }

  //**************************************************************************************************
  //               Búsqueda de elementos genérica ya que las otras tienen filtros                                                           
  //**************************************************************************************************
  
  export const findElementsNormal = async(database: Db, collection: string, filter:object = {}) => {
      return await database.collection(collection).find(filter).toArray();
    }


//**************************************************************************************************
//                 Manejar el stock de un producto                                                             
//**************************************************************************************************

  export const updateStock = async(database: Db, collection: string, filter:object = {}, objectUpdated: object = {}) => {
    return await database.collection(collection).updateOne(filter, {$inc: objectUpdated});
  }

  //**************************************************************************************************
  //                 Método para añadir un campo a todos los registros                                                           
  //**************************************************************************************************
  
  export const insertUpdateAll = async (database: Db, collection: string) => {
    return await database.collection(collection).updateMany({}, {$set : {"active":true}})
  };

  //**************************************************************************************************
  //                 Método de filtrado para búsqueda component                                                       
  //**************************************************************************************************
  export const findElementsSearch = async(database: Db, collection: string, args:any) => {


    let filterName = args.name 
    let filterActive: object = {$ne: false}

    if(args.active === ACTIVE_VALUES_FILTER.INACTIVE ) {
      filterActive = {$eq: false}
    }
    //utilizar un $or // no works por que choca con el $and. Tendría que crear dos objetos diferentes
    if(args.active === ACTIVE_VALUES_FILTER.ALL ) {
      filterActive = {$or: [false,true]}
    }
    

   let filters = { 
     $and: [
       { active: filterActive }, 
       { name: {$regex: filterName, $options:"$i" } }] 
   }
 
   let pipeline = [
     { $match: filters }
   ]
 
     return await database.collection(collection).aggregate(pipeline).sort({id: -1}).toArray()

  }

  //**************************************************************************************************
  //                 Método para añadir a un objeto tipo Array                                                    
  //**************************************************************************************************

  export const updateScreenshoots = async(database: Db, args:any) => {

    let object = { $push: { screenshoots: args.screenshoots } }

    const tryit = await database.collection(args.collection).updateOne({id: args.id}, object)

    return tryit

  }


  //**************************************************************************************************
  //                 Método para eliminar primer objeto de un array                                                    
  //**************************************************************************************************
  export const deleteFirstElemArray =  async (database: Db, collection: string, args:any) => {

    let object = { $pop: { screenshoots: -1 } }

    const tryit = await database.collection(collection).updateOne({id: args.id}, object)

    return tryit
  }


  export const countElements = async(database: Db, collection: string, args:any) => {

    let filteredActive: object = {active: {$ne: false}};
    let itemId: Array<any> = [];
    const asignId = args.itemId ? itemId = args.itemId : itemId = [];
    let filterTogether = filteredActive
    
  
      if(args.active === ACTIVE_VALUES_FILTER.ALL){
        filteredActive = {}
      } else if(args.active === ACTIVE_VALUES_FILTER.INACTIVE ) {
        filteredActive = {active: {$eq: false}}
      }
      
    
      switch (args.filter) {
    
        case 'sizeId':
          if (itemId && itemId !== undefined){
            filterTogether = {...filteredActive, ...{sizeId: {$in: itemId}}   } // { active: { '$ne': false }, platform_id: { '$in': [ '4', '18' ] } }
          }
          break;
        case 'colorId':
          if (itemId && itemId !== undefined){
            filterTogether = {...filteredActive, ...{colorId: {$in: itemId}}   } // { active: { '$ne': false }, platform_id: { '$in': [ '4', '18' ] } }
          }
          break;
        case 'categoriaId':
          if (itemId && itemId !== undefined){
            filterTogether = {...filteredActive, ...{categoria: {$in: itemId}} }// { active: { '$ne': false }, platform_id: { '$in': [ '4', '18' ] } }
          }
          break;
        default:
          break;
      }
    
      if (itemId.length <= 0 || itemId == undefined){
        filterTogether = {...filteredActive}
      }
    
      return await database.collection(collection).count(filterTogether)
    }