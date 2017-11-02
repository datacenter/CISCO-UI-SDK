import React from 'react'
import { Icon } from 'semantic-ui-react'
import SDKHOC from '../hoc/sdk'
import EventListenerHOC from '../hoc/event-listener';
import DataLoaderHOC from "../hoc/data-loader"
import semanticDefaults from "../others/semantic-defaults"


class IconComponent extends React.Component{

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
    let {name, __configName, onClick, position, ...rest} = this.props.config
    let defaultOptions = semanticDefaults["icon"];
    let style= Object.assign({}, {
      "cursor": "pointer",
      "position": "absolute"
    }, position);

    return (
      <div style={{"position":"relative"}}>
        <Icon style={style}
          name={name}
          onClick={this.handleClick}
          {...defaultOptions}
          {...rest}
        />
        { this.props.sdk.listener.getContent() }
      </div>
    )
  }

}

export default SDKHOC( EventListenerHOC ( DataLoaderHOC( IconComponent ) ) )
