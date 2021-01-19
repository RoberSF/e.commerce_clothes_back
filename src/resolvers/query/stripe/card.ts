import { IResolvers } from 'graphql-tools';
import { IStripeCard } from '../../../interfaces/stripe/card.interface';
import StripeApi from '../../../lib/stripe.api';
import { STRIPE_OBJECTS, STRIPE_ACTIONS } from '../../../lib/stripe.api';


const resolversStripeCreditCardQuery: IResolvers = {

    Query: {

    async card(_, { customer, card }) {

      return await new StripeApi().execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.DETAILS_CARD,
        customer,
        card).then((result: IStripeCard) => {

          return {
            status: true,
            message: `Detalles de tarjeta ${result.id} asignada correctamente`,
            id: result.id,
            card: result
          }
        }).catch((error: Error) => {
          return {
            status: false,
            message: `Error: ${error}`,
          }
        })
    },

    async cardsPerCustomer(_, { customer, limit, startingAfter, endingBefore} ) {

      const pagination = new StripeApi().getPaginationOfStripe(startingAfter, endingBefore )

            return await new StripeApi().execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.LIST_CARDS,
              customer,
                {
                    object: 'card', limit, ...pagination
                })
                .then( (result: {has_more: boolean, data: Array<IStripeCard>}) => {
                return {
                    status: true,
                    message: `Lista cargada correctamente`,
                    hasMore: result.has_more,
                    cards: result.data
                };
              }).catch( (error: Error) => {
                return {
                    status: false,
                    message: `Error:`.concat(error.message),
                    hasMore: false,
                    customer: null
                };
              });;
    }
        

    }

}

export default resolversStripeCreditCardQuery;



