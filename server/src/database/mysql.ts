const mysql = require('mysql');
import * as dotenv from 'dotenv';
dotenv.config();

module.exports  = () => {
    return {
        // init function createConnection , 밑에 정보는 local mysql 내 정보
        init:  () => {
          return mysql.createConnection({
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT,
            user: process.env.DATABASE_USER,
            password:process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME
          })
        },
        open: (con: { connect: (arg0: (err: any) => void) => void; }) => {
          con.connect( (err) => {
            if (err) {
              console.error('mysql connection error :' + err);

            } else {
              console.log("***************[Open Database Connection]***************");
            }
          })
        },
    }
};
