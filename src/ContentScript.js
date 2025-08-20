import React from 'react';
import ReactDOM from 'react-dom';
import MicrophoneIcon from './MicrophoneIcon';
import './MicrophoneIcon.css'

function injectMicrophoneIcon() {
  const sfContainer = document.getElementsByClassName('css-njhh6c');//css-vtikxo
  const container = document.createElement('div');
  container.classList.add('center-div');
  sfContainer[0].appendChild(container);
  ReactDOM.render(<MicrophoneIcon />, container);
}

injectMicrophoneIcon();