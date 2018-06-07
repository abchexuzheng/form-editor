var formData={
    fieldData:[{
        name:'主表',
        type:'form',
        id:'mainForm',
        pid:'0'
    },{
        name:'姓名',
        type:'input',
        id:'id',
        pid:'mainForm'
    },{
        name:'姓名2',
        type:'input',
        id:'id2',
        pid:'mainForm'
    },{
        name:'姓名3',
        type:'input',
        id:'id3',
        pid:'mainForm'
    },{
        name:'姓名4',
        type:'input',
        id:'id4',
        pid:'mainForm'
    },{
        name:'子表',
        type:'form',
        id:'childForm',
        pid:'0',
        repeatRow:true
    },{
        name:'姓名5',
        type:'input',
        id:'id5',
        pid:'childForm'
    },{
        name:'电话',
        type:'input',
        id:'id6',
        pid:'childForm'
    },{
        name:'电话2',
        type:'input',
        id:'id62',
        pid:'childForm'
    },{
        name:'电话3',
        type:'input',
        id:'id63',
        pid:'childForm'
    },{
        name:'电话4',
        type:'input',
        id:'id634',
        pid:'childForm'
    },{
        name:'姓名2345',
        type:'input',
        id:'id123',
        pid:'mainForm'
    }]
}



exports.default = formData;


