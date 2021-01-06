import { ITipoConta } from "interfaces/entities/ITipoConta";

export class TipoConta implements ITipoConta{
    private idTipoConta: number | null;
    private nome: string;

    constructor(nome: string, idTipoConta?: number){
        this.nome = nome;
        this.idTipoConta = (!!idTipoConta)?idTipoConta:null;

    }
    public getIdTipoConta(): number {
        return this.idTipoConta;
    }

    public getNome(): string {
        return this.nome;
    }

    public setNome(nome: string): void {
        this.nome = nome;
    }

}