import { IResolvers } from 'graphql-tools';
import { transport } from '../../config/mailer';
import { EXPIRETIME, MESSAGES, COLLECTIONS } from '../../config/constants';
import JWT from '../../lib/jwt';
import { updateOne, findOneElement } from '../../lib/db-functions';
import bcrypt from 'bcrypt';
import MailService from '../../services/mail.service';



const resolversMailMutation: IResolvers = {

// Tipo raíz "Mutation"
  Mutation: {
    
//**************************************************************************************************
//      Método para enviar un email automático. Pasamos los datos del email desde el front                                                            
//**************************************************************************************************

    async sendEmail(_,{mail}) {

    return new MailService().send(mail)
 
    },

//**************************************************************************************************
//     Método para añadir el admin un nuevo usuario y enviarle un email con las instruciones
//     y enlace para que se active el client.Este método sólo pasaría el active de false a true                                                           
//**************************************************************************************************


    async activeUserEmail(_,{id, email}) {

      const token = new JWT().sign(  {user: {id, email}}  , EXPIRETIME.H1);
      const html = `Para activar tu cuenta:<a href="${process.env.CLIENT_URL}/#/active/${token}"> Click aquí</a>`
      const mail = {
        subject: 'Activar usuario', // Subject line
        to: email, // list of receivers
        html
      }
      // console.log(token);
    // Enviamos el mail al servicio y que allí reutilice el envíar email
     return new MailService().send(mail)
    },

//**************************************************************************************************
//      Viniendo de las instrucciones anteriores hacemos este método para
//      cambiar el client el password por defecto                                                            
//**************************************************************************************************
  

    async activeUserAction(_,{id, birthday, password}, {token, db}) {
      //Verificar que el token es válido
      const verify = verifyToken(token, id)
      if ( verify?.status === false) { // El "?" es por que es posible que sea undifinied
        return {
          status: false, message: verify.message
        }
      };

      // Validamos el password del token es diferente al nuevo que estoy poniendo
      if ( password === '1234') {
        return {
          status: false,
          message: 'No se puede activar por que no has cambiado el password'
        };
      };

      // Asignamos los valores nuevos 
      const filterUserObjectId = { id: id}
      const encryptPass = bcrypt.hashSync(password, 10)
      const objectUpdate = {
        birthday: birthday,
        password: encryptPass,
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
        
    },


//**************************************************************************************************
//     Método para enviar email con las instrucciones para resetear password. Validaciones también desde front                                                         
//**************************************************************************************************


    async resetPassword(_,{email}, { db}) {
      // Coger info del usuario 
      const user = await findOneElement(db, COLLECTIONS.USERS,{email})
      
      if ( user === undefined || user === null) {
        return {
          status: false,
          message: `Usuario con el email ${email} no existe`
        };
      }
      // Si usuario es indefinido un mensaje de que no existe el usuario
      const newUser = {
        id: user.id,
        email
      }
      const token = new JWT().sign({user: newUser}, EXPIRETIME.M15); // user se pone así a causa de la interface que sólo permite "user" de tipo IUser
      console.log(token);
      const html = `Para cambiar tu contraseña:<a href="${process.env.CLIENT_URL}/#/reset/${token}"> Click aquí</a>`
      const mail = {
        to: email,
        subject: 'Cambiar contraseña',
        html
      };

      return new MailService().send(mail)
  },

//**************************************************************************************************
//                         Método para cambiar el password                                                           
//**************************************************************************************************


  async changePassword(_,{id,password}, {token, db}) {
    //Verificar que el token es válido
    const verify = verifyToken(token, id)
    if ( verify?.status === false) { // El "?" es por que es posible que sea undifinied
      return {
        status: false, message: verify.message
      }
    };

    // Comprobamos que el id es correcto
    if ( id === undefined || id === ''){
      return {
        status: false,
        message: 'El ID necesita una información correcta'
      }
    }
    // Comprobamos que el password es correcto
    if ( password === undefined || password === ''){
      return {
        status: false,
        message: 'El password necesita una información correcta'
      }
    }
    // Encryptar el password
    // Actualizar
    const filterUserObjectId = { id: id}
    const encryptNewPass = bcrypt.hashSync(password, 10)
    const objectUpdate = {
      password: encryptNewPass,
  };
   

  try {
    return await updateOne(db, COLLECTIONS.USERS, filterUserObjectId, objectUpdate)
    .then(
        result => {
            // También hay result.n que nos dice el número de elementos que nos devolvió
            if (result.result.nModified === 1) {
                return {
                    status: true,
                    message: `El password se actualizó correctamente`,
                    
                  };
            }
            return {
                status: false,
                message: `Error inesperado al actualizar password. Inténtalo de nuevo por favor.`,
                user: null
            }

      })
} catch(error) {
    return {
        status: false,
        message: `Error inesperado al actualizar password. Inténtalo de nuevo por favor.`,
        user: null
    }
}

    
  },





    //Fin de Mutation
    }
    // Fin const 
  }



//**************************************************************************************************
//            Método genérico para verificar datos del token                                                           
//**************************************************************************************************

  function verifyToken(token: string, id: string) {
    const checkToken = new JWT().verify(token);
    if (checkToken === MESSAGES.TOKEN_VERICATION_FAILED) {
      return {
        status: false,
        message: 'El link para activar usuario no es válido. Contacta con el administrador por favor',
      };
    }
    //Si el token es válido ,asignamos el dato correspondiente
    const user = Object.values(checkToken)[0] // información relacionada con el usuario

    // Validamos que el usuario del token es igual que el usuario con el que queremos acceder
    if (user.id !== id) {
      return {
        status: false,
        message: 'El usuario del token no corresponde con el usuario que usted intenta acceder '
      };
    };

  }


export default resolversMailMutation;
