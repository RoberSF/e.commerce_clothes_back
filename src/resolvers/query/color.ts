import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from '../../config/constants';
import { findElementsSub, findOneElement } from '../../lib/db-functions';
import { pagination } from '../../lib/pagination';


const resolversColorQuery: IResolvers = {
    Query: {

//**************************************************************************************************
//   Método para listar elemtos solamente                                                           
//**************************************************************************************************

   async colors(_, {page, itemsPerPage, active}, { db }) {

    try {
        const paginationData = await pagination(db, COLLECTIONS.COLORS, page, itemsPerPage);
        return {
            info: {
                page: paginationData.page, 
                pages:paginationData.pages, 
                total: paginationData.total,
                itemsPerPage: paginationData.itemsPage
                    },
            status: true,
            message: 'Lista de colores correctamente cargada',
            colors: await findElementsSub(db, COLLECTIONS.COLORS, {active: active}, paginationData)
        }
    } catch (error) {
        return {
        info: null,
        status: false,
        message: `Lista de colores no cargada: ${error}`
    }}
},

//**************************************************************************************************
//                 Método para listar un género pasandole un id                                                           
//**************************************************************************************************
 
async color(_, {id}, {db}) {
    try {
        return {
            status: true,
            message: `Color con ${id} cargada correctamente`,
            colors: await findOneElement(db, COLLECTIONS.COLORS, {id: id}),
        }
    } catch (error) {
        return {
        status: false,
        message: `Talla no cargada: ${error}`
    }}
},
    }
};

export default resolversColorQuery;



