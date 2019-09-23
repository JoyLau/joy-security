import React, {Component} from 'react';
import Texty from 'rc-texty';
import TweenOne from 'rc-tween-one';
import 'rc-texty/assets/index.css';
import './text.css';

class Text extends Component {
    state = {
        show: true,
        flash: true,
        flashDelay: 3800
    };
    geInterval = (e) => {
        switch (e.index) {
            case 0:
                return 0;
            case 1:
                return 150;
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                return 150 + 450 + (e.index - 2) * 10;
            default:
                return 150 + 450 + (e.index - 6) * 150;
        }
    };
    getEnter = (e) => {
        const t = {
            opacity: 0,
            scale: 1,
            y: '-100%',
        };
        if (e.index  === 0 || e.index === 4) {
            return { ...t, y: '-30%', duration: 1500 };
        }
        return t;
    };

    getSplit = (e) => {
        const t = e.split(' ');
        const c = [];
        t.forEach((str, i) => {
            c.push((
                <span key={`${str}-${i}`}>{str}</span>
            ));
            if (i < t.length - 1) {
                c.push(<span key={` -${i}`}> </span>);
            }
        });
        return c;
    };

    onClick = () => {
        this.setState({
            show: false,
        }, () => {
            this.setState({
                show: true
            });
        });
    };

    componentDidMount() {
        let that = this;
        setTimeout(function () {
            setInterval(function () {
                let flash = that.state.flash;
                that.setState({
                    flash: !flash,
                    flashDelay: 0
                })
            },2000)
        },6000)
    }

    render() {
        return (
            <div className="combined-wrapper">
                {/*<div style={{zIndex:100}} className="combined-reload">
                    <Button shape="circle" icon="reload" onClick={this.onClick} />
                </div>*/}
                {this.state.show && (
                    <div className="combined">
                        <div className="combined-shape">
                            <div className="shape-left">
                                <TweenOne
                                    animation={[
                                        { x: 200, type: 'from', ease: 'easeInOutQuint', duration: 600 },
                                        { x: -200, ease: 'easeInOutQuart', duration: 450, delay: -150 },
                                    ]}
                                />
                            </div>
                            <div className="shape-right">
                                <TweenOne
                                    animation={[
                                        { x: -200, type: 'from', ease: 'easeInOutQuint', duration: 600 },
                                        { x: 200, ease: 'easeInOutQuart', duration: 450, delay: -150 },
                                    ]}
                                />
                            </div>
                        </div>
                        <Texty
                            className="title"
                            type="mask-top"
                            delay={400}
                            enter={this.getEnter}
                            interval={this.geInterval}
                            component={TweenOne}
                            componentProps={{
                                animation: [
                                    { x: 130, type: 'set' },
                                    { x: 100, delay: 500, duration: 450 },
                                    {
                                        ease: 'easeOutQuart',
                                        duration: 300,
                                        x: 0,
                                    },
                                    {
                                        letterSpacing: 0,
                                        delay: -300,
                                        scale: 0.9,
                                        ease: 'easeInOutQuint',
                                        duration: 1000,
                                    },
                                    { scale: 1, width: '100%', delay: -300, duration: 1000, ease: 'easeInOutQuint' },
                                ],
                            }}
                        >
                            MAC Security
                        </Texty>
                        <TweenOne
                            className="combined-bar"
                            animation={{ delay: 2000, width: 0, x: 158, type: 'from', ease: 'easeInOutExpo' }}
                        />
                        <Texty
                            className="content"
                            type="bottom"
                            split={this.getSplit}
                            delay={2200}
                            interval={80}
                        >
                            Provide security certification for your system products using Docm.
                        </Texty>

                        <Texty
                            className="wait-content"
                            type="alpha"
                            split={this.getSplit}
                            delay={this.state.flashDelay}
                            interval={80}
                        >
                            {this.state.flash && 'Waiting for the request . . . . . .'}
                        </Texty>
                    </div>
                )}
            </div>
        );
    }
}

export default Text;