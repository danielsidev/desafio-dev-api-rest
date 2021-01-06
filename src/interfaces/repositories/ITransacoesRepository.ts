
import { DateUtc } from "../../entities/DateUtc";
import { Transacao } from "../../entities/Transacao";
import { IContaExtratoBusiness } from "../business/IContaExtratoBusiness";

export interface ITransacoesRepository{
    registrar(transacao: Transacao):Promise<object | number>;
    consultarExtrato(idConta: number): Promise<[IContaExtratoBusiness]>;
    consultarExtratoPorPeriodo(idConta:number, dataInicial: string, dataFinal: string): Promise<[IContaExtratoBusiness]>;
}