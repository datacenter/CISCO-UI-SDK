import React, { Component } from 'react'
import {  Grid, Segment } from 'semantic-ui-react'
import getComponent from '../others/comp-util'
import {compConfigLoader} from "../aci-loader"
const MAX_WIDTH = 2;
// const MAX_HEIGHT = 2;
const defaultSize = "2:1";

export const getCompLayout = function( compsList ){
	let rowsList = [];
	let current;
	let currentRowWidth = 0;
	let currentRow = [];
	let currentCompWidth = 0;

	for(let i=0; i<compsList.length; i++){
		current = compsList[i];

		if(typeof current === "string"){
			try{
				current = compConfigLoader(current);
			}catch(err){
				console.log(err);
				let errtxt = `Unable to load the file "${current}". Please make sure the configuration file is available in config folder `
		    return alert(errtxt)
			}
		}

		currentCompWidth = getCompLayoutHorSize(current.size);
		if(currentRowWidth + currentCompWidth <= MAX_WIDTH){
			currentRowWidth += currentCompWidth;
			currentRow.push( current );
		}else{
      currentRow.columns = getColsCount(currentRow);
			rowsList.push( currentRow );
			currentRow = [current];
			currentRowWidth = currentCompWidth;
		}
	}

	if(currentRow.length){
    currentRow.columns = getColsCount(currentRow);
		rowsList.push( currentRow );
	}

  return rowsList;

}

export const getGridContent = function(compsList) {
	let compLayout = getCompLayout(compsList)
	return (<Grid>
		{
			compLayout.map( (row, rowIndex) => (
				<Grid.Row key={"grid-row-"+rowIndex} columns={row.columns}>
					{
						row.map( (compConfig, colIndex) => (
							<Grid.Column key={"grid-col-"+colIndex} className={ getComponentHeight(compConfig) }>
								{getComponent(compConfig, colIndex)}
							</Grid.Column>
						))
					}
				</Grid.Row>
			) )
		}
	</Grid>);
}

function getCompLayoutHorSize(size){
	if(!size)
		return 2;//defaultSize;

	if( size == "1:1" || size == "2:1" || size == "1:2" || size == "2:2")
		return parseInt( size.split(":")[0], 10 );

	return 2;//defaultSize;
}

function getCompLayoutVerSize(size){
	if(!size)
		return 1;//defaultSize;

	if( size == "1:1" || size == "2:1" || size == "1:2" || size == "2:2")
		return parseInt( size.split(":")[1], 10 );

	return 1;//defaultSize;
}

function getComponentHeight(compConfig) {
	return "comp-height-"+ getCompLayoutVerSize(compConfig.size);
}

function getColsCount(colsList){
  let count = 0;
  for(let i=0; i<colsList.length; i++){
    count += getCompLayoutHorSize(colsList[i].size);
  }
  return MAX_WIDTH*colsList.length/count;
}
