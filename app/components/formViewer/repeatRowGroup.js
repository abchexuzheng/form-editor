import React from 'react';
import ReactDom from 'react-dom';
import FieldData from './../class/FieldData'
import Row from './row'


//props data array  重复行的配置数据
//props fieldData array
//props index num
//props checkRow fun
//props checked bol
//props fieldData 所有字段数据
export default class RepeatRowGroup extends React.Component {
    constructor(props) {
        super(props);
    }
    render(){
        var thisObj=this;
        var dataArr=[];
        for(var i in this.props.data){
            var checkbox={
                show:i==0,
                onCheck:(e)=>thisObj.props.checkRow(e,this.props.index),
                checked:thisObj.props.checked,
                rowSpan:thisObj.props.data.length
            };
            var row=<Row
                key={"repeatRowRow"+i}
                checkbox={checkbox}
                data={this.props.data[i]}
                fieldData={this.props.fieldData}
                changeValue={(e,obj)=>this.props.changeValue(e,obj,this.props.index)}
                index={this.props.index}
            />;
            dataArr.push(row)
        }
        return dataArr;
    }
}