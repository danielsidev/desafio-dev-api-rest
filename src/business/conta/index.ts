
import { Request, Response, NextFunction } from "express-serve-static-core";
import { IContaBusiness } from "../../interfaces/business/IContaBusiness";
import { ContaController } from "../../controller/core/ContaController";
import { IContaPessoaBusiness } from "interfaces/business/IContaPessoaBusiness";
/**
* Represents  a class of account for the account routes
* @class PessoaBusiness
*/
export class ContaBusiness {

    /**
     * Representa o método para criar Conta para cliente Existente 
     * @name post /conta/pf/existente
     * @param req {express.Request} The request.
     * @param res {express.Response} The response.
     * @param req.body {Object: IPessoaBusiness} JSON payload.
     * @param req.body.id_pessoa {string } - ID do cliente
     * @param req.body.saldo {string} - Saldo inicial
     */
    public async criarContaPessoaFisicaExistente(req: Request, res: Response) {
        try {
            let conta: IContaBusiness = req.body;
            let contaNova = new ContaController();
            let contaCriada = await contaNova.criar(conta);
            if (contaCriada.result) {
                res.status(200).json(contaCriada);
            } else if(contaCriada.response==="Pessoa não existe.") {
                res.status(404).json(contaCriada);
            }else{
                res.status(400).json(contaCriada);
            }
        } catch (error) {
            console.log(`ERROR: ${JSON.stringify(error)}`);
            res.status(400).json({ result: false, response: 'Não foi possível criar a conta', data: error });
        }
    }
    /**
      * Representa o método para criar Conta para um Cliente Novo
      * @name post /conta/pf/nova
      * @param req {express.Request} The request.
      * @param res {express.Response} The response.
      * @param req.body {Object: IContaPessoaBusiness} JSON payload.
      * @param req.body.nome {string } - Nome do cliente
      * @param req.body.cpf  {string } - CPF do cliente
      * @param req.body.data_nascimento {string } - Data de Nascimento do cliente
      * @param req.body.saldo {string} - Saldo inicial
      */
    public async criarContaPessoaFisicaNova(req: Request, res: Response) {
        try {
            let conta: IContaPessoaBusiness = req.body;
            let contaNova = new ContaController();
            let contaCriada = await contaNova.criarContaPessoa(conta);
            if (contaCriada.result) {
                res.status(200).json(contaCriada);
            } else {
                res.status(400).json(contaCriada);
            }
        } catch (error) {
            console.log(`ERROR: ${JSON.stringify(error)}`);
            res.status(400).json({ result: false, response: 'Não foi possível criar a conta', data: error });
        }
    }
    /**
         * Representa o método para Bloquear Conta 
         * @name post /conta/bloquear/{id}
         * @param req {express.Request} The request.
         * @param res {express.Response} The response.
         * @param req.params.id {interger} ID da Conta
         */
    public async bloquearConta(req: Request, res: Response) {
        try {
            let idConta: number = parseInt(req.params.id);
            if (idConta > 0) {
                let conta = new ContaController();
                let contaBloqueada = await conta.bloquearConta(idConta);
                if (contaBloqueada.result) {
                    res.status(200).json(contaBloqueada);
                } else {
                    res.status(400).json(contaBloqueada);
                }
            } else {
                res.status(400).json({ result: false, response: 'Dados inválidos.', data: null });
            }
        } catch (error) {
            console.log(`ERROR: ${JSON.stringify(error)}`);
            res.status(400).json({ result: false, response: 'Não foi possível bloquear a conta', data: error });
        }
    }
    /**
     * Representa o método para Desbloquear Conta 
     * @name post /conta/desbloquear/{id}
     * @param req {express.Request} The request.
     * @param res {express.Response} The response.
     * @param req.params.id {interger} ID da Conta
     */
    public async desbloquearConta(req: Request, res: Response) {
        try {
            let idConta: number = parseInt(req.params.id);
            if (idConta > 0) {
                let conta = new ContaController();
                let contaDesbloqueada = await conta.desbloquearConta(idConta);
                if (contaDesbloqueada.result) {
                    res.status(200).json(contaDesbloqueada);
                } else {
                    res.status(400).json(contaDesbloqueada);
                }
            } else {
                res.status(400).json({ result: false, response: 'Dados inválidos.', data: null });
            }
        } catch (error) {
            console.log(`ERROR: ${JSON.stringify(error)}`);
            res.status(400).json({ result: false, response: 'Não foi possível desbloquear a conta', data: error });
        }
    }
    /**
     * Representa o método pata recupear a conta por id
     * @name post /conta/{id}
     * @param req {express.Request} The request.
     * @param res {express.Response} The response.
     * @param req.params.id  {integer} - ID da conta
    

 * Representa o método para recupear o saldo da conta e nome do dono da conta
 * @name post /conta/saldo/{id}
 * @param req {express.Request} The request.
 * @param res {express.Response} The response.
 * @param req.params.id  {integer} - ID da conta
 
 */
    public async consultarContaSaldo(req: Request, res: Response) {
        try {
            if (!!req.params.id) {
                let id = parseInt(req.params.id);
                if (id > 0) {
                    let conta = new ContaController();
                    let result = await conta.consultarSaldo(id);
                    if (result && result.length > 0) {
                        res.status(200).json({ result: true, response: "Saldo recuperado com sucesso.", data: result });
                    } else {
                        res.status(404).json({ result: false, response: "Conta inexistente ou bloqueada!", data: null });

                    }

                } else {
                    res.status(400).json({ result: false, response: 'Dados inválidos', data: null });
                }
            } else {
                res.status(400).json({ result: false, response: 'Dados inválidos', data: null });
            }
        } catch (error) {
            res.status(400).json({ result: false, response: 'Error', data: error });
        }
    }
}