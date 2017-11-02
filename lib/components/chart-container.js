import React from 'react'
import { Grid } from 'semantic-ui-react';
import { extractFromObjectsList, sortByDate, expValueFromObject, isSDKExpression } from '../others/util';

import SDKHOC from '../hoc/sdk'
import EventListenerHOC from '../hoc/event-listener';
import DataLoaderHOC from "../hoc/data-loader"
import ChartComponent from "./chart-component"

import DropdownContainer from './dropdown-container'

let __compCounter = 0;

class ChartContainer extends React.Component {

  constructor(props) {
    super(props);
    __compCounter++;


    this.onDDChange = this.onDDChange.bind(this);

    let dropdownsData = this.init();

    this.state = {
      [this.name]: {
          "dropdowns": dropdownsData
      }
    };
  }

  init() {
    this.name = this.props.config.name || ("SDK_CHART_CONTAINER_"+__compCounter);
    this.dynamicDDs = [];

    let dropdownsData = {};
    let dropdowns = this.props.config.dropdowns;

    if(dropdowns && dropdowns.length){
      for(let i=0; i<dropdowns.length; i++){
        dropdownsData[ dropdowns[i].name ] = dropdowns[i].value || dropdowns[i].defaultValue;

        let options = dropdowns[i].data || dropdowns.dropdownsList || dropdowns.options;
        if(!options || !options.length ){
          this.dynamicDDs.push( dropdowns[i].name );
        }
      }
    }
    return dropdownsData;
  }

  getChartData() {
    let config = this.props.config;
    let data = this.props.sdk.dataloader.data || config.data;
    if(!data || !data.length) return;

    let xparam = config.xparam;
    let yparam = config.yparam;
    if( isSDKExpression(xparam) ){
      xparam = expValueFromObject(xparam, this.state);
    }
    if( isSDKExpression(yparam) ){
      yparam = expValueFromObject(yparam, this.state);
    }

    let yAxisData = yparam;
    if( !(yAxisData instanceof Array) ){
      yAxisData = [yAxisData];
    }

    let srcData = sortByDate(data, xparam);

    let xAxis = extractFromObjectsList(srcData, this.state[this.name].dropdowns[xparam] || xparam  );
    let yAxis = yAxisData.map( (yparam) => extractFromObjectsList(srcData, yparam ) )

    xAxis = xAxis.map( item => item.split('.')[0].replace('T', ' ') );
    yAxis = yAxis.map( ydata => ydata.map( item => item.split('.')[0] ) );
    let chData = [];
    for(let i=0; i<yAxis.length; i++ ){
      chData.push({
        x: xAxis,
        y: yAxis[i]
      })
    }

    return chData;
  }

  onDDChange(ddValue, ddName, f) {
    let ddData = {};
    ddData[ddName] = ddValue;
    this.setState({
      [this.name]: {
        "dropdowns": Object.assign({}, this.state[this.name].dropdowns, ddData)
      }
    });

    if( ddValue!=undefined && ddValue!=null && this.dynamicDDs.indexOf(ddName)!==-1 ){
      let self = this;
      setTimeout(function(){
        let param, paramsContext = {};
        for(param in self.props.config.query.params){
          if( isSDKExpression( self.props.config.query.params[param] ) ){
            try{
              paramsContext[param] = expValueFromObject(self.props.config.query.params[param], self.state);
            }catch(err){
              throw new Error(`Parsing Error: Could not parse expression "${self.props.config.query.params[param]}" for parameter "${param}" ` );
            }
          }else{
            paramsContext[param] = self.props.config.query.params[param];
          }
        }
        self.props.sdk.dataloader.fetchData(paramsContext);
      })
    }
  }

  getDropdownsContent() {
    let dropdowns = this.props.config.dropdowns;
    if(!dropdowns || !dropdowns.length) return null;

    return dropdowns.map( (ddConfig, ddIndex) => (
      <div key={ddIndex} className='listPadding wid50 float_left'>
        <div  className=' marBottom10'>
          <DropdownContainer onChange={this.onDDChange} config={ddConfig} />
        </div>
      </div>
    ))
  }

  render() {

    let chartData = this.getChartData();

    return (
      <Grid columns={1} className="chart-component" id={this.name}>
        <Grid.Row className='pad0'>
          <Grid.Column className='pad0'>
            <div className='panelHeader'> {this.props.config.title} </div>
            <div className='panelGrid'>
               <div> { this.getDropdownsContent() } </div>
      	       <div className="clr"> <ChartComponent {...this.props} parentId={this.name} chartData={chartData} /> </div>
     			   </div>
     	  </Grid.Column>
     	 </Grid.Row>
     	</Grid>
    )
  }

}

export default SDKHOC( EventListenerHOC ( DataLoaderHOC( ChartContainer ) ) );
