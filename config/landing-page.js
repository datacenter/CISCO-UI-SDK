import Header from "../components/header/header"

export default {
  type: "page",
  content: [
    {
      type: "userdefined",
      component: Header
    },
    {
      "type": "icon",
      "name": "setting",
      "size": "large",
      "position": {
        "right": "0px",
        "top": "-40px"
      },
      onClick: {
        dispatchEvent: {
          name: "SHOW_LOGIN_FORM"
        }
      }
    }
  ],
  "onLoad": {
    "action": {
      name: "SDK.ACTION.ADD_COMPONENT",
      component: "connection-status-config"
    }
  },
  "listenFor": [
    {
      "name": "SHOW_LOGIN_FORM",
      "action": {
        name: "SDK.ACTION.ADD_COMPONENT",
        component: "create-connection-form"
      }
    },
    {
      "name": "CONNECTION_CREATION_SUCCESS",
      "action": [
        {
          "name": "SDK.ACTION.ADD_COMPONENT",
          "component": "sync-status-config"
        },
        {
          "name": "SDK.ACTION.REMOVE_COMPONENT",
          "component": "not-connected-text"
        }
      ]
    },
    {
      "name": "CONNECTION_NOT_AVAILABLE",
      "action": [
        {
          "name": "SDK.ACTION.ADD_COMPONENT",
          "component": "not-connected-text"
        }
      ]
    },
    {
      "name": "CONNECTION_AVAILABLE",
      "action": [
        {
          "name": "SDK.ACTION.ADD_COMPONENT",
          "component": "sync-status-config"
        },
        {
          "name": "SDK.ACTION.REMOVE_COMPONENT",
          "component": "not-connected-text"
        }
      ]
    }
  ]
}
