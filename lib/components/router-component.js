import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import getComponent from "../others/comp-util"


let __compCounter = 0;

function RComp(props){
  return (
    getComponent(props.component)
  )
}

const RouterComponent = (props) => {
  __compCounter++
  if(__compCounter > 1){
    throw new Error("SDK ERROR :: Creating multiple router components :: Please use only one Router component per application");
  }

  return (
    <Router>
      <div>
        {
          props.config.content.map( (routerconfig, routerIndex) => (
            <Route exact key={routerIndex} path={routerconfig.path}
              render={ () => <RComp component={routerconfig.component} /> } />
          ) )
        }
      </div>
    </Router>
  )
};

export default RouterComponent
