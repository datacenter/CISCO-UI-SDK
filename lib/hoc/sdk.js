import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

export default function(WrappedComponent) {

  return class extends Component {

    constructor(props){
      super(props);

      this.redirectTo = this.redirectTo.bind(this);
      this.sdk = { redirectTo: this.redirectTo };

      this.state = {
        shouldRedirect: false,
        redirectTo: ""
      };
    }

    redirectTo(urlPath) {
      this.setState({shouldRedirect:true, redirectTo: urlPath});
    }

    render() {
      let {sdkEventData, ...rest} = this.props;
      this.sdk.eventData = sdkEventData;

      if(this.state.shouldRedirect)
        return (<Redirect to={this.state.redirectTo} />);

      return (
        <div>
          <WrappedComponent sdk={this.sdk} {...rest} />
        </div>
      )
    }
  }
}
