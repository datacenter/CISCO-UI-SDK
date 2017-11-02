import React from 'react'
import { Container, Dimmer, Loader, Icon } from 'semantic-ui-react'
import dispatchEvents from '../../others/dispatcher'
import SDKHOC from '../../hoc/sdk'
import DataLoaderHOC from "../../hoc/data-loader"
import "./query-loader.css";


let __compCounter = 0;

class QueryLoaderComponent extends React.Component{
  constructor(props){
    super(props);

    this.onCloseLoader = this.onCloseLoader.bind(this);
    this.__compId = ( "SDK_CHART_CONTAINER_" + __compCounter++ );
  }

  componentDidMount() {
    this.props.sdk.dataloader.fetchData(this.props.config.queryParamsContext);
  }

  componentWillReceiveProps(nextProps){
    let dataloader = nextProps.sdk.dataloader;
    let query = nextProps.config.query;
    if(dataloader.success && (!query.onSuccess || !query.onSuccess.displayMessage)){
      this.onCloseLoader();
    }
    if(dataloader.error && (!query.onError || !query.onError.displayMessage)){
      this.onCloseLoader();
    }
  }

  onCloseLoader() {
    let query = this.props.config.query;
    let dataloader = this.props.sdk.dataloader;
    if(dataloader.success){
      if(query.onSuccess && query.onSuccess.dispatchEvent){
        dispatchEvents(query.onSuccess.dispatchEvent, dataloader.data, dataloader.data);
      }
    }else if(dataloader.error){
      if(query.onError && query.onError.dispatchEvent){
        dispatchEvents(query.onError.dispatchEvent, dataloader.errorData, dataloader.errorData);
      }
    }

    if(typeof this.props.removeMeFromParent === "function"){
      this.props.removeMeFromParent(this.props.__configName);
    }
  }

  getContent() {
    let dataloader = this.props.sdk.dataloader;
    let query = this.props.config.query;
    if( dataloader.loading ){
      return (<Loader className="loading-bar" size="large"
        inline='centered'
        content={ dataloader.message || "Your request is in progress"} />);
    }

    return (<div className={"loader-"+(dataloader.error ? "error" : "success") +"-message"}>
     <div className="message">{dataloader.message}</div>
    </div>);
  }

  render(){
    return (
      <div className="loader-indicator" id={this.__compId} key={this.__compId}>
        { this.getContent() }
        { this.props.sdk.dataloader.loading ? null : <Icon link name='close' className="closeIcon" onClick={this.onCloseLoader}/>}
      </div>
    )
  }
}

export default SDKHOC( DataLoaderHOC( QueryLoaderComponent ) )
