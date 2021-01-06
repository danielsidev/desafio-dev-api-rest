
import { ResponseDao } from '../../interfaces/response/response.dao.interface';
import { Transacao } from '../../entities/Transacao';
import { TransacaoRepository } from '../../repositories/TransacaoRepository';
import { ITransacaoBusiness } from 'interfaces/business/ITransacaoBusiness';
import { ContaController } from './ContaController';
import { Conta } from '../../entities/Conta';
import { DateUtc } from '../../entities/DateUtc';
import { IContaExtratoBusiness } from '../../interfaces/business/IContaExtratoBusiness';


export class TransacaoController {

    private transacoes: [Transacao];
    private contas: [Conta];
    private extratos: [IContaExtratoBusiness];
    private transacaoRepository: TransacaoRepository;
    private contaController: ContaController;
    private response: ResponseDao;

    constructor() {
        this.transacaoRepository = new TransacaoRepository();
        this.response = { result: false, response: '' };
    }

    public async registrar(transacao: ITransacaoBusiness): Promise<ResponseDao> {
        this.response = { result: false, response: 'Precisamos de todos campos preenchidos!' };
        if (!!transacao.id_conta && !!transacao.valor) {
            this.response = { result: false, response: 'Conta inexistente ou bloqueada!', data: null };
            this.contaController = new ContaController();
            this.contas = await this.contaController.consultarPorId(transacao.id_conta);
            if (!!this.contas && this.contas.length > 0) {
                let transacaoBusiness: ITransacaoBusiness = {
                    id_conta: this.contas[0]['idConta'],
                    valor: (transacao.tipo === "saque") ? transacao.valor * -1 : transacao.valor,
                    tipo: transacao.tipo,
                    data_transacao: new DateUtc(new Date())
                }
                let transacaoNova = new Transacao(transacaoBusiness);
                this.response = { result: false, response: "Operação indefinida.", data: null };
                let transacaoRegistrada: object | number;
                if (transacao.tipo === "saque" || transacao.tipo === "deposito") {
                    transacaoRegistrada = await this.transacaoRepository.registrar(transacaoNova);
                }
                if (typeof transacaoRegistrada === 'number' && transacaoRegistrada > 0) {
                    if (transacao.tipo === "saque") {
                        this.response = await this.contaController.sacar(transacaoBusiness.valor, transacaoBusiness.id_conta);
                        if (!this.response.result) {
                            await this.transacaoRepository.excluir(transacaoRegistrada);
                        }
                    } else if (transacao.tipo === "deposito") {
                        this.response = await this.contaController.depositar(transacaoBusiness.valor, transacaoBusiness.id_conta);
                        if (!this.response.result) {
                            await this.transacaoRepository.excluir(transacaoRegistrada);
                        }
                    }
                }
            }
        }
        return this.response;
    }

    public async consultarExtrato(idConta: number): Promise<ResponseDao> {
        this.response = { result: false, response: 'Não existem transações para essa conta', data: null };
        if (!!idConta) {
            this.extratos = await this.transacaoRepository.consultarExtrato(idConta);
            if (this.extratos && this.extratos.length > 0) {
                let extratoConta = { cliente: "", conta: 0, saldo: 0, transacoes: [] };
                this.extratos.map((extrato) => {
                    extratoConta.cliente = extrato.cliente;
                    extratoConta.conta = extrato.conta;
                    extratoConta.saldo = extrato.saldo;
                    extratoConta.transacoes.push({ id:extrato.idTransacao,tranasacao: extrato.transacao, data: extrato.data });
                });
                this.response = { result: true, response: 'Extrato consultado com sucesso.', data: extratoConta };
            }
        }
        return this.response;
    }

    public async consultarExtratoPeriodo(idConta: number, dataInicial: string, dataFinal: string): Promise<ResponseDao> {
        this.response = { result: false, response: 'Não existem transações para essa conta no período solicitado.', data: null };
        if (!!idConta) {
            this.extratos = await this.transacaoRepository.consultarExtratoPorPeriodo(idConta, dataInicial, dataFinal);
            if (this.extratos && this.extratos.length > 0) {
                let extratoConta = { cliente: "", conta: 0, saldo: 0, transacoes: [] };
                this.extratos.map((extrato) => {
                    extratoConta.cliente = extrato.cliente;
                    extratoConta.conta = extrato.conta;
                    extratoConta.saldo = extrato.saldo;
                    extratoConta.transacoes.push({ tranasacao: extrato.transacao, data: extrato.data });
                });
                this.response = { result: true, response: 'Extrato consultado com sucesso.', data: extratoConta };
            }
        }
        return this.response;
    }

    public async excluir(id: number): Promise<ResponseDao> {
        this.response = { result: false, response: 'Não existem transações', data: null };
        if (!!id) {
            let result: object = await this.transacaoRepository.excluir(id);
            this.response = { result: true, response: 'Transação excluída com sucesso.', data: result };
        }
        return this.response;
    }

    public async excluirPorIdConta(idConta: number): Promise<object> {
        let result:object;
        try {
            result = await this.transacaoRepository.excluirPorIdConta(idConta);
        } catch (error) {
            result = error;
        }
        return result;
    }
}

