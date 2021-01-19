import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from '../../config/constants';
import { inserOneElement, findOneElement, asingDocumentId, updateOne, deleteOne, insertUpdateAll } from '../../lib/db-functions';
import GenresService from '../../services/genre.service';
import slugify from 'slugify';
import { updateLabel } from 'typescript';


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
