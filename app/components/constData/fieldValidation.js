import SelecterData from "../class/SelecterData.js"


export const fieldValidation=new SelecterData([{
    value:'/^1[34578]\\d{9}$/',
    name:'手机号'
},{
    value:'/^([A-Za-z0-9_\\-\.])+\@([A-Za-z0-9_\\-\.])+\.([A-Za-z]{2,4})$/',
    name:'电子邮箱'
},{
    value:'/^[\u0391-\uFFE5]+$/',
    name:'中文'
},{
    value:'/^[1-9]\\d{5}(18|19|([23]\\d))\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$/',
    name:'身份证号'
},{
    value:'custom',
    name:'自定义'
}]);
