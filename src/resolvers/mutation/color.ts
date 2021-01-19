import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from '../../config/constants';
import { inserOneElement, findOneElement, asingDocumentId, updateOne, deleteOne } from '../../lib/db-functions';
import slugify from 'slugify';


const resolversColorMutation: IResolvers = {

  Mutation: {
    
    async addColor(_, { color }, { db }) {

        // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
        if (color === '' || color === undefined) {
            return {
                status: false,
                message: `La talla no se ha especificado correctamente`,
                color: null
            }
        };

        // Comprobar que no existe
        if (color){
            const sizeCheck = await findOneElement(db,COLLECTIONS.COLORS,{name: color.name})
            
            if (sizeCheck !== null) {
                return {
                  status: false,
                  message: `El color con nombre "${color.name}" está registrado y no puedes registrarlo`,
                  color: null
                };
              }
        } 
    

        // En caso contrario que tag el document para insertarlo
        const colorObject = {
            id: await asingDocumentId(db, COLLECTIONS.COLORS, { id: -1}),
            name: color.name,
            slug: slugify(color || '', { lower: true }),
            active: true
        };


        try {
            return await inserOneElement(db,COLLECTIONS.COLORS,colorObject)
            .then(
                result => {
                    // También hay result.n que nos dice el número de elementos que nos devolvió
                    if (result.result.ok === 1) {
                        return {
                            status: true,
                            message: `El color se registró correctamente`,
                            color: colorObject
                          };
                    }
                    return {
                        status: false,
                        message: `Error inesperado al insertar color. Inténtalo de nuevo por favor.`,
                        color: null
                    }
 
              })
        } catch(error) {
            return {
                status: false,
                message: `Error inesperado al insertar color. Inténtalo de nuevo por favor.`,
                color: null
            }
        }
    },

    // tag = id y name
    async updateColor(_, { id, color }, { db }) {

        // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
        if (String(id) === '' || String(id) === undefined) {
            return {
                status: false,
                message: `El ${id} de color no se ha especificado correctamente`,
                color: null
            }
        };
        // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
        if (color === '' || color === undefined) {
            return {
                status: false,
                message: `El nombre no se ha especificado correctamente`,
                color: null
            }
        };

    
        // En caso contrario que genere el document para insertarlo
        const filterColorObjectId = { id: id}
        const objectUpdate = {
            name: color.name,
            slug: slugify(color || '', { lower: true })
        };

        try {
            return await updateOne(db,COLLECTIONS.SIZES,filterColorObjectId, objectUpdate)
            .then(
                result => {
                    // También hay result.n que nos dice el número de elementos que nos devolvió
                    if (result.result.nModified === 1) {
                        return {
                            status: true,
                            message: `El color se actualizó correctamente`,
                            color: null
                          };
                    }
                    return {
                        status: false,
                        message: `Error inesperado al actualizar color. Inténtalo de nuevo por favor.`,
                        color: null
                    }
 
              })
        } catch(error) {
            return {
                status: false,
                message: `Error inesperado al bloquear color. Inténtalo de nuevo por favor.`,
                color: null
            }
        }
    },


    async deleteColor(_, { id }, { db }) {

        if (String(id) === '' || String(id) === undefined) {
            return {
                status: false,
                message: `El ${id} de color no se ha especificado correctamente`,
                color: null
            }
        };

        try {
            return await deleteOne(db,COLLECTIONS.COLORS,{id: id})
            .then(
                result => {
                    // También hay result.n que nos dice el número de elementos que nos devolvió
                    if (result.ok === 1) {
                        return {
                            status: true,
                            message: `El color con id: ${id} se borró correctamente`,
                            color: null
                          };
                    }
                    return {
                        status: false,
                        message: `Error al borrar color. Inténtalo de nuevo por favor.`,
                        color: null
                    }
 
              })
        } catch(error) {
            return {
                status: false,
                message: `Error inesperado al borrar color. Inténtalo de nuevo por favor.`,
                color: null
            }
        }
    },

    async blockColor(_, { id }, { db }) {

        // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
        if (String(id) === '' || String(id) === undefined) {
            return {
                status: false,
                message: `El ${id} de color no se ha especificado correctamente`,
                color: null
            }
        };

        // En caso contrario que genere el document para insertarlo
        const filterColorObjectId = { id: id}
        const objectUpdate = {
            active: false
        };

        try {
            return await updateOne(db,COLLECTIONS.COLORS,filterColorObjectId, objectUpdate)
            .then(
                result => {
                    // También hay result.n que nos dice el número de elementos que nos devolvió
                    if (result.result.nModified === 1) {
                        return {
                            status: true,
                            message: `El color se bloqueó correctamente`,
                            // Object.assign es para mezclar ambos elementos
                            color: Object.assign({}, filterColorObjectId, objectUpdate)
                          };
                    }
                    return {
                        status: false,
                        message: `Error inesperado al bloquear color. Inténtalo de nuevo por favor.`,
                        color: null
                    }
 
              })
        } catch(error) {
            return {
                status: false,
                message: `Error inesperado al bloquear color. Inténtalo de nuevo por favor.`,
                color: null
            }
        }
    },

    async unBlockColor(_, { id }, { db }) {

        // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
        if (String(id) === '' || String(id) === undefined) {
            return {
                status: false,
                message: `El ${id} de color no se ha especificado correctamente`,
                color: null
            }
        };
      
        // En caso contrario que genere el document para insertarlo
        const filterColorObjectId = { id: id}
        const objectUpdate = {
            active: true
        };
      
        try {
            return await updateOne(db,COLLECTIONS.COLORS,filterColorObjectId, objectUpdate)
            .then(
                result => {
                    // También hay result.n que nos dice el número de elementos que nos devolvió
                    if (result.result.nModified === 1) {
                        return {
                            status: true,
                            message: `El color desbloqueado correctamente`,
                            // Object.assign es para mezclar ambos elementos
                            color: Object.assign({}, filterColorObjectId, objectUpdate)
                          };
                    }
                    return {
                        status: false,
                        message: `Error inesperado al desbloquear color. Inténtalo de nuevo por favor.`,
                        color: null
                    }
      
              })
        } catch(error) {
            return {
                status: false,
                message: `Error inesperado al desbloquear color. Inténtalo de nuevo por favor.`,
                color: null
            }
        }
    }
    }
  }




export default resolversColorMutation
