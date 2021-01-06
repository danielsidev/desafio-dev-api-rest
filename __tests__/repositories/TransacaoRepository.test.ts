import { TransacaoRepository } from "../../src/repositories/TransacaoRepository";
import { Transacao } from "../../src/entities/Transacao"
import { ContaRepository } from "../../src/repositories/ContaRepository";
import { Conta } from "../../src/entities/Conta"
import { PessoaRepository } from "../../src/repositories/PessoaRepository";
import { Pessoa } from "../../src/entities/Pessoa"
import { DateUtc } from "../../src/entities/DateUtc";

describe('Repositories - Transação ', () => {
    const idPessoa = 3;
    const pessoa = { idPessoa: idPessoa, nome: 'Mariana Silva', cpf: '800.587.656-17', data_nascimento: '1987-12-07' };
    let pessoaCriada: any = 0;
    const conta = {
        id_conta: 3,
        id_pessoa: idPessoa,
        saldo: 800.00,
        flag_ativo: true,
        tipo_conta: 1,
        data_criacao: new DateUtc(new Date()),
        limite_saque_diario: 2000.00
    };

    let contaCriada: any = 0;

    let transacao = {
        id_conta: conta.id_conta,
        valor: 100,
        tipo: '',
        data_transacao: new DateUtc(new Date(2020, 12, 10))
    };

    let transacaoCriadaDeposito: any = 0;
    let transacaoCriadaSaque: any = 0;


    it('Deve conseguir Criar uma Transação de Depósito', async () => {
        const pessoaNova: Pessoa = new Pessoa(pessoa.nome, pessoa.cpf, pessoa.data_nascimento, pessoa.idPessoa);
        const pessoaRepository = new PessoaRepository();
        pessoaCriada = await pessoaRepository.criar(pessoaNova);

        const contaNova: Conta = new Conta(conta);
        const contaRepository = new ContaRepository();
        contaCriada = await contaRepository.criar(contaNova);
        expect(contaCriada).toBeGreaterThan(0);
        expect(pessoaCriada).toBeGreaterThan(0);

        transacao['tipo'] = "deposito";
        const transacaoNova = new Transacao(transacao);
        const transacaoRepository = new TransacaoRepository();
        transacaoCriadaDeposito = await transacaoRepository.registrar(transacaoNova);
        expect(transacaoCriadaDeposito).toBeGreaterThan(0);
    });

    it('Deve conseguir Criar uma Transação de Saque', async () => {
        transacao['valor'] = -100;
        transacao['tipo'] = "saque";
        transacao['data_transacao'] = new DateUtc(new Date(2020, 12, 7))
        const transacaoNova = new Transacao(transacao);
        const transacaoRepository = new TransacaoRepository();
        transacaoCriadaSaque = await transacaoRepository.registrar(transacaoNova);
        expect(transacaoCriadaSaque).toBeGreaterThan(0);
    });

    it('Deve conseguir Consultar o Extrado de Transações', async () => {
        const transacaoRepository = new TransacaoRepository();
        let extrato = await transacaoRepository.consultarExtrato(contaCriada);
        expect(extrato.length).toBeGreaterThan(0);
    });

    it('Deve conseguir Consultar o Extrado de Transações Por Período', async () => {
        const pessoaRepository = new PessoaRepository();
        const contaRepository = new ContaRepository();
        const transacaoRepository = new TransacaoRepository();

        let extrato = await transacaoRepository.consultarExtratoPorPeriodo(contaCriada, '2021-01-07', '2021-01-10');
        expect(extrato.length).toBeGreaterThan(0);

        const resultConta = await contaRepository.excluir(contaCriada);
        const resultPessoa = await pessoaRepository.excluir(pessoaCriada);
        const resultTransacaoDeposito = await transacaoRepository.excluir(transacaoCriadaDeposito);
        const resultTransacaoSaque = await transacaoRepository.excluir(transacaoCriadaSaque);
        expect(resultPessoa).toBeGreaterThan(0);
        expect(resultConta).toBeGreaterThan(0);
        expect(resultTransacaoDeposito).toBeGreaterThan(0);
        expect(resultTransacaoSaque).toBeGreaterThan(0);
    });
});