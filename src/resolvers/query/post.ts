import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from '../../config/constants';
import { findElements, findElementsSub, findOneElement } from '../../lib/db-functions';
import { pagination } from '../../lib/pagination';


const resolversPostQuery: IResolvers = {

Query:{

//**************************************************************************************************
//   Método para listar elemtos solamente                                                           
//**************************************************************************************************

   async posts(_, {page, itemsPerPage, active}, { db }) {


        try {
            const paginationData = await pagination(db, COLLECTIONS.POSTS, page, itemsPerPage);
            return {
                info: {
                    page: paginationData.page, 
                    pages:paginationData.pages, 
                    total: paginationData.total,
                    itemsPerPage: paginationData.itemsPage
                        },
                status: true,
                message: 'Lista de posts correctamente cargada',
                posts: await findElementsSub(db, COLLECTIONS.POSTS, {active: active}, paginationData)
            }
        } catch (error) {
            return {
            info: null,
            status: false,
            message: `Lista de posts no cargada: ${error}`
        }}
    },

//**************************************************************************************************
//                 Método para listar un género pasandole un id                                                           
//**************************************************************************************************
    

    async post(_, {id}, {db}) {
        try {
            return {
                status: true,
                message: `Post con ${id} cargado correctamente`,
                post: await findOneElement(db, COLLECTIONS.POSTS, {id: id}),
            }
        } catch (error) {
            return {
            status: false,
            message: `Post no cargado: ${error}`
        }}
    },

}
}

export default resolversPostQuery