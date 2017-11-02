import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'
import SDKHOC from '../hoc/sdk'
import EventListenerHOC from '../hoc/event-listener';
import DataLoaderHOC from "../hoc/data-loader"
import { getCompLayout, getGridContent } from '../others/grid-util'


class PageComponent extends Component {

  render() {
    let pageOptions = {
       fluid: this.props.config.fluid || false
    };

    return (
      <Container {...pageOptions}>
        <div> { this.props.config.title } </div>
        {/* { getGridContent(this.props.sdk.listener.content) } */}
        { this.props.sdk.listener.getContent() }
      </Container>
    )
  }
}

export default SDKHOC( EventListenerHOC ( PageComponent ) )
