import { DateUtc } from "entities/DateUtc";

export interface IContaBasicBusiness{
    id_conta?:number;
    saldo:number;
    limite_saque_diario?:number;
    flag_ativo?:boolean;
    tipo_conta?:number;
    data_criacao?:DateUtc;
}