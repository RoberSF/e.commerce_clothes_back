import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from '../../config/constants';
import bcrypt from 'bcrypt';
import { asingDocumentId, deleteOne, findOneElement, inserOneElement, updateOne } from '../../lib/db-functions';



const resolversUserMutation: IResolvers = {

  Mutation: {
    
    async register(_, { user }, { db }) {

      if ( user?.password === null || user?.password === undefined || user?.password === 'null'){
        return {
          status: false,
          message: `Deber definir el password correctamente`,
          user: null
        };
      }
      // Comprobar que el usuario no existe
      const userCheck = await findOneElement(db,COLLECTIONS.USERS,{email: user.email});
      
      if (userCheck !== null) {
        return {
          status: false,
          message: `El email ${user.email} está registrado y no puedes registrarte con este email`,
          user: null
        };
      }

      // Comprobar el último usuario registrado para asignar ID
      user.id = await asingDocumentId(db, COLLECTIONS.USERS, { registerDate: -1 });

      // Asignar la fecha en formato ISO en la propiedad registerDate
      user.registerDate = new Date().toISOString();
      
      // Encriptar password
      user.password = bcrypt.hashSync(user.password, 10);

      // Guardar el documento (registro) en la colección
      return await inserOneElement(db,COLLECTIONS.USERS,user)
        .then(async () => {
          return {
            status: true,
            message: `El usuario con el email ${user.email} está registrado correctamente`,
            user
          };
        })
        .catch((err: Error) => {
          return {
            status: false,
            message: `Error inesperado, prueba de nuevo`,
            user: null
          };
        });
  },

    async updateUser(_, { user }, { db }) {
  
      // En caso contrario que genere el document para insertarlo
      const filterUserObjectId = { id: user?.id}
      const objectUpdate = { 
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        birthday: user.birthday,
        role: user.role,
        id: user.id 
       };

      try {
          return await updateOne(db,COLLECTIONS.USERS,filterUserObjectId, objectUpdate)
          .then(
              result => {
                  // También hay result.n que nos dice el número de elementos que nos devolvió
                  if (result.result.nModified === 1) {
                      return {
                          status: true,
                          message: `El usuario se actualizó correctamente`,
                          // Object.assign es para mezclar ambos elementos
                          user: objectUpdate
                        };
                  }
                  return {
                      status: false,
                      message: `Error inesperado al actualizar usuario. Inténtalo de nuevo por favor.`,
                      user: null
                  }

            })
      } catch(error) {
          return {
              status: false,
              message: `Error inesperado al actualizar usuario. Inténtalo de nuevo por favor.`,
              user: null
          }
      }
  },

  async deleteUser(_, { id }, { db }){
    
    if (String(id) === '' || String(id) === undefined) {
      return {
          status: false,
          message: `El ${id} de usuario no se ha especificado correctamente`,
          user: null
      }
  };

  try {
      return await deleteOne(db,COLLECTIONS.USERS,{id: id})
      .then(
          result => {
              // También hay result.n que nos dice el número de elementos que nos devolvió
              if (result.ok === 1) {
                  return {
                      status: true,
                      message: `El user con id: ${id} se borró correctamente`,
                    };
              }
              return {
                  status: false,
                  message: `Error al borrar user. Inténtalo de nuevo por favor.`,
                  user: null
              }

        })
  } catch(error) {
      return {
          status: false,
          message: `Error inesperado al borrar género. Inténtalo de nuevo por favor.`,
          user: null
      }
  }
  },

  async blockUser(_, { id }, { db }) {

    // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
    if (String(id) === '' || String(id) === undefined) {
        return {
            status: false,
            message: `El ${id} del usuario no se ha especificado correctamente`,
            user: null
        }
    };

    // En caso contrario que genere el document para insertarlo
    const filterUserObjectId = { id: id}
    const objectUpdate = {
        active: false
    };

    try {
        return await updateOne(db,COLLECTIONS.USERS,filterUserObjectId, objectUpdate)
        .then(
            result => {
                // También hay result.n que nos dice el número de elementos que nos devolvió
                if (result.result.nModified === 1) {
                    return {
                        status: true,
                        message: `El usuario se bloqueó correctamente`,
                        // Object.assign es para mezclar ambos elementos
                        user: Object.assign({}, filterUserObjectId, objectUpdate)
                      };
                }
                return {
                    status: false,
                    message: `Error inesperado al bloquear usuario. Inténtalo de nuevo por favor.`,
                    user: null
                }

          })
    } catch(error) {
        return {
            status: false,
            message: `Error inesperado al bloquear usuario. Inténtalo de nuevo por favor.`,
            user: null
        }
    }
},

async unBlockUser(_, { id }, { db }) {

  // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
  if (String(id) === '' || String(id) === undefined) {
      return {
          status: false,
          message: `El ${id} de user no se ha especificado correctamente`,
          user: null
      }
  };

  // En caso contrario que genere el document para insertarlo
  const filterUserObjectId = { id: id}
  const objectUpdate = {
      active: true
  };

  try {
      return await updateOne(db,COLLECTIONS.USERS,filterUserObjectId, objectUpdate)
      .then(
          result => {
              // También hay result.n que nos dice el número de elementos que nos devolvió
              if (result.result.nModified === 1) {
                  return {
                      status: true,
                      message: `El usuario desbloqueado correctamente`,
                      // Object.assign es para mezclar ambos elementos
                      user: Object.assign({}, filterUserObjectId, objectUpdate)
                    };
              }
              return {
                  status: false,
                  message: `Error inesperado al desbloquear usuario. Inténtalo de nuevo por favor.`,
                  user: null
              }

        })
  } catch(error) {
      return {
          status: false,
          message: `Error inesperado al desbloquear usuario. Inténtalo de nuevo por favor.`,
          user: null
      }
  }
}
  },
};

export default resolversUserMutation;
