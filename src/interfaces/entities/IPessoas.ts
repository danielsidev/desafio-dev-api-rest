import { DateUtc } from "entities/DateUtc";

export interface IPessoas{
    getIdPessoa(): number;
    setNome(nome:string):void;
    getNome(): string;
    setCpf(cpf: string):void;
    getCpf(): string;
    setDataNascimento(dataNascimento:string):void;
    getDataNascimento(): string;
}