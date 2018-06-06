import {fieldType,fieldValidation,fieldMode} from './../constData'


var FieldData=function(data){
    return new FieldData.fn.init(data);
};

FieldData.fn=FieldData.prototype={
    init:function(data,recall){
        this.data=data;
        this.recall=recall
    },
    //处理数据的默认值
    initData:function(){
        var that=this;
        this.data.map(function(data) {
            let parent = that.getField(data.pid);
            if (data.value === undefined && data.defaultValue) {
                data.value = data.defaultValue;
            } else if (data.value === undefined) {
                if (parent && parent.repeatRow) {
                    data.value = [""];
                } else {
                    data.value = "";
                }
            }
        });
        return this;
    },
    runFormat:function(times){
        let thisObj=this;
        let fieldData=this;
        let formatTimes=0;
        let promiseList=[];
        let promiseDataList=[];
        this.data.map(function(data){
            //处理数据表达式
            if(data.formatter){
                var newValue=thisObj.getFormatValue(data.formatter,data.value);
                if(newValue!==undefined){
                    if(newValue instanceof Promise){
                        promiseList.push(newValue);
                        promiseDataList.push(data);
                    }else{
                        data.value=newValue;
                        formatTimes++;
                    }
                }
            }
        });
        //如果表达式改变了数据，则再次执行所有表达式；
        if(formatTimes>0&&(times==undefined||times<20)){
            let newTimes=times?++times:1;
            this.runFormat(newTimes);
        }else if(times>=20){
            console.error('超出formatter最大可调用次数，请检查是否有互相引用的情况')
        }
        Promise.all([promiseList]).then(function(result){
           for(let [index,data] of promiseDataList.entries()){
               console.log(data,index,result);
               result[index].then(function(response){
                   data.value=response;
               });
           }
        });
        return this;
    },
    //计算除了value外的所有属性
    formatProps(data,index){
        var thisObj=this;
        var formatField={};
        for(var i in data){
            if(data[i]&&data[i].formatter&&i!=="value"){
                //let fn=eval('('+data[i].formatter+')');
                //if(typeof fn==='function'){
                //    formatField[i]=fn(thisObj,index);
                //}
                formatField[i]=this.getFormatValue(data[i].formatter,data[i].value,index)
            }else if(data[i]&&data[i].value!==undefined){
                formatField[i]=data[i].value;
            }else{
                formatField[i]=data[i]
            }
        }
        return formatField;
    },
    //转换format并获取其返回值
    getFormatValue(formatStr,value,index){
        const that=this;
        const $=this.$.bind(this);
        const fieldData=this;
        const fieldTypeList=fieldType.data;
        const fieldValidationList=fieldValidation.data;
        const fieldModeList=fieldMode.data;
        const ajaxGet=this.ajaxGet.bind(this);
        let evalData;
        let i=index;
        let newValue;
        try {
            evalData=eval('('+formatStr+')');
        } catch (err){
            console.log(err);
            return;
        }
        if(!value||!(value instanceof Array)){
            if(typeof evalData ==='function'){
                newValue=evalData();
            }else{
                newValue=evalData;
            }
            if(!Object.is(newValue,value)){
                return newValue;
            }
        }else if(value instanceof Array){
            newValue=[];
            let isNew=false;
            for(let j in value){
                i=j;
                if(typeof evalData ==='function'){
                    newValue[j]=evalData();
                }else{
                    newValue[j]=evalData;
                }
                if(!Object.is(newValue[j],value[j])){
                    isNew=true;
                }
            }
            if(isNew){
                return newValue;
            }
        }
    },
    //获取异步数据
    ajaxGet(url){
        return fetch(url, {
            method: 'get'
        }).then(function(response) {
            return response.json();
        })
    },
    //生成提交的数据
    getSubmitData:function(thisData=this.data){
        var thisObj=this;
        var dataObj={};
        thisData.map(function(data){
            if(data.pid=="0"){
                dataObj[data.id]={};
                thisData.map(function(data2){
                    if(data.id==data2.pid){
                        dataObj[data.id][data2.id]=data2.value?data2.value:'';
                    }
                })
            }
        })
        return dataObj;
    },
    //验证数据
    validation:function(){
        var success=true;
        this.data.map(function(data){
            var isList=data.value instanceof Array;
            if(isList){
                for(var i in data.value){
                    if(data.required&&(data.value[i]===undefined||data.value[i]==="")){
                        success=false;
                    }
                    if(data.validation&&data.value[i]){
                        var reg=eval(data.validation);
                        var testResult=reg.test(data.value[i]);
                        if(!testResult){
                            success=false;
                        }
                    }
                }
            }else{
                if(data.required&&(data.value===undefined||data.value==="")){
                    success=false;
                }
                if(data.validation&&data.value){
                    var reg=eval(data.validation);
                    var testResult=reg.test(data.value);
                    if(!testResult){
                        success=false;
                    }
                }
            }
        });
        return success;
    },
    getField(value,selector="id"){
        var fields=[];
        this.data.map(function(data){
            if(data[selector]==value){
                fields.push(data);
            }
        });
        if(fields.length>1){
            return fields;
        }else{
            return fields[0];
        }
    },
    getFieldValueById(id,i){
        let fieldObj=this.data.find(function(data){
            return data.id==id;
        });
        if(i!==undefined&&fieldObj.value instanceof Array){
            return fieldObj.value[i]
        }else{
            return fieldObj.value
        }
    },
    getValue(str,i){
        return this.getFieldValueById(str,i)
    },
    $(propValue,prop){
        return this.getField(propValue,prop);
    },
    set(prop,value){
        this[prop]=value;
        return this;
    },
    getDiffData(data={},props="value"){
        var diffData={};
        for(let i in this.data){
            if(data&&!(this.data[i].value instanceof Array)&&this.data[i].value!=data[this.data[i].id]){
                diffData[this.data[i].id]=this.data[i][props];
            }else if(this.data[i].value instanceof Array&&this.data[i].value.toString()!=(data[this.data[i].id]&&data[this.data[i].id].toString())){
                diffData[this.data[i].id]=(this.data[i][props] instanceof Array)?JSON.parse(JSON.stringify(this.data[i][props])):this.data[i][props]
            }
        }
        return diffData;
    },
    //获取valuelist，格式为[{字段id,字段值},……]
    getValueList(){
        var valueList={};
        for(var i in this.data){
            valueList[this.data[i].id]=this.data[i].value?JSON.parse(JSON.stringify(this.data[i].value)):'';
        }
        return valueList;
    },
    //合并更新fieldData
    merge(newData){
        for(var field of newData){
            var thisField=this.getField(field.id);
            Object.assign(thisField,field);
        }
        return this;
    },
    //合并数据
    mergeData(newData){
        let data=newData
        //if(typeof data!=='object'){
        //    data={
        //        0:data
        //    }
        //}
        if(data&&typeof data=="object"){
            for(let item of this.data){
                item.value=data[item.id];
            }
        }
        return this;
    },
    //根据字段数据生成字符串形式的数据
    getValueStr(){
        let str="";
        for(let item of this.data){
            if(item.value&&item.value!=""){
                str+=(str===""?"":",");
                str+=item.name+":";
                if(item.value instanceof Array){
                    str+=item.value.join(",")
                }else{
                    str+=item.value;
                }
            }
        }
        return str;
    },
    //根据字段数据和默认列数自动生成表单布局
    getDefaultFormData(defaultCol=4){
        var fieldData=this.data;
        var formData=[];
        var that=this;
        defaultCol = parseInt(defaultCol);
        fieldData.map(function (data,index) {
            if(data.type=='form'){
                if(!data.repeatRow){
                    let formDataChild={
                        id:data.id,
                        data:[[{
                            content:data.name,
                            colSpan:defaultCol,
                            fontWeight:'600'
                        }]]
                    };
                    for(var j=1;j<defaultCol;j++){
                        formDataChild.data[0].push({hidden:'hidden'})
                    }
                    fieldData.map(function(data2){
                        if(data2.pid==data.id&&data2.type != 'form'){
                            var dataLabel = {
                                content: data2.name,
                                colSpan: 1,
                                fontWeight: '400',
                                width:100/defaultCol/5*3+'%'
                            };
                            var dataInput = {
                                fields: [data2.id],
                                width:100/defaultCol/5*7+'%'
                            };
                            if (formDataChild.data[formDataChild.data.length - 1].length < defaultCol) {
                                formDataChild.data[formDataChild.data.length - 1].push(dataLabel)
                            } else {
                                formDataChild.data.push([])
                                formDataChild.data[formDataChild.data.length - 1].push(dataLabel)
                            }
                            if (formDataChild.data[formDataChild.data.length - 1].length < defaultCol) {
                                formDataChild.data[formDataChild.data.length - 1].push(dataInput)
                            } else {
                                formDataChild.data.push([])
                                formDataChild.data[formDataChild.data.length - 1].push(dataInput)
                            }
                        }
                    })
                    for(var i=formDataChild.data[formDataChild.data.length-1].length;i<defaultCol;i++){
                        formDataChild.data[formDataChild.data.length-1].push({})
                    }
                    formData.push(formDataChild)
                }else{
                    var formFieldLength=0;
                    var childrenFields=that.getField(data.id,"pid");
                    let formDataChild={
                        id:data.id,
                        data:[[{
                            content:data.name,
                            fontWeight:'600'
                        }]]
                    };
                    fieldData.map(function(data2) {
                        if (data2.pid == data.id&&data2.type != 'form') {
                            var dataLabel = {
                                content: data2.name,
                                colSpan: 1,
                                fontWeight: '400',
                                width:100/childrenFields.length-0.5+'%'
                            };
                            var dataInput = {
                                fields: [data2.id]
                            };
                            if(formDataChild.data.length<3){
                                formDataChild.data.push([])
                                formDataChild.data.push([])
                            }
                            formDataChild.data[1].push(dataLabel)
                            formDataChild.data[2].push(dataInput)
                            formFieldLength++;
                        }
                    })
                    formDataChild.data[0][0].colSpan=formFieldLength;
                    for(var j=1;j<formFieldLength;j++){
                        formDataChild.data[0].push({hidden:'hidden'})
                    }
                    formData.push(formDataChild)
                }
            }
        });
        return formData;
    }
};

FieldData.fn.init.prototype = FieldData.fn;


export default FieldData;