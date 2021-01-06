import { IContaBusiness } from "interfaces/business/IContaBusiness";
import { IContas } from "interfaces/entities/IContas";
import { DateUtc } from "./DateUtc";

export class Conta implements IContas{
    private idConta: number | null;
    private idPessoa:number;
    private saldo: number;
    private limiteSaqueDiario: number | null;
    private flagAtivo: boolean;
    private tipoConta: number;
    private dataCriacao: DateUtc;

    constructor(conta: IContaBusiness)
    {
            this.idPessoa = conta.id_pessoa;
            this.saldo = conta.saldo;
            this.flagAtivo = conta.flag_ativo;
            this.tipoConta = conta.tipo_conta;
            this.dataCriacao= conta.data_criacao;
            this.idConta = conta.id_conta;
            this.limiteSaqueDiario = conta.limite_saque_diario;
    }
    public getIdConta(): number {
        return this.idConta;
    }
    public getIdPessoa(): number {
        return this.idPessoa;
    }
    public setIdPessoa(idPessoa: number): void {
        this.idPessoa = idPessoa;
    }
    public getSaldo(): number {
        return this.saldo;
    }
    public setSaldo(saldo: number): void {
        this.saldo = saldo;
    }
    public getLimiteSaqueDiario(): number {
        return this.limiteSaqueDiario;
    }
    public setLimiteSaqueDiario(limiteSaqueDiario: number): void {
        this.limiteSaqueDiario = limiteSaqueDiario;
    }
    public getFlagAtivo(): boolean {
        return this.flagAtivo;
    }
    public setFlagAtivo(flagAtivo: boolean): void {
        this.flagAtivo = flagAtivo;
    }
    public getTipoConta(): number {
        return this.tipoConta;
    }
    public setTipoConta(tipoConta: number): void {
        this.tipoConta = tipoConta;
    }
    public getDataCriacao(): string {
        return this.dataCriacao.getDateTime();
    }
    public setDataCriacao(dataCriacao: DateUtc): void {
        this.dataCriacao = dataCriacao;
    }
}