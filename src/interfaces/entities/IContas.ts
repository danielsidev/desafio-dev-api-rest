
import { DateUtc } from "entities/DateUtc";

export interface IContas{    
    getIdConta(): number;
    setIdPessoa(idPessoa:number):void;
    getIdPessoa(): number;
    setSaldo(saldo:number):void;
    getSaldo(): number;
    setLimiteSaqueDiario(limiteSaqueDiario:number):void;
    getLimiteSaqueDiario(): number;
    setFlagAtivo(flagAtivo:boolean):void;
    getFlagAtivo(): boolean;
    setTipoConta(tipoConta:number):void;
    getTipoConta(): number;
    setDataCriacao(dataCriacao:DateUtc):void;
    getDataCriacao():string;
}