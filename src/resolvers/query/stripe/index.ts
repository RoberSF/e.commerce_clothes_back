import GMR from 'graphql-merge-resolvers';
import resolversStripeCustomersQuery from './customer';
import resolversStripeCreditCardQuery from './card';
import resolversStripeChargesQuery from './charges';


const queryStripeResolvers = GMR.merge([
    resolversStripeCustomersQuery,
    resolversStripeCreditCardQuery,
    resolversStripeChargesQuery
]);

export default queryStripeResolvers