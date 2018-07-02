var http = require('http');
var url = require('url');
var fs = require('fs');
var returned = require('./getJson.js');
var db=require("./db.js");
var querystring = require('querystring');
// var options=require("./constData/defaultCellOption.js");

var options={
    cellOption:require("./constData/defaultCellOption.js"),
    fieldOption:require("./constData/defaultFieldOption.js"),
    formOption:require("./constData/defaultFormOption.js"),
    mainFormOption:require("./constData/defaultMainFormOption.js")
}

function route(request,response) {
    response.setHeader("Access-Control-Allow-Origin", "*"); 
    console.log("About to route a request for " + pathname);
    var pathname = url.parse(request.url).pathname;
    function showPage(pathRoute){
        // 从文件系统中读取请求的文件内容
        fs.readFile(pathRoute.substr(1), function (err, data) {
            if (err) {
                console.log(err);
                // HTTP 状态码: 404 : NOT FOUND
                // Content Type: text/plain
                response.writeHead(404, {'Content-Type': 'text/html'});
            }else{
                // HTTP 状态码: 200 : OK
                // Content Type: text/plain
                response.writeHead(200, {'Content-Type': 'text/html'});

                // 响应文件内容
                response.write(data.toString());
            }
            //  发送响应数据
            response.end();
        });
    }
    switch (pathname){
        case "/":
            showPage("/index.html",200);
            break;
        case "/getJson":
            response.writeHead(200, {'Content-Type': 'text/plain'});
            // 解析 url 参数
            var params = url.parse(request.url, true).query;
            console.log(params)
            response.end(JSON.stringify(returned.default));
            break;
        case "/getForm":
            response.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
            // 解析 url 参数
            var params = url.parse(request.url, true).query;
            // var SQL='SELECT [formid],[formdata],[fielddata],[formoptions] FROM [hxz].[dbo].[form] where formid=\''+params.formid+'\'';
            // db.sql(SQL,function(err,result){
            //     if (err) {
            //         console.log(err);
            //         return;
            //     }
            //     var fieldData=JSON.parse(result.recordset[0].fielddata);
            //     var formData=result.recordset[0].formdata?JSON.parse(result.recordset[0].formdata):undefined;
            //     var formOptions=result.recordset[0].formoptions?JSON.parse(result.recordset[0].formoptions):undefined;
            //     var returnedData={
            //         fieldData:fieldData,
            //         formData:formData,
            //         formOptions:formOptions,
            //         formId:result.recordset[0].formid
            //     }
            //     response.end(JSON.stringify(returnedData),'utf-8');
            // });
            let thisReturned;
            if(params.formid=="formid1"){
                thisReturned=returned;
            }else{
                thisReturned=options[params.formid]
            }
            response.end(JSON.stringify(thisReturned),'utf-8');
            break;
        case "/saveForm":
            response.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
            if (request.method.toLowerCase() === 'post') {
                var alldata = '';
                request.on('data', function (chunk) {
                    alldata += chunk;
                });
                request.on('end', function () {
                    //将字符串转换位一个对象
                    var dataString = alldata.toString();
                    //将接收到的字符串转换位为json对象
                    var dataObj = JSON.parse(dataString);
                    dataObj.formData=JSON.stringify(dataObj.formData);
                    dataObj.fieldData=JSON.stringify(dataObj.fieldData);
                    dataObj.formOptions=JSON.stringify(dataObj.formOptions);
                    var SQL='UPDATE [hxz].[dbo].[form] SET [formdata] = \''+dataObj.formData+'\',[fielddata] = \''+dataObj.fieldData+'\',[formoptions] = \''+dataObj.formOptions+'\' WHERE formid=\''+dataObj.formId+'\''
                    db.sql(SQL,function(err,result){
                        if (err) {
                            console.log(err);
                            return;
                        }
                        //console.log(result)
                        response.end(JSON.stringify({success:true}));
                    });
                });
                response.end(JSON.stringify({success:true}));
            };
            break;
        case "/submit":
            break;
        case "/save":
            var returned2={
                success:true,
                fieldData:[{
                    id:'id63',
                    value:[Math.ceil(Math.random()*100)]
                },{
                    id:'id62',
                    value:[Math.ceil(Math.random()*10000)]
                }
                //    ,{
                //    id:'id',
                //    data:[{
                //        value:'abc',
                //        name:'abc',
                //        pValue:0
                //    },{
                //        value:'abc2',
                //        name:'abc2',
                //        pValue:0
                //    },{
                //        value:'abc23',
                //        name:'ab23c',
                //        pValue:0
                //    }]
                //}
                ]
            };
            response.end(JSON.stringify(returned2));
            break;
    }
}

exports.route = route;
