import React, {Component} from 'react';
import {Button, Icon, Result, Spin} from 'antd';
import $ from 'jquery';
import Logo from "./index/logo/Logo";

const electron = window.electron;

class Send extends Component {
    state = {
        status: 'init',
        reSendDisabled: false,
    };


    componentWillMount() {
        this.sendMessage();
    }

    sendMessage = () =>{
        let that = this;
        let message = electron.remote.getGlobal('shareObject').message;
        if (message) {
            $.ajax({
                url: message.url.indexOf('http') > -1 ? message.url : "http://" + message.url,
                timeout: 10000,
                type: 'POST',
                data: JSON.stringify(message),
                contentType: "application/json; charset=UTF-8",
                success: function (data) {
                    that.setState({status: 'success',reSendDisabled: true});
                    electron.remote.getGlobal('shareObject').message = null;
                    electron.remote.getGlobal('shareObject').isSend = false;
                },
                complete: function (XMLHttpRequest, status) {
                    that.setState({status: status})
                }
            });
        }
    };

    reSend (){
        this.sendMessage();
    }

    goHome(){
        this.props.goHome();
    }

    render() {
        return (
            <div>
                {
                    this.state.status === 'init' ?
                        <Spin style={{color:"black"}} tip="Calibration Data Sending..." size="large">

                            <div style={{height: '600px'}}>

                            </div>
                        </Spin>

                        :
                        this.state.status === 'success' ?
                            <div>
                                <Logo/>
                                <Result
                                    style={{paddingTop: '20%'}}
                                    title="Great, we have done all the operations!!"
                                    icon={<Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a"/>}
                                    extra={<div><Button type="primary" icon="redo" onClick={() => this.reSend()} disabled={this.state.reSendDisabled}>Resend</Button><Button type="primary" icon="check" onClick={() => this.goHome()} style={{marginLeft:10}}>Got It</Button></div>}
                                />
                            </div>

                            :
                            this.state.status === 'error' ?
                                <Result
                                    style={{paddingTop: '10%'}}
                                    status="500"
                                    title="500"
                                    subTitle="Sorry, the server is wrong."
                                    extra={<Button type="primary" onClick={() => this.goHome()}>Go Home</Button>}
                                />
                                :
                                this.state.status === 'timeout' ?
                                    <Result
                                        style={{paddingTop: '10%'}}
                                        status="404"
                                        title="Time Out!"
                                        subTitle="Sorry, the connection establishment is timed out."
                                        extra={<Button type="primary" onClick={() => this.goHome()}>Go Home</Button>}
                                    />
                                    :
                                    <div/>

                }
            </div>
        )
    }
}

export default Send;