import { mv } from "../lib/upload";
import { verificaToken } from "../middlewares/autentication";

const { Router } = require('express'); 

const router = Router();



router.put('/:type/:id',[verificaToken], (request:any, response:any) => {

    var file = request.files.imagen;
    var type = request.params.type ;
    var id = request.params.id ;

    const mvSave = mv(file, type, id).then( (result:any) => {
        if( !result.status) {
            return response.status(500).json({
                status: true,
                message: result
            })
        }

        return response.status(200).json({
            status: true,
            message: result
        })

    })
   
    
})

module.exports = router