import GMR from 'graphql-merge-resolvers';
import resolversProductSuscription from './product';


const subscriptionResolvers = GMR.merge([
    resolversProductSuscription
]);

export default subscriptionResolvers