import React from 'react';
import ReactDom from 'react-dom';
import store from './../reducers'
import { addField,addForm,addNewField } from './../actions'
import { Icon } from 'antd';
import {fieldType} from './../constData'


class FormElementSelecter extends React.Component {
    static defaultProps={
        fieldData:[]
    };
    constructor(props) {
        super(props);
    }
    handleAddField(e,id){
        store.dispatch(addField(id))
    }
    handleAddForm(e,id){
        store.dispatch(addForm(id))
    }
    render(){
        var thisObj=this;
        return <div className="formElementSelecter">
            {
                this.props.fieldData.map(function(data){
                    if(data.pid==0){
                        return <div className="selecterDiv" key={"selecter"+data.id}>
                            <div className="selecterTitle" onClick={(e)=>thisObj.handleAddForm(e,data.id)}>{data.name}</div>
                            <div>
                                {
                                    thisObj.props.fieldData.map(function(data2) {
                                        if(data2.pid==data.id){
                                            return <div className="simpleSelecter"
                                                        onClick={(e)=>thisObj.handleAddField(e,data2.id)}
                                                        key={"selecter"+data2.id}
                                            >
                                                <div className="simpleSelecterTitle">{data2.name}</div>
                                                <div className="simpleSelecterInfo">{fieldType.findObj("value",data2.type).name}</div>
                                            </div>
                                        }
                                    })
                                }
                                {
                                    thisObj.props.formOptions.customField==true?<div className="simpleSelecter"
                                        onClick={(e)=>store.dispatch(addNewField(data.id))}
                                    >
                                        <Icon type="plus" className="addFieldIcon"/>
                                    </div>:null
                                }
                            </div>
                        </div>
                    }
                })
            }
        </div>
    }
}

export default FormElementSelecter

