import GMR from 'graphql-merge-resolvers';
import resolversPaypalChargeMutation from './payment';



const paypalResolvers = GMR.merge([
    resolversPaypalChargeMutation

]);

export default paypalResolvers