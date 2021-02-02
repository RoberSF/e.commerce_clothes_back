import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from '../../config/constants';
import { findElementsSearch, findElementsSub, findOneElement } from '../../lib/db-functions';
import { pagination } from '../../lib/pagination';


const resolversCategoriaQuery: IResolvers = {
    Query: {

//**************************************************************************************************
//   Método para listar elemtos solamente                                                           
//**************************************************************************************************

   async categorias  (_, {page, itemsPerPage, active}, { db }) {

    try {
        const paginationData = await pagination(db, COLLECTIONS.CATEGORIAS, page, itemsPerPage);
        return {
            info: {
                page: paginationData.page, 
                pages:paginationData.pages, 
                total: paginationData.total,
                itemsPerPage: paginationData.itemsPage
                    },
            status: true,
            message: 'Lista de categorias correctamente cargada',
            categorias: await findElementsSub(db, COLLECTIONS.CATEGORIAS, {active: active}, paginationData)
        }
    } catch (error) {
        return {
        info: null,
        status: false,
        message: `Lista de categorias no cargada: ${error}`
    }}
},

//**************************************************************************************************
//                 Método para listar un género pasandole un id                                                           
//**************************************************************************************************
 
async categoria(_, {id}, {db}) {
    try {
        return {
            status: true,
            message: `Categoria con ${id} cargado correctamente`,
            categorias: await findOneElement(db, COLLECTIONS.CATEGORIAS, {id: id}),
        }
    } catch (error) {
        return {
        status: false,
        message: `Categoria no cargado: ${error}`
    }}
},

async categoriaSearch(_, { page, itemsPerPage, active, value}, { db }) {


    // ** platform ahora tendría que se run array de strings
    // console.log(platform);
    try {
        return {
            status: true,
            message: 'Lista de tags correctamente cargada',
            categorias: await findElementsSearch(db, COLLECTIONS.CATEGORIAS, {active: active, name: value})
        }
    } catch (error) {
        return {
        info: null,
        status: false,
        message: `Lista de categorias no cargada: ${error}`
    }}
   },
}
};

export default resolversCategoriaQuery;



