import React from 'react';
import ReactDom from 'react-dom';
import { Icon,message,Form,Button } from 'antd'
//import {getDefaultFormDataFun} from './../reducers'
import FieldData from './../class/FieldData'
import SingleForm from './singleForm'
import './style'


//props data 表单数据
//props mode 显示模式
//props defaultCol 默认布局显示行数
class FormViewer extends React.Component {
    constructor(props) {
        super(props);
        var that=this;
        this.state={
            formData:JSON.parse(JSON.stringify(props.data.formData?props.data.formData:this.initForm())),
            fieldData:JSON.parse(JSON.stringify(props.data.fieldData))
        };
        this.autoSave=setInterval(function(){
            that.saveForm();
        },3000000);
        FieldData(this.state.fieldData).initData().runFormat();
    }
    componentWillReceiveProps(nextProps){
        this.props=nextProps;
        this.state={
            formData:JSON.parse(JSON.stringify(nextProps.data.formData?nextProps.data.formData:this.initForm())),
            fieldData:JSON.parse(JSON.stringify(nextProps.data.fieldData))
        };
        FieldData(this.state.fieldData).runFormat();
        this.setState({
            updated:true
        })
    }
    initForm(){
        //初始化报表，如果没有布局数据，自动生成默认布局；
        return FieldData(this.props.data.fieldData).getDefaultFormData(this.props.defaultCol)
    }
    //更新数据
    changeValue=(e,obj,rowIndex)=>{
        var dataIndex=rowIndex;
        if(dataIndex===undefined){
            obj.value=e&&e.target?e.target.value:e;
        }else{
            if(!(obj.value instanceof Array)){
                obj.value=[""]
            }
            obj.value[dataIndex]=e&&e.target?e.target.value:e;
        }
        this.clearChildrenData(obj.id,rowIndex);
        console.log(FieldData(this.state.fieldData).getValueList());
        if(this.props.getData){
            this.props.getData(obj);
        }else{
            var submit=false;
            var realTimeSubmitArray=FieldData(this.state.fieldData).runFormat().getDiffData(this.dataSaved,"realTimeSubmit");
            for(var i in realTimeSubmitArray){
                if(realTimeSubmitArray[i]===true){
                    submit=true;
                }
            }
            if(submit){
                this.saveForm();
            }
            this.setState({
                updated:true
            });
        }
    };
    //清空所有parentId为id的value
    clearChildrenData(id,rowIndex){
        var thisObj=this;
        var fieldData=this.state.fieldData;
        fieldData.map(function(data){
            if(data.parentId==id){
                thisObj.changeValue("",data,rowIndex)
                thisObj.clearChildrenData(data.id,rowIndex)
            }
        })
    }
    updateFields(data){
        this.state.fieldData=data;
        //this.runFormat();
        FieldData(this.state.fieldData).runFormat();
        this.setState({
            updated:true
        })
    }
    submitForm(){
        var submitAble=FieldData(this.state.fieldData).validation();
        if(submitAble){
            message.success("可以提交")
        }else{
            message.error("提交失败，请检查数据是否正确填写")
        }
    }
    saveForm(msg){
        var thisObj=this;
        var dataNow=this.state.fieldData;
        var valueList=FieldData(dataNow).getValueList();
        var diffData=FieldData(dataNow).getDiffData(this.dataSaved);
        console.log(diffData);
        if(Object.keys(diffData).length>0){
            fetch('http://localhost:8280/save', {
                method: 'post',
                body:JSON.stringify(diffData)
            }).then(function(response) {
                return response.json();
            }).then(function(response) {
                if(response.success){
                    if(msg){
                        message.success("保存成功")
                    }else{
                        console.log('自动保存成功');
                    }
                    FieldData(dataNow).merge(response.fieldData).runFormat();
                    thisObj.dataSaved=valueList;
                    thisObj.setState({
                        updated:true
                    });
                }else{
                    message.error("保存失败");
                }
            }).catch(function(err) {
                console.log(err);
                // 出错了;等价于 then 的第二个参数,但这样更好用更直观 :(
            });
        }
    }
    render(){
        var thisObj=this;
        var newProps=this.state;
        return <Form className={this.state.updated?"updated":null}>
            {
                this.props.mode==="apply"?<div className="tableBtnGroup">
                    <Button type="primary" onClick={()=>this.submitForm()}>提交</Button>
                    <Button type="primary" onClick={()=>this.saveForm(true)}>保存</Button>
                    <Button type="primary">撤回</Button>
                </div>:null
            }
            {
                newProps.formData?newProps.formData.map(function(tableData,i){
                    return <SingleForm
                        key={"table"+i}
                        tableData={tableData}
                        tableIndex={i}
                        data={thisObj.state}
                        fieldData={thisObj.state.fieldData}
                        changeValue={(e,obj,rowIndex)=>thisObj.changeValue(e,obj,rowIndex)}
                        updateFields={(data)=>thisObj.updateFields(data)}
                    />
                }):null}
        </Form>
    }
}


export default FormViewer;
