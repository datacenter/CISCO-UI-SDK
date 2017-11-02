import React, { Component } from 'react'
import {  Menu } from 'semantic-ui-react'

export default (props) => (
  <Menu className={props.className} >
    <Menu.Menu position="right">
      {
        props.tabs.map((tabItem, tabItemIndex) => (
          <Menu.Item key={tabItemIndex} id={tabItemIndex} name={tabItem.name || 'Tab-'+(tabItemIndex+1)}
            active={props.tabIndex === tabItemIndex}
            onClick={props.onTabSelectionChanged} />
        ))
      }
    </Menu.Menu>
  </Menu>
)
