import { Connection, createPool ,createConnection, FieldInfo, MysqlError, Pool, PoolConnection} from 'mysql';

class MySQLConn {
    private readonly connection: Connection;
    private pool: Pool;
    private config: object;
    constructor() {
        this.config = {
            connectionLimit:10,
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            timezone: 'utc'
        };
        this.pool = createPool(this.config);       
    }

    public setDatabase(db_name){
        this.config['database'] = db_name;
    }
    public setCreatePool(){
        this.pool = createPool(this.config);
    }
    public getConnection(){
        return new Promise((resolve, reject )=>{
            this.pool.getConnection((err, connection:PoolConnection) => {
                if (err) {
                    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                        console.error('Database connection was closed.')
                        reject('error connecting: ' + err.stack);
                    }
                    if (err.code === 'ER_CON_COUNT_ERROR') {
                        console.error('Database has too many connections.')
                        reject('error connecting: ' + err.stack);
                    }
                    if (err.code === 'ECONNREFUSED') {
                        console.error('Database connection was refused.')
                        reject('error connecting: ' + err.stack);
                    }else{
                        console.log(`ERROR Connect: ${JSON.stringify(err)}`);
                        reject('error connecting: ' + err.stack);
                    }
                }
                if (connection){
                    connection.release()
                    resolve(connection);
                } 
            });
        });
    }



}
export {MySQLConn, PoolConnection}



