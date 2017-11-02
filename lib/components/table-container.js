import React from 'react'
import TableComponent from './table-component';
import { sortObjectListByProp, isSDKExpression, expValueFromObject } from '../others/util';
import SDKHOC from '../hoc/sdk'
import EventListenerHOC from '../hoc/event-listener';
import DataLoaderHOC from "../hoc/data-loader"
import evalExp from "../others/eval-exp"
import Pagination from './pagination-component'
import DropdownContainer from './dropdown-container'

let __compCounter = 0;

const defaultPageConfig = {
  currentPage: 1,
  recordsPerpage: 5
}

class TableContainer extends React.Component {
  constructor(props) {
    super(props);
    __compCounter++;


    let pagination = this.props.config.pagination ?
      (typeof this.props.config.pagination === "boolean") ?
        defaultPageConfig :
        Object.assign({}, defaultPageConfig, this.props.config.pagination) : null

    let dropdowns = null;
    if(this.props.config.dropdowns && this.props.config.dropdowns.length){
      dropdowns = {};
      for(let i=0; i<this.props.config.dropdowns.length; i++){
        dropdowns[ this.props.config.dropdowns[i].name ] = this.props.config.dropdowns[i].value || this.props.config.dropdowns[i].defaultValue;
      }
    }

    this.name = this.props.config.name || ("SDK_INTERNAL_TABLE_COMPONENT_"+__compCounter);
    this.onDeleteRow = this.onDeleteRow.bind(this);

    this.state = {
      sortOn: this.props.config.sortOn,
      sortOrder: this.props.config.sortOrder || 'ascending',
      pagination: pagination,
      currentPage: pagination ? pagination.currentPage : 1,
      payload: this.props.config.query.config.payload,
      [this.name]: {
          "dropdowns": dropdowns
      }
    };
  }

  componentDidMount() {
    if( !this.props.sdk.dataloader.data && !this.props.config.data && !this.props.config.dropdowns){
      this.props.sdk.dataloader.fetchData();
    }
  }

  onDeleteRow(e) {
    let config = this.props.config;
    let colIndex = e.currentTarget.getAttribute("data-colIndex");
    let rowIndex = e.currentTarget.getAttribute("data-rowIndex");
    let rowData = (config.data || this.props.sdk.dataloader.data)[rowIndex];
    let colConfig = config.columns[colIndex];

    if(colConfig.onClick && colConfig.onClick.query){
      let paramContext = {};
      let query = colConfig.onClick.query;
      if(query.params){
        for(let param in query.params){
          paramContext[param] = evalExp( query.params[param], rowData )
        }
      }
      this.props.sdk.listener.addToParent({
        "type": "queryLoader",
        "query": query,
        "queryParamsContext": paramContext
      })
    }
  }

  sortByProp(e, f) {
    let colIndex = e.target.getAttribute("id");
    let selectedColumn = this.props.config.columns[colIndex];
    let sortOrder = "";
    if(this.props.config.sortable || selectedColumn.sortable){
      if(this.state.sortOn === selectedColumn.queryResponseField){
        if(this.state.sortOrder === 'ascending'){
          sortOrder = 'descending'
        }else if(this.state.sortOrder === 'descending'){
          sortOrder = '';
        }else{
          sortOrder = 'ascending';
        }
      }else{
        sortOrder = 'ascending';
      }

      this.setState({
        sortOn: selectedColumn.queryResponseField,
        sortOrder: sortOrder
      });
    }
  }

  onPageChange(pageConfig) {
    this.setState({
      currentPage: pageConfig.currentPage
    });
  }

  onDDChange(ddValue, ddName) {
    let ddData = {};
    ddData[ddName] = ddValue;
    this.setState({
      [this.name]: {
        "dropdowns": Object.assign({}, this.state[this.name].dropdowns, ddData)
      }
    })

    if(ddValue!=undefined && ddValue!=null){
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
        self.props.sdk.dataloader.fetchData( paramsContext );
      }, 100)
    }

  }

  render() {
    let config = JSON.parse(JSON.stringify( Object.assign({}, this.props.config, this.state) ) );
    if(config.sortOn && config.sortOrder){
      config.data = sortObjectListByProp(config.data, config.sortOn, config.sortOrder);
    }

    if(config.pagination){
      let startRecord = (config.currentPage-1) * config.pagination.recordsPerpage;
      let endRecord = startRecord + config.pagination.recordsPerpage;
      config.data = config.data.slice(startRecord, endRecord)
      config.pagination.totalRecords = this.props.config.data.length || 0;
    }

    return (
      <div className="chart-component">
        <div className='panelHeader'> {config.title} </div>
        <div className="outerBorder">
        <div>
          {
            this.props.config.dropdowns && this.props.config.dropdowns.length ?
            this.props.config.dropdowns.map( (ddConfig, ddIndex) => (
              <div className='listPadding wid50 float_left' key={ddIndex}>
                <div  className=' marBottom10'>
                  <DropdownContainer onChange={this.onDDChange.bind(this)} config={ddConfig} />
                </div>
              </div>
            )) : null
          }
        </div>

        <div className='outerPanel clr'>
          <TableComponent {...this.props} config={config}
            sortByProp={this.sortByProp.bind(this)}
            onDeleteRow={this.onDeleteRow}/>
        </div>
        </div>
        { config.pagination ? <Pagination config={config.pagination} onPageChange={this.onPageChange.bind(this)}></Pagination> : null}

        { this.props.sdk.listener.getContent() }
      </div>
    )
  }

}

export default SDKHOC( EventListenerHOC ( DataLoaderHOC( TableContainer ) ) )
