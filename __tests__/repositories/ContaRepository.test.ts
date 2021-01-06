import { ContaRepository } from "../../src/repositories/ContaRepository";
import { Conta } from "../../src/entities/Conta"
import { PessoaRepository } from "../../src/repositories/PessoaRepository";
import { Pessoa } from "../../src/entities/Pessoa"
import { DateUtc } from "../../src/entities/DateUtc";

describe('Repositories - Conta ', () => {
    const idPessoa = 2;
    const pessoa = { idPessoa: idPessoa, nome: 'Gustavo Silva', cpf: '200.587.456-87', data_nascimento: '1980-09-10' };
    let pessoaCriada: any = 0;
    const conta = {
        id_pessoa: idPessoa,
        saldo: 600.00,
        flag_ativo: true,
        tipo_conta: 1,
        data_criacao: new DateUtc(new Date()),
        limite_saque_diario: 2000.00
    };

    let contaCriada: any = 0;

    it('Deve conseguir Criar uma ContaPessoa', async () => {
        const pessoaNova: Pessoa = new Pessoa(pessoa.nome, pessoa.cpf, pessoa.data_nascimento, pessoa.idPessoa);
        const pessoaRepository = new PessoaRepository();
        pessoaCriada = await pessoaRepository.criar(pessoaNova);
        const contaNova: Conta = new Conta(conta);
        const contaRepository = new ContaRepository();
        contaCriada = await contaRepository.criar(contaNova);
        expect(contaCriada).toBeGreaterThan(0);
        expect(pessoaCriada).toBeGreaterThan(0);

    });

    it('Deve conseguir Consultar uma Conta por Id', async () => {
        const contaRepository = new ContaRepository();
        const result = await contaRepository.consultarPorId(contaCriada);
        expect(result[0]['idConta']).toBe(contaCriada);
        expect(result[0]['idPessoa']).toBe(conta.id_pessoa);
        expect(result[0]['saldo']).toBe(conta.saldo);
        expect(result[0]['limiteSaqueDiario']).toBe(conta.limite_saque_diario);
        expect(result[0]['flagAtivo']).toBe(1);
        expect(result[0]['tipoConta']).toBe(conta.tipo_conta);
        expect(result[0]['dataCriacao']).toBe(conta.data_criacao.getDateTime());
    });

    it('Deve conseguir Consultar Saldo em Conta de uma Pessoa', async () => {
        const contaRepository = new ContaRepository();
        const result = await contaRepository.consultarSaldoContaPessoaPorId(contaCriada);
        expect(result[0]['id']).toBe(contaCriada);
        expect(result[0]['saldo']).toBe(conta.saldo);
        expect(result[0]['nome']).toBe(pessoa.nome);
    });

    it('Deve conseguir Atualizar Saldo em Conta', async () => {
        const novoSaldo = 300.00;
        const contaRepository = new ContaRepository();
        const result = await contaRepository.atualizarSaldo(novoSaldo, contaCriada);
        expect(result).toBeGreaterThan(0);
        const resultSaldo = await contaRepository.consultarPorId(contaCriada);
        expect(resultSaldo[0]['idConta']).toBe(contaCriada);
        expect(resultSaldo[0]['saldo']).toBe(novoSaldo);
    });

    it('Deve conseguir Atualizar FlagAtivo', async () => {
        const contaRepository = new ContaRepository();
        const result = await contaRepository.atualizarFlagAtivo(false, contaCriada);
        expect(result).toBeGreaterThan(0);
        const resultAtivo = await contaRepository.atualizarFlagAtivo(true, contaCriada);
        expect(resultAtivo).toBeGreaterThan(0);
        
    });

    it('Deve conseguir Consultar uma Conta Join Pessoa', async () => {
        const pessoaRepository = new PessoaRepository();
        const contaRepository = new ContaRepository();
        const result = await contaRepository.consultarPorPessoa(conta.id_pessoa);
        expect(result[0]['idConta']).toBe(contaCriada);
        expect(result[0]['idPessoa']).toBe(pessoaCriada);

        const resultConta = await contaRepository.excluir(contaCriada);
        const resultPessoa = await pessoaRepository.excluir(pessoaCriada);
        expect(resultPessoa).toBeGreaterThan(0);
        expect(resultConta).toBeGreaterThan(0);

    });

    
});