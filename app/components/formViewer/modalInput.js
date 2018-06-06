import React from 'react';
import ReactDom from 'react-dom';
import { Input,Modal,Popover } from 'antd'
import FormViewer from './'
import FieldData from './../class/FieldData'

export default class ModalInput extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            data:{},
            formLoaded:false,
            modalVisible:false
        }
        this.fetchData();
    }
    fetchData(){
        let that=this;
        fetch(this.props.source, {
            method: 'get'
        }).then(function(response) {
            return response.json();
        }).then(function(response) {
            let fieldData=response.fieldData;
            if(that.props.value){
                fieldData=FieldData(response.fieldData).mergeData(that.props.value).data;
                that.valueStr=FieldData(fieldData).getValueStr();
            }
            that.valueStr=FieldData(fieldData).initData().runFormat().getValueStr();
            that.setState({
                data:{
                    formData:response.formData?response.formData:FieldData(response.fieldData).getDefaultFormData(),
                    fieldData:fieldData,
                },
                formLoaded:true
            })
        }).catch(function(err) {
            console.log(err);
            // 出错了;等价于 then 的第二个参数,但这样更好用更直观 :(
        });
    }
    showModal(){
        this.setState({
            modalVisible:true
        })
    }
    closeModal(){
        this.setState({
            modalVisible:false
        })
    }
    confirmData(){
        let fieldData=this.state.data.fieldData;
        let valueList=FieldData(fieldData).getValueList();
        this.valueStr=FieldData(fieldData).getValueStr();
        this.props.getData(valueList);
        this.closeModal();
    }
    cancelChange() {
        FieldData(this.state.data.fieldData).mergeData(this.props.value);
        this.closeModal();
    }
    getData(data){
        this.state.data.fieldData.map(function(field){
            if(field.id===data.id){
                field.value=data.value;
            }
        });
        this.setState({
            updated:true
        })
    }
    render(){
        let previewContent=this.state.data.fieldData?<div>
            {
                this.state.data.fieldData.map(function(data){
                    let value=data.value;
                    if(value instanceof Array){
                        value=value.join(",")
                    }
                    return data.value&&data.value!=""?<p><b>{data.name+"："}</b>{value}</p>:null
                })
            }
        </div>:null;
        return <div className="modalInput">
            <Popover content={previewContent} title={this.props.name}>
                <Input
                    {...this.props}
                    readonly="readonly"
                    onClick={()=>this.showModal()}
                    value={this.valueStr}
                />
            </Popover>
            <Modal
                title={this.props.name}
                visible={this.state.modalVisible}
                onOk={()=>this.confirmData()}
                onCancel={()=>this.cancelChange()}
            >
                {
                    this.state.formLoaded===true?<FormViewer
                        data={this.state.data}
                        getData={(data)=>this.getData(data)}
                    />:null
                }
            </Modal>
        </div>
    }
}
