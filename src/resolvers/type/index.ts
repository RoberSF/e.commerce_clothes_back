import GMR from 'graphql-merge-resolvers';
import resolversStripeType from './charges';
import resolversProductsType from './product';


const typeResolvers = GMR.merge([
    resolversStripeType,
    resolversProductsType
]);

export default typeResolvers