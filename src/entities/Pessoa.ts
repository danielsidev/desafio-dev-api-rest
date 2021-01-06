import { IPessoas } from "interfaces/entities/IPessoas";
import { DateUtc } from "./DateUtc";

export class Pessoa implements IPessoas{
    private idPessoa: number | null;
    private nome: string;
    private cpf: string;
    private dataNascimento: string;

    constructor( nome:string, cpf:string, dataNascimento:string,idPessoa?:number){        
        this.nome = nome;
        this.cpf = cpf;
        this.dataNascimento = dataNascimento; 
        this.idPessoa = (!!idPessoa)?idPessoa:null;
    }

    public getIdPessoa(): number {
        return this.idPessoa;
    }

    public getNome(): string {
        return this.nome;
    }

    public setNome(nome: string): void {
        this.nome = nome;
    }

    public getCpf(): string {
        return this.cpf;
    }

    public setCpf(cpf: string): void {
        this.cpf = cpf;
    }

    public getDataNascimento(): string {
        return this.dataNascimento;
    }

    public setDataNascimento(dataNascimento: string  ): void {     
        this.dataNascimento = dataNascimento;
    }    
}