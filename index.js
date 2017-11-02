import 'semantic-ui-css/semantic.min.css';
import * as SDK from "./lib/aci-sdk";

window.document.addEventListener("DOMContentLoaded", function(event) {
    SDK.loadComponent("aci-sdk-root", "app-config");
});
