import React from 'react';
import ReactDom from 'react-dom';
import { Icon,message,Button } from 'antd'
import MenuSwitcher from './menuSwitcher.js'
import FormElementSelecter from './elementSelecter.js'
import Editor from './editor.js'
import FieldEditor from './fieldEditor.js'
import CodeEditor from './codeEditor'
import "./style"


//表单组件
class FormEditor extends React.Component{
    constructor(props) {
        super(props);
    }
    render(){
        return <div className="formContainer editorContainer">
            <div className="leftMenu">
                <MenuSwitcher>
                    <MenuSwitcher.Menu.Item key="field">
                        <Icon type="appstore"/>字段
                    </MenuSwitcher.Menu.Item>
                    <MenuSwitcher.Menu.Item key="property">
                        <Icon type="bars" />属性
                    </MenuSwitcher.Menu.Item>
                    <MenuSwitcher.Menu.Item key="code">
                        <Icon type="code-o" />代码
                    </MenuSwitcher.Menu.Item>
                    <MenuSwitcher.MenuContent keyTo="field">
                        <FormElementSelecter formOptions={this.props.formOptions} fieldData={this.props.fieldData}/>
                    </MenuSwitcher.MenuContent>
                    <MenuSwitcher.MenuContent keyTo="property" className="fieldEditorContainer">
                        <FieldEditor data={this.props.data} formOptions={this.props.formOptions} formData={this.props.formData} fieldData={this.props.fieldData} selected={this.props.selected}/>
                    </MenuSwitcher.MenuContent>
                    <MenuSwitcher.MenuContent keyTo="code">
                        <CodeEditor data={this.props}/>
                    </MenuSwitcher.MenuContent>
                </MenuSwitcher>
            </div>
            <div className="rightEditor">
                <Editor state={this.props} changeState={this.props.changeState} />
            </div>
        </div>
    }
}

export default FormEditor;