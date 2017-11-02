export const getDDOptionsFromObjectsList = function(data, prop) {
  if(prop){
    return data.map( (dataItem) => ({
      key: dataItem.key || dataItem[prop],
      value: dataItem.value || dataItem[prop],
      text: dataItem.text || dataItem[prop]
    }) );
  }else{
    return data.map( (dataItem) => ({
      key: dataItem,
      value: dataItem,
      text: dataItem
    }) );
  }
};

export const extractFromObjectsList = function(data, prop) {
  return data.map( (dataItem) => dataItem[prop] );
}

export const sortObjectListByProp = function(srcData, prop, sortOrder){
  let list = [].concat(srcData);
  let mult = (sortOrder === 'descending') ? -1 : 1;
  list.sort( function(a, b){
    return a[prop] < b[prop] ? -1*mult : a[prop] > b[prop] ? 1*mult : 0;
  } )
  return list;
}

export const isFunction = function(param) {
  return typeof param === "function"
};

export const isEmpty = function(param){
  return param === null ||
         param === undefined ||
         (param.hasOwnProperty("length") && param.length === 0) ||
         (param.constructor === Object && Object.keys(param).length === 0)
};


export const sortByDate = function( list, prop ){
  list = list || [];
  list = [].concat(list);
  list.sort( function(a, b){
    return (new Date(a[prop]).getTime()) - (new Date(b[prop]).getTime())
  } )
  return list;
}

export const expValueFromObject = function(str, srcObj ){
  let pattern = /^{{(.*)}}$/;
  let expression = pattern.exec(str);
  let result = srcObj;
	if(expression && expression.length){
    expression = expression[1];
    let strArr = expression.split(".");
  	for(var i=0; i<strArr.length; i++){
  		result = result[ strArr[i] ];
  	}
  }else{
    throw new Error(`Invalid Expression: ${str}`);
  }
	return result;
}

export const isSDKExpression = function(str ){
  let pat1 = /^{{(.*)}}$/;
  let pat2 = /[^\w\.]/;
  let result = pat1.exec(str);
  return result && result.length && !(pat2.test(result[1]));
  // return startsWith(str, "{{") && endsWith(str, "}}");
};

export const startsWith = function(srcString, str ){
  return (srcString.indexOf(str) === 0)
};

export const endsWith = function(srcString, str ){
  return (srcString.length === srcString.indexOf(str) + str.length);
}

export const cloneObj = function(srcObj) {
  // return JSON.parse( JSON.stringify( srcObj ) )
  // return Object.assign({}, srcObj)
  return clone(srcObj)
}

export const getDeepCopy = function(srcObj) {
  return JSON.parse( JSON.stringify( srcObj ) )
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}
