import React, {Component} from 'react';
import './App.less';
import Info from './page/Info';
import Index from './page/index/Index';
import Copyright from "./page/Copyright";
import Send from "./page/Send";
import Drag from "./page/index/drag/Drag";
import Menu from "./page/index/menu/Menu";

const electron = window.electron;

class App extends Component {
    state = {
        page: 'index'
    };

    componentWillMount() {
        let that = this;
        electron.ipcRenderer.on('ch-1', (event, arg) => {
            // 如果当前页面就处于发送页面,则重新发送
            if (arg === 'send' && this.state.page === 'send'){
                this.sendCom.reSend();
            } else {
                that.setState({page: arg});
            }
        });

        if (electron.remote.getGlobal('shareObject').isSend){
            that.setState({page: 'send'});
        }
    }

    goHome(){
        this.setState({page: 'index'});
    }

    render() {
        return (
            <div>
                <Drag/>
                <Menu/>
                {
                    this.state.page === 'index' ?
                    <Index/>
                    :
                    this.state.page === 'info' ?
                    <div>
                        <Info/>
                        <Copyright/>
                    </div>
                    :
                    this.state.page === 'send' ?
                    <Send goHome = {() => {this.goHome()}}
                          ref = {child => this.sendCom = child}
                    />
                    :
                    <div/>

                }
            </div>

        )
    }
}
export default App;
