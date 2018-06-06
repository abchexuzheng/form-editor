import React from 'react';
import ReactDom from 'react-dom';
import {Icon, Button,message,Input,Menu, Dropdown,Popconfirm} from 'antd'
import store from './../reducers'
import { selectCell,selectField,removeField,switchMode,selectForm,removeForm,addRow,deleteRow,addCol,deleteCol,mergeCell,clearSelect,save,resetLayout} from './../actions'
import { ActionCreators } from 'redux-undo';


class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            formData:props.formData,
            fieldData:props.fieldData
        }
    }
    componentDidMount(){
        var thisObj=this;
        document.addEventListener('keydown',function(e){
            switch (e.keyCode){
                case 90:
                    if(e.ctrlKey==true&&thisObj.props.state.undoDisabled==false){
                        thisObj.handleAction('undo')
                    }
                    break;
                case 89:
                    if(e.ctrlKey==true&&thisObj.props.state.redoDisabled==false){
                        thisObj.handleAction('redo')
                    }
                    break;
            }
        });
        document.addEventListener('keyup',function(e){
            switch (e.keyCode){

            }
        })
    }
    //dispatch预处理
    //#parma dispatchFunc为需要dispatch的方法
    //#parma stopPropagation表示是否阻止事件冒泡
    handleDispatch=(dispatchFunc,e,stopPropagation=false)=>{
        store.dispatch(dispatchFunc);
        if(stopPropagation){
            e.stopPropagation();
        }
    };
    getFieldIdArr(){
        var fieldIdArr=[];
        this.props.state.fieldData.map(function(data,index){
            if(fieldIdArr.indexOf(data.id)<0){
                fieldIdArr.push(data.id)
            }else{
                message.error('错误！不能有重复的字段ID')
            }
        })
        return fieldIdArr
    }
    getFieldById(id){
        var dataObj=null;
        this.props.state.fieldData.map(function(data){
            if(data.id==id){
                dataObj=data
            }
        });
        return dataObj
    }
    resetLayout(){
        var colNum=prompt('请输入布局列数','4');
        colNum=parseInt(colNum);
        if(colNum>0){
            this.handleDispatch(resetLayout(colNum));
        }else{
            this.handleDispatch(resetLayout());
        }
    };
    render(){
        var thisObj=this;
        var fieldIdArr=this.getFieldIdArr();
        return <div>
            <div className="methodBtnGroup">
                <Button type="primary" onClick={()=>this.handleDispatch(save())}>保存</Button>
                <Button type="primary" onClick={()=>this.handleDispatch(addRow())}>添加行</Button>
                <Button type="primary" onClick={()=>this.handleDispatch(deleteRow())}>删除行</Button>
                <Button type="primary" onClick={()=>this.handleDispatch(addCol())}>添加列</Button>
                <Button type="primary" onClick={()=>this.handleDispatch(deleteCol())}>删除列</Button>
                <Button type="primary" onClick={()=>this.handleDispatch(mergeCell())}>合并单元格</Button>
                <Button type="primary" disabled={this.props.state.undoDisabled===true?"disabled":undefined} onClick={()=>this.handleDispatch(ActionCreators.undo())}>撤销</Button>
                <Button type="primary" disabled={this.props.state.redoDisabled===true?"disabled":undefined} onClick={()=>this.handleDispatch(ActionCreators.redo())}>重做</Button>
                <Button type="primary" onClick={()=>this.resetLayout()}>重置布局</Button>
                <Button type="primary" onClick={()=>this.handleDispatch(switchMode('preview'))}>预览</Button>
            </div>
            <div className="formEditor" onClick={()=>this.handleDispatch(clearSelect())}>
                {
                    thisObj.props.state.formData.map(function(tableData,i){
                        var tableClass='formEditorTable';
                        if(thisObj.props.state.selected&&thisObj.props.state.selected.type=='form'&&thisObj.props.state.selected.id==tableData.id){
                            tableClass+=' selected'
                        }
                        var tableFieldObj=thisObj.getFieldById(tableData.id)
                        var repeatRow=tableFieldObj.repeatRow;
                        var repeatRowStart=repeatRow&&tableFieldObj.repeatRowRange[0];
                        var repeatRowEnd=repeatRow&&tableFieldObj.repeatRowRange[1];
                        return <div key={"table"+tableData.id}>
                            <Button className="formSelecter" type="primary" size="small"  onClick={(e)=>thisObj.handleDispatch(selectForm(tableData.id),e,true)}>
                                {tableFieldObj.name}
                                <div className="closeBtn" onClick={(e)=>thisObj.handleDispatch(removeForm(i),e,true)}><Icon type="close" /></div>
                            </Button>
                            <table className={tableClass}>
                            <tbody>
                            {
                                tableData.data.map(function(data,index){
                                    return <tr key={"line"+index} className={repeatRow&&index>=repeatRowStart&&index<=repeatRowEnd?'repeatRow':''}>
                                        {
                                            data.map(function(data2,index2){
                                                var tdContent;
                                                var closeBtn;
                                                if(data2.fields&&data2.fields.length>0){
                                                    data2.fields.map(function(data3,index3){
                                                        var fieldIndex=fieldIdArr.indexOf(data3);
                                                        if(fieldIndex>=0){
                                                            var fieldObj=thisObj.props.state.fieldData[fieldIndex];
                                                            tdContent+=<div className='fieldDiv'>{fieldObj.name}</div>
                                                        }
                                                    });
                                                    //closeBtn=<div className="closeBtn" onClick={(e)=>thisObj.handleDispatch(clearCell(i,index,index2),e,true)}><Icon type="close-circle" /></div>
                                                }
                                                var style={
                                                    fontWeight:data2.fontWeight,
                                                    textAlign:data2.textAlign,
                                                    width:data2.width&&(data2.width.indexOf("px")>=0||data2.width.indexOf("%")>=0)?data2.width:data2.width+'px',
                                                    fontSize:data2.fontSize,
                                                    color:data2.color
                                                }
                                                var selected='';
                                                var selectedObj=thisObj.props.state.selected
                                                if(selectedObj&&selectedObj.type=='cell'&&i==selectedObj.x&&selectedObj.y.indexOf(index)>=0&&selectedObj.z.indexOf(index2)>=0){
                                                    selected='selected'
                                                }
                                                //console.log(data2)
                                                return data2.hidden!="hidden"?
                                                    <td
                                                        className={selected}
                                                        rowSpan={data2.rowSpan}
                                                        colSpan={data2.colSpan}
                                                        key={index+index2}
                                                        style={style}
                                                        onClick={(e)=>thisObj.handleDispatch(selectCell(i,index,index2,e),e,true)}>
                                                        {
                                                            data2.content
                                                        }
                                                        {
                                                            data2.fields&&data2.fields.length>0?data2.fields.map(function(data3,index3){
                                                                var fieldIndex=fieldIdArr.indexOf(data3);
                                                                if(fieldIndex>=0){
                                                                    var fieldObj=thisObj.props.state.fieldData[fieldIndex];
                                                                    var fieldClass='fieldDiv';
                                                                    if(thisObj.props.state.selected&&thisObj.props.state.selected.type=='field'&&thisObj.props.state.selected.id.indexOf(fieldObj.id)>=0){
                                                                        fieldClass='fieldDiv selected'
                                                                    }
                                                                    return <div className={fieldClass}  onClick={(e)=>thisObj.handleDispatch(selectField(fieldObj.id,e),e,true)} key={"field"+data3}>
                                                                        {'['+fieldObj.name+']['+fieldObj.id+']'}
                                                                        <div className="closeBtn" onClick={(e)=>thisObj.handleDispatch(removeField(i,index,index2,index3),e,true)}><Icon type="close" /></div>
                                                                    </div>
                                                                }
                                                            }):null
                                                        }{closeBtn}
                                                    </td>
                                                    :null
                                            })
                                        }
                                    </tr>
                                })
                            }
                            </tbody>
                        </table></div>
                    })
                }

            </div>
        </div>
    }
}

export default Editor
