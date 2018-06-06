import React from 'react';
import ReactDom from 'react-dom';
import FieldData from './../class/FieldData'
import Field from './field'


//props data  表单单元格配置数据
//props fieldData 所有字段数据
//props changeValue  改变字段值的方法
//props index   子表字段index
export default class Cell extends React.Component{
    constructor(props) {
        super(props);
    }
    init(){
        this.data=this.props.data;
        this.data=FieldData(this.props.fieldData).formatProps(this.data,this.props.index);
        this.style={
            fontWeight:this.data.fontWeight,
            textAlign:this.data.textAlign,
            width:this.data.width&&(this.data.width.indexOf("px")>=0||this.data.width.indexOf("%")>=0)?this.data.width:this.data.width+'px',
            fontSize:this.data.fontSize,
            color:this.data.color,
            background:this.data.background
        }
    }
    render(){
        this.init();
        var thisObj=this;
        return this.data.hidden!==true&&this.data.hidden!=="hidden"?<td
            style={this.style}
            colSpan={this.props.data.colSpan}
            rowSpan={this.props.data.rowSpan}
        >
            {this.props.data.content}
            {
                this.props.data.fields?this.props.data.fields.map(function(data,index){
                    return <Field
                        key={"field"+index}
                        id={data}
                        fieldData={thisObj.props.fieldData}
                        changeValue={(e,obj)=>thisObj.props.changeValue(e,obj)}
                        index={thisObj.props.index}
                    />
                }):null
            }
        </td>:null
    }
}