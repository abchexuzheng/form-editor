import React from 'react';
import ReactDom from 'react-dom';
import { Checkbox } from 'antd'
import FieldData from './../class/FieldData'
import Cell from './cell'

//props data  行表单数据集[]
//props checkbox checkbox配置项 #show,#rowSpan,#onCheck,#checked
//props fieldData 所有字段数据
//props changeValue  改变字段值的方法
//props index   子表字段index
export default class Row extends React.Component{
    constructor(props) {
        super(props);
    }
    render(){
        var thisObj=this;
        var checkBoxCellStyle={
            width:30,
            textAlign:"center"
        };
        return <tr>
            {
                this.props.checkbox&&this.props.checkbox.show?<td rowSpan={this.props.checkbox.rowSpan} style={checkBoxCellStyle}>
                    {
                        this.props.checkbox.showCheckbox!=false?<Checkbox
                            onChange={(e)=>this.props.checkbox.onCheck(e)}
                            checked={this.props.checkbox.checked}
                            indeterminate={this.props.checkbox.indeterminate}
                        />:null
                    }
                </td>:null
            }
            {
                this.props.data.map(function(data,index){
                    return <Cell
                        key={"cell"+index}
                        data={data}
                        fieldData={thisObj.props.fieldData}
                        changeValue={(e,obj)=>thisObj.props.changeValue(e,obj)}
                        index={thisObj.props.index}
                    />
                })
            }
        </tr>
    }
}
