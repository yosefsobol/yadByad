import React from 'react';
import './WebcamCapture.css';
import Webcam from "react-webcam";

class WebcamCapture extends React.Component {
  state = {
    img: 'https://cdn.pixabay.com/photo/2016/08/20/05/38/avatar-1606916__340.png', webcamEnabled: false,
    textButton: 'הפעל מצלמה'
  }
  componentDidMount() {
    if (this.props.Img === undefined || this.props.Img === '') { }
    else {
      this.setState({ textButton: 'צלם תמונה חדשה' })
      this.setState({ img: this.props.Img })
    }
  }
  change = () => {
    if (this.state.webcamEnabled === false) {
      this.setState({ webcamEnabled: true });
      this.setState({ textButton: 'לחץ לצילום' });

    } else {
      this.capture();
      this.setState({ webcamEnabled: false });
      this.setState({ textButton: 'צלם תמונה חדשה' });
    }
  }

  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({ img: imageSrc })
    this.props.changeImg(imageSrc)
  };
  render() {
    const videoConstraints = {
      width: 300,
      height: 250
    };
    return (
      <div className='WebcamCapture'>
        <div className='Webcam' >
          {this.state.webcamEnabled ? (
            <Webcam
              audio={false}
              ref={this.setRef}
              screenshotFormat="image/jpeg"
              minScreenshotHeight={600}
              videoConstraints={videoConstraints}
            />
          )
            : <img className='imgWebcam' src={this.state.img} alt='img' />
          }
        </div>
        <button className='buttonWebcam' type="button" onMouseDown={this.change}>{this.state.textButton}</button>
      </div>
    );
  }
}

export default WebcamCapture;