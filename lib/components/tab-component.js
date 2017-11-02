import React, { Component } from 'react'
import {  Grid, Segment } from 'semantic-ui-react'

import { getCompLayout, getGridContent } from '../others/grid-util'
import getComponent from '../others/comp-util'
import MenuComponent from "./menu-component"
import SDKHOC from '../hoc/sdk'
import EventListenerHOC from '../hoc/event-listener';

class TabComponent extends Component {

  constructor(props) {
    super(props);
    this.onTabSelectionChanged = this.onTabSelectionChanged.bind(this);
    this.state = {
      currentTabIndex: 0
    };
  }

  onTabSelectionChanged(e, elem) {
    let tabIndex = elem.id;
    if( this.state.currentTabIndex !== tabIndex ){
      let self = this;
      setTimeout( () => self.setState({ currentTabIndex: tabIndex }) )
    }
  }

  getTabContent() {
    if(this.state.currentTabIndex === -1){
      return null;
    }
    let activeTab = this.props.config.tabs[ this.state.currentTabIndex ];
    activeTab = JSON.parse( JSON.stringify(activeTab) )

    setTimeout( () => {
      let tabContainer = document.getElementById("tab-content");
      if(tabContainer){
        let bbrect = tabContainer.getBoundingClientRect();
        tabContainer.style.maxHeight = window.outerHeight - bbrect.top - tabContainer.offsetTop + 40 + "px";
      }
    })

    return (
      <div>
        <div> { activeTab.title } </div>
        { getGridContent(activeTab.content) }
      </div>
    );

  }

  render() {

    return (
      <div>
        {/* Tabs Menu  */}
        <MenuComponent {...this.props.config}
          tabIndex={this.state.currentTabIndex}
          onTabSelectionChanged={this.onTabSelectionChanged}/>

        {/* Active Menu's Content  */}
        <Segment attached='bottom' id="tab-content" className='containerScroll '> { this.getTabContent() } </Segment>

        { this.props.sdk.listener.getContent() }
      </div>
    )
  }
}

export default SDKHOC( EventListenerHOC ( TabComponent ) )
