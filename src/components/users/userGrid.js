import React, { Component } from "react";
import List from "../grid.component";
import { Form, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { setUserInfo } from 'src/reducers/profileReducer';
import { connect } from "react-redux";
import moment from 'moment';
import Moment from "react-moment";
import apiCalls from "src/api/apiCalls";

class Users extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loader: false,
			wallet: null,
			walletAddress: null,
			gridUrl: process.env.REACT_APP_API_END_POINT_KYCINFO + "/api/v1" + "/Projects/AllCustomersData",
			searchObj: {
				searchBy: null
			},
			value: '',
			copied: false,
			selection: null
		};
		this.gridRef = React.createRef();

	}
	componentDidMount() {
		this.saveAuditlogs()
	}


	saveAuditlogs = async () => {
		let obj = {
			id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
			projectOwnerId: this.props.adminDetails,
			feature: "sign In",
			action: "string",
			remarks: "string",
			info: JSON.stringify(this.props.trackAuditLogData),
			createdDate: "2023-04-24T07:29:18.685Z"
		}
		let response = await apiCalls.saveAuditLog(obj);
		if (response) {
		}
	}
	gridColumns = [
		{
			field: "createdDate",
			title: "Date",
			filter: true,
			width: 140,
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
			width: 430,
			customCell: (props) => (
				<td className='copy-width'>
					<div className="d-flex justify-content-between" >
						<span className="gridLink batch-filename d-flex justify-content-between">
							<Link to={`/ProfileInfo/${props?.dataItem?.walletAddress}`}>{props?.dataItem?.walletAddress}</Link>
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
						<span className="gridLink c-pointer batch-filename"><Link to={`/ProfileInfo/${props?.dataItem?.walletAddress}`}>{props?.dataItem?.firstName}</Link></span>
					</div>
				</td>
			),
		},

		{
			field: "email",
			title: "Email",
			filter: true,
			width: 260,
		},
		{
			field: "phoneNumber",
			title: "Phone Number",
			filter: true,
			width: 200,
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
			width: 160,
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
			searchObj.searchBy = value;
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
	render() {
		const { searchObj, gridUrl } = this.state;
		return (
			<>
				<div className=''>
					<div className='container'>
						<h5 className="sub-title mb-3 mt-3 mt-md-0">Customers </h5>
						<div className='custom-flex pb-4'>
							<Form className="d-lg-flex grid-search mobile-block" >
								<Form.Control 
								    name='searchBy'
								    type="text"
								    autoComplete="off"
								    className="search-style"
									aria-label="Search"
									onChange={(e) => this.handleChange(e)}
									onKeyDown ={(e)=>this.handleEnterSearch(e)}
									maxLength={20}
									placeholder="Search" />
								<Button className="filled-btn ms-lg-3 ms-2" type="button" onClick={this.handleSearch} >
									Search</Button>
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
					</div>
				</div>


			</>
		);
	}
}

const connectStateToProps = ({ oidc, walletAddress }) => {
	return { user: oidc?.user, trackAuditLogData: oidc?.trackAuditLogData,userDetails:oidc?.adminDetails, walletAddress: walletAddress }
}
const connectDispatchToProps = dispatch => {
	return {
		fetchData: (data) => {
			dispatch(setUserInfo(data))
		},

	}
}

export default connect(connectStateToProps, connectDispatchToProps)(Users);
