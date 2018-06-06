import React from 'react';
import ReactDom from 'react-dom';
import { Button,message } from 'antd'
import FieldData from './../class/FieldData'
import RepeatRows from './repeatRows'
import Row from './row'



//单个表单组件
//props tableData  表布局配置
//props tableIndex  表索引
//props data  所有数据
//props fieldData  字段数据
//props changeValue  fun  更新字段值方法
//props updateField fun 更新字段方法
export default class SingleForm extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            selectedRow:[]
        };
        this.initData(props);
    }
    componentWillReceiveProps(nextProps){
        this.initData(nextProps);
    }
    initData(props){
        var thisObj=this;
        this.tableDataCopy=JSON.parse(JSON.stringify(this.props.tableData));
        this.formField=FieldData(thisObj.props.data.fieldData).getField(this.props.tableData.id);
        this.formField.repeatRowRange=this.formField.repeatRowRange||[2,2];
        //重复行的行数长度;
        this.repeatRowLength=this.formField.repeatRowRange?this.formField.repeatRowRange[1]-this.formField.repeatRowRange[0]+1:1;
        this.repeatLength=thisObj.getRepeatLength(props);
    }
    checkAllRow=(e)=>{
        var checked=e.target.checked;
        if(checked){
            for(var i=0;i<this.repeatLength;i++){
                if(this.state.selectedRow.indexOf(i)<0){
                    this.state.selectedRow.push(i)
                }
            }
        }else{
            this.state.selectedRow=[];
        }
        this.setState({
            update:true
        })
    };
    checkRow=(e,rowIndex)=>{
        if(this.state.selectedRow.indexOf(rowIndex)<0){
            this.state.selectedRow.push(rowIndex);
        }else{
            this.state.selectedRow.splice(this.state.selectedRow.indexOf(rowIndex),1)
        }
        this.setState({
            updated:true
        })
    };
    addRow=()=>{
        var thisObj=this;
        var fieldDataCopy=JSON.parse(JSON.stringify(this.props.fieldData));
        fieldDataCopy.map(function(data){
            if(data.pid==thisObj.tableDataCopy.id){
                if(data.value&&!(data.value instanceof Array)){
                    data.value=[data.value,""]
                }else if(data.value){
                    data.value.push("")
                }else{
                    data.value=["",""]
                }
            }
        });
        this.props.updateFields(fieldDataCopy);
    };
    repeatRow=()=>{
        var thisObj=this;
        if(this.state.selectedRow.length==0){
            message.warning("请选择需要复制的行")
            return
        }
        var fieldDataCopy=JSON.parse(JSON.stringify(this.props.fieldData));
        fieldDataCopy.map(function(data){
            if(data.pid==thisObj.tableDataCopy.id){
                if(data.value){
                    thisObj.state.selectedRow.map(function(selectedRowIndex){
                        data.value.push(data.value[selectedRowIndex])
                    })
                }else{
                    data.value=["",""]
                }
            }
        });
        this.props.updateFields(fieldDataCopy);
    };
    deleteRow=()=>{
        var thisObj=this;
        if(this.state.selectedRow.length==0){
            message.warning("请选择需要删除的行")
            return
        }
        var fieldDataCopy=JSON.parse(JSON.stringify(this.props.fieldData));
        fieldDataCopy.map(function(data){
            if(data.pid==thisObj.tableDataCopy.id){
                if(data.value&&data.value.length>1){
                    var deleteRow=thisObj.state.selectedRow.sort(function (a,b){return a - b})
                    deleteRow.map(function(selectedRowIndex,index){
                        data.value.splice(selectedRowIndex-index,1)
                    })
                }else{
                    data.value=[""]
                }
            }
        });
        thisObj.state.selectedRow=[];
        this.props.updateFields(fieldDataCopy);
    };
    //获取这个表中所有field的value的最大length
    getRepeatLength(props){
        var thisObj=this;
        var length=1;
        props.fieldData.map(function(data){
            if(data.pid==props.tableData.id&&data.value instanceof Array &&data.value.length>length){
                length=data.value.length;
            }
        });
        return length;
    }
    render(){
        var thisObj=this;
        return <div className="formTableDiv">
            {
                this.formField.repeatRow?<div className="tableFuncDiv">
                    <Button type="primary" size="small" onClick={()=>thisObj.addRow()} >添加</Button>
                    <Button type="primary" size="small" onClick={()=>thisObj.repeatRow()} >复制</Button>
                    <Button type="primary" size="small" onClick={()=>thisObj.deleteRow()} >删除</Button>
                </div>:null
            }
            <table className="formTable">
                <tbody>
                {
                    this.props.tableData.data.map(function(data,rowIndex){
                        if(!thisObj.formField.repeatRow||rowIndex<thisObj.formField.repeatRowRange[0]){
                            //表头
                            return <Row
                                key={"rowHead"+rowIndex}
                                data={data}
                                fieldData={thisObj.props.fieldData}
                                changeValue={(e,obj)=>thisObj.props.changeValue(e,obj)}
                                checkbox={{
                                    show:thisObj.formField.repeatRow&&rowIndex==0,
                                    onCheck:(e)=>thisObj.checkAllRow(e),
                                    checked:thisObj.state.selectedRow.length===thisObj.repeatLength,
                                    indeterminate:thisObj.state.selectedRow.length>0&&thisObj.state.selectedRow.length!=thisObj.repeatLength,
                                    rowSpan:thisObj.formField.repeatRowRange[0]
                                }}
                            />
                        }else if(thisObj.formField.repeatRow&&rowIndex==thisObj.formField.repeatRowRange[0]){
                            //数据行
                            return <RepeatRows
                                key={"repeatRow"+rowIndex}
                                data={thisObj.tableDataCopy}
                                fieldData={thisObj.props.fieldData}
                                formField={thisObj.formField}
                                changeValue={(e,obj,rowIndex)=>thisObj.props.changeValue(e,obj,rowIndex)}
                                selectedRow={thisObj.state.selectedRow}
                                repeatLength={thisObj.repeatLength}
                                checkRow={(e,rowIndex)=>thisObj.checkRow(e,rowIndex)}
                            />
                        }else if(thisObj.formField.repeatRow&&rowIndex>thisObj.formField.repeatRowRange[1]){
                            //表尾
                            return <Row
                                key={"rowEnd"+rowIndex}
                                data={data}
                                fieldData={thisObj.props.fieldData}
                                changeValue={(e,obj)=>thisObj.props.changeValue(e,obj)}
                                checkbox={{
                                    show:thisObj.formField.repeatRow&&rowIndex==thisObj.formField.repeatRowRange[1]+1,
                                    showCheckbox:false,
                                    rowSpan:thisObj.props.tableData.data.length-thisObj.formField.repeatRowRange[1]
                                }}
                            />
                        }
                    })
                }
                </tbody>
            </table></div>
    }
}