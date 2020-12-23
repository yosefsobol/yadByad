import React, { Component } from 'react';
import "./ImgFiles.css";

class ImgFiles extends Component {
    Display = () => {
        this.props.Display()
    }

    render() {
        return (
            <div className='DivFiles'>
                <button className='ButtonFiles' onClick={this.Display}>סגירה</button>
                <img className='ImgFiles' src={this.props.ImgFiles} alt={this.props.ImgFiles}></img>
            </div>
        );
    }
}

export default ImgFiles;