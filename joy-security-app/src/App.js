import React, {Component} from 'react';
import './App.less';
import Info from './page/Info'
import Copyright from "./page/Copyright";
import Send from "./page/Send";

const electron = window.electron;

class App extends Component {
    state = {
        page: 'index'
    };

    componentWillMount() {
        let that = this;
        electron.ipcRenderer.on('ch-1', (event, arg) => {
            console.info('收到 ch -1 的消息', arg);
            that.setState({page: arg});
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
                {
                    this.state.page === 'index'
                    ?
                    <div>
                        <Info/>
                        <Copyright/>
                    </div>
                    :
                    <Send goHome = {() => {this.goHome()}}/>

                }
            </div>

        )
    }
}
export default App;
