import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from '../../config/constants';
import { findElements, findElementsSearch, findElementsSub, findOneElement } from '../../lib/db-functions';
import { pagination } from '../../lib/pagination';


const resolversSalesQuery: IResolvers = {

Query:{

//**************************************************************************************************
//   Método para listar elemtos solamente                                                           
//**************************************************************************************************

   async sales(_, {page, itemsPerPage, active}, { db }) {

        try {
            const paginationData = await pagination(db, COLLECTIONS.SALES, page, itemsPerPage);
            return {
                info: {
                    page: paginationData.page, 
                    pages:paginationData.pages, 
                    total: paginationData.total,
                    itemsPerPage: paginationData.itemsPage
                        },
                status: true,
                message: 'Lista de ventas correctamente cargada',
                sales: await findElementsSub(db, COLLECTIONS.SALES, {active: active}, paginationData)
            }
        } catch (error) {
            return {
            info: null,
            status: false,
            message: `Lista de ventas no cargada: ${error}`
        }}
    },

//**************************************************************************************************
//                 Método para listar un género pasandole un id                                                           
//**************************************************************************************************
    

    async sale(_, {id}, {db}) {
        try {
            return {
                status: true,
                message: `Post con ${id} cargado correctamente`,
                sale: await findOneElement(db, COLLECTIONS.SALES, {id: id}),
            }
        } catch (error) {
            return {
            status: false,
            message: `Venta no cargada: ${error}`
        }}
    },

    async saleSearch(_, { page, itemsPerPage, active, value}, { db }) {


        // ** platform ahora tendría que se run array de strings
        // console.log(platform);
        try {
            return {
                status: true,
                message: 'Lista de ventas correctamente cargada',
                sales: await findElementsSearch(db, COLLECTIONS.SALES, {active: active, name: value})
            }
        } catch (error) {
            return {
            info: null,
            status: false,
            message: `Lista de ventas no cargada: ${error}`
        }}
       },

}
}

export default resolversSalesQuery