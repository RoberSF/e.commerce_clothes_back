import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from '../../config/constants';
import { findOneElement, findElements, findElementsNormal } from '../../lib/db-functions';
import { Db } from 'mongodb';

const resolversProductsType: IResolvers = {

    ProductSize: {


        product: async (parent,__,{db})  => {
            try {
                const result = await findOneElement(db, COLLECTIONS.PRODUCTS_ITEMS, {id: parent.productId})
                return result
            } catch(error) {
                return error
            }
        },
        size: async (parent,__,{db})  => {
            try {
                const result = await findOneElement(db, COLLECTIONS.SIZES, {id: parent.sizeId})
                return result
            } catch(error) {
                return error
            }
        },
    
   },

   ProductItem: {

    sizeInfo: async (parent,__,{db})  => {
        try {
            const result = await findElementsNormal(db,COLLECTIONS.SIZES, {id: {$in: parent.size}})
            return result
        } catch(error) {
            return error
        }
    },
    colorInfo: async (parent,__,{db})  => {
        try {
            const result = await findElementsNormal(db,COLLECTIONS.COLORS, {id: {$in: parent.color}})
            return result
        } catch(error) {
            return error
        }
    },
    categoriaInfo: async(parent,__,{db}) => {
        try {
            const result = await findElementsNormal(db,COLLECTIONS.CATEGORIAS, {id: parent.categoria})
            return result
        } catch(error) {
            return error
        }
    },
   }
 };

export default resolversProductsType;