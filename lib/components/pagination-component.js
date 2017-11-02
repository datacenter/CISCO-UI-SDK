import React from "react"
import { Menu, Icon } from 'semantic-ui-react'

const defaultPageConfig = {
  pageSize: 5,
  totalPages: 1,
  currentPage: 1,
  recordsPerpage: 5
}

export default class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: props.config.currentPage || defaultPageConfig.currentPage
    }
    this.dState =  Object.assign({}, defaultPageConfig, this.props.config);
  }

  componentDidMount() {
    this.init();
  }

  init(){
    let pageSize = this.dState.pageSize;
    let totalPages = Math.ceil(this.props.config.totalRecords / this.props.config.recordsPerpage);
    let currentPage = this.state.currentPage > totalPages ? totalPages : this.state.currentPage

    this.dState = {
      pageSize: pageSize,
      totalPages: totalPages,
      currentPage: currentPage
    };
  }

  prevPage() {
    this.setState({
      currentPage: this.state.currentPage - 1
    })
    this.pageChanged();
  }

  nextPage() {
    this.setState({
      currentPage: this.state.currentPage + 1
    })
    this.pageChanged();
  }

  pageChanged() {
    if(typeof this.props.onPageChange==="function"){
      let self = this;
      setTimeout( () => self.props.onPageChange(self.state))
    }
  }

  selectPage(e, {id}) {
    if( this.state.currentPage !== id ){
      this.setState({
        currentPage: id
      });
      this.pageChanged();
    }
  }

  getPageNumbers() {
      let pageNumbers = [];
      if(this.props.config.totalRecords === 0){
        return pageNumbers;
      }

      let pageStart = Math.floor( (this.state.currentPage - 1)  / this.dState.pageSize) * this.dState.pageSize;
      let pageEnds = pageStart + this.dState.pageSize;
      if(  pageEnds > this.dState.totalPages  ){
        pageEnds = this.dState.totalPages;
      }

      for(let i=pageStart; i<pageEnds; i++){
        pageNumbers.push( <Menu.Item id={i+1} key={"page-"+(i+1)} as='a'
           active={this.state.currentPage===(i+1)} onClick={this.selectPage.bind(this)}>
          {i+1}
        </Menu.Item>);
      }
      return pageNumbers;
  }

  prevBtn() {
      return (<Menu.Item as='a' icon disabled={ this.state.currentPage<=1 } onClick={this.prevPage.bind(this)}>
                <Icon name='left chevron' />
              </Menu.Item>);
  }

  nextBtn() {
    return (<Menu.Item as='a' icon disabled={ this.state.currentPage>=this.dState.totalPages } onClick={this.nextPage.bind(this)}>
              <Icon name='right chevron' />
            </Menu.Item>);
  }

  render() {
    this.init();
    let comp = (<Menu pagination floated="right">
      {this.prevBtn()}
      {this.getPageNumbers()}
      {this.nextBtn()}
    </Menu>)

    return (
      <div> {comp} </div>
    )
  }


}
