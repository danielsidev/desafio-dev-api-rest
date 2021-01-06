import { Pessoa } from "entities/Pessoa";
import { IPessoas } from "interfaces/repositories/IPessoasRepository";
import { MySQLConn, PoolConnection } from "./database/MySQLClient";

class PessoaRepository implements IPessoas{
    private readonly table: string = "pessoas";
    private db: MySQLConn;
    constructor() {    
        this.db = new MySQLConn();
    }
    
    public criar(pessoa: Pessoa ): Promise<object> {
        return new Promise((resolve, reject)=>{
            this.db.getConnection().then((connection: PoolConnection) => {
                connection.query(`INSERT INTO ${this.table}  VALUES(?, ?, ?, ?)`, 
                [
                    pessoa.getIdPessoa(), 
                    pessoa.getNome(), 
                    pessoa.getCpf(),
                    pessoa.getDataNascimento()
                ], (err, rows) => {
                    if (err) {
                        console.log(`ERROR QUERY: ${JSON.stringify(err)}`);
                        reject(err);
                    } else {
                        resolve(rows.insertId);
                    }
                })
            }).catch((err)=>{
                console.log(`CATCH: ERROR EXECUTION => ${JSON.stringify(err)}`);
                reject(err);
            });
        });        
    }
    public consultarPorId(idPessoa: number ): Promise<[Pessoa]> {
        return new Promise((resolve, reject)=>{
            this.db.getConnection().then((connection: PoolConnection) => {
                connection.query(`SELECT idPessoa, nome, cpf, DATE_FORMAT(dataNascimento,'%Y-%m-%d') as dataNascimento FROM ${this.table} WHERE idPessoa=?`, [idPessoa], (err, rows) => {
                    if (err) {
                        console.log(`ERROR QUERY: ${JSON.stringify(err)}`);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                })
            }).catch((err)=>{
                console.log(`CATCH: ERROR EXECUTION => ${JSON.stringify(err)}`);
                reject(err);
            });
        });        
    }

    public consultarPorCpf(cpf: string ): Promise<[Pessoa]> {
        return new Promise((resolve, reject)=>{
            this.db.getConnection().then((connection: PoolConnection) => {
                connection.query(`SELECT idPessoa, nome, cpf, DATE_FORMAT(dataNascimento,'%Y-%m-%d') as dataNascimento   FROM ${this.table} WHERE cpf=?`, [cpf], (err, rows) => {
                    if (err) {
                        console.log(`ERROR QUERY: ${JSON.stringify(err)}`);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                })
            }).catch((err)=>{
                console.log(`CATCH: ERROR EXECUTION => ${JSON.stringify(err)}`);
                reject(err);
            });
        });        
    }
    public excluir(idPessoa: number):Promise<object>{
        return new Promise((resolve, reject)=>{
            this.db.getConnection().then((connection: PoolConnection) => {
                connection.query(`DELETE FROM ${this.table}  WHERE idPessoa=?`, [idPessoa], (err, rows) => {
                    if (err) {
                        console.log(`ERROR QUERY: ${JSON.stringify(err)}`);
                        reject(err);
                    } else {
                        resolve(rows.affectedRows);
                    }
                })
            }).catch((err)=>{
                console.log(`CATCH: ERROR EXECUTION => ${JSON.stringify(err)}`);
                reject(err);
            });
        });  
    }

}

export {PessoaRepository};
