import React, { Component } from 'react'
import { processGQL } from '../others/query-util'

function parseFormConfig(srcConfig){
  const config = Object.assign( {}, srcConfig );
  config.controls = config.content;
  delete config.content;
  for(let i=0; i<config.controls.length; i++){
    config.controls[i].type = getControlType(config.controls[i]);
  }
  return config;
}

function getControlType(formControl) {
  switch (formControl.type) {
    case "textbox":
      return "text"; break;
    case "encrypted_textbox":
      return "password"; break;
    case "textbox":
      return "text"; break;
    default:
      return formControl.type; break;
  }
}

export const FormParserHOC = function(ReactComponent) {
  return (props) => {
    const config = parseFormConfig(props.config);
    return (
      <ReactComponent {...props} config={config} />
    )
  }
}
