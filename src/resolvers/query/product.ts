import { IResolvers } from 'graphql-tools';
import { pagination } from '../../lib/pagination';
import { COLLECTIONS } from '../../config/constants';
import { findElements, findOneElement, findElementsSub } from '../../lib/db-functions';

const resolversProductsQuery: IResolvers = {

  Query: {

   async products(_, {page, itemsPerPage, active}, { db }) {
    try {
        const paginationData = await pagination(db, COLLECTIONS.PRODUCTS_ITEMS, page, itemsPerPage);
        return {
            info: {
                page: paginationData.page, 
                pages:paginationData.pages, 
                total: paginationData.total,
                itemsPerPage: paginationData.itemsPage
                    },
            status: true,
            message: 'Lista de productos correctamente cargada',
            products: await findElements(db, COLLECTIONS.PRODUCTS_ITEMS, {active: active}, paginationData)
        }
    } catch (error) {
        return {
        info: null,
        status: false,
        message: `Lista de productos no cargada: ${error}`
    }}
   },

    async productDetails(_,{id}, { db }) {
        try {
            return {
                info: { id },
                status: true,
                message: 'Product details correctamente cargados',
                product: await findOneElement(db,  COLLECTIONS.PRODUCTS_ITEMS, {id})
            }
        } catch (error) {
            return {
            info: null,
            status: false,
            message: `Product details no cargados: ${error}`
        }}
    },

    async productsSizes(_, { page, itemsPerPage, active, size}, { db }) {

        try {
            const paginationData = await pagination(db, COLLECTIONS.PRODUCTS_SIZES, page, itemsPerPage);
            return {
                info: {
                    page: paginationData.page, 
                    pages:paginationData.pages, 
                    total: paginationData.total,
                    itemsPerPage: paginationData.itemsPage
                        },
                status: true,
                message: 'Lista de ropa por tallas correctamente cargada',
                products: await findElementsSub(db, COLLECTIONS.PRODUCTS_SIZES, {active: active, sizeId: size}, paginationData)
            }
        } catch (error) {
            return {
            info: null,
            status: false,
            message: `Lista de ropa por tallas no cargada: ${error}`
        }}
       },
  }
}

export default resolversProductsQuery;





