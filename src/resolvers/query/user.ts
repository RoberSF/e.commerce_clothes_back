import { EXPIRETIME, MESSAGES } from './../../config/constants';
import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from '../../config/constants';
import JWT from '../../lib/jwt';
import bcrypt from 'bcrypt';
import { findOneElement,findElementsSub } from '../../lib/db-functions';
import { pagination } from '../../lib/pagination';
import UserService from '../../services/user.service';


const resolversUsersQuery: IResolvers = {



  Query: {

    async users(_, {page, itemsPerPage, active}, { db }) { 
      try {
        const paginationData = await pagination(db, COLLECTIONS.USERS, page, itemsPerPage);
        return {
  
          info: {
            page: paginationData.page, 
            pages:paginationData.pages, 
            total: paginationData.total,
            itemsPerPage: paginationData.itemsPage
                },
          status: true,
          message: 'Lista de usuarios cargada correctamente',
          users: await findElementsSub(db, COLLECTIONS.USERS, {active:active}, paginationData)
        };
      } catch (error) {
        return {
          info:null,
          status: false,
          message:
            'Error al cargar los usuarios. Comprueba que tienes correctamente todo.',
          users: [],
        };
      }
    },


    async login(_, { email, password }, { db }) { 
      try {
        const user = await findOneElement(db, COLLECTIONS.USERS, {email})
        if (user === null) {
          return {
            status: false,
            message: 'Usuario no existe',
            token: null,

          };
        }
        const passwordCheck = bcrypt.compareSync(password, user.password); 

        if (passwordCheck !== null) {
          delete user.password;
          delete user.birthday;
          delete user.registerDate;
        }
        return {
          status: true,
          message: !passwordCheck ? 'Password y usuario no son correctos, sesión no iniciada' : 'Usuario cargado correctamente',
          token: !passwordCheck ? null : new JWT().sign({ user }, EXPIRETIME.H24),
          user,
          menu: new UserService().obtenerMenu(user.role)
        };
      } catch (error) {
        return {
          status: false,
          message: 'Error al cargar el usuario. Comprueba que tienes correctamente todo.',
          token: null,
        };
      }
     },


    me(_, __, { token }) {

      let info = new JWT().verify(token); 
      if (info === MESSAGES.TOKEN_VERICATION_FAILED) {
        return {
          status: false,
          message: info,
          user: null
        };
      }
      return {
        status: true,
        message: 'Usuario autenticado correctamente mediante el token',
        user: Object.values(info)[0], 
        menu: new UserService().obtenerMenu(Object.values(info)[0].role)
      };
    },
    
   },
 };

export default resolversUsersQuery;
