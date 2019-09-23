import React, {Component} from 'react';
import Logo from './logo/Logo';
import Text from './text/Text';
import Copyright from '../Copyright';


class Index extends Component {

    render() {
        return (
            <div>
                <Text/>
                <Logo/>
                <Copyright/>
            </div>
        )
    }
}

export default Index;