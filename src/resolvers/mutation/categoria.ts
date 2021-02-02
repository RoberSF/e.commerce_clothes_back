import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from '../../config/constants';
import { inserOneElement, findOneElement, asingDocumentId, updateOne, deleteOne } from '../../lib/db-functions';
import slugify from 'slugify';


const resolversCategoriaMutation: IResolvers = {

  Mutation: {
    
    async addCategoria(_, { categoria }, { db }) {

        // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
        if (categoria === '' || categoria === undefined) {
            return {
                status: false,
                message: `El categoria no se ha especificado correctamente`,
                categoria: null
            }
        };

        // Comprobar que no existe
        if (categoria){
            const categoriaCheck = await findOneElement(db,COLLECTIONS.CATEGORIAS,{name: categoria})
            
            if (categoriaCheck !== null) {
                return {
                  status: false,
                  message: `El categoria con nombre "${categoria}" está registrado y no puedes registrarlo`,
                  categoria: null
                };
              }
        } 
    

        // En caso contrario que tag el document para insertarlo
        const categoriaObject = {
            id: await asingDocumentId(db, COLLECTIONS.CATEGORIAS, { id: -1}),
            name: categoria,
            slug: slugify(categoria || '', { lower: true }),
            active: true
        };


        try {
            return await inserOneElement(db,COLLECTIONS.CATEGORIAS,categoriaObject)
            .then(
                result => {
                    // También hay result.n que nos dice el número de elementos que nos devolvió
                    if (result.result.ok === 1) {
                        return {
                            status: true,
                            message: `El categoria se registró correctamente`,
                            categoria: categoriaObject
                          };
                    }
                    return {
                        status: false,
                        message: `Error inesperado al insertar categoria. Inténtalo de nuevo por favor.`,
                        categoria: null
                    }
 
              })
        } catch(error) {
            return {
                status: false,
                message: `Error inesperado al insertar categoria. Inténtalo de nuevo por favor.`,
                categoria: null
            }
        }
    },

    // tag = id y name
    async updateCategoria(_, { id, categoria }, { db }) {

        // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
        if (String(id) === '' || String(id) === undefined) {
            return {
                status: false,
                message: `El ${id} de categoria no se ha especificado correctamente`,
                categoria: null
            }
        };
        // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
        if (categoria === '' || categoria === undefined) {
            return {
                status: false,
                message: `El nombre no se ha especificado correctamente`,
                categoria: null
            }
        };

    
        // En caso contrario que genere el document para insertarlo
        const filterTagObjectId = { id: id}
        const objectUpdate = {
            name: categoria,
            slug: slugify(categoria || '', { lower: true })
        };

        try {
            return await updateOne(db,COLLECTIONS.CATEGORIAS,filterTagObjectId, objectUpdate)
            .then(
                result => {
                    // También hay result.n que nos dice el número de elementos que nos devolvió
                    if (result.result.nModified === 1) {
                        return {
                            status: true,
                            message: `El categoria se actualizó correctamente`,
                            categoria: null
                          };
                    }
                    return {
                        status: false,
                        message: `Error inesperado al actualizar categoria. Inténtalo de nuevo por favor.`,
                        categoria: null
                    }
 
              })
        } catch(error) {
            return {
                status: false,
                message: `Error inesperado al bloquear categoria. Inténtalo de nuevo por favor.`,
                categoria: null
            }
        }
    },


    async deleteCategoria(_, { id }, { db }) {

        if (String(id) === '' || String(id) === undefined) {
            return {
                status: false,
                message: `El ${id} de categoria no se ha especificado correctamente`,
                categoria: null
            }
        };

        try {
            return await deleteOne(db,COLLECTIONS.CATEGORIAS,{id: id})
            .then(
                result => {
                    // También hay result.n que nos dice el número de elementos que nos devolvió
                    if (result.ok === 1) {
                        return {
                            status: true,
                            message: `El categoria con id: ${id} se borró correctamente`,
                            categoria: null
                          };
                    }
                    return {
                        status: false,
                        message: `Error al borrar categoria. Inténtalo de nuevo por favor.`,
                        categoria: null
                    }
 
              })
        } catch(error) {
            return {
                status: false,
                message: `Error inesperado al borrar categoria. Inténtalo de nuevo por favor.`,
                categoria: null
            }
        }
    },

    async blockCategoria(_, { id }, { db }) {

        // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
        if (String(id) === '' || String(id) === undefined) {
            return {
                status: false,
                message: `El ${id} de categoria no se ha especificado correctamente`,
                categoria: null
            }
        };

        // En caso contrario que genere el document para insertarlo
        const filterTagObjectId = { id: id}
        const objectUpdate = {
            active: false
        };

        try {
            return await updateOne(db,COLLECTIONS.CATEGORIAS,filterTagObjectId, objectUpdate)
            .then(
                result => {
                    // También hay result.n que nos dice el número de elementos que nos devolvió
                    if (result.result.nModified === 1) {
                        return {
                            status: true,
                            message: `El tag se bloqueó correctamente`,
                            // Object.assign es para mezclar ambos elementos
                            categoria: Object.assign({}, filterTagObjectId, objectUpdate)
                          };
                    }
                    return {
                        status: false,
                        message: `Error inesperado al bloquear categoria. Inténtalo de nuevo por favor.`,
                        categoria: null
                    }
 
              })
        } catch(error) {
            return {
                status: false,
                message: `Error inesperado al bloquear categoria. Inténtalo de nuevo por favor.`,
                categoria: null
            }
        }
    },

    async unBlockCategoria(_, { id }, { db }) {

        // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
        if (String(id) === '' || String(id) === undefined) {
            return {
                status: false,
                message: `El ${id} de categoria no se ha especificado correctamente`,
                categoria: null
            }
        };
      
        // En caso contrario que genere el document para insertarlo
        const filterUserObjectId = { id: id}
        const objectUpdate = {
            active: true
        };
      
        try {
            return await updateOne(db,COLLECTIONS.CATEGORIAS,filterUserObjectId, objectUpdate)
            .then(
                result => {
                    // También hay result.n que nos dice el número de elementos que nos devolvió
                    if (result.result.nModified === 1) {
                        return {
                            status: true,
                            message: `El tag desbloqueado correctamente`,
                            // Object.assign es para mezclar ambos elementos
                            categoria: Object.assign({}, filterUserObjectId, objectUpdate)
                          };
                    }
                    return {
                        status: false,
                        message: `Error inesperado al desbloquear categoria. Inténtalo de nuevo por favor.`,
                        categoria: null
                    }
      
              })
        } catch(error) {
            return {
                status: false,
                message: `Error inesperado al desbloquear categoria. Inténtalo de nuevo por favor.`,
                categoria: null
            }
        }
    }
    }
  }




export default resolversCategoriaMutation
