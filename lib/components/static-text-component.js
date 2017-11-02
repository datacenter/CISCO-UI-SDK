import React, { Component } from 'react'
import {  Menu } from 'semantic-ui-react'
import SDKHOC from "../hoc/sdk"
import evalExp from "../others/eval-exp"


const StaticTextComponent =  (props) => {
    return (
      <div>
        { evalExp(props.config.text, props.sdk.eventData) }
      </div>
    )
}

export default SDKHOC( StaticTextComponent )
