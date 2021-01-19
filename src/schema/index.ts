/* ***************************************************************************************/
// Es el ejecutable para que funcione el archivo .graphQL y poder añadirlo a Apollo Server Express
//**************************************************************************************** */



import 'graphql-import-node';
import resolvers from './../resolvers';
import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';

import {loadFilesSync} from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';

const loadedFiles = loadFilesSync(`${__dirname}/**/*.graphql`); // obtenemos cualquier archivo con extension .graphql
const typeDefs = mergeTypeDefs(loadedFiles);


const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  }
});

export default schema;
