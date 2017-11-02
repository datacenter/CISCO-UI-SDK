import React from 'react'
import { Form } from 'semantic-ui-react'
import { getDDOptionsFromObjectsList, isFunction } from '../others/util'
import SDKHOC from '../hoc/sdk'
import EventListenerHOC from '../hoc/event-listener';
import DataLoaderHOC from "../hoc/data-loader"

class DropdownContainer extends React.Component{

  constructor(props){
    super(props);

    this.onChange = this.onChange.bind(this);
    this.state = {
      value: props.config.value
    }
  }

  componentDidMount() {
    if( !this.props.config.data || !this.props.sdk.dataloader.data && this.props.config.query ){
      this.props.sdk.dataloader.fetchData();
    }
  }

  onChange(e, f) {
    let value = f.value;
    if(this.props.config.multiple && this.props.config.maxOptions && value.length > this.props.config.maxOptions){
      value = value.splice(0, this.props.config.maxOptions);
    }
    this.setState({
      value: value
    });
    if( isFunction(this.props.onChange) ){
      this.props.onChange( value, this.props.config.name, f );
    }
    if( this.props.config.onChange && this.props.config.onChange.dispatchEvent ){
      this.props.sdk.listener.publishEvents(this.props.config.onChange.dispatchEvent, value);
    }
  }

  render(){
    let dataloader = this.props.sdk.dataloader;
    let config = this.props.config;
    let value = this.state.value || config.value || config.defaultValue;
    let placeholder = config.placeholder || "select a value";
    let data = dataloader.data || config.data;
    let options = [];
    let self = this;

    if(dataloader.loading){
      placeholder = "Loading data...";
      options = getDDOptionsFromObjectsList( [placeholder] );
      value = placeholder
    }else if(dataloader.error){
      placeholder = "Error...";
      options = getDDOptionsFromObjectsList( [placeholder] );
      value = placeholder
    }else if(data){
      options = getDDOptionsFromObjectsList( data, config.dataProp );
      // Setting the first option as the default value if value is not set
      if( (value === undefined || value === null || value === "") && options && options.length){
        value = options[0].value;
        setTimeout(function(){
          self.onChange({}, options[0]);
        }, 10);
      }
    }

    return (
      <div>
        <label className='formLabel'> {this.props.config.label} </label>
        <Form.Select disabled={this.props.disabled || dataloader.loading}
          error={dataloader.error}  loading={dataloader.loading}
          options={options} placeholder={placeholder} value={value}
          onChange={this.onChange} multiple={config.multiple}/>
        { this.props.sdk.listener.getContent() }
      </div>
    )
  }

}

export default SDKHOC( EventListenerHOC ( DataLoaderHOC( DropdownContainer ) ) )
