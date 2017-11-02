import React, { Component } from 'react'
import { Grid, Menu, Header, Button, Modal} from 'semantic-ui-react'
import LoaderIndicator from './loader-indicator/loader-indicator'
import { FormParserHOC } from '../hoc/form-parser';
import dispatchEvents from '../others/dispatcher'
import FormComponent from "./form-component"
import SDKHOC from '../hoc/sdk'
import DataLoaderHOC from "../hoc/data-loader"
import evalExp from "../others/eval-exp"
import _i_actionHandler from '../others/action-handler'

let __compCounter = 0;

class FormContainer extends Component {

  constructor(props) {
    super(props);

    this.onClosingLoaderIndicator = this.onClosingLoaderIndicator.bind(this);
    this.onCancelModal = this.onCancelModal.bind(this);
    this.onClosingModalOnSuccess = this.onClosingModalOnSuccess.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);

    this.name = props.config.name || ("SDK_FORM_COMPONENT_" + __compCounter++);
    this.state = {
        isModalClosed: false,
        isLoadingIndicatorClosed: false,
        formData: {
        [this.name]: {}
      }
    };
  }

  componentDidMount() {
    let formData = {};
    let controls = this.props.config.controls;
    let formItem;
    for(let i=0; i<controls.length; i++){
      formItem = controls[i];
      if(formItem.name && formItem.type1 !== "button"){
        formData[ formItem.name ] = formItem.value || formItem.defaultValue;
      }
    }
    this.setState({
      "formData": {
        [this.name]: formData
      }
    })
  }

  onInputChange(inputName, inputValue) {
    this.setState({
      "formData": {
        [this.name]: {
          ...this.state.formData[this.name],
          [inputName]: inputValue
        }
      }
    })
  }

  isFormInvalid() {
    let formData = this.state.formData[this.name];
    for(let prop in formData){
      if( formData[prop] === undefined || formData[prop] === null || formData[prop] === "" ){
        window.alert("Invalid form. Please provide valid data for all fields")
        return true;
      }
    }
    return false;
  }

  onButtonClick(e, btnConfig) {
    let btnAction = btnConfig.onClick;
    if(typeof btnAction === "string" && btnAction === "CLOSE_FORM"){
      this.onCancelModal();
    }else if(typeof btnAction === "string" && btnAction === "SUBMIT_FORM"){
      this.submitForm();
    }

    if(btnConfig.onClick && btnConfig.onClick.action){
      this.handleActions(btnConfig.onClick.action)
    }
  }

  submitForm() {
    if(this.isFormInvalid()) return;

    if(!this.props.config.onSubmit || !this.props.config.onSubmit.query) return;

    let paramContext = {};
    let submitQuery = this.props.config.onSubmit.query;
    if(submitQuery.params){
      for(let param in submitQuery.params){
        paramContext[param] = evalExp( submitQuery.params[param], this.state.formData )
      }
    }
    this.setState({ isLoadingIndicatorClosed: false });
    this.props.sdk.dataloader.fetchData(paramContext, submitQuery);
  }

  onCancelModal() {
    let hasRedirection = false;
    if(this.props.sdk.dataloader.error){
      let submitQuery = this.props.config.onSubmit.query;
      if(submitQuery.onError && submitQuery.onError.dispatchEvent){
        dispatchEvents(submitQuery.onError.dispatchEvent, this.props.sdk.dataloader.errorData, this.props.sdk.dataloader.errorData)
      }
      if(submitQuery.onError && submitQuery.onError.action){
        hasRedirection = this.handleActions(submitQuery.onError.action)
      }
    }
    if(!hasRedirection){
      this.onFormClose();
    }

  }

  onClosingLoaderIndicator() {
    this.setState({ isLoadingIndicatorClosed: true });
  }

  onClosingModalOnSuccess() {
    let hasRedirection = false;
    let submitQuery = this.props.config.onSubmit.query;
    if(submitQuery.onSuccess && submitQuery.onSuccess.dispatchEvent){
      dispatchEvents(submitQuery.onSuccess.dispatchEvent, this.props.sdk.dataloader.data, this.props.sdk.dataloader.data)
    }
    if(submitQuery.onSuccess && submitQuery.onSuccess.action){
      hasRedirection = this.handleActions(submitQuery.onSuccess.action)
    }

    if(!hasRedirection){
      this.onFormClose();
    }
  }

  handleActions(actions) {
    if(actions && !(actions instanceof Array)){
      actions = [actions];
    }
    if(!actions || !actions.length) return;
    for(var i=0; i<actions.length; i++){
      if(actions[i].name === "SDK.ACTION.REDIRECT"){
        if(actions[i].redirectTo !== undefined){
          this.props.sdk.redirectTo( actions[i].redirectTo )
          return true;
        }
      }
    }
  }

  onFormClose() {
    if(typeof this.props.removeMeFromParent === "function"){
      this.props.removeMeFromParent(this.props.__configName);
    }
  }

  render() {
    if(this.state.isModalClosed) return null;
    let dataloader = this.props.sdk.dataloader;

    return (
      <Modal open={true} closeOnDimmerClick={false} onClose={this.onCancelModal} size="small" closeIcon='close'>
        <Header icon='sign in' content={this.props.config.title} />
        <Modal.Content>
          <FormComponent {...this.props}
            onInputChanged={this.onInputChange}
            formData={ this.state.formData[this.name] }
            onButtonClicked={this.onButtonClick}
            name={this.name}/>
        </Modal.Content>
        {
          this.state.isLoadingIndicatorClosed ? null : (
              <LoaderIndicator message={ dataloader.message }
                loading={dataloader.loading}
                error={dataloader.error} onClose={this.onClosingLoaderIndicator} />
            )
        }

        {
          dataloader.success ?
            (<div className="loader-indicator">
              <div className="message">
                <div> { dataloader.message } </div>
                <br />
                <Button color="blue" onClick={this.onClosingModalOnSuccess}> Ok  </Button>
              </div>
            </div>) : null
        }
      </Modal>
    )
  }
}

export default SDKHOC( DataLoaderHOC( FormParserHOC(FormContainer) ) );
