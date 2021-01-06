import { DateUtc } from "../../entities/DateUtc";

export interface ITransacaoBusiness{
    id?:number;
    id_conta:number;
    valor:number;
    tipo:string;
    data_transacao?:DateUtc;
}