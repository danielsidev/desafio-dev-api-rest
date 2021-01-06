import { Conta } from "entities/Conta";

export interface IContasRepository{
    criar(conta:Conta):Promise<object>;
    atualizarSaldo(valor:number, idConta: number):Promise<object>;
    consultarPorId(idConta:number):Promise<[Conta]>;
    atualizarFlagAtivo(flagAtivo: boolean, idConta: number):Promise<object>; 
}