import { IResolvers } from 'graphql-tools';
import slugify from 'slugify';
import { IStripeCustomer } from '../../../interfaces/stripe/customer.interface';
import StripeApi from '../../../lib/stripe.api';
import { STRIPE_OBJECTS, STRIPE_ACTIONS } from '../../../lib/stripe.api';
import { updateOne, findOneElement } from '../../../lib/db-functions';
import { COLLECTIONS } from '../../../config/constants';
import { IUser } from '../../../interfaces/user.interface';


const resolversStripeCustomerMutation: IResolvers = {

// Tipo raíz "Mutation"
  Mutation: {
    
    // genre = name
    async createCustomer(_, { name, email, description }, { db }) {

      // 1º Comprobamos que el cliente ya exista en StripeDB. (mismo email)
      const userCheck: { data: Array<IStripeCustomer>} = await new StripeApi().execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.LIST,{ email })

      if ( userCheck.data.length > 0 ) {
        // 1.1.-Si el usuario existe:
        return {
          status: false,
          message: `El usuario con el email ${email} ya existe`
        }
      }
        // 1.2.- Si el usuario no existe lo creamos en StripeDB y actualizamos MongoDB
        //1.2.1.-Creamos usuario en StripeDB
        return await new StripeApi().execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.CREATE,
          {
          name,
          email,
          description: `${name} (${email} )`           
          })
          // 1.2.1.1.- Una vez creado en StripeDB buscamos coincidencias en MongoDB y actualizamos
          .then( async (result: IStripeCustomer) => {
            const filterUserObject = { email: email};
              // 1.2.1.1.1.- Primero buscamos el usuario en MongoDB
               // Para que este await funcione, hay que poner el async en el result
              const user: IUser =  await findOneElement(db,COLLECTIONS.USERS,filterUserObject)
              // console.log('1','He buscado a uno');
              // 1.2.1.1.2.- Si existe usuario en MongoDB actualizamos
              if(user) {
                // console.log('2','Existe el user y es',user);
                // Este resul.id viene de la creación de stripe
                user.stripeCustomer = result.id
                const objectUpdate = { 
                  stripeCustomer: user.stripeCustomer
                 };
                // console.log('3', 'stripeCustomer es:',user.stripeCustomer);
                const resultUserOperation = await updateOne(db,COLLECTIONS.USERS,filterUserObject,objectUpdate )
                .then(
                  result => {
                    // console.log('4','Después de actualizar uno:', result.result );
                      // También hay result.n que nos dice el número de elementos que nos devolvió
                      if (result) {
                          return {
                              status: true,
                              message: `StripeId se ha añadido correctamente a db`,
                              customer: userCheck.data
                            };
                      }
                      return {
                          status: false,
                          message: `Error inesperado al añadir stripeid en db. Inténtalo de nuevo por favor.`,
                          user: null
                      }
    
                }) // Si no hay usuario en MongoDB tenemos que borrar el usuario creado de StripeDB con función específica
          } 

          return {
            status: true,
            message: `El cliente ${name} se ha creado correctamente`,
            customer: result
          }
        
          //1.2.1.1.- Si da error en crear usuario en StripeDB
          }).catch( (error: Error) => {
            return {
                status: false,
                message: `Error:`.concat(error.message),
                customer: null
            };
          });
    },

    async updateCustomer(_, {id, customer}) {

          return await new StripeApi().execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.UPDATE, id, customer )
                .then( async (result: IStripeCustomer) => {
                    return {
                        status: true,
                        message: `El cliente ${result.name} se ha actualizado correctamente`,
                        customer: result
                    }
                }
                ).catch ( (error: Error) => {
                    return {
                        status: true,
                        message: `Error: ${error}`,
                    }
                })
    },

    async deleteCustomer(_, { id }, {db}) {

      return await new StripeApi().execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.DELETE, id)

      .then( async (result: { id: string, deleted: boolean}) => {

        if ( result.deleted ) {

          console.log(result.id);
            
          const resultOperation = await db.collection(COLLECTIONS.USERS).updateOne({stripeCustomer: result.id}, {$unset: {stripeCustomer: result.id}})
          return {
              status: result.deleted && resultOperation ? true : false,
              message:  result.deleted && resultOperation ? `El cliente ${result.id} se ha borrado correctamente` : 
               'Usuario no actualizado en la base de datos privada',
          }
        }

        return {
          status: false,
          message: `El cliente ${result.id} no se ha borrado correctamente`,
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


export default resolversStripeCustomerMutation