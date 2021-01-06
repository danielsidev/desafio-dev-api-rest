import { IPessoaBusiness } from '../../../src/interfaces/business/IPessoaBusiness';
import { IContaPessoaBusiness } from '../../../src/interfaces/business/IContaPessoaBusiness';
import { IContaBusiness } from '../../../src/interfaces/business/IContaBusiness';
import { ITransacaoBusiness } from '../../../src/interfaces/business/ITransacaoBusiness';
import { ContaController } from '../../../src/controller/core/ContaController';
import { TransacaoController } from '../../../src/controller/core/TransacaoController';
import { DateUtc } from '../../../src/entities/DateUtc';
import { Conta } from '../../../src/entities/Conta';
import { ResponseDao } from '../../../src/interfaces/response/response.dao.interface';
import { IContaSaldoRepository } from '../../../src/interfaces/repositories/IContaSaldoRepository';

describe('Controller - Transação ', () => {


    let contaPessoaCriada:object = { result:false, response:'', data:''};
    let contaPessoa: IContaPessoaBusiness = {id:null,nome: "Joana da Silva", cpf:"731.049.420-21", data_nascimento:"1990-04-25", saldo:1550.78};
    let transacaoResponse: ResponseDao;
    let transacao: ITransacaoBusiness = {id_conta:0, valor:0, tipo:""}; 


    it('Deve Registrar uma Transação de Depósito', async () => {
        const contaController= new ContaController();        
        contaPessoaCriada = await contaController.criarContaPessoa(contaPessoa);
        
        
        const response = parseInt(contaPessoaCriada['response']);
        const data = parseInt(contaPessoaCriada['data']);
        expect(contaPessoaCriada['result']).toBeTruthy();
        expect(response).toBeGreaterThan(0);
        expect(data).toBeGreaterThan(0);
        const idConta = parseInt(contaPessoaCriada['data']);
        contaPessoa.id = idConta;
        transacao.id_conta = idConta;
        transacao.valor = 700;
        transacao.tipo = "deposito";

        const transacaoController = new TransacaoController();
        transacaoResponse = await transacaoController.registrar(transacao);
        let dataTransacao = parseInt(transacaoResponse.data);
        expect(transacaoResponse.result).toBeTruthy();
        expect(dataTransacao).toBeGreaterThan(0);
    });

    it('Deve Registrar uma Transação de Saque', async () => {
        const idConta = contaPessoa.id;
        transacao.id_conta = idConta;
        transacao.valor = 200;
        transacao.tipo = "saque";
        const transacaoController = new TransacaoController();
        transacaoResponse = await transacaoController.registrar(transacao);
        let dataTransacao = parseInt(transacaoResponse.data);
        expect(transacaoResponse.result).toBeTruthy();
        expect(dataTransacao).toBeGreaterThan(0);
    });

    it('NÃO Registra Transação: Operação Indefinida', async () => {
        const idConta = contaPessoa.id;
        transacao.id_conta = idConta;
        transacao.valor = 200;
        transacao.tipo = "transferencia";
        const transacaoController = new TransacaoController();
        transacaoResponse = await transacaoController.registrar(transacao);
        expect(transacaoResponse.result).toBeFalsy();
    });

    it('NÃO Registra Transação: Conta Bloqueada', async () => {
        const idConta = contaPessoa.id;
        const contaController = new ContaController();
        await contaController.bloquearConta(idConta);
        transacao.id_conta = idConta;
        transacao.valor = 200;
        transacao.tipo = "deposito";
        const transacaoController = new TransacaoController();
        transacaoResponse = await transacaoController.registrar(transacao);        
        expect(transacaoResponse.result).toBeFalsy();
        await contaController.desbloquearConta(idConta);
    });

    it('Deve Consultar o Extrato de Transações', async () => {
        const idConta = contaPessoa.id;
        const transacaoController = new TransacaoController();
        transacaoResponse = await transacaoController.consultarExtrato(idConta);        
        expect(transacaoResponse.result).toBeTruthy();
        expect(transacaoResponse.data.conta).toBe(idConta);
        expect(transacaoResponse.data.transacoes.length).toBeGreaterThan(0);
    });

    it('NÃO Consulta o Extrato de Transações: Conta Bloqueada', async () => {
        const idConta = contaPessoa.id;
        const contaController = new ContaController();
        await contaController.bloquearConta(idConta);
        const transacaoController = new TransacaoController();
        transacaoResponse = await transacaoController.consultarExtrato(idConta);        
        expect(transacaoResponse.result).toBeFalsy();
        await contaController.desbloquearConta(idConta);
    });

    it('NÃO Consulta o Extrato de Transações: Conta não existe', async () => {
        const idConta = null;
        const transacaoController = new TransacaoController();
        transacaoResponse = await transacaoController.consultarExtrato(idConta);        
        expect(transacaoResponse.result).toBeFalsy();
    });

    it('Deve Consultar o Extrato de Transações Por Período entre Datas', async () => {
        const idConta = contaPessoa.id;
        const dataInicial= new DateUtc(new Date()).getDateTime();
        const dataFinal= new DateUtc(new Date()).getDateTime();
        const transacaoController = new TransacaoController();
        transacaoResponse = await transacaoController.consultarExtratoPeriodo(idConta, dataInicial, dataFinal);        
        expect(transacaoResponse.result).toBeTruthy();
        expect(transacaoResponse.data.conta).toBe(idConta);
        expect(transacaoResponse.data.transacoes.length).toBeGreaterThan(0);
    });

    it('NÃO Consulta o Extrato de Transações Por Período entre Datas: Conta Bloqueada', async () => {
        const idConta = contaPessoa.id;
        const dataInicial= new DateUtc(new Date()).getDateTime();
        const dataFinal= new DateUtc(new Date()).getDateTime();
        const contaController = new ContaController();
        await contaController.bloquearConta(idConta);
        const transacaoController = new TransacaoController();
        transacaoResponse = await transacaoController.consultarExtratoPeriodo(idConta, dataInicial, dataFinal);        
        expect(transacaoResponse.result).toBeFalsy();
        await contaController.desbloquearConta(idConta);
    });

    it('NÃO Consulta o Extrato de Transações Por Período entre Datas: Conta não existe', async () => {
        const idConta = null;
        const dataInicial= new DateUtc(new Date()).getDateTime();
        const dataFinal= new DateUtc(new Date()).getDateTime();
        const transacaoController = new TransacaoController();
        transacaoResponse = await transacaoController.consultarExtratoPeriodo(idConta, dataInicial, dataFinal);        
        expect(transacaoResponse.result).toBeFalsy();
    });    

    it('Deve Excluir Transações', async () => {
        const idConta = contaPessoa.id;
        const transacaoController = new TransacaoController();        
        const excluido = await transacaoController.excluirPorIdConta(idConta);
        const contaController= new ContaController(); 
        const contaPessoaExcluida =  await contaController.excluir(idConta);
        
        expect(contaPessoaExcluida['conta']).toBeGreaterThan(0); 
        expect(contaPessoaExcluida['pessoa']).toBeGreaterThan(0);
        expect(excluido).toBeGreaterThan(0);
        
    });  
});