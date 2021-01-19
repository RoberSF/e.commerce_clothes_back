import { IResolvers } from 'graphql-tools';
import { PubSub, withFilter } from 'apollo-server-express';
import { SUBSCRIPTIONS_EVENT } from '../../config/constants';


const resolversProductSuscription: IResolvers = {

    Subscription:{
        
        updateStockProduct: {
            
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(SUBSCRIPTIONS_EVENT.UPDATE_STOCK_PRODUCT)
        },

        //**************************************************************************************************
        //       Sólo escuchará aquellos cambios que tengan que ver con el filtro que le estoy pasando  
        //       Cambios en el stock de un item en concreto                                                         
        //**************************************************************************************************
        

        selectProductStockUpdate: {

            subscribe: withFilter((_, __, { pubsub }) => pubsub.asyncIterator(SUBSCRIPTIONS_EVENT.UPDATE_STOCK_PRODUCT), (payload, variables) => {
                return +payload.selectProductStockUpdate.id === +variables.id;
            }),
        }
    }
}

export default resolversProductSuscription