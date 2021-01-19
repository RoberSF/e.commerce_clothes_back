import { IResolvers } from 'graphql-tools';
import { createNamespaceExportDeclaration } from 'typescript';
import { IStripeCard } from '../../../interfaces/stripe/card.interface';
import StripeApi, { STRIPE_OBJECTS } from '../../../lib/stripe.api';
import { STRIPE_ACTIONS } from '../../../lib/stripe.api';


const resolversStripeCardMutation: IResolvers = {

// Tipo raíz "Mutation"
  Mutation: {

    async createCard(_, {card}) {

        return await new StripeApi().execute(
          STRIPE_OBJECTS.TOKENS,
          STRIPE_ACTIONS.CREATE,
          {
            card: {
              number: card.number,
              exp_month: card.expMonth,
              exp_year: card.expYear,
              cvc: card.cvc,
            },
          }
        ).then ( (result: {id: string}) => {
            return {
                status: true,
                message: `Token ${result.id} creado correctamente`,
                token: result.id
            }
        }).catch ( (error: Error) => {
            return {
                status: false,
                message: `Error: ${error}`,
            }
        })
    },

    async createCardWithClient(_, { customer, tokenCard }) {

      return await new StripeApi().execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.CREATE_CARD_CLIENT,
        customer,
        {
          source: tokenCard
        }).then((result: { id: string }) => {

          return {
            status: true,
            message: `Tarjeta ${result.id} asignada correctamente`,
            id: result.id
          }
        }).catch((error: Error) => {
          return {
            status: false,
            message: `Error: ${error}`,
          }
        })
    },

    async updateCard(_, {customer, cardId, cardDetails}) {

      return await new StripeApi().execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.UPDATE_CARD, 
        customer, cardId, cardDetails )
            .then( async (result: IStripeCard) => {
                return {
                    status: true,
                    message: `Tarjeta ${result.id} actualizada correctamente`,
                    id: result.id,
                    card: result
                }
            }
            ).catch ( (error: Error) => {
                return {
                    status: true,
                    message: `Error: ${error}`,
                }
            })
    },

    async deleteCard(_, { customer, cardId }) {

      return await new StripeApi().execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.DELETE_CARD, customer, cardId)

      .then((result: {id: string, deleted: boolean}) => {
        return {
            status: result.deleted,
            message: result.deleted ? `Tarjeta ${result.id} borrada correctamente` : `No se ha borrado`,
            id: result.id
        }
    }

        
      ).catch ( (error: Error) => {
          return {
              status: true,
              message: `Error: ${error}`,
          }
      })
    }


  }

}


export default resolversStripeCardMutation