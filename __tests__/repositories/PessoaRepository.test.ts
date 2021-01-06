import { PessoaRepository } from "../../src/repositories/PessoaRepository";
import { Pessoa } from "../../src/entities/Pessoa"
describe('Repositories - Pessoa ', () => {
    let pessoa = { idPessoa:1, nome:'João Silva', cpf:'147.258.369-79', data_nascimento:'1960-01-23'};
    let pessoaCriada:any = 0;
    it('Deve conseguir Criar uma Pessoa', async () => {
        const pessoaNova: Pessoa = new Pessoa(pessoa.nome, pessoa.cpf, pessoa.data_nascimento, pessoa.idPessoa);
        const pessoaRepository = new PessoaRepository();        
        pessoaCriada = await pessoaRepository.criar(pessoaNova);               
        expect(pessoaCriada).toBeGreaterThan(0);
    });


    it('Deve conseguir Consultar uma Pessoa Por Id', async () => {
        const pessoaRepository = new PessoaRepository();        
        const result= await pessoaRepository.consultarPorId(pessoaCriada);   

        expect(result[0]['idPessoa']).toBe(pessoaCriada);
        expect(result[0]['nome']).toBe(pessoa.nome);
        expect(result[0]['cpf']).toBe(pessoa.cpf);
        expect(result[0]['dataNascimento']).toBe(pessoa.data_nascimento);
    });

    it('Deve conseguir Consultar uma Pessoa Por CPF', async () => {
        const pessoaRepository = new PessoaRepository();        
        const result= await pessoaRepository.consultarPorCpf(pessoa.cpf);   

        expect(result[0]['idPessoa']).toBe(pessoaCriada);
        expect(result[0]['nome']).toBe(pessoa.nome);
        expect(result[0]['cpf']).toBe(pessoa.cpf);
        expect(result[0]['dataNascimento']).toBe(pessoa.data_nascimento);
    });


    it('Deve conseguir Excluir uma Pessoa Por IdPessoa', async () => {
        const pessoaRepository = new PessoaRepository();        
        const result= await pessoaRepository.excluir(pessoaCriada);
        expect(result).toBeGreaterThan(0);
        
    });

});
const time = 1000*10;
afterAll(() => setTimeout(() => process.exit(), time))