import { combineReducers } from 'redux'
import { INIT_DATA, SELECT_CELL, SELECT_FIELD, UPDATE_OPTION,REMOVE_FIELD ,ADD_FIELD,SWITCH_MODE,SELECT_FORM,REMOVE_FORM,ADD_FORM,ADD_ROW,DELETE_ROW,ADD_COL,DELETE_COL,MERGE_CELL,CLEAR_SELECT,SAVE,RESET_LAYOUT,UPDATE_DATA,ADD_NEW_FIELD} from './actions'
import { createStore } from 'redux'
import { message } from 'antd'
import undoable, { excludeAction } from 'redux-undo';
import {defaultFieldOption,defaultFormOption} from './constData'
import DataOption from './class/DataOption'
import FieldData from './class/FieldData'
import UUID from './class/UUID'

//const { SHOW_ALL } = VisibilityFilters
//
//function visibilityFilter(state = SHOW_ALL, action) {
//    switch (action.type) {
//        case SHOW_ALL:
//            return action.filter
//        default:
//            return state
//    }
//}

function formState(stateNow = {}, action) {
    //var state=JSON.parse(JSON.stringify(stateNow));
    var state=Object.assign({},stateNow);
    switch (action.type) {
        //初始化数据
        case INIT_DATA:
            initFieldData(action.data.fieldData);
            action.data.formData=action.data.formData||FieldData(action.data.fieldData).getDefaultFormData(action.defaultCol);
            action.data.formOptions=action.data.formOptions||{};
            return action.data;
        //选择单元格
        case SELECT_CELL:
            if(action.e.shiftKey){
                var rowMin=Math.min.apply(null,state.selected.y);
                var colMin=Math.min.apply(null,state.selected.z);
                var startRow=Math.min(rowMin,action.y);
                var endRow=Math.max(rowMin,action.y);
                var startCol=Math.min(colMin,action.z);
                var endCol=Math.max(colMin,action.z);
                var rowLastpos=null;
                var colLastpos=null;
                for(var x=startRow;x<=endRow;x++){
                    for(var y=startCol;y<=endCol;y++){
                        var thisRowSpan=state.formData[action.x].data[x][y].rowSpan?state.formData[action.x].data[x][y].rowSpan:1
                        var thisColSpan=state.formData[action.x].data[x][y].colSpan?state.formData[action.x].data[x][y].colSpan:1
                        rowLastpos=(rowLastpos==null||(thisRowSpan+x-1)>rowLastpos)?thisRowSpan+x-1:rowLastpos
                        colLastpos=(colLastpos==null||(thisColSpan+y-1)>colLastpos)?thisColSpan+y-1:colLastpos
                    }
                }
                clearSelectedCell(state)
                for(var i=startRow;i<=rowLastpos;i++){
                    for(var j=startCol;j<=colLastpos;j++){
                        state.selected.y.push(i)
                        state.selected.z.push(j)
                    }
                }
                state.selected.x=action.x;
                state.selected.type='cell';
            }else{
                var selectedObj=state.selected
                var selected=selectedObj&&selectedObj.type=='cell'&&action.x==selectedObj.x&&selectedObj.y.indexOf(action.y)>=0&&selectedObj.z.indexOf(action.z)>=0
                if(selected){
                    clearSelectedCell(state);
                }else{
                    state.selected={
                        type:'cell',
                        x:action.x,
                        y:[action.y],
                        z:[action.z]
                    }
                }
            }
            return state;
        //选中字段
        case SELECT_FIELD:
            if(!state.selected||state.selected.type!='field'){
                clearSelectedCell(state);
                state.selected.type='field';
            }
            if(state.selected.id.indexOf(action.id)<0){
                if(action.e.ctrlKey||action.e.shiftKey){
                    state.selected.id.push(action.id);
                }else{
                    state.selected.id=[action.id];
                }
            }else{
                if(state.selected.id.length>1){
                    state.selected.id.splice(state.selected.id.indexOf(action.id),1);
                }else{
                    clearSelectedCell(state);
                }
            }
            return state;
        //清空选中
        case CLEAR_SELECT:
            clearSelectedCell(state)
            return state;
        //更新选中的字段
        case UPDATE_OPTION:
            var selectedDataArr=getSelectedData(state);
            selectedDataArr.map(function(data){
                if(action.data.id==="id"){
                    if(selectedDataArr.length===1){
                        state.selected.id[0]=action.data.value;
                        let lastId=data.id;
                        let fieldPos=checkField(state,lastId);
                        state.formData[fieldPos.x].data[fieldPos.y][fieldPos.z].fields[fieldPos.f]=action.data.value;
                        data.id=action.data.value;
                    }else{
                        message.error("不能批量更新ID，请选择1个需要更新的字段")
                    }
                }else{
                    data[action.data.id]=action.data.value
                }
            });
            return state;
        //移除单元格中的一个字段
        case REMOVE_FIELD:
            var formObj=state.formData[action.x].data[action.y][action.z];
            if(action.i){
                formObj.fields.splice(action.i,1);
            }else{
                formObj.fields=[];
            }
            return state;
        //移除一个表
        case REMOVE_FORM:
            state.formData.splice(action.i,1)
            clearSelectedCell(state)
            return state;
        //添加一个表
        case ADD_FORM:
            if(!checkField(state,action.id)){
                state.formData.push({
                    id:action.id,
                    data:[[{}]]
                })
            }else{
                message.error('该表已经被添加')
            }
            return state;
        //添加行
        case ADD_ROW:
            if(state.selected&&state.selected.type){
                if(state.selected.type=='cell'){
                    var rowSpan=state.formData[state.selected.x].data[0].length;
                    var addedArray=[];
                    for(var i=0;i<rowSpan;i++){
                        addedArray.push({});
                    }
                    state.formData[state.selected.x].data.splice(state.selected.y[state.selected.y.length-1]+1,0,addedArray)
                }else{
                    var fieldPos=checkField(state,state.selected.id)
                    var colSpanTotal=getTotalSpan(state.formData[fieldPos.x].data,"colSpan");
                    var pushedArr=[];
                    for(var i=0;i<colSpanTotal;i++){
                        pushedArr.push({})
                    }
                    state.formData[fieldPos.x].data.push(pushedArr);
                }
                setRelativeData(state)
            }else{
                message.error('请选择需要添加行的表/单元格')
            }
            return state;
        //删除行
        case DELETE_ROW:
            if(state.selected&&state.selected.type=='cell'){
                state.formData[state.selected.x].data.splice(state.selected.y,1)
            }else{
                message.error('请选中需要删除的行所在的单元格')
            }
            setRelativeData(state)
            return state;
        //添加列
        case ADD_COL:
            if(state.selected&&state.selected.type){
                var thisTableData=state.formData[state.selected.x].data;
                thisTableData.map(function(data){
                    data.push({})
                })
            }else{
                message.error('请选择需要添加行的表/单元格')
            }
            return state;
        //删除列
        case DELETE_COL:
            if(state.selected&&state.selected.type=='cell'){
                var thisTableData=state.formData[state.selected.x].data;
                thisTableData.map(function(data){
                    data.splice(state.selected.z,1)
                })
            }else{
                message.error('请选中需要删除的行所在的单元格')
            }
            return state;
        //合并单元格
        case MERGE_CELL:
            var selectedY=JSON.parse(JSON.stringify(state.selected.y));
            selectedY=selectedY.sort(function (a,b){return a - b});
            var yLength=selectedY[selectedY.length-1]-selectedY[0]+1;
            var selectedZ=JSON.parse(JSON.stringify(state.selected.z));
            selectedZ=selectedZ.sort(function (a,b){return a - b});
            var zLength=selectedZ[selectedY.length-1]-selectedZ[0]+1;
            state.selected.y.map(function(data,index){
                var data2=state.selected.z[index]
                if(index==0){
                    state.formData[state.selected.x].data[data][data2].rowSpan=yLength;
                    state.formData[state.selected.x].data[data][data2].colSpan=zLength;
                }else{
                    state.formData[state.selected.x].data[data][data2].hidden="hidden";
                    state.formData[state.selected.x].data[data][data2].fields=[];
                }
            })
            return state;
        //在选中的单元格中添加字段
        case ADD_FIELD:
            var selectedData=getSelectedData(state)[0];
            var selectedFormId=state.formData[state.selected.x].id;
            var thisField=getFieldById(state.fieldData,action.id);
            if(state.selected&&state.selected.type=="cell"&&selectedFormId==thisField.pid){
                if(!checkField(state,action.id)){
                    if(selectedData.fields){
                        selectedData.fields.push(action.id)
                    }else{
                        selectedData.fields=[action.id]
                    }
                }else{
                    message.error('该字段已经被添加')
                }
            }else{
                message.error('请选择正确的位置')
            }
            return state;
        //选中表
        case SELECT_FORM:
            var selectedNow=state.selected&&state.selected.type=='form'&&state.selected.id==action.id
            if(selectedNow){
                clearSelectedCell(state)
            }else{
                state.selected={
                    type:'form',
                    id:[action.id]
                }
            }
            return state;
        //切换预览模式
        case SWITCH_MODE:
            state.mode=action.mode;
            return state;
        //保存表单数据
        case SAVE:
            fetch('http://localhost:8280/saveForm', {
                method: 'post',
                body:JSON.stringify({
                    fieldData:state.fieldData,
                    formData:state.formData,
                    formOptions:state.formOptions,
                    formId:state.formId
                })
            }).then(function(response) {
                return response.json();
            }).then(function(response) {
                if(response.success){
                    message.success("保存成功")
                }else{
                    message.error("保存失败");
                }
            }).catch(function(err) {
                console.log(err);
                // 出错了;等价于 then 的第二个参数,但这样更好用更直观 :(
            });
            return state;
        //重置为默认布局
        case RESET_LAYOUT:
            state.formData=FieldData(state.fieldData).getDefaultFormData(action.col);
            clearSelectedCell(state);
            return state;
        case UPDATE_DATA:
            var newData=JSON.parse(action.data);
            state.fieldData=newData.fieldData;
            if(newData.formData){
                state.formData=newData.formData;
            }
            return state;
        case ADD_NEW_FIELD:
            state.fieldData.push({
                id:UUID(32,16),
                name:"新字段",
                type:"input",
                pid:action.pid
            });
            return state;
        default:
            return state;
    }
}


//检查字段是否已经被添加
//已经被添加返回字段添加的位置，未被添加返回false
var checkField=(state,id)=>{
    for(var i in state.formData){
        if(state.formData[i].id==id){
            return {x:i};
        }
        for(var j in state.formData[i].data){
            for(var k in  state.formData[i].data[j]){
                if(state.formData[i].data[j][k].fields){
                    for(var m in state.formData[i].data[j][k].fields){
                        if(state.formData[i].data[j][k].fields[m]==id){
                            return {
                                x:i,
                                y:j,
                                z:k,
                                f:m
                            }
                        }
                    }
                }
            }
        }
    }
    return false;
}

//获取已选择的对应的
var getSelectedData=(state)=>{
    if(state.selected&&state.selected.type=='field'){
        var fieldArr=[];
        for(var i in state.selected.id){
            fieldArr.push(getFieldById(state.fieldData,state.selected.id[i]))
        }
        return fieldArr
    }else if(state.selected&&state.selected.type=='cell'){
        var cellFieldArr=[];
        for(var i in state.selected.y){
            cellFieldArr.push(state.formData[state.selected.x].data[state.selected.y[i]][state.selected.z[i]])
        }
        return cellFieldArr;
    }else if(state.selected&&state.selected.type=='form'){
        return [getFieldById(state.fieldData,state.selected.id)]
    }else{
        console.log(state)
        return [state.formOptions]
    }
};

//根据ID获取字段
var getFieldById=(fieldData,id)=>{
    var dataObj=null;
    fieldData.map(function(data){
        if(data.id==id){
            dataObj=data;
        }
    });
    return dataObj
}

//清空已选择的单元格
var clearSelectedCell=(state)=>{
    state.selected={
        type:'',
        x:'',
        y:[],
        z:[],
        id:[]
    }
}


//初始化字段数据
function initFieldData(fieldData){
    var formOptionData=defaultFormOption.getDataByMainFieldName("formOption");
    var fieldOptionData=defaultFieldOption.getDataByMainFieldName("fieldOption");
    fieldData.map(function(fieldObj,fieldObjIndex){
        if(fieldObj.type==="form"){
            for(var i in formOptionData){
                if(formOptionData[i]){
                    fieldObj[i]= fieldObj[i] || formOptionData[i];
                }
            }
        }else{
            for(var i in formOptionData){
                if(formOptionData[i]){
                    fieldObj[i]= fieldObj[i] || formOptionData[i];
                }
            }
        }
    })
}

//获取行/列总长度
function getTotalSpan(formData,type){
    var span=0;
    if(type=="colSpan"){
        formData[0].map(function(data,index){
            if(!data.hidden){
                span+=data[type]?data[type]:1;
            }
        })
    }else{
        formData.map(function(data,index){
            if(!data[0].hidden){
                span+=data[type]?data[type]:1;
            }
        })
    }
    return span;
}

function setRelativeData(state){
    state.formData.map(function(data){
        var rowLength=getTotalSpan(data.data,"rowSpan")
        getFieldById(state.fieldData,data.id).max=rowLength;
    })
}

const formApp = combineReducers({
    //visibilityFilter,
    formState:undoable(formState,{filter:excludeAction([INIT_DATA, SELECT_CELL,SELECT_FIELD,SWITCH_MODE,CLEAR_SELECT,SAVE])})
});


let store = createStore(formApp);
export default store
//export const getDefaultFormDataFun = getDefaultFormData;
export const getFieldByIdFun = getFieldById;
