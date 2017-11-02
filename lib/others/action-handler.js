import PubSub from 'pubsub-js'

export default function(actions, content, eventData) {
  if(!actions) return content;
  if( !(actions instanceof Array) ){
    actions = [actions]
  }

  let newContent = [].concat(content) ;
  actions.map( action => {
    switch(action.name){
      case "SDK.ACTION.ADD_COMPONENT":
        addComponents(newContent, action.component, eventData); break;
      case "SDK.ACTION.REMOVE_COMPONENT":
        removeComponents(newContent, action.component, eventData); break;
    }
  } );

  return newContent;
}

function addComponents(contentList, component, eventData) {
  if(component instanceof Array){
    for(let i=0; i<component.length; i++){
      addComponent(contentList, component[i], eventData);
    }
  }else {
    addComponent(contentList, component, eventData);
  }
}

function removeComponents(contentList, component) {
  if(component instanceof Array){
    for(let i=0; i<component.length; i++){
      removeComponent(contentList, component[i]);
    }
  }else {
    removeComponent(contentList, component);
  }
}

function addComponent(contentList, component, eventData){
  contentList.push( {
    __type: "eventDriven",
    originalComponent: component,
    eventData: eventData
  } );
}

function removeComponent(contentList, component) {
  let indx = contentList.indexOf( component );
  if(indx === -1){
    for(let i=0; i<contentList.length; i++){
      if(contentList[i].__type === "eventDriven" && (contentList[i].originalComponent === component || contentList[i].originalComponent.__configName === component)){
        indx = i; break;
      }
    }
  }
  if( indx !== -1 ){
    contentList.splice( indx, 1 );
  }
}
