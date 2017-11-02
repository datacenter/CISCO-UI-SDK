import React from 'react'
import { Button } from 'semantic-ui-react'
import SDKHOC from '../hoc/sdk'
import EventListenerHOC from '../hoc/event-listener';
import DataLoaderHOC from "../hoc/data-loader"


class ButtonComponent extends React.Component{

  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    let config = this.props.config;
    if( config.onClick ){
      if( config.onClick.dispatchEvent ){
        this.props.sdk.listener.publishEvents(config.onClick.dispatchEvent)
      }
      if( config.onClick.action ){
        this.props.sdk.listener.handleActions(config.onClick.action)
      }
    }
  }

  render(){
    let config = this.props.config
    return (
      <div>
        <Button id={config.id} color={config.color} onClick={this.handleClick}>
          { config.label }
        </Button>
        { this.props.sdk.listener.getContent() }
      </div>
    )
  }

}

export default SDKHOC( EventListenerHOC ( DataLoaderHOC( ButtonComponent ) ) )
