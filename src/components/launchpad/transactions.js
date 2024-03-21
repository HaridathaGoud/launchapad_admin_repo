import React, { Component } from "react";
import { CBreadcrumb, CBreadcrumbItem,} from '@coreui/react'
import Form from 'react-bootstrap/Form';
import List from "../grid.component";
import moment from 'moment';
import { CopyToClipboard } from "react-copy-to-clipboard";
class Transactions extends Component {
  constructor(props) {
    super(props);
   
    this.state = {
      loader: false,
      gridUrl:  process.env.REACT_APP_API_LAUNCHPAD_POINT+"api/v1" + "/Projects/StakingTransactionsK",
      searchObj: {
        searchBy: null
      },
      value: '',
    }
    this.gridRef = React.createRef();
  }
  handleBlur = (e) => {
    let value = e.target.value.trim();
    e.target.value = value;
  };
  handleChange = (e) => {
    if(e.target.value == ""){
        let { searchObj } = this.state;
        searchObj.searchBy = null;
        this.gridRef?.current?.refreshGrid();                    
    }else{
    let value = e.target.value          
    let { searchObj } = this.state;
    if (value == "") {
        searchObj.searchBy = null;
    } else {
        let data=value.trim();
        searchObj.searchBy = data;
    }
    this.setState({ ...this.state, searchObj });
    e.preventDefault();
}
};


  handleEnterSearch = async (e) => {    
    let data=e.target.value.trim();
        if (e.key == 'Enter') {
            if(data == ""){   
              e.target.value = data;         
            e.preventDefault();
            }else {
              let { searchObj } = this.state;
              searchObj.searchBy = data;
              this.setState({ ...this.state, searchObj }, () => {
                  this.gridRef.current.refreshGrid();
              });
              e.target.value = data;
              e.preventDefault();
          }  
        }
}

  handleSearch = (data) => {
    let { searchObj } = this.state;
    if (data == "") {
      searchObj.searchBy = null;
    } else {
      searchObj.searchBy = data;
      this.setState({ ...this.state, searchObj }, () => {
        this.gridRef.current.refreshGrid();
      });
    }
  };
 
  iconClass = {
    "Stake": "icon receive",
    "Unstake": "icon send",
    "Withdraw Rewards": "icon withdraw-reward",
    "Stake Rewards": "icon stake-rewards",
    "Withdraw": "icon send",
  };


  gridColumns = [
  
    {
			field: "fromAddress",
			title: "Wallet Address",
			filter: true,
			width: 430,
			customCell: (props) => (
				<td className='copy-width'>
					<div className="d-flex justify-content-between text-white" >
						<span className="d-flex justify-content-between">
							{props?.dataItem?.fromAddress}
						</span>
							<CopyToClipboard text={props?.dataItem?.fromAddress} options={{ format: 'text/plain' }}
							onCopy={() => this.handleCopy(props?.dataItem)}>
							<span className={(this.state.copied && this.state.selection?.id === props?.dataItem?.id) ? "icon copied-check" : "icon copy c-pointer"}></span>
						</CopyToClipboard>
						
					</div>
				</td>
			),
		},
    {
      field: "name",
      title: "Name",
      filter: true,
      sortable: true,
      width: 200,
    },
    {
      field: "type",
      title: "Transaction Type",
      filter: true,
      sortable: true,
      width: 250,
      customCell: (props) => (
        <td>
          <div>
            <div className='d-flex align-items-center text-white'>
              <span
               className={this.iconClass[props?.dataItem?.type] || ""}></span>
              <span>{props?.dataItem?.type}</span>
            </div>
          </div>
        </td>
      ),

    },
    {
      field: "transactionDate",
      title: "Transaction Date",
      filterType: "date",
      filter: true,
      sortable: true,
      width: 250,
      customCell: (props) => (
        <td>
          <div>
            <div className='d-flex align-items-center text-white'>
             
              <span>{moment.utc(props?.dataItem?.transactionDate).local().format("DD-MM-YYYY HH:mm ")}</span>
            </div>
          </div>
        </td>
      ),
    },
  
    {
      field: "amount",
      title: "Staking Token",
      width: 200,
      filter: true,
      sortable: true,
      dataType: "number",
			filterType: "numeric"
    },
  ];
	handleCopy = (dataItem) => {
		this.setState({...this.state, selection: dataItem, copied: true})
		setTimeout(() => this.setState({ copied: false}), 2000)
	}
  render() {
    const { searchObj, gridUrl } = this.state;
    
    return (
      <>
      <h3 className='page-title mb-3'>Transactions</h3>
        <CBreadcrumb>
          <CBreadcrumbItem>
           
            Launchpad
          </CBreadcrumbItem>
          <CBreadcrumbItem >Transactions</CBreadcrumbItem>
        </CBreadcrumb>

        <div className='custom-flex pb-4 pt-2 '>
          
          <Form className="d-flex grid-search">
          <Form.Control name='searchBy'
            type="text"
            placeholder="Search Transaction"
            className="search-style"
            aria-label="Search"
            onChange={(e) => this.handleChange(e)}
            onKeyDown ={(e)=>this.handleEnterSearch(e)}
            onBlur={(e) => this.handleBlur(e)}
           
          />
          <i className="icon search-icon" onClick={()=>this.handleSearch(this.state.searchObj.searchBy)}></i>
        </Form>
        </div>

        <div className=''>
          <List
            additionalParams={searchObj}
            url={gridUrl}
            ref={this.gridRef}
            columns={this.gridColumns}
            pSize={10}
            className="custom-grid"
          />
        </div>
      </>
    );
  }
}
export default Transactions;