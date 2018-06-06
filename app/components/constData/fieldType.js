import SelecterData from "../class/SelecterData.js"


export const fieldType=new SelecterData([{
    value:'input',
    name:'单行文本'
},{
    value:'select',
    name:'下拉选择'
},{
    value:'textarea',
    name:'多行文本'
},{
    value:'datePicker',
    name:'日期选择'
},{
    value:'switch',
    name:'开关'
},{
    value:'slider',
    name:'滑动条'
},{
    value:'treeSelect',
    name:'树选择'
},{
    value:'modalInput',
    name:'弹框输入'
}]);
