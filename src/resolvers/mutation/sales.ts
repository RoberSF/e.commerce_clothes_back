import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from '../../config/constants';
import { asingDocumentId,inserOneElement, updateOne } from '../../lib/db-functions';



const resolversSaleMutation: IResolvers = {

  Mutation: {
    
    async addSale(_, { sale }, { db }) {


      // Comprobar el último usuario registrado para asignar ID
      sale.id = await asingDocumentId(db, COLLECTIONS.SALES, { date: -1 });


      // Guardar el documento (registro) en la colección
      return await inserOneElement(db,COLLECTIONS.SALES,sale )
        .then(async () => {
          return {
            status: true,
            message: `La venta con id ${sale.id} ha sido guardada correctamente`,
            sale
          };
        })
        .catch((err: Error) => {
          return {
            status: false,
            message: `Error inesperado, prueba de nuevo. Detalles: ${err}`,
            sale: null
          };
        });
  },

    async updateSale(_, {id, sale }, { db }) {

  
      // En caso contrario que genere el document para insertarlo
      const filterPostObjectId = { id: sale?.id}
      try {
          return await updateOne(db,COLLECTIONS.SALES,filterPostObjectId, sale)
          .then(
              result => {
                  // También hay result.n que nos dice el número de elementos que nos devolvió
                  if (result.result.nModified === 1) {
                      return {
                          status: true,
                          message: `La venta se actualizó correctamente`,
                          sale: sale
                        };
                  }
                  return {
                      status: false,
                      message: `Error inesperado al actualizar registro. Inténtalo de nuevo por favor.`,
                  }

            })
      } catch(error) {
          return {
              status: false,
              message: `Error inesperado al actualizar venta. Inténtalo de nuevo por favor.`,
          }
      }
  },

  async blockSale(_, { id }, { db }) {

    // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
    if (String(id) === '' || String(id) === undefined) {
        return {
            status: false,
            message: `El ${id} del registro no se ha especificado correctamente`,
            sale: null
        }
    };

    // En caso contrario que genere el document para insertarlo
    const filterPostObjectId = { id: id}
    const objectUpdate = {
        active: false
    };

    try {
        return await updateOne(db,COLLECTIONS.SALES,filterPostObjectId, objectUpdate)
        .then(
            result => {
                // También hay result.n que nos dice el número de elementos que nos devolvió
                if (result.result.nModified === 1) {
                    return {
                        status: true,
                        message: `El registro se bloqueó correctamente`,
                        sales: Object.assign({}, filterPostObjectId, objectUpdate)
                      };
                }
                return {
                    status: false,
                    message: `Error inesperado al bloquear registro. Inténtalo de nuevo por favor.`,
                    sales: null
                }

          })
    } catch(error) {
        return {
            status: false,
            message: `Error inesperado al bloquear registro. Inténtalo de nuevo por favor.`,
            sale: null
        }
    }
},

async unBlockSale(_, { id }, { db }) {

  // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
  if (String(id) === '' || String(id) === undefined) {
      return {
          status: false,
          message: `El ${id} de registro no se ha especificado correctamente`,
          sale: null
      }
  };

  // En caso contrario que genere el document para insertarlo
  const filterPostObjectId = { id: id}
  const objectUpdate = {
      active: true
  };

  try {
      return await updateOne(db,COLLECTIONS.SALES,filterPostObjectId, objectUpdate)
      .then(
          result => {
              // También hay result.n que nos dice el número de elementos que nos devolvió
              if (result.result.nModified === 1) {
                  return {
                      status: true,
                      message: `Post desbloqueado correctamente`,
                      // Object.assign es para mezclar ambos elementos
                      sale: Object.assign({}, filterPostObjectId, objectUpdate)
                    };
              }
              return {
                  status: false,
                  message: `Error inesperado al desbloquear registro. Inténtalo de nuevo por favor.`,
                  post: null
              }

        })
  } catch(error) {
      return {
          status: false,
          message: `Error inesperado al desbloquear registro. Inténtalo de nuevo por favor.`,
          sale: null
      }
  }
}
  },
};

export default resolversSaleMutation;