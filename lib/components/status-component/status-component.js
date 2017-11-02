import React from 'react'
import { Icon } from 'semantic-ui-react'
import evalExp from "../../others/eval-exp";

import SDKHOC from '../../hoc/sdk'
import DataLoaderHOC from "../../hoc/data-loader"
import dispatchEvents from '../../others/dispatcher'


import "./status-component.css";

class StatusComponent extends React.Component{

  constructor(props) {
    super(props);
    this.styles = this.props.config.position;
    this.statusMessage = "---------";
  }

  componentDidMount() {
    if(this.props.config && this.props.config.query && this.props.config.query.fetchInterval){
      this.timeInterval = 1000 * this.props.config.query.fetchInterval;
    }
    this.props.sdk.dataloader.fetchData();
  }

  componentWillUnmount() {
    clearTimeout( this.__timeerId );
  }

  getStatusMessage() {
    var msg = this.statusMessage;
    let dataloader = this.props.sdk.dataloader;
    let config = this.props.config;
    let query = config.query;

    if(dataloader.error){
      msg = "API Error";
      if(query.onError && query.onError.dispatchEvent){
        dispatchEvents(query.onError.dispatchEvent, dataloader.errorData, dataloader.errorData);
      }
    }else if(dataloader.success){
      if(config.statusMessages){
        let i, statusObj, jsExpression;
        for(i=0; i<config.statusMessages.length; i++){
          statusObj = config.statusMessages[i];
          jsExpression = statusObj.if || "";
          if( jsExpression && evalExp( jsExpression, dataloader.data ) ){
            msg = statusObj.message;
            break;
          }
        }
      }
      if(query.onSuccess && query.onSuccess.dispatchEvent){
        dispatchEvents(query.onSuccess.dispatchEvent, dataloader.data, dataloader.data);
      }
    }

    // keep chekcing for the status at every certain interval specified
    if( (dataloader.error || dataloader.success) && this.timeInterval){
      clearTimeout( this.__timeerId );
      let self = this;
      this.__timeerId = setTimeout( function() {
        self.props.sdk.dataloader.fetchData();
      }, this.timeInterval );
    }

    return msg;
  }

  render(){
    let dataloader = this.props.sdk.dataloader;
    this.statusMessage = this.getStatusMessage();

    if(this.props.config.hide)
      return null;

    return (
        <div className="status-component" style={this.styles}>
          <span> { this.props.config.message }</span>
          <span> { this.statusMessage } </span>
          { dataloader.loading ? <Icon loading name='spinner' className="loader-icon" /> : null }
        </div>
    )
  }

}

export default SDKHOC( DataLoaderHOC( StatusComponent ) )
