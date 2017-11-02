import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import _i_actionHandler from '../others/action-handler'
import _i_dispatchEvents from '../others/dispatcher'
import evalExp from "../others/eval-exp"

import getComponent from '../others/comp-util'

const EventListenerHOC = function(ReactComponent) {

  return class _EventListenerHOC extends Component {

    constructor(props){
      super(props);
      this.isUnmounted = false;
      this.listeners = [];
      this.publishEvents = this.publishEvents.bind(this);
      this.handleActions = this.handleActions.bind(this);
      this.getContent = this.getContent.bind(this);
      this.removeMeFromParent = this.removeMeFromParent.bind(this);
      this.addToParent = this.addToParent.bind(this);
      this.state = {content: props.config.content || [] };
      this.updateTimer = null;
    }

    componentDidMount() {
      this.isUnmounted = false;
      this.registerEvents(this.props.config.listenFor);
      if(this.props.config.onLoad && this.props.config.onLoad.dispatchEvent){
        this.publishEvents(this.props.config.onLoad.dispatchEvent);
      }
      if(this.props.config.onLoad && this.props.config.onLoad.action){
        this.handleActions(this.props.config.onLoad.action);
      }
    }

    registerEvents(events) {
      if(!events) return;

      if( !(events instanceof Array) ){
        events = [events];
      }

      let self = this;
      events.map( event => {
        let listenerId
        if(typeof event.name === "string"){
          listenerId = PubSub.subscribe( event.name, function(evtInfo, eventData){
            // console.log(" recieved action :: ", evtInfo, eventData, self.props.parentContext);
            self.handleActions( event.action, eventData );
          } );
          // catpuring all the listener ids which will be used to unregister before unmounting/destroy
          self.listeners.push(listenerId);
        }else if(event.name instanceof Array){
          for(let i=0; i<event.name.length; i++){
            listenerId = PubSub.subscribe( event.name[i], function(evtInfo, eventData){
              // console.log(" recieved action :: ", evtInfo, eventData, self.props.parentContext);
              self.handleActions( event.action, eventData );
            } );
            // catpuring all the listener ids which will be used to unregister before unmounting/destroy
            self.listeners.push(listenerId);
          }
        }


      } )
    }

    unregisterEvents() {
      for(let i=0; i<this.listeners.length; i++){
        PubSub.unsubscribe( this.listeners[i] );
      }
      this.listeners = null;
    }

    handleActions(actions, eventData) {
      // get the new content based on actions specified & update the state if required
      var newContent = _i_actionHandler( actions, this.state.content, eventData );
      if( this.state.content !== newContent ){
        this.setState({content: newContent});
      }

      if(actions && !(actions instanceof Array)){
        actions = [actions];
      }
      if(!actions || !actions.length) return;
      for(var i=0; i<actions.length; i++){
        if(actions[i].name === "SDK.ACTION.FETCH_DATA" || actions[i].name === "SDK.ACTION.REFRESH_DATA"){
          let paramContext = {};
          let query = this.props.config.query || this.props.config.onSubmit.query;
          if(query.params){
            for(let param in query.params){
              paramContext[param] = evalExp( query.params[param], this.props.parentContext )
            }
          }

          this.props.sdk.dataloader.fetchData(paramContext)
        }else if(actions[i].name === "SDK.ACTION.REDIRECT"){
          if(actions[i].redirectTo !== undefined){
            this.props.sdk.redirectTo( actions[i].redirectTo )
          }
        }
      }
    }

    publishEvents(events, eventData, eventExpressionContext) {
      _i_dispatchEvents(events, eventData, eventExpressionContext);
    }

    removeMeFromParent(components) {
      // console.log(" removeMeFromParent ", components);
      if(!(components instanceof Array)){
        components = [components];
      }
      if(!components || !components.length) return;

      let i, compIndex, newContent = this.state.content;
      for(i=0; i<components.length; i++){
        compIndex = newContent.indexOf( components[i] );
        if(compIndex == -1){
          for(let j=0; j<newContent.length; j++){
            if(typeof newContent[j] !== "string"){
              if(newContent[j].__type==="eventDriven" && (newContent[j].originalComponent === components[i] || newContent[j].originalComponent.__configName === components[i])){
                  compIndex = j;break;
              }else if( newContent[j].__configName === components[i]){
                compIndex = j;break;
              }
            }
          }
        }
        if( compIndex !== -1 ){
          newContent.splice( compIndex, 1 );
        }
      }
      this.setState({content: newContent});
    }

    addToParent(components) {
      if(!(components instanceof Array)){
        components = [components];
      }
      if(!components || !components.length) return;

      let newContent = this.state.content.concat( components );
      this.setState({"content": newContent});
    }

    getContent() {
      let content = this.state.content;
      let data = content.map( (compDef, compIndex) => (
        getComponent( compDef, compIndex, {removeMeFromParent: this.removeMeFromParent} )
      ) );
      return data;
    }

    componentWillUnmount() {
      this.isUnmounted = true;
      this.unregisterEvents();
    }

    render() {
      if(this.isUnmounted){
        return null;
      }

      const config = {
        publishEvents: this.publishEvents,
        handleActions: this.handleActions,
        content: this.state.content,
        getContent: this.getContent,
        removeMeFromParent: this.removeMeFromParent,
        addToParent: this.addToParent
      };

      let props = this.props;
      props.sdk.listener = config

      return ( <ReactComponent {...props} /> )
    }
  }
}

export default EventListenerHOC;
