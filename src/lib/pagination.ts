//**************************************************************************************************
//    Sistema de paginación genérica. Posibilidad de usar le método de paginación desarrollado en angular-avanzado      
//        desde el que la paginación se hace desde front                                                     
//**************************************************************************************************


import { Db } from "mongodb";
import { countlements } from "./db-functions";

export async function pagination(db: Db, collection: string, page:number = 1, itemsPage: number = 20, filter: object = {}) {
    //Comprobamos el número de items por página

    if (itemsPage < 1 || itemsPage > 20 ) {
        itemsPage = 20;
    }

    if (page <1 ) {
        page = 1
    }

    const total = await countlements(db, collection, filter);
    const pages = Math.ceil(total/ itemsPage);

    return {
        page,
        skip: (page -1) * itemsPage,
        itemsPage,
        total,
        pages
    }
}