export const STRIPE_OBJECTS = {
    CUSTOMERS: 'customers',
    TOKENS: 'tokens', 
    CHARGES: 'charges'
};

export const STRIPE_ACTIONS = {
    CREATE: 'create',
    LIST: 'list',
    RETRIEVE: 'retrieve',
    UPDATE: 'update',
    DELETE: 'del',
    CREATE_CARD_CLIENT: 'createSource',
    DETAILS_CARD: 'retrieveSource',
    UPDATE_CARD: 'updateSource',
    DELETE_CARD: 'deleteSource',
    LIST_CARDS: 'listSources'
}


class StripeApi {
    private stripe = require('stripe')(process.env.STRIPE_API_KEY, {
        apiVersion: process.env.STRIPE_API_VERSION
    });

    // Creamos una función global para consultar la api desde los resolvers
    async execute( object: string, action: string, ...args: [ (string | object), (string | object)?, (string | object)?] ) {

        return await this.stripe[object][action](...args);
    };

    async getPaginationOfStripe(startingAfter: string, endingBefore: string ) {

        let pagination;
        if ( startingAfter !== '' && endingBefore === '') {
            pagination = {
                starting_after: startingAfter
            } 
        } else if ( startingAfter === '' && endingBefore !== '' ) {
            pagination = {
                ending_before: endingBefore
            }
            }

        return pagination;
    }

    // Sin uso por no refactor
    protected async getError(error: Error) {
        {
          return {
            status: false,
            message: 'Error: '.concat(error.message),
            hasMore: false,
            customer: undefined,
            card: undefined,
            cards: undefined
          };
        }
      }
}

export default StripeApi;