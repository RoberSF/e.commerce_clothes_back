import { IResolvers } from 'graphql-tools';
import { countlements} from '../../lib/db-functions';


const resolversDashboardQuery: IResolvers = {
    Query: {

//**************************************************************************************************
//                       Método para dashboard                                                      
//**************************************************************************************************

   async totalElements(_, {collection}, { db }) {

// En este caso la respuesta es así por que en squema definimos el result solamente como Int. LA RESPUESTA TIENE QUE SER LA MISMA QUE EN LA DEFINICIÓN
            return await countlements(db, collection)
    
        }


    }
};

export default resolversDashboardQuery;



