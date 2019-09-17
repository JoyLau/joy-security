import React, {Component} from 'react';
import './../App.less';
import {Button, Card, Col, Row} from 'antd';
import updateImg from '../../public/update.png';

const electron = window.electron;
const { Meta } = Card;

class Update extends Component {

    render() {
        return (
            <div>
                <Card
                    bordered={false}
                    cover={<img draggable={false} alt={'update'} style={{width: '200px',margin: '0 auto'}} src={updateImg} />}
                >
                    <Meta title="Europe Sasdastreet beat" description="www.instagram.com" />
                </Card>
                <Row style={{marginTop:'10px'}}>
                    <Col offset={5}  span={8}><Button size={'small'} shape="round" onClick={()=>{electron.remote.getCurrentWindow().close()}}>暂不更新</Button></Col>
                    <Col span={8}><Button size={'small'} shape="round" type="primary" icon="arrow-down">立即更新</Button></Col>
                </Row>
            </div>
        )
    }
}

export default Update;