import { IResolvers } from 'graphql-tools';


const resolversStripeType: IResolvers = {

    StripeCharge: {

        receiptEmail: async (parent) => {
            if ( parent.receipt_email) {
                return parent.receipt_email;
            } 
            // Si no existe no da email de respuesta, lo buscamos en el cliente
            // Execute de buscar en stripe
            // const userData = await new StripeCustomerService().get(parent.customer)
            // return (userData.customer?.email) ? userData.customer?.email : ''
            return 'Email pendiente de buscar'
        },
        receiptUrl: (parent) => parent.receipt_url,
        typeOrder: (parent) => parent.object,
        amount: (parent) => parent.amount / 100,
        card: (parent) => parent.payment_method,
        created: (parent) => new Date(parent.created * 1000).toISOString()
 
    
   },
 };

export default resolversStripeType;