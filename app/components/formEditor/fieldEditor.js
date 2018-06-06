import React from 'react';
import ReactDom from 'react-dom';
import { Icon,message,Input } from 'antd'
import FormEditor from './editor.js'
import FormViewer from './../formViewer/index.js'
import store, {getFieldByIdFun} from './../reducers'
import { updateOption } from './../actions'
import FieldData from './../class/FieldData'
//import "./../style/index_bak.less"
import {defaultFieldOption,defaultMainFormOption,defaultCellOption,defaultFormOption} from './../constData'


class FieldEditor extends React.Component{
    constructor(props) {
        super(props);
        const that=this;
        this.state={
            optionLoaded:false
        };
        Promise.all([
            this.getOptions("fieldOption"),
            this.getOptions("cellOption"),
            this.getOptions("formOption"),
            this.getOptions("mainFormOption")
        ]).then(function(res){
            for(let item of res){
                that[item.formId]={
                    fieldData:item.fieldData,
                    formData:item.formData
                }
            }
            that.setState({
                optionLoaded:true
            });
        });
    }
    //返回获取默认表单配置的Promise对象
    getOptions(id){
        let that=this;
        return fetch(`http://localhost:8280/getForm?formid=${id}`, {
            method: 'get'
        }).then(function(response) {
            return response.json();
        }).then(function(response) {
            return response;
        }).catch(function(err) {
            console.log(err);
            // 出错了;等价于 then 的第二个参数,但这样更好用更直观 :(
        });
    }
    initState(){
        var optionForm;
        var thisObj=this;
        if(this.props.selected&&this.props.selected.type=='field'){
            optionForm=JSON.parse(JSON.stringify(this.fieldOption));
            optionForm.fieldData.map(function(data,index){
                var thisValue;
                thisObj.props.selected.id.map(function(data2){
                    var thisFieldData=FieldData(thisObj.props.fieldData).getField(data2);
                    var newValue=thisFieldData[data.id];
                    if(newValue!=thisValue&&thisValue==undefined){
                        thisValue=newValue;
                    }else if(newValue!=thisValue&&thisValue!=undefined){
                        thisValue='';
                    }
                });
                if(thisValue!=undefined){
                    data.value=thisValue;
                }
            })
        }else if(this.props.selected&&this.props.selected.type=='cell'){
            optionForm=JSON.parse(JSON.stringify(this.cellOption))
            if(typeof this.props.selected.y=="object"&&typeof this.props.selected.z=="object"){
                optionForm.fieldData.map(function(data){
                    var thisValue;
                    thisObj.props.selected.y.map(function(data2,index2){
                        var zData=thisObj.props.selected.z[index2];
                        var newValue=thisObj.props.formData[thisObj.props.selected.x].data[data2][zData][data.id];
                        if(newValue!=thisValue&&thisValue==undefined){
                            thisValue=newValue;
                        }else if(newValue!=thisValue&&thisValue!=undefined){
                            thisValue='';
                        }
                    });
                    if(thisValue!=undefined){
                        data.value=thisValue;
                    }
                })
            }else{
                var selectedCell=this.props.formData[this.props.selected.x].data[this.props.selected.y][this.props.selected.z];
                optionForm.fieldData.map(function(data){
                    if(selectedCell[data.id]){
                        data.value=selectedCell[data.id]
                    }
                });
            }
        }else if(this.props.selected&&this.props.selected.type=='form'){
            let selectedForm=FieldData(thisObj.props.fieldData).getField(this.props.selected.id);
            optionForm=JSON.parse(JSON.stringify(this.formOption))
            optionForm.fieldData.map(function(data){
                if(selectedForm[data.id]){
                    data.value=selectedForm[data.id]
                }
            });
            var length;
            for(var i in this.props.formData){
                if(this.props.formData[i].id==this.props.selected.id){
                    length=this.props.formData[i].data.length;
                }
            }
            optionForm.fieldData[5].max=length-1;
        }else{
            optionForm=JSON.parse(JSON.stringify(this.mainFormOption))
            optionForm.fieldData.map(function(data){
                if(thisObj.props.formOptions[data.id]){
                    data.value=thisObj.props.formOptions[data.id];
                }
            })
        }
        return optionForm
    }
    getFieldOption(){
        var selectedData=this.state.selected();
        if(selectedData){
            var optionForm={
                fieldData:defaultFieldOption.fieldData
            }
            optionForm.fieldData.map(function(data){
                if(selectedData[data.id]){
                    data.value=selectedData[data.id]
                }
            })
            return optionForm;
        }
    }
    getData(data){
        store.dispatch(updateOption(data))
    }
    render(){
        //console.log(JSON.stringify(defaultFieldOption.option.fieldData))
        var key="fieldEditor";
        key+="id="+(this.props.selected&&this.props.selected.id&&this.props.selected.id[0]);
        key+="x="+(this.props.selected&&this.props.selected.x);
        key+="y="+(this.props.selected&&this.props.selected.y&&this.props.selected.y[0]);
        key+="z="+(this.props.selected&&this.props.selected.z&&this.props.selected.z[0]);
        return this.state.optionLoaded===true?<div key={key} className="fieldEditorTable">
            <FormViewer data={this.initState()} defaultCol='2' getData={(data)=>this.getData(data)} />
        </div>:null
    }
}

export default FieldEditor;