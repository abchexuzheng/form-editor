import React from 'react';
import ReactDom from 'react-dom';
import { Icon,message,Input,Select,Form,Button,Checkbox,DatePicker,Switch,Slider,Cascader,TreeSelect,AutoComplete,Modal   } from 'antd'
import Moment from 'Moment'
import FieldData from './../class/FieldData'
import SelecterData from './../class/SelecterData'
import FormViewer from './'
import ModalInput from './modalInput'


//props id  字段id
//props fieldData 所有字段数据
//props changeValue  改变字段值的方法
//props index   子表字段index
export default class Field extends React.Component{
    constructor(props) {
        super(props);
        this.state={}
    }
    init(){
        this.fieldData=FieldData(this.props.fieldData).getField(this.props.id);
        this.valueTest=this.testValue(this.fieldData);
        this.fieldFormatted=FieldData(this.props.fieldData).formatProps(this.fieldData,this.props.index);
        this.field=this.getFieldObj(this.fieldFormatted,this.fieldData);
    }
    //检查数据是否符合正则
    testValue(obj){
        var returned={};
        var value=this.props.index!=undefined&&(obj.value instanceof Array)?obj.value[this.props.index]:obj.value;
        if(obj.validation&&value&&obj.validation!="custom"){
            var reg=eval(obj.validation);
            var testResult=reg.test(value);
            if(!testResult){
                returned.validateStatus='error';
                returned.help=obj.validationHelp||'格式错误';
            }
        }else if(obj.validation=="custom"&&value){
            if(obj.reg.substr(0,1)=='/'&&obj.reg.substr(data.length-1,1)=='/'){
                var reg=eval(obj.reg);
                var testResult=reg.test(value);
                if(!testResult){
                    returned.validateStatus='error';
                    returned.help=obj.validationHelp||'格式错误';
                }
            }
        }
        return returned
    }
    //寻找父选择项字段
    findParentField(parentId,id){
        var parentField=this.props.fieldData.find(function(data){
            return data.id==parentId;
        });
        if(parentField&&parentField.parentId&&id!=undefined&&parentField.parentId!=id){
            parentField=this.findParentField(parentField.parentId)
        }
        return parentField
    }
    //显示表达式输入框，并自动生成表达式模板
    showFormatter(){
        var value=(typeof this.fieldData.value=="object")?this.fieldData.value.value:this.fieldData.value
        if(this.fieldData.value.formatter){
            this.props.changeValue({
                value:value,
                formatter:''
            },this.fieldData)
        }else{
            var formatter;
            if(typeof value=="string"){
                formatter='function(){return "'+value+'";}'
            }else{
                formatter='function(){return '+value+';}'
            }
            this.props.changeValue({
                value:value,
                formatter:formatter
            },this.fieldData)
        }
    };
    //根据字段数据返回对应的表单控件
    getFieldObj(fieldObj,fieldObj2){
        var thisObj=this;
        var style={
            fontSize:fieldObj.fontSize,
            width:fieldObj.width,
            color:fieldObj.color,
            background:fieldObj.background
        };
        let value;
        if((Number.isNaN(fieldObj.value))||!fieldObj.value||!(fieldObj.value instanceof Array)){
            value=fieldObj.value
        }else{
            if(this.props.index!==undefined){
                value=fieldObj.value[this.props.index]
            }else{
                if(fieldObj.type!="treeSelect"&&fieldObj.type!="slider"&&fieldObj.type!="select"){
                    value=JSON.stringify(fieldObj.value);
                }else{
                    value=fieldObj.value;
                }
            }
        }
        //var value=(Number.isNaN(fieldObj.value)&&!(fieldObj.value instanceof Array))||!fieldObj.value||!(fieldObj.value instanceof Array)?fieldObj.value:fieldObj.value[this.props.index]
        var props={
            hidden:fieldObj.hidden===true?'hidden':undefined,
            disabled:fieldObj.disabled,
            key:fieldObj.id,
            defaultValue:fieldObj.defaultValue,
            value:value,
            onChange:(e)=>this.props.changeValue(e,fieldObj2),
            style:style,
            placeholder:fieldObj.placeholder,
            showSearch:fieldObj.showSearch,
            mode:fieldObj.mode,
            allowClear:fieldObj.allowClear
            //addonAfter:fieldObj.required?"*":"",
            //suffix:fieldObj.required?"*":""
        };
        //value!==undefined?props.value=value:null;   //value有值时再对props进行赋值，解决value属性覆盖defaultValue的问题；
        //isNaN(value)?props.value="":null;  //当value的值为NaN时，赋值为空，解决值format值为NaN时无法覆盖原来的值的问题；
        switch (fieldObj.type){
            case 'input' :
                return <Input
                    {...props}
                />;
            case 'select':
                var parentFieldData=this.findParentField(fieldObj.parentId,0);
                var lastParentFieldData=this.findParentField(fieldObj.parentId);
                var selecterData=(parentFieldData&&parentFieldData.data)||fieldObj.data;
                if(selecterData instanceof Array){
                    //selecterData=selecterData;
                }else if(eval(selecterData) instanceof Array){
                    selecterData=eval(selecterData)
                }else if(selecterData){
                    console.error("无法识别的选择项数据,字段名为："+fieldObj.name)
                }
                let selectOptions=[];
                selecterData&&(selecterData instanceof Array)?selecterData.map(function(selectData,index){
                    var lastParentValue=false;
                    if(lastParentFieldData){
                        lastParentValue=!lastParentFieldData.value||typeof lastParentFieldData.value=="string"?lastParentFieldData.value:lastParentFieldData.value[thisObj.props.index]
                    }
                    if((!fieldObj.parentId&&!selectData.pValue)||(lastParentValue===selectData.pValue)){
                        selectOptions.push(<Select.Option
                            value={selectData.value}
                            key={fieldObj.value+"option"+selectData.value}
                        >
                            {selectData.name}
                        </Select.Option>)
                    }
                }):null;
                return <Select
                    {...props}
                    optionFilterProp="children"
                    optionLabelProp="children"
                    value={(fieldObj.mode=='tags'||fieldObj.mode=='multiple')&&!(value instanceof Array)?[]:value}
                >
                    {selectOptions}
                </Select>;
            case 'textarea':
                return <Input.TextArea
                    {...props}
                    autosize
                />;
            case 'datePicker':
                return <DatePicker
                    {...props}
                    onChange={(e,dataStr)=>this.props.changeValue(dataStr,fieldObj2)}
                    value={value?Moment(value):undefined}
                />
            case 'switch':
                return <Switch
                    {...props}
                    checked={fieldObj.value===true}
                />
            case 'slider':
                return <Slider
                    {...props}
                    range={fieldObj.value instanceof Array}
                    value={fieldObj.value}
                    max={fieldObj.max}
                    min={fieldObj.min}
                    step={fieldObj.step}
                />
            case 'treeSelect':
                let treeData=new SelecterData(fieldObj.data);
                treeData=treeData.switchMode();
                return <TreeSelect
                    {...props}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={treeData}
                    treeDefaultExpandAll
                    treeNodeFilterProp="label"
                    searchPlaceholder="搜索"
                    treeCheckable={fieldObj.multiple}
                />
            case 'modalInput':
                return <ModalInput
                    {...props}
                    source={fieldObj.source}
                    getData={(e)=>this.props.changeValue(e,fieldObj2)}
                    name={fieldObj.name}
                />
        }
    }
    render(){
        this.init();
        var style={
            paddingRight:this.fieldData.required?15:0
        };
        return <Form.Item
            style={style}
            hasFeedback
            validateStatus={this.valueTest.validateStatus}
            help={this.valueTest.help}
            className="formItem"
        >


            {
                this.fieldData.value&&this.fieldData.value.formatter?<Input.TextArea
                    //{...props}
                    placeholder="表达式"
                    className="formatterTextArea"
                    key={this.fieldData.id+"formatter"}
                    value={this.fieldData.value.formatter}
                    onChange={(e)=>this.props.changeValue({
                        value:this.fieldData.value.value!==undefined?this.fieldData.value.value:this.fieldData.value,
                        formatter:e.target.value
                    },this.fieldData)}
                    autosize
                />:this.field
            }
            {
                this.fieldData.required?<div className="requiredDiv">
                    *
                </div>:null
            }
            {
                this.fieldData.formatterAble?<Icon
                    className="formatterSwitcher"
                    type={this.fieldData.value&&this.fieldData.value.formatter?"form":"code-o"}
                    onClick={()=>this.showFormatter()}
                /> :null
            }
        </Form.Item>
    }
}