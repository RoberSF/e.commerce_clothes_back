import { IResolvers } from 'graphql-tools';
import { IStripeCharges } from '../../../interfaces/stripe/charges.interface';
import StripeApi from '../../../lib/stripe.api';
import { STRIPE_OBJECTS, STRIPE_ACTIONS } from '../../../lib/stripe.api';


const resolversStripeChargesQuery: IResolvers = {

    Query: {


        async chargesByCustomer(_, {customer, limit, startingAfter, endingBefore }) {

            const pagination = new StripeApi().getPaginationOfStripe(startingAfter, endingBefore )

            return await new StripeApi().execute(STRIPE_OBJECTS.CHARGES, STRIPE_ACTIONS.LIST,
                {
                    limit, customer, ...pagination
                })
                .then( (result: {has_more: boolean, data: Array<IStripeCharges>}) => {
                return {
                    status: true,
                    message: `Lista cargada correctamente`,
                    hasMore: result.has_more,
                    charges: result.data
                };
              }).catch( (error: Error) => {
                return {
                    status: false,
                    message: `Error:`.concat(error.message),
                    hasMore: false,
                };
              });;
        }
        

    }

}

export default resolversStripeChargesQuery;



