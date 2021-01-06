import { DateUtc } from "entities/DateUtc";

export interface ITransacoes{
    getIdTransacao():number;
    setIdConta(idConta: number):void;
    getIdConta(): number;
    setValor(valor: number):void;
    getValor(): number;
    setDataTransacao(getDataTransacao: DateUtc):void;
    getDataTransacao(): string;
}