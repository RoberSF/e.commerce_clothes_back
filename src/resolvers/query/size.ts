import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from '../../config/constants';
import { findElementsSub, findOneElement } from '../../lib/db-functions';
import { pagination } from '../../lib/pagination';


const resolversSizeQuery: IResolvers = {
    Query: {

//**************************************************************************************************
//   Método para listar elemtos solamente                                                           
//**************************************************************************************************

   async sizes(_, {page, itemsPerPage, active}, { db }) {

    try {
        const paginationData = await pagination(db, COLLECTIONS.SIZES, page, itemsPerPage);
        return {
            info: {
                page: paginationData.page, 
                pages:paginationData.pages, 
                total: paginationData.total,
                itemsPerPage: paginationData.itemsPage
                    },
            status: true,
            message: 'Lista de tallas correctamente cargada',
            sizes: await findElementsSub(db, COLLECTIONS.SIZES, {active: active}, paginationData)
        }
    } catch (error) {
        return {
        info: null,
        status: false,
        message: `Lista de tallas no cargada: ${error}`
    }}
},

//**************************************************************************************************
//                 Método para listar un género pasandole un id                                                           
//**************************************************************************************************
 
async size(_, {id}, {db}) {
    try {
        return {
            status: true,
            message: `Talla con ${id} cargada correctamente`,
            sizes: await findOneElement(db, COLLECTIONS.SIZES, {id: id}),
        }
    } catch (error) {
        return {
        status: false,
        message: `Talla no cargada: ${error}`
    }}
},
    }
};

export default resolversSizeQuery;



