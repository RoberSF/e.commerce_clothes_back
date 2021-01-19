/* ***************************************************************************************/
// Fichero que arranca todos los resolvers y que nosotros llamaremos desde schema
//**************************************************************************************** */


import { IResolvers } from 'graphql-tools';
import query from './query';
import mutation from './mutation';
import type from './type';
import subscription from './suscription';

const resolvers: IResolvers = { // La interface de IResolvers ya viene en el paquete de Graphql
  ...query,
  ...mutation,
  ...type,
  ...subscription
};

export default resolvers;
