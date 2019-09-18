import React, {Component} from 'react';
import './../App.less';
import {Button, Card, Col, List, Row, Spin, Typography} from 'antd';
import updateImg from '../../public/update.png';
import appConfig from '../Config';
import $ from 'jquery';
import semver from 'semver';

const { Text } = Typography;
const electron = window.electron;
const {Meta} = Card;

class Update extends Component {
    state = {
        check: true,
        latest: {},
        update: false
    };

    componentWillMount() {
        let that = this;
        $.ajax({
            url: appConfig.updateCheckURL,
            timeout: 10000,
            type: 'GET',
            success: function (data) {
                let latest = data[0];
                if(semver.satisfies(latest.version, '>' + electron.remote.app.getVersion())){
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
                                        <Row><Col offset={8} span={8}><Text type="secondary" style={{fontSize:'12px'}}>当前版本: v{electron.remote.app.getVersion()}</Text></Col></Row>
                                    </div>
                                } description={
                                    <List
                                        size="small"
                                        split={false}
                                        bordered={false}
                                        dataSource={this.state.latest.description}
                                        renderItem={item => <List.Item style={{textAlign:'center'}}>{item}</List.Item>}
                                    />
                                }/>
                            </div>
                        : <Meta title={<div style={{textAlign:'center'}}><span>当前已经是最新版本</span></div>}/>
                    }

                </Card>
                {
                    this.state.latest.version
                    ?
                        <Row style={{marginBottom: '10px'}}>
                            <Col offset={5} span={8}><Button size={'small'} shape="round" onClick={() => {
                                electron.remote.getCurrentWindow().close()
                            }}>暂不更新</Button></Col>
                            <Col span={8}><Button size={'small'} shape="round" type="primary"
                                                  icon="arrow-down">立即更新</Button></Col>
                        </Row>
                    :
                        <div/>
                }

            </Spin>
        )
    }
}

export default Update;