import createError from 'http-errors';
const mysql = require('./mysql')();
const connection = mysql.init();
mysql.open(connection);

/**
 * @description
  Promise API를 이용한 비동기식 DB접근을 동기식화 하여 쿼리의 결과값을 리턴하는 함수,
  Error 또는 query 성공시 Logger로 입력을 진행한다.
  1. 사용법
    - query문 을 사용하는 js파일에 conn.query() 대신 사용.
    - .then() 과 .catch()를 이용하여 Error 핸들링 및 query data 사용.
  2. 필수사항
    - 쿼리 내부의 가변적 변수는 무.조.건 `?` 로 선언 이후, queryArray 로 넣는다.
 * @param {string} query 쿼리 string
 * @param {array} queryArray ? 에 해당하는 변수들을 요소로 가지는 array
 * @author 박찬우
 */

function doQuery<QueryResult = any>(
    query: string,
    queryArray?: any[]
  ): Promise<{result: QueryResult; error: any}> {
    return new Promise((resolve, reject) => {
          connection.query(query, queryArray, (error: { sqlMessage: string | undefined; }, result: QueryResult) => {
            if (error) {
              reject(new createError[500](error.sqlMessage));
            } else {
              resolve({ error, result });
            }
          });
        }
  )};

export default doQuery;