import React, { Component } from 'react';
import './Chart.css';

class Chart extends Component {
    componentDidMount() {
        window.chartInit(this.props.data, this.props.onItemClick);
    }

    render() {
        return (
            <div className="container">
                <div className="scaling-svg-container">
                    <svg id="radar" className="scaling-svg" viewBox="0 0 1000 1000">
                        <defs>
                            <linearGradient id="MyGradient">
                                <stop offset="5%"  stopColor="#e8e5df"/>
                                <stop offset="70%" stopColor="#FFFFFF"/>
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>
        );
    }
}

export default Chart;
