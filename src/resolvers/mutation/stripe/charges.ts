import { IResolvers } from 'graphql-tools';
import { IPayment } from '../../../interfaces/stripe/payment.interface';
import StripeApi from '../../../lib/stripe.api';
import { STRIPE_OBJECTS, STRIPE_ACTIONS } from '../../../lib/stripe.api';
import { IStripeCustomer } from '../../../interfaces/stripe/customer.interface';
import { IStripeCard } from '../../../interfaces/stripe/card.interface';
import { IStock } from '../../../interfaces/stock.interface';
import { findOneElement, updateStock } from '../../../lib/db-functions';
import { COLLECTIONS, SUBSCRIPTIONS_EVENT } from '../../../config/constants';

const resolversStripeChargeMutation: IResolvers = {

// Tipo raíz "Mutation"
  Mutation: {

    async chargeOrder(_, { payment, stockChange }, {db, pubsub}) {

      // Comprobar que existe el cliente
      let payment_customer: IPayment = payment.customer;
      let stockChange_: Array<IStock> = stockChange
      const userData:IStripeCustomer = await new StripeApi().execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.RETRIEVE,  payment_customer )
      if ( userData) {

        // console.log('1.-payment.token',payment.token );

        if ( payment.token !== undefined && payment.token !== ''  ) {
          // console.log('2.-token existe');
          // Asociar el cliente a la tarjeta
          const cardCreate: IStripeCard = await new StripeApi().execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.CREATE_CARD_CLIENT,
            payment.customer, { source: payment.token
             } )
          // console.log('3.-cardCreate',cardCreate);
          // console.log('4.-',cardCreate.id);

          // Actualizar como fuente predeterminada de pago
          // console.log('5.-', payment.customer, cardCreate.id );
          const upDatePayMethod =  await new StripeApi().execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.UPDATE,
            payment.customer,
            {
              default_source: cardCreate.id
            })
          // console.log('6.-', upDatePayMethod );

          // Actualizar borrando las demás tarjetas de ese cliente
          // Lo hacemos por que la Api de Stripe pone la que estoy usando como predeterminada 
          //     y la que está la deja de lado, aun que sea la misma

          const ListCardCustomer =  await new StripeApi().execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.LIST_CARDS, payment.customer, {object: 'card', limit: 5})
          // console.log('7.-', ListCardCustomer.data );
          const list = ListCardCustomer.data?.map(async(item: IStripeCard) => {
            // id de la tarjeta que no queremos borrar
            let noDeleteCard = cardCreate.id
            if( item.id !== noDeleteCard && noDeleteCard !== '') {
              // console.log('8.- No Borrar', noDeleteCard);
              // console.log('9.- Borrada', item.id);
              const removeOtherCards = await new StripeApi().execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.DELETE_CARD, payment.customer, item.id)
            }
          })

        } else if (payment.token === undefined && userData.default_source === null ) {
          return {
            status: false,
            message: 'Cliente no tiene ningun método de pago asignado y no puede realizar pago'
          }
        }
      } else {
        // No funciona el else, da el error Stripe antes de que llegue aquí
        return {
          status: false,
          message: 'Cliente no encontrado'
        }
      }
      
      delete payment.token; // al pasarle el objeto entero de payment llevaría el token y para éste método no sería necesario

      // Redondeo de número 
      let paymentRound: IPayment = payment;
      paymentRound.amount = Math.round( (+payment.amount + Number.EPSILON) *100 )/100
      paymentRound.amount *= 100

      // Orden de pago
      return await new StripeApi().execute(STRIPE_OBJECTS.CHARGES, STRIPE_ACTIONS.CREATE,
        paymentRound).then( (result: object) => {
          // console.log('10.-', result);

          // Hacemos la actulización del stock después del pago. Refactorizar en un servicio
          try {
            // Actualización stock a tiempo real

            // stockChange_.map( async (item:IStock) => {
            //     const itemsDetails = await findOneElement(db, COLLECTIONS.PRODUCTS_ITEMS, {id: +item.id});
            //     // Comprobación para que el stock no pueda ser menos que cero
            //     if(item.increment < 0 && ((item.increment + itemsDetails.stock) < 0)) {
            //        item.increment = -itemsDetails.stock; // el - es para que se ponga en cero
            //      }
            //     await updateStock(db, COLLECTIONS.PRODUCTS_ITEMS,{ id: +item.id}, {stock: item.increment});
            //     itemsDetails.stock += item.increment;
            //     // Publicamos al socket uno a uno el cambio 
            //     pubsub.publish(SUBSCRIPTIONS_EVENT.UPDATE_STOCK_PRODUCT, { selectProductStockUpdate: itemsDetails});
            // })

        } catch(e) {
            return false
        }
          return {
            status: true,
            message: `El cargo se ha hecho correctamente`,
            charge: result
          };
        }).catch((error: Error) => {
          return {
            status: true,
            message: `Error: ${error}`,
          }
        })
      



      }
    }
  }


export default resolversStripeChargeMutation