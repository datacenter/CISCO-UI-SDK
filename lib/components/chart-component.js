import React from 'react'
import { Grid } from 'semantic-ui-react';

import defaultPlotlyConfig from '../config/plotly-config';
import { cloneObj, getDeepCopy } from "../others/util";

let chartId = 0;

class ChartComponent extends React.Component {

  constructor(props) {
    super(props);

    this.drawPlot = this.drawPlot.bind(this);
    this.chartId = ("chart-comp-" + chartId++);
    this.plotlyConfig = getDeepCopy( this.props.config.plotly || defaultPlotlyConfig );
    this.chartTimer = null;
  }

  componentDidMount() {
    let parentElemId = this.props.parentId;
    if( !parentElemId ) return;
    let parentElem = document.getElementById( parentElemId );
    if(!parentElem) return;

    let width = this.plotlyConfig.layout.width;
    let height = this.plotlyConfig.layout.height;

    if(typeof width === "string" && width.indexOf('%')){
      width = parentElem.offsetWidth * parseInt(width.replace("%", "") , 10) / 100;
      this.plotlyConfig.layout.width = width;
    }

    if(typeof height === "string" && height.indexOf('%')){
      height = parentElem.offsetHeight * parseInt(height.replace("%", "") , 10) / 100;
      this.plotlyConfig.layout.height = height;
    }

    let hSize = window.parseInt( this.props.config.size.split(":")[0] );
    if(hSize == 1){
      this.plotlyConfig.layout.width *= 0.5;
    }
    console.log(this.props.config, hSize)
  }

  drawPlot() {
    if(window.Plotly && document.getElementById(this.chartId)){
      window.Plotly.newPlot(this.chartId, this.props.chartData, this.plotlyConfig.layout, this.plotlyConfig.options);
    }
  }

  getChartContent() {
    if(this.props.sdk.dataloader.loading){
      return <div className='loadingText'>Loading Chart content</div>
    }else if(this.props.sdk.dataloader.error){
      return <div className='loadingText'>Error while loading Chart content</div>
    }else if(!this.props.chartData || !this.props.chartData.length){
      return <div className='loadingText'> Data is not avaiable  </div>
    }else{
      clearTimeout(this.chartTimer);
      this.chartTimer = setTimeout( this.drawPlot, 10 );
      return <div id={this.chartId}></div>
    }
  }


  render() {
    return this.getChartContent();
  }

}

export default ChartComponent;
