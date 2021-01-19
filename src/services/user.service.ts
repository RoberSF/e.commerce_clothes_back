//**************************************************************************************************
//      Servicio para métodos compatidos y despejar los querys y mutations. Por el momento sin uso                                                           
//*

import { ROLE } from "../config/constants";


export class UserService {


    public obtenerMenu(ROLE: string) {

        var menu = [
            {
                title: 'MAIN',
                submenu: [
                    {
                        url: "/",
                        label: "Inicio",
                        icon: ""
                    },
                    {
                        url: "/games/platforms/sony",
                        label: "Juegos PlayStation",
                        icon: ""
                    },
                    
                    {
                        url: "/games/platforms/microsoft",
                        label: "Juegos Microsoft",
                        icon: ""
                    },
                    {
                        url: "/games/platforms/nintendo",
                        label: "Juegos Nintendo",
                        icon: ""
                    },
                    {
                        url: "games/promotions/last-units",
                        label: "Últimas unidades",
                        icon: ""
                    },
                    {
                        url: "/games/promotions/offers",
                        label: "Liquidación",
                        icon: ""
                    },
                    {
                        url: "/contact",
                        label: "Contacto",
                        icon: ""
                    }
    
                ]
            },
            {
                title: 'ADMIN',
                submenu: [
                    {
                        url: "/",
                        label: "Inicio",
                        icon: "fas fa-columns"
                    },
                ]
            }
        ]
    
        if (ROLE === 'ADMIN') {
            menu[1].submenu?.push(
                {
                    url: "/admin",
                    label: "Dashboard",
                    icon: "fas fa-columns"
                },
                {
                    url: "/admin/users",
                    label: "Usuarios",
                    icon: "fas fa-id-card"
                },
                {
                    url: "/admin/genres",
                    label: "Géneros",
                    icon: "fas fa-atlas"
                },
                {
                    url: "/admin/tags",
                    label: "Tags(etiquetas)",
                    icon: "fas fa-atlas"
                }

            )
        }
        return menu;
    }


}
    
    export default UserService;