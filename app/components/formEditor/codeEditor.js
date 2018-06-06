import React from 'react';
import ReactDom from 'react-dom';
import { Icon } from 'antd'
import store from './../reducers'
import {updateData} from './../actions'
import {UnControlled as CodeMirror} from 'react-codemirror2'
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/javascript/javascript.js');


class CodeEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            value:JSON.stringify(this.props.data,null,2)
        }
    }
    changeValue(editor, data,value){
        this.setState({value})
    }
    refreshCode(){
        store.dispatch(updateData(this.state.value))
    }
    render(){
        return <div className="codeEditorContainer">
            <Icon type="retweet" className="refreshCodeBtn" onClick={()=>this.refreshCode()} />
            <CodeMirror
                value={this.state.value}
                options={{
                    mode: 'javascript',
                    theme: 'xq-light',
                    lineNumbers: true,
                    //lineWrapping:true,
                }}
                className="react-codemirror2 codeEditor"
                onChange={(editor, data, value) => {this.changeValue(editor, data,value)}}
            />
        </div>
    }
}

export default CodeEditor