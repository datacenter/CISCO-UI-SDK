import { runInNewContext } from "vm"
import {Parser} from "expr-eval"

const parser = new Parser();

export default function (expression, context){
  if(!expression || !context){
    return expression;
  }
  // console.log(expression, context);
  let regEx = /^{{(.*)}}$/;
  let result = regEx.exec(expression);
  // this is to check whether given string is a valid expression [strig that is enclosed in a pair of curly braces ] or not
  let isSDKExpression = !(!(result && result.length));
  // evaluate the expression in the context & return the resulted value
  // return isSDKExpression ? runInNewContext( result[1], context ) : expression;
  // return isSDKExpression ? context[ result[1] ] : expression;

  if(isSDKExpression){
    let expr = result[1];
    expr = expr.replace("===", "==").replace("!==", "!=");
    try{
        return parser.evaluate( expr, context);
    }catch(err){
      console.log(err)
      return undefined;
    }
  }else{
    return expression;
  }
}
