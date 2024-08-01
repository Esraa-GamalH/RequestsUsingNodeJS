const mysql = require('mysql2/promise');
const config = require('../config');

const query = async (sql, params) =>{
    try {
        const connection = await mysql.createConnection(config.db);
        console.log('connection successed');
        const [results] = await connection.execute(sql, params);
        return results;
    } catch (error) {
        console.error('connection failed');
    }
}

exports.query = query;