// import { fieldType } from './fieldType';
// import { fieldValidation } from './fieldValidation';
// import DataOption from "../class/DataOption"

var fieldType=require("./fieldType.js")
var fieldValidation=require("./fieldValidation.js")

//字段默认配置
exports.default={
    fieldData:[{
        name:'字段属性',
        type:'form',
        id:'fieldOption',
        pid:'0'
    },{
        name:'字段ID',
        type:'input',
        id:'id',
        pid:'fieldOption',
        disabled:true
    },{
        name:'字段名',
        type:'input',
        id:'name',
        pid:'fieldOption',
        disabled:true
    },{
        name:'所属表ID',
        type:'input',
        id:'pid',
        pid:'fieldOption',
        disabled:true
    },{
        name:'字段类型',
        type:'select',
        id:'type',
        pid:'fieldOption',
        value:'input',
        data:fieldType.data
    },{
        name:'实时提交',
        type:'switch',
        id:'realTimeSubmit',
        pid:'fieldOption'
    },{
        name:'初始值',
        type:'input',
        id:'defaultValue',
        pid:'fieldOption',
        placeholder:'数据初始值'
    },{
        name:'表达式',
        type:'textarea',
        id:'formatter',
        pid:'fieldOption'
    },{
        name:'选择项数据',
        type:'textarea',
        id:'data',
        pid:'fieldOption'
    },{
        name:'父选择项ID',
        type:'input',
        id:'parentId',
        pid:'fieldOption',
        placeholder:'级联选择时的父选择项'
    },{
        name:'是否必填',
        type:'switch',
        id:'required',
        pid:'fieldOption',
        formatterAble:true
    },{
        name:'字体大小',
        type:'input',
        id:'fontSize',
        pid:'fieldOption',
        value:'14px',
        formatterAble:true
    },{
        name:'字体颜色',
        type:'input',
        id:'color',
        pid:'fieldOption',
        value:'#666666',
        formatterAble:true
    },{
        name:'背景颜色',
        type:'input',
        id:'background',
        pid:'fieldOption',
        value:'#ffffff',
        formatterAble:true
    },{
        name:'宽度',
        type:'input',
        id:'width',
        pid:'fieldOption',
        value:'100%',
        formatterAble:true
    },{
        name:'是否只读',
        type:'switch',
        id:'disabled',
        pid:'fieldOption',
        formatterAble:true
    },{
        name:'是否隐藏',
        type:'switch',
        id:'hidden',
        pid:'fieldOption',
        formatterAble:true
    },{
        name:'提示信息',
        type:'input',
        id:'placeholder',
        pid:'fieldOption',
        placeholder:'输入框底部提示信息',
        defaultValue:{
            value:'',
            formatter:'function(){return "请输入"+fieldData.getFieldValueById("name")}'
        },
        formatterAble:true
    },{
        name:'字段验证',
        type:'select',
        id:'validation',
        pid:'fieldOption',
        value:null,
        data:fieldValidation.data
    },{
        name:'正则表达式',
        type:'input',
        id:'reg',
        pid:'fieldOption',
        value:'',
        disabled:{
            value:false,
            formatter:'function(){return fieldData.getFieldValueById("validation")!="custom";}'
        }
    },{
        name:'验证提示',
        type:'input',
        id:'validationHelp',
        pid:'fieldOption',
        formatterAble:true
    },{
        name:'最大长度',
        type:'input',
        id:'maxLength',
        pid:'fieldOption',
        formatterAble:true
    }]
}