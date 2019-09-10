import React, {Component} from 'react';
import {Badge, Descriptions, Typography} from 'antd';

const {Text, Paragraph} = Typography;
const electron = window.electron;

class Info extends Component {

    state = {
        osInfo: {},
        macInfo: [],
        colors: ['blue', 'purple', 'orange', 'magenta', 'cyan', 'green', 'pink', 'red', 'geekblue', 'yellow', 'volcano', 'gold', 'lime']
    };

    componentWillMount() {
        let osInfo = electron.remote.getGlobal('shareObject').osInfo;
        let macInfo = [];
        let net = osInfo.networkInterfaces();
        let netKeys = [];
        for (let property in net) {
            netKeys.push(property);
        }
        netKeys.map(key => {
            net[key].map(item => {
                if (item.family === 'IPv4' && item.mac !== '00:00:00:00:00:00') {
                    macInfo.push({name: key, mac: item.mac, address: item.address})
                }
            })
        });

        this.setState({osInfo: osInfo, macInfo: macInfo});
    }

    render() {
        return (
            <Descriptions bordered column={1}>
                <Descriptions.Item label="System Type">{this.state.osInfo.type()}</Descriptions.Item>
                <Descriptions.Item label="Platform">{this.state.osInfo.platform()}</Descriptions.Item>
                <Descriptions.Item label="Release">{this.state.osInfo.release()}</Descriptions.Item>
                <Descriptions.Item label="Arch">{this.state.osInfo.arch()}</Descriptions.Item>
                <Descriptions.Item label="Username">{this.state.osInfo.userInfo().username}</Descriptions.Item>
                <Descriptions.Item label="CPUs Core">{this.state.osInfo.cpus().length}</Descriptions.Item>
                <Descriptions.Item label="Homedir">{this.state.osInfo.homedir()}</Descriptions.Item>
                <Descriptions.Item label="Tmpdir">{this.state.osInfo.tmpdir()}</Descriptions.Item>
                <Descriptions.Item
                    label="Total Mem">{(this.state.osInfo.totalmem() / 1024 / 1024 / 1024).toFixed(1)} GB</Descriptions.Item>
                <Descriptions.Item label="Mac Addr">
                    {
                        this.state.macInfo.map((item, index) => {
                            return <Paragraph copyable={{text: item.mac}} key={Math.random()}><Badge
                                color={index >= this.state.colors.length - 1 ? this.state.colors[index - 1] : this.state.colors[index]}
                                status="processing" text={<strong>{item.name}</strong>}/>: <Text
                                code>{item.address}</Text> <Text code>{item.mac}</Text></Paragraph>;
                        })
                    }
                </Descriptions.Item>
            </Descriptions>
        )
    }
}

export default Info;