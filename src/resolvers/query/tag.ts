import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from '../../config/constants';
import { findElementsSub, findOneElement } from '../../lib/db-functions';
import { pagination } from '../../lib/pagination';


const resolversTagQuery: IResolvers = {
    Query: {

//**************************************************************************************************
//   Método para listar elemtos solamente                                                           
//**************************************************************************************************

   async tags(_, {page, itemsPerPage, active}, { db }) {

    try {
        const paginationData = await pagination(db, COLLECTIONS.TAGS, page, itemsPerPage);
        return {
            info: {
                page: paginationData.page, 
                pages:paginationData.pages, 
                total: paginationData.total,
                itemsPerPage: paginationData.itemsPage
                    },
            status: true,
            message: 'Lista de tags correctamente cargada',
            tags: await findElementsSub(db, COLLECTIONS.TAGS, {active: active}, paginationData)
        }
    } catch (error) {
        return {
        info: null,
        status: false,
        message: `Lista de tags no cargada: ${error}`
    }}
},

//**************************************************************************************************
//                 Método para listar un género pasandole un id                                                           
//**************************************************************************************************
 
async tag(_, {id}, {db}) {
    try {
        return {
            status: true,
            message: `Tag con ${id} cargado correctamente`,
            tags: await findOneElement(db, COLLECTIONS.TAGS, {id: id}),
        }
    } catch (error) {
        return {
        status: false,
        message: `Tag no cargado: ${error}`
    }}
},
    }
};

export default resolversTagQuery;



