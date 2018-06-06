

export default class SelecterData{
    constructor(data) {
        this.setData(data);
    }
}

SelecterData.prototype={
    setData:function(data){
        if(typeof data==="string"){
            this.data=eval(data);
        }else{
            this.data=data;
        }
    },
    findObj:function(name,value){
        return this.data.find(function(data){
            return data[name]==value;
        })
    },
    switchMode:function(){
        let that=this;
        function getItemByPValue(pValue){
            let dataList=[];
            for(let item of that.data){
                if(item.pValue==pValue){
                    let newItem={
                        label:item.name,
                        value:item.value,
                        key:item.value,
                        children:getItemByPValue(item.value)
                    }
                    dataList.push(newItem);
                }
            }
            return dataList;
        }
        return getItemByPValue(0);
    }
}
