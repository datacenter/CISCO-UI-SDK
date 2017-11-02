// update the environment specific details in .evn.development or .env.production files
// each varaible / data item should start with "REACT_APP_"

// export default {
//   "query": {
//     "url": process.env.REACT_APP_GRAPHQL_URL,
//     "headers": {
//       "Content-Type": "application/graphql",
//       "DevCookie": "{{app_Cisco_InfobloxSync_token}}",
//       "APIC-challenge": "{{app_Cisco_InfobloxSync_urlToken}}"
//     }
//   }
// }

export default {
  "query": {
    "url": process.env.REACT_APP_GRAPHQL_URL,
    "headers": [
      {
        "header_name": "DevCookie",
        "cookie_name": "app_Cisco_InfobloxSync_token",
        "message_event_prop": "token",
        "header_value": ""
      },
      {
        "header_name": "APIC-challenge",
        "cookie_name": "app_Cisco_InfobloxSync_urlToken",
        "message_event_prop": "urlToken",
        "header_value": ""
      }
    ]
  }
};