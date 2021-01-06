
import { IPessoaBusiness } from '../../../src/interfaces/business/IPessoaBusiness';
import { PessoaController } from '../../../src/controller/core/PessoaController';
import { IContaPessoaBusiness } from '../../../src/interfaces/business/IContaPessoaBusiness';
import { IContaBusiness } from '../../../src/interfaces/business/IContaBusiness';
import { ContaController } from '../../../src/controller/core/ContaController';
import { Conta } from '../../../src/entities/Conta';
import { ResponseDao } from '../../../src/interfaces/response/response.dao.interface';
import { IContaSaldoRepository } from '../../../src/interfaces/repositories/IContaSaldoRepository';
describe('Controller - Conta ', () => {

    let pessoaExistente:IPessoaBusiness = { nome:'Sandra Silva', cpf:'021.228.969-19', data_nascimento:'1970-07-29'};
    let pessoaCriada:object, contaCriada:object, contaPessoaCriada:object = { result:false, response:'', data:''};
    let contaPessoa: IContaPessoaBusiness = {nome: "Carla da Silva", cpf:"982.041.003-00", data_nascimento:"1965-01-15", saldo:1450.78};
    let conta: IContaBusiness = {id_pessoa:10, saldo:2450.78};
    let contaModel:[Conta];
    let contaSaldo: [IContaSaldoRepository];
    let contaResponse: ResponseDao;

    it('Deve Criar uma Conta  com base em uma Pessoa Existente', async () => {
        //Simulando a existência de uma pessoa na base.
        let pessoaController:PessoaController = new PessoaController();
        pessoaCriada = await pessoaController.criar(pessoaExistente); 
        
        let idPessoa:number = parseInt(pessoaCriada['data']); 
        conta['id_pessoa'] = idPessoa;
        
        //Criando a conta com base em uma pessoa existente
        const contaController= new ContaController();        
        contaCriada = await contaController.criar(conta);
        
        const response = parseInt(contaCriada['response']);
        const data = parseInt(contaCriada['data']);
        expect(contaCriada['result']).toBeTruthy();
        expect(response).toBeGreaterThan(0);
        expect(data).toBeGreaterThan(0);

        const contaPessoaExcluida =  await contaController.excluir(data);
        expect(contaPessoaExcluida['conta']).toBeGreaterThan(0); 
        expect(contaPessoaExcluida['pessoa']).toBeGreaterThan(0);

    });

    it('Deve Criar uma Conta e Pessoa Nova', async () => {
        const contaController= new ContaController();        
        contaPessoaCriada = await contaController.criarContaPessoa(contaPessoa);
        const response = parseInt(contaPessoaCriada['response']);
        const data = parseInt(contaPessoaCriada['data']);
        expect(contaPessoaCriada['result']).toBeTruthy();
        expect(response).toBeGreaterThan(0);
        expect(data).toBeGreaterThan(0);
        

        // const contaPessoaExcluida =  await contaController.excluir(data);
        // expect(contaPessoaExcluida['conta']).toBeGreaterThan(0); 
        // expect(contaPessoaExcluida['pessoa']).toBeGreaterThan(0);

    });

    it('Deve Consultar Conta Simples por Id', async () => {
        const idConta = parseInt(contaPessoaCriada['data']);
        const contaController= new ContaController(); 
        contaModel = await contaController.consultarPorId(idConta);
        expect(contaModel.length).toBeGreaterThan(0);
        expect(contaModel[0]['idConta']).toBe(idConta);
        expect(contaModel[0]['idPessoa']).toBeGreaterThan(0);
        expect(contaModel[0]['saldo']).toBe(contaPessoa.saldo);
        expect(contaModel[0]['flagAtivo']).toBe(1);
        expect(contaModel[0]['tipoConta']).toBe(1);
    });

    it('Deve Consultar Saldo', async () => {
        const idConta = parseInt(contaPessoaCriada['data']);
        const contaController= new ContaController(); 
        contaSaldo = await contaController.consultarSaldo(idConta);
        expect(contaSaldo.length).toBeGreaterThan(0);
        expect(contaSaldo[0]['id']).toBe(idConta);
        expect(contaSaldo[0]['saldo']).toBe(contaPessoa.saldo);
        expect(contaSaldo[0]['nome']).toBe(contaPessoa.nome);
    });

    it('Deve Conseguir Depositar', async () => {
        const idConta = parseInt(contaPessoaCriada['data']);
        const contaController= new ContaController(); 
        const valor = 500;
        contaResponse = await contaController.depositar(valor, idConta);
        let data = parseInt(contaResponse.data);
        expect(contaResponse.result).toBeTruthy();
        expect(data).toBeGreaterThan(0);        
    });

    it('Deve Conseguir Sacar', async () => {
        const idConta = parseInt(contaPessoaCriada['data']);
        const contaController= new ContaController(); 
        const valor = -100;
        contaResponse = await contaController.sacar(valor, idConta);
  
        let data = parseInt(contaResponse.data);
        expect(contaResponse.result).toBeTruthy();
        expect(data).toBeGreaterThan(0);
    });

    it('NÃO Consegue Depositar: Valor Igual a zero', async () => {
        const idConta = parseInt(contaPessoaCriada['data']);
        const contaController= new ContaController(); 
        const valor = 0;
        contaResponse = await contaController.depositar(valor, idConta);
        expect(contaResponse.result).toBeFalsy();
    });

    it('NÃO Consegue Sacar: Saldo Insuficiente', async () => {
        const idConta = parseInt(contaPessoaCriada['data']);
        const contaController= new ContaController(); 
        const valor = -10000000;
        contaResponse = await contaController.sacar(valor, idConta);
        expect(contaResponse.result).toBeFalsy();
    });

    it('NÃO Consegue Depositar: Conta Bloqueada', async () => {
        const idConta = parseInt(contaPessoaCriada['data']);
        const contaController= new ContaController(); 
        await contaController.bloquearConta(idConta);
        const valor = 50;
        contaResponse = await contaController.depositar(valor, idConta);
        expect(contaResponse.result).toBeFalsy();
        await contaController.desbloquearConta(idConta);
    });

    it('NÃO Consegue Sacar: Conta Bloqueada', async () => {
        const idConta = parseInt(contaPessoaCriada['data']);
        const contaController= new ContaController(); 
        await contaController.bloquearConta(idConta);
        const valor = -10;
        contaResponse = await contaController.sacar(valor, idConta);
        expect(contaResponse.result).toBeFalsy();
        await contaController.desbloquearConta(idConta);
    });

    it('Bloquear Conta ', async () => {
        const idConta = parseInt(contaPessoaCriada['data']);
        const contaController= new ContaController(); 
        contaResponse = await contaController.bloquearConta(idConta);
        expect(contaResponse.result).toBeTruthy();
    });

    it('Desbloquear Conta ', async () => {
        const idConta = parseInt(contaPessoaCriada['data']);
        const contaController= new ContaController(); 
        contaResponse = await contaController.desbloquearConta(idConta);
        expect(contaResponse.result).toBeTruthy();
    });

    it('Excluir Conta ', async () => {
        const idConta = parseInt(contaPessoaCriada['data']);
        const contaController= new ContaController(); 
        const contaPessoaExcluida =  await contaController.excluir(idConta);
        expect(contaPessoaExcluida['conta']).toBeGreaterThan(0); 
        expect(contaPessoaExcluida['pessoa']).toBeGreaterThan(0);
    });
});