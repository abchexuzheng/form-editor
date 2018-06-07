// import DataOption from "../class/DataOption"

//整体报表默认配置
exports.default={
    fieldData:[{
        name:'表单属性',
        type:'form',
        id:'mainFormOption',
        pid:'0'
    },{
        name:'背景色',
        type:'input',
        id:'background',
        pid:'mainFormOption',
    },{
        name:'提交地址',
        type:'input',
        id:'actionAddress',
        pid:'mainFormOption'
    },{
        name:'字体大小',
        type:'input',
        id:'fontSize',
        pid:'mainFormOption'
    },{
        name:'宽度',
        type:'input',
        id:'width',
        pid:'mainFormOption'
    },{
        name: '自动保存',
        type: 'switch',
        id: 'autoSave',
        pid: 'mainFormOption'
    }]
}
