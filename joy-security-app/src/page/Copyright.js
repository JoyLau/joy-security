import React, {Component} from 'react';
import config from "../../config"


class Copyright extends Component {

    render() {
        return (
            <div style={{position: 'absolute', bottom: '5px',left: '45%', textAlign: 'center', fontWeight: 'lighter',color: 'white'}}>{config.copyright}</div>
        )
    }
}

export default Copyright;