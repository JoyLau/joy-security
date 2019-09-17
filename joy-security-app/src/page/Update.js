import React, {Component} from 'react';
import './../App.less';
import {Card} from 'antd';

const { Meta } = Card;
class Update extends Component {

    render() {
        return (
            <Card
                hoverable
                cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
            >
                <Meta title="Europe Street beat" description="www.instagram.com" />
            </Card>
        )
    }
}

export default Update;