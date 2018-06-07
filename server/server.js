var http = require("http");
var url = require("url");
var express = require('express');
var app = express();
var db=require("./db.js");

function start(route) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        console.log("Request for " + pathname + " received.");
        route(request,response);
    }

    http.createServer(onRequest).listen(8280);
    console.log("Server has started.");
}

exports.start = start;