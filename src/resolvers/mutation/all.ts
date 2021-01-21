import { IResolvers } from 'graphql-tools';
import { insertUpdateAll } from '../../lib/db-functions';



const resolversAllMutation: IResolvers = {

// Tipo raíz "Mutation"
  Mutation: {
    
    async updateAllDocuments(_, { collection }, {db}) {

        try {
            const update = await insertUpdateAll(db,collection) 
            return true
        } catch(error) {
            return false
        }
    }


  }

}




export default resolversAllMutation;
