import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from '../../config/constants';
import { inserOneElement, findOneElement, asingDocumentId, updateOne, deleteOne } from '../../lib/db-functions';
import slugify from 'slugify';


const resolversProductSizeMutation: IResolvers = {

  Mutation: {
    
    async addProductSize(_, { productSize }, { db }) {

        // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
        if (productSize === '' || productSize === undefined) {
            return {
                status: false,
                message: `No se ha especificado correctamente`,
                product: null
            }
        };

        // Comprobar que no existe
        if (productSize){
            // filtrar por id de talla y de producto
            const productSizeCheck = await findOneElement(db,COLLECTIONS.PRODUCTS_SIZES,{productId: productSize.productId, sizeId: productSize.sizeId })
            
            if (productSizeCheck !== null) {
                return {
                  status: false,
                  message: `Ya está registrado y no puedes registrarlo`,
                  product: null
                };
              }
        } 
    

        // En caso contrario que tag el document para insertarlo
        const productSizeObject = {
            id: await asingDocumentId(db, COLLECTIONS.PRODUCTS_SIZES, { id: -1}),
            productId: productSize.productId,
            sizeId: productSize.sizeId,
            active: true
        };


        try {
            return await inserOneElement(db,COLLECTIONS.PRODUCTS_SIZES,productSizeObject)
            .then(
                result => {
                    // También hay result.n que nos dice el número de elementos que nos devolvió
                    if (result.result.ok === 1) {
                        return {
                            status: true,
                            message: `Se registró correctamente`,
                            product: productSizeObject
                          };
                    }
                    return {
                        status: false,
                        message: `Error inesperado al insertar. Inténtalo de nuevo por favor.`,
                        product: null
                    }
 
              })
        } catch(error) {
            return {
                status: false,
                message: `Error inesperado al insertar. Inténtalo de nuevo por favor.`,
                product: null
            }
        }
    },

    // async updateSize(_, { id, size }, { db }) {

    //     // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
    //     if (String(id) === '' || String(id) === undefined) {
    //         return {
    //             status: false,
    //             message: `El ${id} de talla no se ha especificado correctamente`,
    //             size: null
    //         }
    //     };
    //     // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
    //     if (size === '' || size === undefined) {
    //         return {
    //             status: false,
    //             message: `El nombre no se ha especificado correctamente`,
    //             size: null
    //         }
    //     };

    
    //     // En caso contrario que genere el document para insertarlo
    //     const filterSizeObjectId = { id: id}
    //     const objectUpdate = {
    //         name: size.name,
    //         slug: slugify(size || '', { lower: true })
    //     };

    //     try {
    //         return await updateOne(db,COLLECTIONS.SIZES,filterSizeObjectId, objectUpdate)
    //         .then(
    //             result => {
    //                 // También hay result.n que nos dice el número de elementos que nos devolvió
    //                 if (result.result.nModified === 1) {
    //                     return {
    //                         status: true,
    //                         message: `La talla se actualizó correctamente`,
    //                         size: null
    //                       };
    //                 }
    //                 return {
    //                     status: false,
    //                     message: `Error inesperado al actualizar talla. Inténtalo de nuevo por favor.`,
    //                     size: null
    //                 }
 
    //           })
    //     } catch(error) {
    //         return {
    //             status: false,
    //             message: `Error inesperado al bloquear talla. Inténtalo de nuevo por favor.`,
    //             size: null
    //         }
    //     }
    // },


    // async deleteSize(_, { id }, { db }) {

    //     if (String(id) === '' || String(id) === undefined) {
    //         return {
    //             status: false,
    //             message: `El ${id} de size no se ha especificado correctamente`,
    //             size: null
    //         }
    //     };

    //     try {
    //         return await deleteOne(db,COLLECTIONS.SIZES,{id: id})
    //         .then(
    //             result => {
    //                 // También hay result.n que nos dice el número de elementos que nos devolvió
    //                 if (result.ok === 1) {
    //                     return {
    //                         status: true,
    //                         message: `El size con id: ${id} se borró correctamente`,
    //                         size: null
    //                       };
    //                 }
    //                 return {
    //                     status: false,
    //                     message: `Error al borrar talla. Inténtalo de nuevo por favor.`,
    //                     size: null
    //                 }
 
    //           })
    //     } catch(error) {
    //         return {
    //             status: false,
    //             message: `Error inesperado al borrar talla. Inténtalo de nuevo por favor.`,
    //             size: null
    //         }
    //     }
    // },

    // async blockSize(_, { id }, { db }) {

    //     // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
    //     if (String(id) === '' || String(id) === undefined) {
    //         return {
    //             status: false,
    //             message: `El ${id} de talla no se ha especificado correctamente`,
    //             size: null
    //         }
    //     };

    //     // En caso contrario que genere el document para insertarlo
    //     const filterSizeObjectId = { id: id}
    //     const objectUpdate = {
    //         active: false
    //     };

    //     try {
    //         return await updateOne(db,COLLECTIONS.SIZES,filterSizeObjectId, objectUpdate)
    //         .then(
    //             result => {
    //                 // También hay result.n que nos dice el número de elementos que nos devolvió
    //                 if (result.result.nModified === 1) {
    //                     return {
    //                         status: true,
    //                         message: `El tag se bloqueó correctamente`,
    //                         // Object.assign es para mezclar ambos elementos
    //                         size: Object.assign({}, filterSizeObjectId, objectUpdate)
    //                       };
    //                 }
    //                 return {
    //                     status: false,
    //                     message: `Error inesperado al bloquear talla. Inténtalo de nuevo por favor.`,
    //                     size: null
    //                 }
 
    //           })
    //     } catch(error) {
    //         return {
    //             status: false,
    //             message: `Error inesperado al bloquear talla. Inténtalo de nuevo por favor.`,
    //             size: null
    //         }
    //     }
    // },

    // async unBlockSize(_, { id }, { db }) {

    //     // Comprobar que no está en blanco ni es indefinido. Podríamos refactorizar para hacerlo común en un servicio
    //     if (String(id) === '' || String(id) === undefined) {
    //         return {
    //             status: false,
    //             message: `El ${id} de talla no se ha especificado correctamente`,
    //             size: null
    //         }
    //     };
      
    //     // En caso contrario que genere el document para insertarlo
    //     const filterSizeObjectId = { id: id}
    //     const objectUpdate = {
    //         active: true
    //     };
      
    //     try {
    //         return await updateOne(db,COLLECTIONS.SIZES,filterSizeObjectId, objectUpdate)
    //         .then(
    //             result => {
    //                 // También hay result.n que nos dice el número de elementos que nos devolvió
    //                 if (result.result.nModified === 1) {
    //                     return {
    //                         status: true,
    //                         message: `El tag desbloqueado correctamente`,
    //                         // Object.assign es para mezclar ambos elementos
    //                         size: Object.assign({}, filterSizeObjectId, objectUpdate)
    //                       };
    //                 }
    //                 return {
    //                     status: false,
    //                     message: `Error inesperado al desbloquear talla. Inténtalo de nuevo por favor.`,
    //                     size: null
    //                 }
      
    //           })
    //     } catch(error) {
    //         return {
    //             status: false,
    //             message: `Error inesperado al desbloquear talla. Inténtalo de nuevo por favor.`,
    //             size: null
    //         }
    //     }
    // }
    }
  }




export default resolversProductSizeMutation
