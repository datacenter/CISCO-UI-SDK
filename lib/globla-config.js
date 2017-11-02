import cookie from 'react-cookie';
import {compConfigLoader, queryConfigLoader} from "./aci-loader"
import evalExp from "./others/eval-exp"

let settings = null;

const SETTINGS_FILE_PATH = "sdk-settings-config";
window.__ACI_SDK_HEADERS = [];
try{
    settings = compConfigLoader(SETTINGS_FILE_PATH);
    let query = settings.query
    if(query && (query.headers instanceof Array)){
      window.__ACI_SDK_HEADERS = query.headers;
    }
}catch(err){
  let errtxt = `Unable to load the file "${SETTINGS_FILE_PATH}". Please make sure the settings configuration file is available in config folder `;
  alert(errtxt)
}

function updateHeaders(tokenObj) {
  tokenObj = tokenObj || {};
  window.__ACI_SDK_HEADERS.forEach(function(header) {
    header.header_value = tokenObj[header.message_event_prop] || cookie.load(header.cookie_name);
  }, this);
}

// update the headers data with browser cookie values
updateHeaders();

window.document.addEventListener("DOMContentLoaded", function(event) {  
  window.addEventListener('message', function (e) {
    if (e.source === window.parent) {
      var data = e.data;
      var tokenObj = (typeof data === "string") ? JSON.parse(data) : data;      
      if (tokenObj) {
        updateHeaders(tokenObj);
      }
    }
  });
});

const SETTINGS = settings;
export default SETTINGS;
