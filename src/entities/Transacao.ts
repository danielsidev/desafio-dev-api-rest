import { ITransacaoBusiness } from "interfaces/business/ITransacaoBusiness";
import { ITransacoes } from "interfaces/entities/ITransacoes";
import { DateUtc } from "./DateUtc";

export class Transacao implements ITransacoes{
    private idTransacao: number | null;
    private idConta: number;
    private valor: number;
    private dataTransacao: DateUtc;

    constructor(transacao: ITransacaoBusiness){
        this.idConta       = transacao.id_conta;
        this.valor         = transacao.valor;
        this.dataTransacao = transacao.data_transacao;
        this.idTransacao   = transacao.id;
    }
    public getIdTransacao(): number {
        return this.idTransacao;
    }
    public getIdConta(): number {
        return this.idConta;
    }
    public setIdConta(idConta: number): void {
        this.idConta = idConta;
    }
    public getValor(): number {
        return this.valor;
    }
    public setValor(valor: number): void {
        this.valor = valor;
    }
    public getDataTransacao(): string {
        return this.dataTransacao.getDateTime();
    }
    public setDataTransacao(dataTransacao: DateUtc): void {
        this.dataTransacao = dataTransacao;
    }
}