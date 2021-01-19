import { IJwt } from './../interfaces/jwt.interface';
import { SECRET_KEY, MESSAGES, EXPIRETIME } from './../config/constants';
import jwt from 'jsonwebtoken';

class JWT {
    private secretKey = SECRET_KEY as string;
    /* ***************************************************************************************/
    // Configuración de lo que se va a componer el token
    //**************************************************************************************** */
    // Información del payload con fecha de caducidad 24 horas por defecto
    sign(data: IJwt, expiresIn: number = EXPIRETIME.H24 ) {
        return jwt.sign(
            { user: data.user },
            this.secretKey,
            { expiresIn} 
        );
    }

/* ***************************************************************************************/
// Configuración para verificar el token
//**************************************************************************************** */
    verify(token: string) {
        try {
            return jwt.verify(token, this.secretKey);
        } catch (e) {
            return MESSAGES.TOKEN_VERICATION_FAILED;
        }
    }
}

export default JWT;