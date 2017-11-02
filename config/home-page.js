import Header from "../components/header/header"

export default {
  type: "page",
  content: [
    {
      type: "userdefined",
      component: Header
    },
    "status-comp-config",
    {
      "type": "icon",
      "name": "setting",
      "size": "large",
      "position": {
        "right": 0,
        "top": -40
      },
      "onClick": {
        "action": {
          name: "SDK.ACTION.ADD_COMPONENT",
          component: "disconnect-form"
        }
      }
    },
    "tab-config"
  ],
  "listenFor": [
    {
      "name": "DISCONNECTION_SUCCESS",
      "action": [
        {
          "name": "SDK.ACTION.REMOVE_COMPONENT",
          "component": "home-page"
        },
        {
          "name": "SDK.ACTION.ADD_COMPONENT",
          "component": "landing-page"
        }
      ]
    }
  ]
}
