import React from 'react'
import { Table } from 'semantic-ui-react'
import * as rsUtil from '../others/rs-util'
import {tableConfig} from '../config/table-config'
import { startsWith } from '../others/util';

const TableComponent = (props) => {
  let tableHeaders = rsUtil.getHeaders(props.config.columns, props.sortByProp, props.config.sortOn, props.config.sortOrder);

  props.config.tabletype = props.config.tabletype || "default";
  let tableOptions = {};//tableConfig[props.config.tabletype];

  for(let prop in props.config){
    if( startsWith(prop, "semantic_")  ){
      tableOptions[ prop.replace("semantic_", "") ] = props.config[ prop ];
    }
  }

  function getTableContent(){
    let data = props.sdk.dataloader.data || props.config.data
    if(props.sdk.dataloader.loading){
      return rsUtil.getTableRowCell("Loading table content");
    }else if(props.sdk.dataloader.error){
      return rsUtil.getTableRowCell("Error while loading table content");
    }else if(data && data.length){
      return rsUtil.getRows(data, props.config.columns, props);
    }else{
      return rsUtil.getTableRowCell("Data is not avialable");
    }
  }

  return (
        <Table {...tableOptions}>
          <Table.Header >
            <Table.Row>
              {tableHeaders}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { getTableContent() }
          </Table.Body>
        </Table>
  );
};

export default TableComponent
