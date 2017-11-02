import ReactDOM from "react-dom";
import getComponent from './others/comp-util'

(function(){
  const ROOT_ELEMENT_ATTR = "aci-sdk-app";
  const CONFIG_DIR = "../config/";

  function Init(){
    if(document.readyState === "complete") {
      Load();
    }
    else {
      document.addEventListener("DOMContentLoaded", Load, false);
    }
  }

  function Load(){
    let rootNode = getElementByAttr( ROOT_ELEMENT_ATTR );
    // if there is no element with an attribute of aci-sdk-app then no autoload
    if(!rootNode) return;

    try{
        const configFilePath = "app-config";// rootNode.getAttribute(ROOT_ELEMENT_ATTR);
        var compConfig = require("../config/" + configFilePath).default;
        // if there is no config data set to attribute "aci-sdk-app" then no autoload
        if(!compConfig) return;

        let component = getComponent(compConfig) ||  null;
        ReactDOM.render(
          component,
          rootNode
        );
        console.debug("Auto initializatoin of ACI SDK")
    }catch(err){
      console.error(" error while auto initializatoin of ACI SDK :: ", err);
    }
  }

  function getElementByAttr(attr){
    var c = document.body.children;
    for(var i=0; i<c.length; i++){
      if(c[i].hasAttribute(attr)){
        return c[i];
      }
    }
    return null;
  }

  Init();

}())
