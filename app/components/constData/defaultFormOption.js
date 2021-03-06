import DataOption from "../class/DataOption"

//报表默认配置
export const defaultFormOption=new DataOption({
    fieldData:[{
        name:'表单属性',
        type:'form',
        id:'formOption',
        pid:'0'
    },{
        name:'背景色',
        type:'input',
        id:'background',
        pid:'formOption',
    },{
        name:'字体大小',
        type:'input',
        id:'fontSize',
        pid:'formOption',
    },{
        name:'宽度',
        type:'input',
        id:'width',
        pid:'formOption'
    },{
        name:'可重复',
        type:'switch',
        id:'repeatRow',
        pid:'formOption'
    },{
        name:'重复行范围',
        type:'slider',
        id:'repeatRowRange',
        pid:'formOption',
        value:[2,2],
        max:3,
        min:0
    },{
        name:'最多重复数',
        type:'input',
        id:'repeatRowMax',
        pid:'formOption',
    },{
        name:'最少重复数',
        type:'input',
        id:'repeatRowMin',
        pid:'formOption',
    },{
        name:'是否隐藏',
        type:'switch',
        id:'hidden',
        pid:'formOption',
        value:false,
        formatterAble:true
    }]
})