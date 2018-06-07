var mssql = require('mssql');
var db = {};
var config = {
    user: 'hexuzheng',
    password: '19931220',
    server: 'localhost',
    port:1433,
    driver: 'msnodesql',
    database: 'hxz',
    connectionString: "Driver={SQL Server Native Client 11.0};Server=#{server}\\sql;Database=#{database};Uid=#{user};Pwd=#{password};",
    /*    options: {
     encrypt: true // Use this if you're on Windows Azure
     },*/
    pool: {
        min: 0,
        max: 10,
        idleTimeoutMillis: 3000
    }
};


db.sql = function (sql, callBack) {
    var connection = new mssql.ConnectionPool(config, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        var ps = new mssql.PreparedStatement(connection);
        ps.prepare(sql, function (err) {
            if (err){
                console.log(err);
                return;
            }
            ps.execute('', function (err, result) {
                if (err){
                    console.log(err);
                    return;
                }

                ps.unprepare(function (err) {
                    if (err){
                        console.log(err);
                        callback(err,null);
                        return;
                    }
                    callBack(err, result);
                });
            });
        });
    });
};

module.exports = db;