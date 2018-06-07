import "babel-polyfill";
import "fetch-polyfill"
import React from 'react';
import ReactDom from 'react-dom';
import { Icon,message,Button } from 'antd'
import FormEditor from './formEditor'
import FormViewer from './formViewer'
import "./style"
import store from './reducers'
import { initData,switchMode } from './actions'



//表单组件
class NpForm extends React.Component{
    static menuTitle=[];
    constructor(props) {
        super(props);
        this.state = {
            loaded:false,
            mode:props.mode,
            fieldData: [],
            formOptions:{}
        };
        this.getInitData();
        let unsubscribe = store.subscribe(() =>
            {
                console.log(store.getState().formState.present)
                var newState=store.getState().formState.present;
                newState.undoDisabled= store.getState().formState.past.length === 0
                newState.redoDisabled= store.getState().formState.future.length === 0
                this.setState(newState)
            }
        )
    }
    getInitData(){
        var thisObj=this;
        fetch(this.props.source, {
            method: 'get'
        }).then(function(response) {
            return response.json();
        }).then(function(response) {
            store.dispatch(initData(response.default,4));
            thisObj.setState({loaded:true})
        }).catch(function(err) {
            console.log(err)
            // 出错了;等价于 then 的第二个参数,但这样更好用更直观 :(
        });
    }
    changeState=(obj)=>{
        this.setState(obj)
    };
    handleAction=(action,arg1)=> {
        var newPorps = this.props;
        var thisObj = this;
        switch (action) {
            case 'switchMode':
                store.dispatch(switchMode(arg1));
                break;
        }
    }
    render(){
        return <div className="npForm">
            {
                this.state.loaded&&this.state.mode=='edit'?<FormEditor
                    data={this.state}
                    fieldData={this.state.fieldData}
                    formData={this.state.formData}
                    formOptions={this.state.formOptions}
                    selected={this.state.selected}
                    changeState={this.changeState}
                />:null
            }
            {
                this.state.loaded&&this.state.mode=='preview'?<div className="formContainer">
                    <Button type="primary" onClick={this.handleAction.bind(null,'switchMode','edit')}>编辑</Button>
                    <FormViewer data={this.state} defaultCol='4' />
                </div> :null
            }
            {
                this.state.loaded&&(this.state.mode=='apply'||!this.state.mode)?<div className="formContainer">
                    <FormViewer data={this.state} defaultCol='4' mode="apply" />
                </div> :null
            }
        </div>
    }
}

export default NpForm;