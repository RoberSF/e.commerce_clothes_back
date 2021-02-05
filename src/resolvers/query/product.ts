import { IResolvers } from 'graphql-tools';
import { pagination} from '../../lib/pagination';
import { COLLECTIONS } from '../../config/constants';
import { findElements, findOneElement, findElementsSub, findElementsSearch, findElementsOfferPrice, countlements, countElements } from '../../lib/db-functions';

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
                products: await findElementsSub(db, COLLECTIONS.PRODUCTS_SIZES, {active: active, itemId: size, filter: 'sizeId'}, paginationData)
            }
        } catch (error) {
            return {
            info: null,
            status: false,
            message: `Lista de ropa por tallas no cargada: ${error}`
        }}
    },

    async productsColors(_, { page, itemsPerPage, active, color}, { db }) {

        try {
            const paginationData = await pagination(db, COLLECTIONS.PRODUCTS_COLORS, page, itemsPerPage);
            return {
                info: {
                    page: paginationData.page, 
                    pages:paginationData.pages, 
                    total: paginationData.total,
                    itemsPerPage: paginationData.itemsPage
                        },
                status: true,
                message: 'Lista de ropa por colores correctamente cargada',
                products: await findElementsSub(db, COLLECTIONS.PRODUCTS_COLORS, {active: active, itemId: color, filter: 'colorId'}, paginationData)
            }
        } catch (error) {
            return {
            info: null,
            status: false,
            message: `Lista de ropa por colores no cargada: ${error}`
        }}
    },

    async productSearch(_, { page, itemsPerPage, active, value, categoriasId}, { db }) {


        // ** platform ahora tendría que se run array de strings
        try {
            return {
                status: true,
                message: 'Lista de productos correctamente cargada',
                products: await findElementsSearch(db, COLLECTIONS.PRODUCTS_ITEMS, {active: active, name: value})
            }
        } catch (error) {
            return {
            info: null,
            status: false,
            message: `Lista de productos no cargada: ${error}`
        }}
    },

    async productsOffersLast(_, { page, itemsPerPage, active, random, topPrice}, { db }) {

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
                    message: 'Lista de productos cargados correctamente cargada',
                    products: await findElementsOfferPrice(db, COLLECTIONS.PRODUCTS_ITEMS, [{active: active}, {random: random}, {topPrice: topPrice}, { itemsPerPage: itemsPerPage}], paginationData)
                }
            } catch (error) {
                return {
                info: null,
                status: false,
                message: `Lista de plataformas no cargada: ${error}`
            }}        
        
    },

    async productsCategorias(_, { page, itemsPerPage, active, categorias}, { db }) {

        // ** categorias ahora tendría que se run array de strings
        let since = 1;
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
                message: 'Lista de plataformas correctamente cargada',
                products: await findElementsSub(db, COLLECTIONS.PRODUCTS_ITEMS, {active: active, itemId: categorias, filter: 'categoriaId'}, paginationData)
            }
        } catch (error) {
            return {
            info: null,
            status: false,
            message: `Lista de plataformas no cargada: ${error}`
        }}
       },
  }
}

export default resolversProductsQuery;





