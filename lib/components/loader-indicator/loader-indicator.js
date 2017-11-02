import React from 'react'
import { Container, Dimmer, Loader, Icon } from 'semantic-ui-react'

import './loader-indicator.css';

const LoaderIndicator = (props) => {

  if(!props.loading && !props.error){
    return null;
  }

  return(
    <div className="loader-indicator">
      {
        props.loading ?
        (<Loader className="loading-bar" size="large" inline='centered' content={ props.message || "Submitting..." } />) :
        (props.error ?
          (<div className="loader-error-message">
            <div className="message">{props.message || "Error in API Call"}</div>
          </div>) :
        null)
      }
      { props.loading ? null : <Icon link name='close' className="closeIcon" onClick={props.onClose}/>}
    </div>
  )
};

export default LoaderIndicator
