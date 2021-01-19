import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from '../../config/constants';
import bcrypt from 'bcrypt';
import { asingDocumentId, deleteOne, findOneElement, inserOneElement, updateOne } from '../../lib/db-functions';
import slugify from 'slugify';



const resolversPostMutation: IResolvers = {

  Mutation: {
    
    async addPost(_, { post }, { db }) {

      // Comprobar el último usuario registrado para asignar ID
      post.id = await asingDocumentId(db, COLLECTIONS.POSTS, { date: -1 });

      // Asignar la fecha en formato ISO en la propiedad registerDate
      post.date = new Date().toISOString();
      post.active = true;
      post.slug = slugify(post.title || '', { lower: true })


      // Guardar el documento (registro) en la colección
      return await inserOneElement(db,COLLECTIONS.POSTS,post)
        .then(async () => {
          return {
            status: true,
            message: `El post con id ${post.id} ha sido guardado correctamente`,
            post
          };
        })
        .catch((err: Error) => {
          return {
            status: false,
            message: `Error inesperado, prueba de nuevo. Detalles: ${err}`,
            post: null
          };
        });
  },

    async updatePost(_, {id,post }, { db }) {

  
      // En caso contrario que genere el document para insertarlo
      const filterPostObjectId = { id: post?.id}
      const objectUpdate = { 
        title: post.title,
        slug: slugify(post.title || '', { lower: true }),
        intro: post.intro,
        contenido: post.contenido,
        categoria: post.categoria,
        img: post.img,
        date: new Date().toISOString()
       };

      try {
          return await updateOne(db,COLLECTIONS.POSTS,filterPostObjectId, objectUpdate)
          .then(
              result => {
                  // También hay result.n que nos dice el número de elementos que nos devolvió
                  if (result.result.nModified === 1) {
                      return {
                          status: true,
                          message: `El post se actualizó correctamente`,
                          // Object.assign es para mezclar ambos elementos
                          post: objectUpdate
                        };
                  }
                  return {
                      status: false,
                      message: `Error inesperado al actualizar post. Inténtalo de nuevo por favor.`,
                  }

            })
      } catch(error) {
          return {
              status: false,
              message: `Error inesperado al actualizar post. Inténtalo de nuevo por favor.`,
          }
      }
  },

  async deletePost(_, { id }, { db }){
    
    if (String(id) === '' || String(id) === undefined) {
      return {
          status: false,
          message: `El ${id} del post no se ha especificado correctamente`,
          post: null
      }
  };

  try {
      return await deleteOne(db,COLLECTIONS.POSTS,{id: id})
      .then(
          result => {
              // También hay result.n que nos dice el número de elementos que nos devolvió
              if (result.ok === 1) {
                  return {
                      status: true,
                      message: `El post con id: ${id} se borró correctamente`,
                      post: null
                    };
              }
              return {
                  status: false,
                  message: `Error al borrar post. Inténtalo de nuevo por favor.`,
                  post: null
              }

        })
  } catch(error) {
      return {
          status: false,
          message: `Error inesperado al borrar post. Inténtalo de nuevo por favor.`,
          post: null
      }
  }
  },

  async blockPost(_, { id }, { db }) {

    // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
    if (String(id) === '' || String(id) === undefined) {
        return {
            status: false,
            message: `El ${id} del post no se ha especificado correctamente`,
            post: null
        }
    };

    // En caso contrario que genere el document para insertarlo
    const filterPostObjectId = { id: id}
    const objectUpdate = {
        active: false
    };

    try {
        return await updateOne(db,COLLECTIONS.POSTS,filterPostObjectId, objectUpdate)
        .then(
            result => {
                // También hay result.n que nos dice el número de elementos que nos devolvió
                if (result.result.nModified === 1) {
                    return {
                        status: true,
                        message: `El post se bloqueó correctamente`,
                        // Object.assign es para mezclar ambos elementos
                        post: Object.assign({}, filterPostObjectId, objectUpdate)
                      };
                }
                return {
                    status: false,
                    message: `Error inesperado al bloquear post. Inténtalo de nuevo por favor.`,
                    post: null
                }

          })
    } catch(error) {
        return {
            status: false,
            message: `Error inesperado al bloquear post. Inténtalo de nuevo por favor.`,
            post: null
        }
    }
},

async unBlockPost(_, { id }, { db }) {

  // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
  if (String(id) === '' || String(id) === undefined) {
      return {
          status: false,
          message: `El ${id} de post no se ha especificado correctamente`,
          post: null
      }
  };

  // En caso contrario que genere el document para insertarlo
  const filterPostObjectId = { id: id}
  const objectUpdate = {
      active: true
  };

  try {
      return await updateOne(db,COLLECTIONS.USERS,filterPostObjectId, objectUpdate)
      .then(
          result => {
              // También hay result.n que nos dice el número de elementos que nos devolvió
              if (result.result.nModified === 1) {
                  return {
                      status: true,
                      message: `Post desbloqueado correctamente`,
                      // Object.assign es para mezclar ambos elementos
                      post: Object.assign({}, filterPostObjectId, objectUpdate)
                    };
              }
              return {
                  status: false,
                  message: `Error inesperado al desbloquear post. Inténtalo de nuevo por favor.`,
                  post: null
              }

        })
  } catch(error) {
      return {
          status: false,
          message: `Error inesperado al desbloquear post. Inténtalo de nuevo por favor.`,
          post: null
      }
  }
}
  },
};

export default resolversPostMutation;
