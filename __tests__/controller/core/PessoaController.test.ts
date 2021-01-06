
import { IPessoaBusiness } from '../../../src/interfaces/business/IPessoaBusiness';
import { PessoaController } from '../../../src/controller/core/PessoaController';
import { Pessoa } from '../../../src/entities/Pessoa';

describe('Controller - Pessoa ', () => {
    let pessoa:IPessoaBusiness = { nome:'João Silva', cpf:'530.624.500-53', data_nascimento:'1960-01-23'};
    let pessoaCriada:object = { result:false, response:'', data:''};
    it('Deve conseguir Criar uma Pessoa', async () => {
        const pessoaController= new PessoaController();        
        pessoaCriada = await pessoaController.criar(pessoa);
        const response = parseInt(pessoaCriada['response']);
        const data = parseInt(pessoaCriada['data']);
        expect(pessoaCriada['result']).toBeTruthy();
        expect(response).toBeGreaterThan(0);
        expect(data).toBeGreaterThan(0);
    });
    it('Deve conseguir Consultar uma Pessoa por Id', async () => {
        let idPessoa:number  = parseInt(pessoaCriada['data']);
        const pessoaController= new PessoaController();        
        const result:[Pessoa] = await pessoaController.consultarPorId(idPessoa);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]['idPessoa']).toBe(idPessoa);
        expect(result[0]['nome']).toBe(pessoa.nome);
        expect(result[0]['cpf']).toBe(pessoa.cpf);
        expect(result[0]['dataNascimento']).toBe(pessoa.data_nascimento);
    });


    it('Deve conseguir Consultar uma Pessoa por CPF', async () => {
        let idPessoa:number  = parseInt(pessoaCriada['data']);
        const pessoaController= new PessoaController();        
        const result:[Pessoa] = await pessoaController.consultarPorCpf(pessoa.cpf);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]['idPessoa']).toBe(idPessoa);
        expect(result[0]['nome']).toBe(pessoa.nome);
        expect(result[0]['cpf']).toBe(pessoa.cpf);
        expect(result[0]['dataNascimento']).toBe(pessoa.data_nascimento);
    });

    it('Deve conseguir Excluir Pessoa ', async () => {
        let idPessoa:number  = parseInt(pessoaCriada['data']);
        const pessoaController= new PessoaController();                
        const excluido = await pessoaController.excluir(idPessoa);
        expect(excluido).toBeGreaterThan(0);

    });
});