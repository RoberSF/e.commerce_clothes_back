import { IPaginationOptions } from "./pagination-options.interface";
import { IUser } from "./user.interface";


//**************************************************************************************************
//                   Por el momento en desuso                                                           
//**************************************************************************************************

export interface IVariables {
    id?: string | number;
    genre?: string,
    user?: IUser,
    pagination?: IPaginationOptions;
}