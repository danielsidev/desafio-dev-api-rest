import { Pessoa } from "entities/Pessoa";

export interface IPessoas{
    criar(pessoa: Pessoa):Promise<object>;
    consultarPorId(idPessoa: number):Promise<[Pessoa]>;
    consultarPorCpf(cpf: string):Promise<[Pessoa]>;
}