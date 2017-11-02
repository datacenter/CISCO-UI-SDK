import axios from 'axios';
import cookie from 'react-cookie';
import settings from "../globla-config"
import evalExp from "./eval-exp"
import {queryConfigLoader} from "../aci-loader"

// Transforming the axios response to return the actual result of graphql query that UI requires
axios.interceptors.response.use(function (response) {
  let gqlResponse = response.data;
  let gqlData = gqlResponse.data[ Object.keys(gqlResponse.data)[0]  ];
  return gqlData;;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

function getHeaders(headers){
  headers = headers || {};
  headers['Content-Type'] = 'application/graphql';
  var headerWithCookies = getCookies();
  return {...headers, ...headerWithCookies}
}

function getCookies() {
  var headerWithCookies = {};
  window.__ACI_SDK_HEADERS.forEach(function(header) {
    headerWithCookies[ header.header_name ] = header.header_value;
  }, this);
  return headerWithCookies;
}

function getUrl(config) {
  if(config.url)
    return evalExp(config.url, {"SDK_SETTINGS": settings} );
  let query = settings.query;
  return query ? (query.defaultURL || query.url) : "";
}



export const processGQL = (srcConfig, queryParamsContext) => {

  let config, configName;
  if( typeof srcConfig === "string" ){
    try{
      config = queryConfigLoader(srcConfig);
    }catch(err){
      throw new Error(`SDK ERROR: Couldn't find/load the query configuration file "${srcConfig}" `);
    }
  }else{
    config = srcConfig;
  }


  let payload = buildQuery( config, queryParamsContext );
  // replacing the single quotes with double quotes to make it as a valid query string for graphql
  payload = payload.replace(/'/g, "\"");
  let headers = getHeaders(config.headers);
  let url = getUrl(config);

  let queryObject = {
    method: (config.method || 'post'),
    headers: headers,
    url: url,
    data: payload
  };

  return axios(queryObject);

};

export const buildQuery = function(config, context){

	var str = "";
	var name = "";
	var args = "";
	var respStr = "";

	name = config.graphql_EP;

	if(config.payload && context){
		for(var prop in config.payload){
			args = args + prop + ":\"" + (  context[ config.payload[prop].replace(/\$/g, "") ] || config.payload[prop] ) + "\",";
		}
		// replacing the trailing comma
		args = args.replace(new RegExp(",$"), "");
		args = "(" + args + ")";
	}

	if(config.response instanceof Array && config.response.length){
		respStr = config.response.join(",");
		respStr = "{" + respStr + "}";
	}


	str = "{" + name + args + respStr + "}"
	return str;
}
