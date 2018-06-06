

export default class DataOption {
    constructor(data) {
        this.setData(data);
    }
}

DataOption.prototype={
    setData:function(data){
        this.option=data;
        var that=this;
        var dataObj={}
        that.option.fieldData.map(function(data){
            if(data.pid=="0"){
                dataObj[data.id]={}
                that.option.fieldData.map(function(data2){
                    if(data.id==data2.pid){
                        dataObj[data.id][data2.id]=data2.value?data2.value:(data.repeatRow==true?[""]:"");
                    }
                })
            }
        })
        this.data=dataObj;
    },
    getDataByMainFieldName:function(formName){
        var newData={};
        for(var i in this.data){
            if(i==formName){
                for(var j in this.data[i]){
                    newData[j]=this.data[i][j];
                }
            }else{
                newData[i]=this.data[i];
            }
        }
        return newData;
    }
};