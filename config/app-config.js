export default {
  type: "page",
  content: [
    "landing-page"
  ],
  "listenFor": [
    {
      "name": "INITIAL_SYNC_COMPLETED",
      "action": [
        {
          "name": "SDK.ACTION.REMOVE_COMPONENT",
          "component": "landing-page"
        },
        {
          "name": "SDK.ACTION.ADD_COMPONENT",
          "component": "home-page"
        }
      ]
    },
    {
      "name": ["DISCONNECTION_SUCCESS", "DISCONNECTED"],
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
