import React, {Component} from 'react';
import './../App.less';
import {Button, Card, Col, Divider, Icon, List, Progress, Row, Spin, Typography} from 'antd';
import updateImg from '../../public/update.png';
import appConfig from '../Config';
import $ from 'jquery';
import semver from 'semver';
import request from 'request';
import progress from 'request-progress';
import pjson from './../../package';

const fs = window.fs;
const cp = window.cp;
const { Text } = Typography;
const electron = window.electron;
const {app, shell} = electron.remote;
const osInfo = electron.remote.getGlobal('shareObject').osInfo;
const {Meta} = Card;

class Update extends Component {
    state = {
        check: true,
        latest: {},
        // wait,download,install,error
        update: 'wait',
        downloadState: {}
    };

    componentWillMount() {
        let that = this;
        $.ajax({
            url: appConfig.updateCheckURL,
            timeout: 10000,
            type: 'GET',
            cache:false,
            success: function (data) {
                let latest = data[0];
                if(semver.satisfies(latest.version, '>' + app.getVersion())){
                    that.setState({latest:latest});
                    if (latest.force) {
                        that.updateVersion();
                    }
                }
            },
            complete: function (XMLHttpRequest, status) {
                that.setState({
                    check: false
                })
            }
        });

    }
    updateVersion(){
        let that = this;
        const platform = osInfo.platform();
        try {
            const downloadUrl = platform === 'darwin' ? this.state.latest.download.dmg : platform === 'win32' ? this.state.latest.download.winSetup : '22';
            if (downloadUrl === '') return;

            const downloadUrlArr = downloadUrl.split("/");

            const filename = downloadUrlArr[downloadUrlArr.length-1];

            const savePath = osInfo.tmpdir() + '/' + filename;

            const _request = request(downloadUrl);
            progress(_request, {
                // throttle: 2000,                    // Throttle the progress event to 2000ms, defaults to 1000ms
                // delay: 1000,                       // Only start to emit after 1000ms delay, defaults to 0ms
                // lengthHeader: 'x-transfer-length'  // Length header to use, defaults to content-length
            })
                .on('progress', function (state) {
                    // The state is an object that looks like this:
                    // {
                    //     percent: 0.5,               // Overall percent (between 0 to 1)
                    //     speed: 554732,              // The download speed in bytes/sec
                    //     size: {
                    //         total: 90044871,        // The total payload size in bytes
                    //         transferred: 27610959   // The transferred payload size in bytes
                    //     },
                    //     time: {
                    //         elapsed: 36.235,        // The total elapsed seconds since the start (3 decimals)
                    //         remaining: 81.403       // The remaining seconds to finish (3 decimals)
                    //     }
                    // }
                    that.setState({downloadState: state})
                })
                .on('error', function (err) {
                    that.setState({
                        downloadState:{
                            error: true
                        }
                    })
                })
                .on('end', function () {
                    that.setState({
                        update: 'install',
                    });

                    setTimeout(function () {
                        if (platform === 'darwin'){
                            const appName = pjson.build.productName;
                            const appVersion = app.getVersion();
                            console.info(appName,appVersion);
                            // 挂载
                            cp.execSync(`hdiutil attach '${savePath}' -nobrowse`, {
                                stdio: ['ignore', 'ignore', 'ignore']
                            });

                            // 覆盖原 app
                            cp.execSync(`rm -rf '/Applications/${appName}.app' && cp -R '/Volumes/${appName} ${appVersion}/${appName}.app' '/Applications/${appName}.app'`);

                            // 卸载挂载的 dmg
                            cp.execSync(`hdiutil eject '/Volumes/${appName} ${appVersion}'`, {
                                stdio: ['ignore', 'ignore', 'ignore']
                            });

                            // 重启
                            app.relaunch();
                            app.quit();
                        }

                        if (platform === 'win32') {
                            shell.openItem(savePath);
                            setTimeout(function () {
                                app.quit();
                            },1500)
                        }
                    },2000)
                })
                .pipe(fs.createWriteStream(savePath));

            that.setState({update:'download'});
        } catch (e) {
            console.info(e);
            that.setState({
                update: 'error',
            });
        }
    }

    render() {
        return (
            <Spin spinning={this.state.check} tip="检查更新中..." size="small">
                <Card
                    bordered={false}
                    cover={<img draggable={false} alt={'update'} style={{width: '200px', margin: '0 auto'}}
                                src={updateImg}/>}
                >
                    {
                        this.state.latest.version
                            ? <div>
                                <Meta title={
                                    <div>
                                        <Row><Col><div style={{textAlign:'center'}}><h3>发现新版本 V{this.state.latest.version}</h3></div></Col></Row>
                                        <Row><Col offset={8} span={8}><Text type="secondary" style={{fontSize:'12px'}}>当前版本: v{app.getVersion()}</Text></Col></Row>
                                    </div>
                                } description={
                                    <List
                                        style={{maxHeight: '150px',overflowY:"auto"}}
                                        size="small"
                                        split={false}
                                        bordered={false}
                                        dataSource={this.state.latest.description}
                                        renderItem={item => <List.Item style={{textAlign:'center'}}>{item}</List.Item>}
                                    />
                                }/>
                            </div>
                            : <Meta title={
                                <div>
                                    <Row><Col><div style={{textAlign:'center'}}><h3>当前已经是最新版本</h3></div></Col></Row>
                                    <Row><Col offset={8} span={8}><Text type="secondary" style={{fontSize:'12px'}}>当前版本: v{app.getVersion()}</Text></Col></Row>
                                </div>
                            }/>
                    }

                </Card>
                {
                    this.state.latest.version && this.state.update === 'wait'
                        ?
                        <Row style={{marginBottom: '20px'}}>
                            <Col offset={5} span={8}><Button size={'small'} shape="round" onClick={() => {
                                electron.remote.getCurrentWindow().close()
                            }}>暂不更新</Button></Col>
                            <Col span={8}><Button size={'small'} shape="round" type="primary"
                                                  icon="arrow-down" onClick={() => {this.updateVersion()}}>立即更新</Button></Col>
                        </Row>
                        :
                        this.state.update === 'download'
                        ?
                            this.state.downloadState.error
                            ?
                            <Text strong style={{marginLeft: '35%'}}>抱歉下载出错了</Text>
                            :
                            <div style={{width: '90%', margin: '15px auto'}}>
                                <Text strong>正在下载,已完成 {Math.floor(this.state.downloadState.percent * 100)} %</Text>
                                <Progress
                                    strokeColor={{
                                        '0%': '#108ee9',
                                        '100%': '#87d068',
                                    }}
                                    showInfo={false}
                                    percent={Math.floor(this.state.downloadState.percent * 100)}
                                />
                                {this.state.downloadState.size && this.state.downloadState.time ? <Text>{(this.state.downloadState.size.transferred/1024/1024).toFixed(2)} MB / {(this.state.downloadState.size.total/1024/1024).toFixed(2)} MB <Divider type="vertical" /> {(this.state.downloadState.speed/1024/1024).toFixed(2)} MB/s <Divider type="vertical" /> {Math.floor(this.state.downloadState.time.remaining)} s</Text> : <div/>}
                            </div>
                        :
                        this.state.update === 'install'
                        ?
                        <Row><Col><div style={{textAlign:'center'}}><h4><Icon type="loading" /> 安装中,请稍等....</h4></div></Col></Row>
                        :
                        this.state.update === 'error'
                        ?
                        <Row><Col><div style={{textAlign:'center',textColor:'red'}}><h4><Icon type="close" /> 安装失败!!!</h4></div></Col></Row>
                        :
                        <div/>
                }
            </Spin>
        )
    }
}

export default Update;