import React, { Component } from "react";
import List from "../grid.component";
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import { Link } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import moment from 'moment';
import Moment from "react-moment";
class KYCCustomers extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gridUrl: process.env.REACT_APP_API_END_POINT_KYCINFO + "/api/v1" + "/Projects/AllCustomersData",
			searchObj: {
				searchBy: null,
				 isKYC:false
			},
		};
		this.gridRef = React.createRef();

	}

	handleClick = () => {
		this.props.history.push('/home');
	}

	getAddress = address => {
		if (address) {
			return address.substring(0, 4) + "...." + address.slice(-4)
		}
	}
	gridColumns = [
		{
			field: "createdDate",
			title: "Date",
			filter: true,
			width: 140,
			filterType: "date",
			customCell: (props) => (
				<td>
					<div>
						<Moment format='DD/MM/YYYY'>{moment(new Date(props.dataItem.createdDate), 'DD/MM/YYYY')}</Moment>

					</div>
				</td>
			)
		},
		{
			field: "walletAddress",
			title: "Wallet Address",
			filter: true,
			width: 420,
			customCell: (props) => (
				<td className='copy-width'>
					<div className="d-flex justify-content-between" >
						<span className="gridLink batch-filename d-flex justify-content-between">
							<Link to={`/kyc/customers/profileinfo/${props?.dataItem?.walletAddress}/${props?.dataItem?.id}`}>{props?.dataItem?.walletAddress}</Link>
						</span>
					</div>
				</td>
			),
		},
		{
			field: "firstName",
			title: "Name",
			filter: true,
			width: 200,
			customCell: (props) => (
				<td>
					<div>
						<span className="gridLink c-pointer batch-filename"><Link to={`/kyc/customers/profileinfo/${props?.dataItem?.walletAddress}/${props?.dataItem?.id}`}>{props?.dataItem?.firstName}</Link></span>
					</div>
				</td>
			),
		},
		{
			field: "email",
			title: "Email",
			filter: true,
			width: 180,
		},
		{
			field: "phoneNumber",
			title: "Phone Number",
			filter: true,
			width: 210,
		},

		{
			field: "country",
			title: "Country",
			filter: true,
			width: 200,
		},
		{
			field: "kycStatus",
			title: "KYC Status",
			filter: true,
			width: 200,
		},
	];
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

	handleSearch = () => {
		let { searchObj } = this.state;
		let data = searchObj.searchBy.trim();
		if(data !=""){
			this.setState({ ...this.state, searchObj }, () => {
				this.gridRef.current.refreshGrid();
			});
		}
	};

     handleEnterSearch = async (e) => {
		let data=e.target.value.trim();
			if (e.key == 'Enter') {
				if(data == ""){
				e.preventDefault();
				}else{
					this.gridRef?.current?.refreshGrid();
					e.preventDefault();
			   }
			}
	}
	handleKYCCustomer=(e)=>{
		let { searchObj } = this.state;
		searchObj.isKYC= e.target.checked;
		this.setState({ ...this.state, searchObj }, () => {
			this.gridRef.current.refreshGrid();
		});
	}
	render() {
		const { searchObj, gridUrl,show} = this.state;
		return (
			<>
				<CBreadcrumb>
					<CBreadcrumbItem>
						KYC
					</CBreadcrumbItem>
					<CBreadcrumbItem active>Customers</CBreadcrumbItem>
				</CBreadcrumb>
				<div className='custom-flex kyc-filter pb-4 pt-2 justify-content-between'>
				<Form className="d-md-flex grid-search mobile-block" >
								<Form.Control
								    name='searchBy'
								    type="text"
								    autoComplete="off"
								    className="search-style customer-grid-search"
									aria-label="Search"
									onChange={(e) => this.handleChange(e)}
									onKeyDown ={(e)=>this.handleEnterSearch(e)}
									maxLength={48}
									placeholder="Search by Name, Email and Wallet Address" />
								<Button className="filled-btn ms-lg-3 ms-2 mt-lg-0" type="button" onClick={this.handleSearch} >
									Search</Button>
							</Form>
							<Form className="d-flex grid-search mobile-block" >

									 <label className='check-input-style  c-pointer d-flex align-items-center'>
                      <input className=''
                        name='isCheck'
                        type="checkbox"
						onClick={(e)=>this.handleKYCCustomer(e)}
                      />
                      <span></span>
                    </label>{" "}<p className="me-2 mb-0 mx-1">Include All KYC Statuses</p>
							</Form>
                        </div>
				<div className='profile-section'>
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
export default KYCCustomers;