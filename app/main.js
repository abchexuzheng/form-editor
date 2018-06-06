//main.js
import React from 'react';
import ReactDom from 'react-dom';
import NpForm from './components/index.js'
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

var formArr=document.getElementsByClassName("np-form");


var render=function(dom,options){
    if(dom){
        let thisHref=options.source||dom.getAttribute("data-source");
        let mode=options.mode||dom.getAttribute("data-mode");
        ReactDom.render(
            <LocaleProvider locale={zhCN}><NpForm source={thisHref} mode={mode} data={options.data} key={"NpForm"+thisHref} /></LocaleProvider>,
            //<NpForm source={thisHref} mode={mode} />,
            dom
        );
    }else{
        for(var i=0;i<formArr.length;i++){
            let thisHref=formArr[i].getAttribute("data-source");
            let mode=formArr[i].getAttribute("data-mode");
            ReactDom.render(
                <LocaleProvider locale={zhCN}><NpForm source={thisHref} mode={mode}  key={"NpForm"+thisHref}/></LocaleProvider>,
                //<NpForm source={thisHref} mode={mode} />,
                formArr[i]
            );
        }
    }
};
//render();


window.npForm={
    render:render
};