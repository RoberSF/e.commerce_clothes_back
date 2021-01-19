import { IResolvers } from 'graphql-tools';
import { IStock } from '../../interfaces/stock.interface';
import { updateStock, findOneElement, asingDocumentId, inserOneElement, updateOne, deleteOne } from '../../lib/db-functions';
import { COLLECTIONS, SUBSCRIPTIONS_EVENT } from '../../config/constants';
import slugify from 'slugify';


const resolversProductMutation: IResolvers = {

  Mutation: {
    
  async updateStock(_, {update}, {db, pubsub}) {

        let updateList:Array<IStock> = update;
        
        try {
            updateList.map( async (item:IStock) => {
                const itemsDetails = await findOneElement(db, COLLECTIONS.PRODUCTS_ITEMS, {id: item.id});
                // Comprobación para que el stock no pueda ser menos que cero
                if(item.increment < 0 && ((item.increment + itemsDetails.stock) < 0)) {
                   item.increment = -itemsDetails.stock; // el - es para que se ponga en cero
                 }
                await updateStock(db, COLLECTIONS.PRODUCTS_ITEMS,{ id: item.id}, {stock: item.increment});
                itemsDetails.stock += item.increment;
                // Publicamos al socket uno a uno el cambio 
                pubsub.publish(SUBSCRIPTIONS_EVENT.UPDATE_STOCK_PRODUCT, {
                  selectProductStockUpdate: itemsDetails,
                });
            })

            return true
        } catch(e) {
            return false
        }
  },

  async addProduct(_, { product }, { db }) {

      // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
      if (product === '' || product === undefined) {
          return {
              status: false,
              message: `El product no se ha especificado correctamente`,
              product: null
          }
      };

      // Comprobar que no existe
      if (product){
          const productCheck = await findOneElement(db,COLLECTIONS.PRODUCTS_ITEMS,{name: product.name})
          
          if (productCheck !== null) {
              return {
                status: false,
                message: `El product con nombre "${product.name}" está registrado y no puedes registrarlo`,
                product: null
              };
            }
      } 
  

      // En caso contrario que tag el document para insertarlo
      const productObject = {
          id: await asingDocumentId(db, COLLECTIONS.PRODUCTS_ITEMS, { id: -1}),
          name: product.name,
          slug: slugify(product.name || '', { lower: true }),
          categoria: product.categoria || '',
          size: product.size || [],
          color: product.color || [],
          photo: product.photo || '',
          price: product.price || '',
          screenshoots: product.screenchots || [],
          active: false,
          stock: product.stock || 0

      };


      try {
          return await inserOneElement(db,COLLECTIONS.PRODUCTS_ITEMS,productObject)
          .then(
              result => {
                  // También hay result.n que nos dice el número de elementos que nos devolvió
                  if (result.result.ok === 1) {
                      return {
                          status: true,
                          message: `El product se registró correctamente`,
                          product: productObject
                        };
                  }
                  return {
                      status: false,
                      message: `Error inesperado al insertar product. Inténtalo de nuevo por favor.`,
                      product: null
                  }

            })
      } catch(error) {
          return {
              status: false,
              message: `Error inesperado al insertar product. Inténtalo de nuevo por favor.`,
              product: null
          }
      }
  },


    async updateProduct(_, { id, product }, { db }) {
    
      const filterProductObjectId = { id: id}
  
       const productObject = {
        name: product.name,
        slug: slugify(product.name || '', { lower: true }),
        description: product.description,
        categoria: product.categoria, 
        size: product.size ,
        color: product.color ,
        photo: product.photo ,
        price: product.price ,
        screenshoots: product.screenchots,
        active: product.active,
        stock: product.stock
  
    };

  
      try {
          return await updateOne(db,COLLECTIONS.PRODUCTS_ITEMS,filterProductObjectId, productObject)
          .then(
              result => {
                  // También hay result.n que nos dice el número de elementos que nos devolvió
                  if (result.result.nModified === 1) {
                      return {
                          status: true,
                          message: `El producto se actualizó correctamente`,
                          // Object.assign es para mezclar ambos elementos
                          product: productObject
                        };
                  }
                  return {
                      status: false,
                      message: `Error inesperado al actualizar producto. Inténtalo de nuevo por favor.`,
                      product: null
                  }
  
            })
      } catch(error) {
          return {
              status: false,
              message: `Error inesperado al actualizar producto. Inténtalo de nuevo por favor.`,
              product: null
          }
      }
  },
  
  async deleteProduct(_, { id }, { db }) {
  
    if (String(id) === '' || String(id) === undefined) {
        return {
            status: false,
            message: `El ${id} de product no se ha especificado correctamente`,
            product: null
        }
    };
  
    try {
        return await deleteOne(db,COLLECTIONS.PRODUCTS_ITEMS,{id: id})
        .then(
            result => {
                // También hay result.n que nos dice el número de elementos que nos devolvió
                if (result.ok === 1) {
                    return {
                        status: true,
                        message: `El product con id: ${id} se borró correctamente`,
                        product: null
                      };
                }
                return {
                    status: false,
                    message: `Error al borrar product. Inténtalo de nuevo por favor.`,
                    product: null
                }
  
          })
    } catch(error) {
        return {
            status: false,
            message: `Error inesperado al borrar product. Inténtalo de nuevo por favor.`,
            product: null
        }
    }
  },

  async blockProduct(_, { id }, { db }) {
    
      // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
      if (String(id) === '' || String(id) === undefined) {
          return {
              status: false,
              message: `El ${id} de product no se ha especificado correctamente`,
              product: null
          }
      };
    
      // En caso contrario que genere el document para insertarlo
      const filterProductObjectId = { id: id}
      const objectUpdate = {
          active: false
      };
    
      try {
          return await updateOne(db,COLLECTIONS.PRODUCTS_ITEMS,filterProductObjectId, objectUpdate)
          .then(
              result => {
                  // También hay result.n que nos dice el número de elementos que nos devolvió
                  if (result.result.nModified === 1) {
                      return {
                          status: true,
                          message: `El product se bloqueó correctamente`,
                          // Object.assign es para mezclar ambos elementos
                          product: Object.assign({}, filterProductObjectId, objectUpdate)
                        };
                  }
                  return {
                      status: false,
                      message: `Error inesperado al bloquear product. Inténtalo de nuevo por favor.`,
                      product: null
                  }
    
            })
      } catch(error) {
          return {
              status: false,
              message: `Error inesperado al bloquear product. Inténtalo de nuevo por favor.`,
              product: null
          }
      }
  },
    
  async unBlockProduct(_, { id }, { db }) {
    
      // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
      if (String(id) === '' || String(id) === undefined) {
          return {
              status: false,
              message: `El ${id} de product no se ha especificado correctamente`,
              product: null
          }
      };
    
      // En caso contrario que genere el document para insertarlo
      const filterProductObjectId = { id: id}
      const objectUpdate = {
          active: true
      };
    
      try {
          return await updateOne(db,COLLECTIONS.PRODUCTS_ITEMS,filterProductObjectId, objectUpdate)
          .then(
              result => {
                  // También hay result.n que nos dice el número de elementos que nos devolvió
                  if (result.result.nModified === 1) {
                      return {
                          status: true,
                          message: `El product desbloqueado correctamente`,
                          // Object.assign es para mezclar ambos elementos
                          product: Object.assign({}, filterProductObjectId, objectUpdate)
                        };
                  }
                  return {
                      status: false,
                      message: `Error inesperado al desbloquear product. Inténtalo de nuevo por favor.`,
                      product: null
                  }
    
            })
      } catch(error) {
          return {
              status: false,
              message: `Error inesperado al desbloquear product. Inténtalo de nuevo por favor.`,
              product: null
          }
      }
  },

    

    }
  }




export default resolversProductMutation




