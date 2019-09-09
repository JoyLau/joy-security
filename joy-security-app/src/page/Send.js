import React, {Component} from 'react';
import {Button, Icon, Result, Spin} from 'antd';
import $ from 'jquery';

const electron = window.electron;

class Send extends Component {
    state = {
        status: 'init'
    };


    componentWillMount() {
        let that = this;
        let message = electron.remote.getGlobal('shareObject').message;
        if (message) {
            $.ajax({
                url: "http://" + message.url,
                timeout: 3000,
                type: 'POST',
                data: JSON.stringify(message),
                contentType: "application/json; charset=UTF-8",
                success: function (data) {
                    that.setState({status: 'success'});
                    electron.remote.getGlobal('shareObject').message = null;
                },
                complete: function (XMLHttpRequest, status) {
                    that.setState({status: status})
                }
            });
        }
    }

    goHome(){
        this.props.goHome();
    }

    render() {
        return (
            <div>
                {
                    this.state.status === 'init' ?
                        <Spin tip="校验数据发送中..." size="large">

                            <div style={{padding: '30%'}}>

                            </div>
                        </Spin>

                        :
                        this.state.status === 'success' ?
                            <Result
                                style={{paddingTop: '10%'}}
                                title="Great, we have done all the operations!!"
                                icon={<Icon type="smile" theme="twoTone"/>}
                                extra={<Button type="primary" onClick={() => this.goHome()}>Got It</Button>}
                            />
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
                                    <div></div>

                }
            </div>
        )
    }
}

export default Send;