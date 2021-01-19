import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from '../../config/constants';
import { inserOneElement, findOneElement, asingDocumentId, updateOne, deleteOne } from '../../lib/db-functions';
import slugify from 'slugify';


const resolversTagMutation: IResolvers = {

  Mutation: {
    
    async addTag(_, { tag }, { db }) {

        // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
        if (tag === '' || tag === undefined) {
            return {
                status: false,
                message: `El tag no se ha especificado correctamente`,
                tag: null
            }
        };

        // Comprobar que no existe
        if (tag){
            const tagCheck = await findOneElement(db,COLLECTIONS.TAGS,{name: tag})
            
            if (tagCheck !== null) {
                return {
                  status: false,
                  message: `El tag con nombre "${tag}" está registrado y no puedes registrarlo`,
                  tag: null
                };
              }
        } 
    

        // En caso contrario que tag el document para insertarlo
        const tagObject = {
            id: await asingDocumentId(db, COLLECTIONS.TAGS, { id: -1}),
            name: tag,
            slug: slugify(tag || '', { lower: true }),
            active: true
        };


        try {
            return await inserOneElement(db,COLLECTIONS.TAGS,tagObject)
            .then(
                result => {
                    // También hay result.n que nos dice el número de elementos que nos devolvió
                    if (result.result.ok === 1) {
                        return {
                            status: true,
                            message: `El tag se registró correctamente`,
                            tag: tagObject
                          };
                    }
                    return {
                        status: false,
                        message: `Error inesperado al insertar tag. Inténtalo de nuevo por favor.`,
                        tag: null
                    }
 
              })
        } catch(error) {
            return {
                status: false,
                message: `Error inesperado al insertar tag. Inténtalo de nuevo por favor.`,
                tag: null
            }
        }
    },

    // tag = id y name
    async updateTag(_, { id,tag }, { db }) {

        // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
        if (String(id) === '' || String(id) === undefined) {
            return {
                status: false,
                message: `El ${id} de tag no se ha especificado correctamente`,
                tag: null
            }
        };
        // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
        if (tag === '' || tag === undefined) {
            return {
                status: false,
                message: `El nombre no se ha especificado correctamente`,
                tag: null
            }
        };

    
        // En caso contrario que genere el document para insertarlo
        const filterTagObjectId = { id: id}
        const objectUpdate = {
            name: tag,
            slug: slugify(tag || '', { lower: true })
        };

        try {
            return await updateOne(db,COLLECTIONS.TAGS,filterTagObjectId, objectUpdate)
            .then(
                result => {
                    // También hay result.n que nos dice el número de elementos que nos devolvió
                    if (result.result.nModified === 1) {
                        return {
                            status: true,
                            message: `El tag se actualizó correctamente`,
                            tag: null
                          };
                    }
                    return {
                        status: false,
                        message: `Error inesperado al actualizar tag. Inténtalo de nuevo por favor.`,
                        tag: null
                    }
 
              })
        } catch(error) {
            return {
                status: false,
                message: `Error inesperado al bloquear tag. Inténtalo de nuevo por favor.`,
                tag: null
            }
        }
    },


    async deleteTag(_, { id }, { db }) {

        if (String(id) === '' || String(id) === undefined) {
            return {
                status: false,
                message: `El ${id} de tag no se ha especificado correctamente`,
                tag: null
            }
        };

        try {
            return await deleteOne(db,COLLECTIONS.TAGS,{id: id})
            .then(
                result => {
                    // También hay result.n que nos dice el número de elementos que nos devolvió
                    if (result.ok === 1) {
                        return {
                            status: true,
                            message: `El tag con id: ${id} se borró correctamente`,
                            tag: null
                          };
                    }
                    return {
                        status: false,
                        message: `Error al borrar tag. Inténtalo de nuevo por favor.`,
                        tag: null
                    }
 
              })
        } catch(error) {
            return {
                status: false,
                message: `Error inesperado al borrar tag. Inténtalo de nuevo por favor.`,
                tag: null
            }
        }
    },

    async blockTag(_, { id }, { db }) {

        // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
        if (String(id) === '' || String(id) === undefined) {
            return {
                status: false,
                message: `El ${id} de tag no se ha especificado correctamente`,
                tag: null
            }
        };

        // En caso contrario que genere el document para insertarlo
        const filterTagObjectId = { id: id}
        const objectUpdate = {
            active: false
        };

        try {
            return await updateOne(db,COLLECTIONS.TAGS,filterTagObjectId, objectUpdate)
            .then(
                result => {
                    // También hay result.n que nos dice el número de elementos que nos devolvió
                    if (result.result.nModified === 1) {
                        return {
                            status: true,
                            message: `El tag se bloqueó correctamente`,
                            // Object.assign es para mezclar ambos elementos
                            tag: Object.assign({}, filterTagObjectId, objectUpdate)
                          };
                    }
                    return {
                        status: false,
                        message: `Error inesperado al bloquear tag. Inténtalo de nuevo por favor.`,
                        tag: null
                    }
 
              })
        } catch(error) {
            return {
                status: false,
                message: `Error inesperado al bloquear tag. Inténtalo de nuevo por favor.`,
                tag: null
            }
        }
    },

    async unBlockTag(_, { id }, { db }) {

        // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
        if (String(id) === '' || String(id) === undefined) {
            return {
                status: false,
                message: `El ${id} de tag no se ha especificado correctamente`,
                tag: null
            }
        };
      
        // En caso contrario que genere el document para insertarlo
        const filterUserObjectId = { id: id}
        const objectUpdate = {
            active: true
        };
      
        try {
            return await updateOne(db,COLLECTIONS.TAGS,filterUserObjectId, objectUpdate)
            .then(
                result => {
                    // También hay result.n que nos dice el número de elementos que nos devolvió
                    if (result.result.nModified === 1) {
                        return {
                            status: true,
                            message: `El tag desbloqueado correctamente`,
                            // Object.assign es para mezclar ambos elementos
                            tag: Object.assign({}, filterUserObjectId, objectUpdate)
                          };
                    }
                    return {
                        status: false,
                        message: `Error inesperado al desbloquear tag. Inténtalo de nuevo por favor.`,
                        tag: null
                    }
      
              })
        } catch(error) {
            return {
                status: false,
                message: `Error inesperado al desbloquear tag. Inténtalo de nuevo por favor.`,
                tag: null
            }
        }
    }
    }
  }




export default resolversTagMutation
