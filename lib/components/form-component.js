import React, { Component } from 'react'
import { Grid, Menu, Header, Button, Modal, Form, Select,Checkbox } from 'semantic-ui-react'
import DropdownContainer from './dropdown-container'
import getComponent from '../others/comp-util'


let __compCounter = 0;

class FormComponent extends Component {

  constructor(props) {
    super(props);
    __compCounter++;

    this.getFormComponent = this.getFormComponent.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onDDChange = this.onDDChange.bind(this);
  }

  onInputChange(e, compDef) {
    let val = e.target.value;
    let name = compDef.name;
    this.props.onInputChanged(name, val);
  }

  onButtonClick(e, compDef) {
    if(!compDef.onClick) return;
    this.props.onButtonClicked( e, compDef );
  }

  onDDChange(ddValue, ddName) {
    console.log(" onDDChange ");
    this.props.onInputChanged(ddName, ddValue);
  }

  getFormComponent(compDef, compIndex) {
    let comp = null;
    let formData = this.props.formData || {};

    switch (compDef.type) {
      case "text":
      case "file":
      case "password":
        comp = <Form.Field key={compIndex} control='input' type={compDef.type}
          label={compDef.label} placeholder={compDef.placeholder}
          value={formData[compDef.name]}
          onChange={(e) => this.onInputChange(e, compDef) }/>
        break;
      case "select":
      case "dropdown":
        comp = <DropdownContainer key={compIndex} config={compDef} value={formData[compDef.name]} onChange={this.onDDChange} parentContext={ {[this.props.name]: formData} }/>
        break;
      case "checkbox":
        comp = <Form.Field key={compIndex} control={Checkbox} label={compDef.label}
          placeholder={compDef.placeholder}
          value={formData[compDef.name]}
          onChange={(e) => this.onInputChange(e, compDef) }/>
        break;
      case "button":
        comp = <Button type="button" className="pull-right marginBtm10" onClick={(e) => this.onButtonClick(e, compDef)}
                  key={compIndex} color={compDef.color} > {compDef.label}  </Button>
        break;
      default:
        comp = getComponent(compDef, compIndex);
        break;
    }

    return comp;
  }

  render() {
    return (
      <Form>
        <Form.Group grouped>
           {this.props.config.controls.map( this.getFormComponent )}
        </Form.Group>
      </Form>
    )
  }
}

export default FormComponent
