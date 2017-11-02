import React, { Component } from 'react'
import { cloneObj } from '../others/util'
import { processGQL } from '../others/query-util'
import evalExp from "../others/eval-exp"

const errorMsg = "Got error while processing your request";
const successMsg = "Your reuest is processed successfully";
const progressMsg = "Please wait, your request is in progress";


const DataLoaderHOC = function(WrappedComponent) {

  return class DataLoaderHOCCC extends Component {

    constructor(props){
      super(props);
      this.fetchData = this.fetchData.bind(this);

      this.state = {
        loading: false,
        error: false,
        success: false,
        data: null,
        errorData: null
      }
    }

    getMessage(msgConfig, contextData) {
      if(!msgConfig || !msgConfig.displayMessage) return;
      let messages = msgConfig.displayMessage;
      let msg, message, jsExpress;

      if(!( messages instanceof Array) ){
        messages = [messages];
      }

      for(let i=0; i<messages.length; i++){
        message = messages[i];
        jsExpress = message.if;
        if(!jsExpress){
          msg = message.message;
          break;
        }else if( evalExp( jsExpress,  contextData) ){
          msg = evalExp(message.message, contextData) ;
          break;
        }
      }

      return msg;
    }

    fetchData(queryParamsContext, queryInfo){

      let self = this;
      let message = "";
      let query = queryInfo || this.props.config.query;

      message = this.getMessage(query.onProgress, {});
      self.setState({loading: true, error: false, success: false, "message": message});

      processGQL(query.config, queryParamsContext).then(function(gqlData){
        if(self.isUnmounted) return;

        if(query.dataAs){
          gqlData = gqlData[query.dataAs];
        }
        message = self.getMessage(query.onSuccess, gqlData);
        self.setState({loading: false, error: false, success: true, data: gqlData, "message": message});
      }, function(errorData){
        if(self.isUnmounted) return;
        message = self.getMessage(query.onError, errorData);
        self.setState({loading: false, error: true, success: false, "message": message, rrorData: errorData});
      })
    }

    componentWillUnmount() {
      this.isUnmounted = true;
    }

    render() {
      if(this.isUnmounted) return null;
      
      let props = this.props;
      props.sdk.dataloader = {
        ...this.state,
        fetchData: this.fetchData
      };

      return (
        <WrappedComponent {...props} />
      )
    }
  }
}

export default DataLoaderHOC
