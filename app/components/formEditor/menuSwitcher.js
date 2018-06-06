import React from 'react';
import ReactDom from 'react-dom';
import { Menu, Icon } from 'antd';
//import "./index.less"


//菜单切换组件
class MenuSwitcher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentMenuItem: "field",
        };
    }
    //切换菜单控制
    handleChangeMenuItem=(e)=>{
        this.setState({
            currentMenuItem:e.key
        })
    }
    render(){
        var thisObj=this;
        return <div className="menuContainer">
            <Menu
                className="menuSwitcher"
                onClick={this.handleChangeMenuItem}
                selectedKeys={[this.state.currentMenuItem]}
                mode="horizontal"
            >
                {
                    this.props.children.map(function(data){
                        return data.type.name=="MenuItem"?data:null
                    })
                }
            </Menu>
            {
                this.props.children.map(function(data,index){
                    if(data.type.name=="MenuContent"){
                        return <MenuContent props={data.props} currentMenuItem={thisObj.state.currentMenuItem} key={data.type.name+index} />
                    }else{
                        return null;
                    }
                })
            }
        </div>
    }
}

class MenuContent extends React.Component{
    constructor(props) {
        super(props);
        console.log(this.props)
    }
    render(){
        return this.props.currentMenuItem==this.props.props.keyTo?<div style={{height:'100%'}} className={this.props.props.className}>
            {this.props.props.children}
        </div>:null
    }
}


export default MenuSwitcher
MenuSwitcher.Menu=Menu;
MenuSwitcher.MenuContent=MenuContent;