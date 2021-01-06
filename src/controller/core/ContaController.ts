
import { ResponseDao } from '../../interfaces/response/response.dao.interface';
import { IContaBusiness } from '../../interfaces/business/IContaBusiness';
import { ContaRepository } from '../../repositories/ContaRepository';
import { Conta } from '../../entities/Conta';
import { DateUtc } from '../../entities/DateUtc';
import { IContaPessoaBusiness } from '../../interfaces/business/IContaPessoaBusiness';
import { PessoaController } from './PessoaController'
import { IContaSaldoRepository } from '../../interfaces/repositories/IContaSaldoRepository';
import { Pessoa } from '../../entities/Pessoa';

export class ContaController {

   private pessoa: PessoaController;
   private response: ResponseDao;
   private contas: [Conta];
   private contaSaldo: [IContaSaldoRepository];
   private contaRepository: ContaRepository;
   constructor() {
      this.contaRepository = new ContaRepository();
      this.response = { result: false, response: '' };
   }
   private async verificarContaPessoa(conta: IContaBusiness): Promise<IContaBusiness> {
      this.contas = await this.contaRepository.consultarPorPessoa(conta.id_pessoa);
      if (!this.contas.length) {
         conta.flag_ativo = (!!conta.flag_ativo) ? conta.flag_ativo : true,
            conta.tipo_conta = (!!conta.tipo_conta) ? conta.tipo_conta : 1,
            conta.data_criacao = new DateUtc(new Date()),
            conta.limite_saque_diario = (!!conta.limite_saque_diario) ? conta.limite_saque_diario : 2000;
      }
      return conta;
   }
   public async criar(conta: IContaBusiness): Promise<ResponseDao> {
      this.response = { result: false, response: 'Precisamos de todos os campos preenchidos!' };
      if (!!conta.id_pessoa && !!conta.saldo) {
         this.response = { result: false, response: 'Conta já existe!', data: null };
         this.pessoa = new PessoaController();
         let pessoa:[Pessoa] = await this.pessoa.consultarPorId(conta.id_pessoa);
         if(pessoa && pessoa.length>0){            
            let contaVerificada: IContaBusiness = await this.verificarContaPessoa(conta);
            if (!!contaVerificada.data_criacao) {
               let contaNova = new Conta(contaVerificada);
               let contaCriada = await this.contaRepository.criar(contaNova);
               this.response = { result: true, response: contaCriada.toString(), data: contaCriada.toString() };
            }
         }else{
            this.response = { result: false, response: "Pessoa não existe.", data: null };
         }   
      }
      return this.response;
   }
   public async criarContaPessoa(contaPessoa: IContaPessoaBusiness): Promise<ResponseDao> {
      this.response = { result: false, response: 'Precisamos de todos os campos preenchidos!' };
      if (!!contaPessoa.cpf && !!contaPessoa.nome && !!contaPessoa.data_nascimento && !!contaPessoa.saldo) {
         let novaPessoa = {
            nome: contaPessoa.nome,
            cpf: contaPessoa.cpf,
            data_nascimento: contaPessoa.data_nascimento
         };
         this.pessoa = new PessoaController();
         let pessoaCriada = await this.pessoa.criar(novaPessoa);
         if (pessoaCriada.result) {
            let idPessoa = parseInt(pessoaCriada.data);
            this.response = { result: false, response: 'Conta já existe!', data: null };
            let conta: IContaBusiness = {
               flag_ativo: contaPessoa.flag_ativo,
               tipo_conta: contaPessoa.tipo_conta,
               data_criacao: contaPessoa.data_criacao,
               limite_saque_diario: contaPessoa.limite_saque_diario,
               saldo: contaPessoa.saldo,
               id_pessoa: idPessoa
            };
            let contaVerificada: IContaBusiness = await this.verificarContaPessoa(conta);
            if (!!contaVerificada.data_criacao) {
               let contaNova = new Conta(contaVerificada);
               let contaCriada = await this.contaRepository.criar(contaNova);
               this.response = { result: true, response: contaCriada.toString(), data: contaCriada.toString() };
            }
         } else {
            this.response = { result: false, response: pessoaCriada.response, data: pessoaCriada.data };
         }
      }
      return this.response;
   }
   public async consultarPorId(id: number): Promise<[Conta]> {
      this.contas = await this.contaRepository.consultarPorId(id);
      return this.contas;
   }

   public async consultarSaldo(idConta:number):Promise<[IContaSaldoRepository]>{
     this.contaSaldo = await this.contaRepository.consultarSaldoContaPessoaPorId(idConta);
     return this.contaSaldo;
   }

   public async depositar(valor:number, idConta:number):Promise<ResponseDao>{
      this.response = { result: false, response: "Não foi possíel depositar", data:null };
      try {
         if(valor>0){
            this.contas = await this.consultarPorId(idConta);
            this.response = { result: false, response: "Conta inxistente ou bloqueada!", data:null };
            if (!!this.contas && this.contas.length > 0) {
               let saldoAtual:number = this.contas[0]['saldo'];
               let saldoNovo:number  = saldoAtual + valor;
               let deposito = await this.contaRepository.atualizarSaldo(saldoNovo, idConta);   
               this.response = { result: true, response: "Depósito realizado com sucesso.", data:deposito.toString() };
            }
         }else{
            this.response = { result: false, response: "O depósito deve ser maior que zero(0).", data:null};   
         }         
      } catch (error) {
         this.response = { result: false, response: "Erro ao realizar depósito", data:error};
      }
      return this.response;      
   }
   public async sacar(valor:number, idConta:number):Promise<ResponseDao>{
      this.response = { result: false, response: "Não foi possíel depositar", data:null };
      try {
         if(valor<0){
            this.contas = await this.consultarPorId(idConta);
            this.response = { result: false, response: "Conta inxistente ou bloqueada!", data:null };
            if (!!this.contas && this.contas.length > 0) {
               let saldoAtual:number = this.contas[0]['saldo'];
               if(saldoAtual< Math.abs(valor)){
                  this.response = { result: false, response: "Operação não permitida. Saldo insuficiente.", data:{saldo:saldoAtual, saque:valor}};   
               }else{
                  let saldoNovo:number  = saldoAtual - Math.abs(valor);
                  let deposito = await this.contaRepository.atualizarSaldo(saldoNovo, idConta);   
                  this.response = { result: true, response: "Saque realizado com sucesso.", data:deposito.toString() };
               }
            }
         }else{
            this.response = { result: false, response: "Operação não permitida. Essa operação só realiza saque.", data:null};   
         }         
      } catch (error) {
         this.response = { result: false, response: "Erro ao realizar saque", data:error};
      }
      return this.response;      
   }
   public async bloquearConta(idConta: number) {
      this.response = { result: false, response: 'Não conseguimos bloquear a conta', data:null };
      let bloqueada = await this.contaRepository.atualizarFlagAtivo(false, idConta);
      if (bloqueada) {
         this.response = { result: true, response: 'Conta bloqueada com sucesso!', data:null };
      }
      return this.response;
   }
   public async desbloquearConta(idConta: number) {
      this.response = { result: false, response: 'Não conseguimos desbloquear a conta' };
      let bloqueada = await this.contaRepository.atualizarFlagAtivo(true, idConta);
      if (bloqueada) {
         this.response = { result: true, response: 'Conta desbloqueada com sucesso!' };
      }
      return this.response;
   }

   
   public async excluir(id: number):Promise<object>{
      let response:object;
      try {
         this.pessoa = new PessoaController();
         this.contas = await this.consultarPorId(id);
         let idPessoa = this.contas[0]['idPessoa'];
         let resultConta:object = await this.contaRepository.excluir(id);
         let resultPessoa:object = await this.pessoa.excluir(idPessoa);
         response = {pessoa:resultPessoa, conta:resultConta};
      } catch (error) {
         response = error;
      }
      return response;
  }
}