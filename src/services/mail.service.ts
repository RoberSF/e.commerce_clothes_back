import { IMailOptions } from '../interfaces/mail.interface';
import { transport } from '../config/mailer';


class MailService {

    send(mail: IMailOptions){

        return new Promise( (resolve, reject) => {
            transport.sendMail({
               from: '"Online Shop 👻" <onlineshoprsf@gmail.com>', // sender address
               to: mail.to, // list of receivers
               subject: mail.subject, // Subject line
               text: "Hello world?", // plain text body
               html: mail.html, // html body
             }, (error, _) => {

               // Manera simplificada de hacer un if
               (error) ? reject({
                 status: false,
                 message: error
               }) : resolve({
                 status: true,
                 message: 'mail correctamente enviado a' + mail.to,
                 mail
               });
             });
       })
    }

}


export default MailService