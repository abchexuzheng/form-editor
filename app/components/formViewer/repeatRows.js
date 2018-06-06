import React from 'react';
import ReactDom from 'react-dom';
import FieldData from './../class/FieldData'
import RepeatRowGroup from './repeatRowGroup'

//#props data  表布局配置
//#props fieldData
//#props formField
//#props changeValue fun
//#props checkRow fun 改变checkbox的值
//#props selectedRow array  选中的行的index列表
//#props repeatLength num  重复次数
export default class RepeatRows extends React.Component{
    constructor(props) {
        super(props);
    }
    init(){
        //每组重复行的行数
        this.repeatRowLength=this.props.formField.repeatRowRange?this.props.formField.repeatRowRange[1]-this.props.formField.repeatRowRange[0]+1:1;
        //重复行的数据
        var dataCopy=JSON.parse(JSON.stringify(this.props.data.data));
        this.repeatTableData=dataCopy.splice(this.props.formField.repeatRowRange[0],this.repeatRowLength)
    }
    render(){
        this.init()
        var repeatArr=[];
        for(var i=0;i<this.props.repeatLength;i++){
            var rowGroup=<RepeatRowGroup
                key={"rowGroup"+i}
                index={i}
                data={this.repeatTableData}
                fieldData={this.props.fieldData}
                checkRow={(e,index)=>this.props.checkRow(e,index)}
                checked={this.props.selectedRow.indexOf(i)>=0}
                changeValue={(e,obj,index)=>this.props.changeValue(e,obj,index)}
            />;
            repeatArr.push(rowGroup);
        }
        return repeatArr;
    }
}
