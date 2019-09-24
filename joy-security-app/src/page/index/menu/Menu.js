import React, {Component} from 'react';
import {Button, Dropdown, Icon, Menu} from "antd";
import './menu.css'

const electron = window.electron;
const {app} = electron.remote;

class Drag extends Component {

    render() {
        return (
            <div className="menu">
                <Dropdown overlay={
                    <Menu>
                        <Menu.Item>
                            <a href onClick={() => electron.ipcRenderer.send('check-update')}>
                                <Icon type="to-top" /> 检查更新
                            </a>
                        </Menu.Item>
                        <Menu.Item disabled>
                            <a href onClick={() => {}}>
                                <Icon type="info" /> 关于
                            </a>
                        </Menu.Item>
                    </Menu>
                }>
                    <Button ghost shape="circle" icon="menu" type="link"/>
                </Dropdown>
                <Button ghost shape="circle" icon="line" type="link" onClick={() => electron.remote.getCurrentWindow().minimize()}/>
                <Button ghost shape="circle" icon="close" type="link" onClick={() => app.quit()}/>
            </div>
        )
    }
}

export default Drag;