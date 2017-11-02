import PubSub from 'pubsub-js'
import evalExpression from "./eval-exp"


export default function(events, eventData, eventExpressionContext) {
  if(!events) return;
  if( ! (events instanceof Array)  ) {
    events = [events];
  }

  let i, event, jsExpression;
  for(i=0; i<events.length; i++){
    event = events[i];
    jsExpression = event.if;
    if( jsExpression ){
      if( evalExpression(jsExpression, eventExpressionContext) ){
          // console.log( " dispatch event :: ", event.name );
          publishEvent(event.name, event.data || eventData);
      }else{
        // console.log( "DO NOT dispatch event :: ", event.name );
      }
    }else{
      // console.log( " dispatch event :: ", event.name );
      publishEvent( event.name, event.data || eventData);
    }
  }
}

function publishEvent(events, eventData) {
  if(typeof events === "string"){
    PubSub.publish( events, eventData );
  }else if(events instanceof Array){
    for(let i=0; i<events.length; i++){
      PubSub.publish( events[i], eventData );
    }
  }
}
