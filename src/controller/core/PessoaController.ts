import { UtilsController } from '../utils/UtilsController';
import { Pessoa } from '../../entities/Pessoa';
import { IPessoaBusiness } from '../../interfaces/business/IPessoaBusiness';
import { ResponseDao } from '../../interfaces/response/response.dao.interface';
import { PessoaRepository } from '../../repositories/PessoaRepository';


export class PessoaController {

    private pessoas:[Pessoa];
    private pessoaRepository: PessoaRepository;
    private response:ResponseDao;

    constructor(){
        this.pessoaRepository = new PessoaRepository();
        this.response = {result:false, response:''};
    }

    public async criar(pessoa:IPessoaBusiness):Promise<ResponseDao>{
        this.response = {result:false, response:'Precisamos de todos campos preenchidos!'};
        if(!!pessoa.cpf && !!pessoa.nome && !!pessoa.data_nascimento){
            this.response = {result:false, response:'Pessoa já existe!', data:null};
            this.pessoas = await   this.pessoaRepository.consultarPorCpf(pessoa.cpf); 
            if(!this.pessoas.length){
                let data_nascimento = UtilsController.stringToDateUtc(pessoa.data_nascimento);
                let pessoaNova = new Pessoa(pessoa.nome, pessoa.cpf, data_nascimento);
                let pessoaCriada = await this.pessoaRepository.criar(pessoaNova);
                this.response = {result:true, response:pessoaCriada.toString(), data:pessoaCriada.toString()};   
            }
        }
        return this.response;
    }

    public async consultarPorCpf(cpf:string):Promise<[Pessoa]>{
        this.pessoas = await this.pessoaRepository.consultarPorCpf(cpf); 
        return this.pessoas;
    }
    public async consultarPorId(id: number):Promise<[Pessoa]>{
        this.pessoas = await this.pessoaRepository.consultarPorId(id); 
        return this.pessoas;
    }

    public async excluir(id: number):Promise<object>{
        let result:object = await this.pessoaRepository.excluir(id);
        return result;
    }
}
