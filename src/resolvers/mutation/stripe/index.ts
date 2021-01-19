import GMR from 'graphql-merge-resolvers';
import resolversStripeCardMutation from './card';
import resolversStripeChargeMutation from './charges';
import resolversStripeCustomerMutation from './customer';


const stripeResolvers = GMR.merge([
    resolversStripeCustomerMutation,
    resolversStripeCardMutation,
    resolversStripeChargeMutation

]);

export default stripeResolvers