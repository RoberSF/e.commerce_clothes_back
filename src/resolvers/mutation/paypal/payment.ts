import { IResolvers } from 'graphql-tools';
import { IPayment } from '../../../interfaces/stripe/payment.interface';
import { IStock } from '../../../interfaces/stock.interface';
import { findOneElement, updateStock } from '../../../lib/db-functions';
import { COLLECTIONS, SUBSCRIPTIONS_EVENT } from '../../../config/constants';
import { IPPayment } from '../../../interfaces/paypal/payment.interface';
import { response } from 'express';


const resolversPaypalChargeMutation: IResolvers = {

    // Tipo raíz "Mutation"
    Mutation: {

        async chargeOrderPaypal(_, { payment, stockChange }, { db, pubsub, paypal }) {
            
            // Comprobar que existe el cliente
            let payment_customer: IPayment = payment.customer;
            let stockChange_: Array<IStock> = stockChange;
            let paymentRound: IPayment = payment;

            // console.log('1.-payment.token',payment.token );
            // if ( payment.token !== undefined && payment.token !== ''  ) {

            // }

            paypal.configure({
                'mode': 'sandbox', //sandbox or live 
                'client_id':  process.env.PAYPAL_CLIENT_ID, // please provide your client id here 
                'client_secret':  process.env.PAYPAL_SECRET_ID // provide your client secret here 
            });

            // Redondeo de número 
            paymentRound.amount = Math.round((+payment.amount + Number.EPSILON) * 100) / 100
            var paypalObject = {
                "intent": "authorize",
                "payer": {
                    "payment_method": 'paypal'
                },
                "redirect_urls": {
                    "return_url": "http://127.0.0.1:3000/success",
                    "cancel_url": "http://127.0.0.1:3000/err"
                },
                "transactions": [{
                    "amount": {
                        "total": paymentRound.amount,
                        "currency": "EUR"
                    },
                    "description": paymentRound.description
                }]
            }
            // console.log('paypalObject',paypalObject.transactions);
            // Orden de pago, 
            //try1
            try {
                    let response$:IPPayment
                    let error$
                    const paypalPayment = await paypal.payment.create(paypalObject, function (error:any, response:any) {
                        if (error) {
                            console.log(error);
                            error$ = error
                        }
                        else {
                            response$ = response
                        }
                    })

                    // Me va a devolver este mensaje haya respuesta o haya error. La clave está en el function. Que tengo que esperar a su respuesta para devolver el return
                    return {
                        status:true,
                        message: 'Transacción realizada'
                    }
                    
                    // try {
                    //         stockChange_.map(async (item: IStock) => {
                    //             const itemsDetails = await findOneElement(db, COLLECTIONS.PRODUCTS, { id: +item.id });
                    //             // Comprobación para que el stock no pueda ser menos que cero
                    //             if (item.increment < 0 && ((item.increment + itemsDetails.stock) < 0)) {
                    //                 item.increment = -itemsDetails.stock; // el - es para que se ponga en cero
                    //             }
                    //             await updateStock(db, COLLECTIONS.PRODUCTS, { id: +item.id }, { stock: item.increment });
                    //             itemsDetails.stock += item.increment;
                    //             console.log(itemsDetails.stock);
                    //             // Publicamos al socket uno a uno el cambio 
                    //             pubsub.publish(SUBSCRIPTIONS_EVENT.UPDATE_STOCK_PRODUCT, { selectProductStockUpdate: itemsDetails });
                    //         })

                    //     } catch (e) {
                    //             console.log(e);
                    //             return false
                    //     }

                //})

                



                //  const pay = await paypal.payment.create(paypalObject).then(
                //      (result: any) => {
                //          console.log(result);
                //          return true
                        // return {
                        //     status: true,
                        //     message: `El cargo se ha hecho correctamente`,
                        //     charge: result
                        // };

            //         }).catch((error: Error) => {
            //             return {
            //                 status: true,
            //                 message: `Error: ${error}`,
            //             }
            // Fin de .then const
                     //})
            // Fin del try1
             } catch (e) {
                 console.log(e);
                 return false
            }
        }
    }
}

  


export default resolversPaypalChargeMutation