
import { Request, Response, NextFunction } from "express-serve-static-core";
import { IPessoaBusiness } from '../../interfaces/business/IPessoaBusiness';
import { PessoaController } from '../../controller/core/PessoaController';
/**
* Represents  a class of account for the account routes
* @class PessoaBusiness
*/
export class PessoaBusiness{

    /**
     * Representa o método para criar novos clientes 
     * @name post /conta/pf/nova
     * @param req {express.Request} The request.
     * @param res {express.Response} The response.
     * @param req.body {Object: IPessoaBusiness} JSON payload.
     * @param req.body.nome {string } - Nome do cliente pessoa física
     * @param req.body.cpf {string} - Documento de identificação
     * @param req.body.data_nascimento {string} - Data de nascimento do cliente
     */    
    public async criarPessoaFisica(req:Request, res:Response){               
        try {
                let pessoa: IPessoaBusiness = req.body;                       
                let pessoaNova = new PessoaController();
                let pessoaCriada = await pessoaNova.criar(pessoa);
                if(pessoaCriada.result){
                    res.status(200).json(pessoaCriada);     
                }else{
                    res.status(400).json(pessoaCriada);     
                }                                        
        } catch (error) {
            console.log(`ERROR: ${JSON.stringify(error)}`);
            res.status(400).json({result:false, response: 'Não foi possível criar o cliente', data:error});
        }
    }

    /**
     * Represent the business method for the route that get accounts
     * @name post /transactions/{init}/{limit}
     * @param req {express.Request} The request.
     * @param res {express.Response} The response.
     * @param req.params.id  {integer} - Initial position of cursor for pagination. Ex:0 for start from first register 
    
     */    
    public async consultarPessoaPorId(req:Request, res:Response){        
        try {
            if(!!req.params.id){
                let id  = parseInt(req.params.id);
                let pessoa = new PessoaController();
                let result = await pessoa.consultarPorId(id);
                res.status(200).json(result);     
            }else{
                res.status(400).json({result:false, response: 'Dados inválidos'});    
            }            
        } catch (error) {
            res.status(400).json({result:false, response:'Error', data:error});
        }
    }
}