import React from 'react'
import ReactDOM from 'react-dom';

// SDK components
import ButtonComponent from '../components/button-component'
import PageComponent from '../components/page-component'
import IconComponent from '../components/icon-component'
import DropdownContainer from '../components/dropdown-container'
import TableContainer from '../components/table-container'
import TabComponent from '../components/tab-component'
import ChartContainer from '../components/chart-container'
import QueryLoaderComponent from '../components/query-loader/query-loader-component'
import StatusComponent from '../components/status-component/status-component'
import FormComponent from '../components/form-container'
import StaticTextComponent from '../components/static-text-component'
import RouterComponent from '../components/router-component'

import {compConfigLoader, queryConfigLoader} from "../aci-loader"
import {cloneObj} from "./util"

let compConfigCounter = 0;

export default (srcComp, key, props) => {
  compConfigCounter++
  let compConfig, configName, eventData;
  if( typeof srcComp === "string" ){
    configName = srcComp;
    compConfig = compConfigLoader(srcComp);
    compConfig = cloneObj ( compConfig )
  }else if( srcComp.__type === "eventDriven" ){
    if(typeof srcComp.originalComponent === "string"){
      configName = srcComp.originalComponent;
      compConfig = compConfigLoader(srcComp.originalComponent);
      compConfig = cloneObj ( compConfig )
    }else{
      compConfig = srcComp.originalComponent;
      configName = ("__comp_config_"+compConfigCounter);
      compConfig.__configName = configName;
    }
    eventData = srcComp.eventData;
  }else{
    compConfig = srcComp;
    configName = ("__comp_config_"+compConfigCounter);
    compConfig.__configName = configName;
  }


  key = key || compConfig.id || ("__comp_config__" + compConfigCounter);
  let id = compConfig.id || key;
  switch (compConfig.type) {
    case "page":
    return <PageComponent id={id} key={key} config={compConfig} {...props} __configName={configName}/>
    case "tab":
      return <TabComponent id={id} key={key} config={compConfig} {...props} __configName={configName}/>
    case "table":
      return (<TableContainer id={id}  key={key} config={compConfig} {...props} __configName={configName}/>)
    case "lineChart":
      return <ChartContainer id={id} key={key} config={compConfig} {...props} __configName={configName}/>
    case "form":
      return <FormComponent id={id} key={key} config={compConfig} {...props} __configName={configName}/>
    case "button":
      return <ButtonComponent id={id} key={key} config={compConfig} {...props} __configName={configName}/>
    case "icon":
      return <IconComponent id={id} key={key} config={compConfig} {...props} __configName={configName}/>
    case "dropdown":
      return <DropdownContainer id={id} key={key} config={compConfig} {...props} __configName={configName}/>
    case "queryLoader":
      return <QueryLoaderComponent id={id} key={key} config={compConfig} {...props} __configName={configName}/>
    case "statusComponent":
      return <StatusComponent id={id} key={key} config={compConfig} {...props} __configName={configName}/>
    case "statictext":
      return <StaticTextComponent id={id} key={key} config={compConfig} {...props} __configName={configName} sdkEventData={eventData}/>
    case "router":
      return <RouterComponent id={id} key={key} config={compConfig} {...props} __configName={configName}/>
    case "userdefined":
      return <compConfig.component id={id} key={key} ></compConfig.component>
    default:
      throw new Error(" SDK ERROR :: Unknown Component '" + compConfig.type + "'")
      return null;
  }
}
