import ReactDOM from "react-dom";
import getComponent from './others/comp-util'
import cookie from 'react-cookie';

// importing styles
import "./styles/colors.css"
import "./styles/main.css"
import "./styles/cisco-styles/common.css";
import "./styles/cisco-styles/form.css"
import "./styles/cisco-styles/graph.css"
import "./styles/cisco-styles/table.css"

const DEFAULT_INITIAL_FILE = "router-config";
const SDK_ROOT_NODE = "aci-sdk-root";

export const loadComponent = function(rootNodeId, compConfig) {
  compConfig = compConfig || DEFAULT_INITIAL_FILE;
  let component;

  try{
    component = getComponent(compConfig) ||  null;
    ReactDOM.render(
      component,
      document.getElementById(rootNodeId || SDK_ROOT_NODE)
    );
  }catch(error){
    let errtxt = `Unable to load the file "${compConfig}". Please make sure the configuration file is available in config folder `
    console.log(error);
    return alert(errtxt)
  }

};


/* Following code is moved to global-config.js  file */
// window.document.addEventListener("DOMContentLoaded", function(event) {
//   window.addEventListener('message', function (e) {
//     if (e.source === window.parent) {
//         var data = e.data; //'{"token": "react-devtools-detector", "urlToken": "development"}';
//         var tokenObj = (typeof data === "string") ? JSON.parse(data) : data;
        
//         // console.log(tokenObj);
//         if (tokenObj) {
//             window.APIC_DEV_COOKIE = tokenObj.token;
//             window.APIC_URL_TOKEN = tokenObj.urlToken;
//             // tokenObj.appId = tokenObj.appId || "Cisco_InfobloxSync";
//             // cookie.save("app_" + tokenObj.appId + "_token", tokenObj.token);
//             // cookie.save("app_" + tokenObj.appId + "_urlToken", tokenObj.urlToken);
//         }
//     }
//   });
// });
