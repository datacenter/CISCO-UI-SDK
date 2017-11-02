import React from 'react';
import { Container, Image } from 'semantic-ui-react'
import "./header.css";

export default function Header(props){
  return (
    <div className="header">
      <div style={{"margin": "10px 0px"}}>
        <Image className="infoblox-logo" src='./images/infoblox.png' />
      </div>
    </div>
  );
}
