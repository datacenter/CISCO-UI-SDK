import React from 'react'
import { Table, Icon, Popup } from 'semantic-ui-react'
import evalExp from "./eval-exp"
import semanticDefaults from "./semantic-defaults"


export const getHeaders = function(columnsList, sortFun, sortProp, sortOrder) {
  // console.log(sortFun)
  return columnsList.map( (column, columnIndex) => {
    if(column.queryResponseField === sortProp && sortOrder){
      if(column.type=="DELETE_ROW"){
        return (
          <Table.HeaderCell id={columnIndex} key={columnIndex} onClick={sortFun}>
            {column.label}
          </Table.HeaderCell>
        )
      }

      return (
        <Table.HeaderCell className={column.sortable ? "sortable" : "no-sorting"} sorted={sortOrder} id={columnIndex} key={columnIndex} onClick={sortFun}>
          {column.label}
        </Table.HeaderCell>
      )
    }

    return (
      <Table.HeaderCell className={column.sortable ? "sortable" : "no-sorting"} id={columnIndex} key={columnIndex} onClick={sortFun}>
        {column.label}
      </Table.HeaderCell>
    )
  } );
};

export const getRowCols = function(rowData, columnsList, rowIndex, props) {
  let self = this;
  return columnsList.map( (column, columnIndex) => {
    let cellContent=null;
    let clrStyle = {};

    if(column.type === "DELETE_ROW"){
      cellContent = (<span>
        <Icon color='red' name='close' size='large' data-colIndex={columnIndex} data-rowIndex={rowIndex} onClick={props.onDeleteRow} />
      </span>);
    }else{
      if(column.textColor){
        clrStyle['color'] = evalExp(column.textColor, rowData)
      }
      if(column.cellColor){
        clrStyle['backgroundColor'] = evalExp(column.cellColor, rowData)
      }
      cellContent = (<span>{evalExp(column.queryResponseField, rowData)}</span>);
    }

    if(column.popup && column.popup.content){
      let defaults = semanticDefaults['popup'];
      let {content, ...rest} = column.popup;
      cellContent = (<Popup
        trigger={cellContent}
        content={evalExp(content, rowData)}
        position="top center"
        {...defaults}
        {...rest}
      />)
    }

    return (<Table.Cell key={columnIndex} style={clrStyle} >
        {cellContent}
    </Table.Cell>)
  })
}

export const getRows = function(tableData, columnsList, props) {
  tableData = tableData || [];
  return tableData.map( (rowData, rowIndex) => (
    <Table.Row key={rowIndex}>
      { getRowCols(rowData, columnsList, rowIndex, props) }
    </Table.Row>
  ) );
};

export const getTableRowCell = function(text){
  return (<Table.Row>
    <Table.Cell >
      {text}
    </Table.Cell>
  </Table.Row>)
};
