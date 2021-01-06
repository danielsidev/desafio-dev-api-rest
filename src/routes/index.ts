import {Request, Response, Application} from "express";
// import {AccountBusiness} from '../business/account/index';
// import {TransactionBusiness} from '../business/transaction/index';
import { PessoaBusiness } from '../business/pessoa/index';
import { ContaBusiness } from '../business/conta/index';
import { TransacaoBusiness } from '../business/transacao/index'
export class Register {
    public app: Application;
    // public ac: AccountBusiness;
    // public tc: TransactionBusiness;
    public pessoa: PessoaBusiness;
    public conta: ContaBusiness;
    public transacao: TransacaoBusiness;

    constructor(app: Application) {  
        this.app = app;
        // this.ac = new AccountBusiness();
        // this.tc = new TransactionBusiness();
        this.pessoa = new PessoaBusiness();
        this.conta = new ContaBusiness();
        this.transacao = new TransacaoBusiness();
    }
    public setRoutes() {
        this.app.get( "/", ( req: Request, res: Response ) => res.render( "index" ) );
        this.app.get( "/health-check", ( req: Request, res: Response ) => res.status(200).json({result:true, response:"ok", data:null}));
        this.app.post("/pessoa", this.pessoa.criarPessoaFisica);
        this.app.get("/pessoa/:id", this.pessoa.consultarPessoaPorId);
        this.app.post("/conta/pf/existente", this.conta.criarContaPessoaFisicaExistente);
        this.app.post("/conta/pf/nova", this.conta.criarContaPessoaFisicaNova);
        // this.app.get("/conta/:id", this.conta.consultarContaPorId);
        this.app.get("/conta/saldo/:id", this.conta.consultarContaSaldo);
        
        this.app.get("/conta/bloquear/:id", this.conta.bloquearConta);
        this.app.get("/conta/desbloquear/:id", this.conta.desbloquearConta);
        this.app.post("/transacao", this.transacao.registrarTransacao);
        this.app.get("/transacao/extrato/conta/:id", this.transacao.consultarExtrato);
        this.app.get("/transacao/extrato/conta/:id/periodo/:data_ini/:data_fim", this.transacao.consultarExtratoPeriodo);

    }
}
