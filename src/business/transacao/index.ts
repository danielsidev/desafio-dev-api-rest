
import { Request, Response, NextFunction } from "express-serve-static-core";
import { ITransacaoBusiness } from "../../interfaces/business/ITransacaoBusiness";
import { TransacaoController } from "../../controller/core/TransacaoController";
import { UtilsController } from "../../controller/utils/UtilsController";
/**
* Represents  a class of account for the account routes
* @class PessoaBusiness
*/
export class TransacaoBusiness{

    /**
     * Representa o método para criar novos clientes 
     * @name post /conta/pf/nova
     * @param req {express.Request} The request.
     * @param res {express.Response} The response.
     * @param req.body {Object: IPessoaBusiness} JSON payload.
     * @param req.body.id_conta {number } - ID da Conta do cliente
     * @param req.body.valor {number} - Valor a ser transacionado
     * @param req.body.tipo {string} - "saque" ou "deposito" -  Operação a ser executada
     */    
    public async registrarTransacao(req:Request, res:Response){    
        let transacao: ITransacaoBusiness = req.body; 
        let transacaoNova = new TransacaoController();
        let transacaoCriada = await transacaoNova.registrar(transacao);          
        try {
                                     
            
                if(transacaoCriada.result){
                    res.status(200).json(transacaoCriada);     
                }else if(transacaoCriada.response==="Conta inexistente ou bloqueada!"){
                    res.status(404).json(transacaoCriada);     
                }else{
                    res.status(400).json(transacaoCriada);     
                }                                        
        } catch (error) {
            console.log(`ERROR: ${JSON.stringify(error)}`);
            res.status(400).json({result:false, response: 'Não foi possível realizar a transação.', data:error});
        }
    }

    /**
     * Representa o método pata consultar o extrato pelo id da conta
     * @name post /transactions/{init}/{limit}
     * @param req {express.Request} The request.
     * @param res {express.Response} The response.
     * @param req.params.id  {integer} - Id da conta
    
     */    
    public async consultarExtrato(req:Request, res:Response){        
        try {
            if(!!req.params.id){
                let id  = parseInt(req.params.id);
                if(id>0){
                    let transacao = new TransacaoController();
                    let result = await transacao.consultarExtrato(id)
                    if(result.result){
                        res.status(200).json(result);   
                    }else{
                        res.status(404).json(result);   
                    }
                    
                }else{
                    res.status(400).json({result:false, response: 'Dados inválidos', data:null});  
                }
                
            }else{
                res.status(400).json({result:false, response: 'Dados inválidos', data:null});    
            }            
        } catch (error) {
            res.status(400).json({result:false, response:'Error', data:error});
        }
    }
    /**
     * Representa o método pata consultar o extrato pelo id da conta e pelo período entre datas
     * @name post /transactions/{init}/{limit}
     * @param req {express.Request} The request.
     * @param res {express.Response} The response.
     * @param req.params.id  {integer} - Id da conta
     * @param req.params.data_ini  {string} - 0000-00-00 -  Data Inicial
     * @param req.params.data_fim  {string} - 0000-00-00 -  Data Final
    
     */   
    public async consultarExtratoPeriodo(req:Request, res:Response){        
        try {
            if(!!req.params.id && !! req.params.data_ini && !!req.params.data_fim){
                let id  = parseInt(req.params.id);
                let dataIni = UtilsController.stringToDateUtc(req.params.data_ini);
                let dataFim = UtilsController.stringToDateUtc(req.params.data_fim, true);
                if(id > 0 && dataIni && dataFim){
                    let transacao = new TransacaoController();
                    let result = await transacao.consultarExtratoPeriodo(id, dataIni, dataFim);
                    if(result.result){
                        res.status(200).json(result);     
                    }else{
                        res.status(404).json(result);     
                    }
                    
                }else{
                    res.status(400).json({result:false, response: 'Dados inválidos', data:null});  
                }

            }else{
                res.status(400).json({result:false, response: 'Dados inválidos'});    
            }            
        } catch (error) {
            res.status(400).json({result:false, response:'Error', data:error});
        }
    }
}