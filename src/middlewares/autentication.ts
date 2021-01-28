import { NextFunction, Request, Response  } from "express";
import jwt_decode from 'jwt-decode';
import JWT from '../lib/jwt';
var jwt = require('jsonwebtoken') // librería para crear el token 


export const verificaToken = async ( req: Request, res: Response, next: NextFunction) => {

    let token = req.headers.authorization || '';
    if(!token ) {
        return res.status(401).json({
            status:false,
            menssage: 'No hay token en la petición'
    })
    }

    
    try {
        
        const checkToken = new JWT().verify(token); // Ojo el secretKey
        const user = Object.values(checkToken)[0]
        if ( user.role === 'ADMIN') {
            next();
        }



    }
    catch(error) {
        console.log(error);
        return res.status(401).json({
            status:false,
            menssage: 'No hay token en la petición'
    })
    }



}
