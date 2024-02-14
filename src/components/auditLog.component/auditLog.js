import React, { Component } from "react";
import List from "../grid.component";
import Button from 'react-bootstrap/Button';
import Moment from "react-moment";
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import { connect } from 'react-redux';
import Accordion from 'react-bootstrap/Accordion';
class AuditLog extends Component {
	constructor(props) {
		super(props);
		this.state = {
            gridUrl: process.env.REACT_APP_API_END_POINT_KYCINFO + "/api/v1" + "/Projects/AdminAuditLogs",
			searchObj: {
				customerId:this.props.user.id,
			},
			value: '',
			copied: false,
			auditDetailsModal:false,
			selection: null,
			logRowData:null
		};
		this.gridRef = React.createRef();
		
	}
	
	
	getAddress = address => {
		if (address) {
			return address.substring(0, 4) + "...." + address.slice(-4)
		}
	}
	handleCopy = (dataItem) => {
		this.setState({...this.state, selection: dataItem, copied: true})
		setTimeout(() => this.setState({ copied: false}), 2000)
	}
	
	gridColumns = [
		{
			field: "createdDate",
			title: "Date",
			filter: true,
			width:260,
			customCell: (props) => (
				<td>
					 <Moment format='DD/MM/YYYY  HH:MM:SS'>{moment(new Date(props.dataItem.createdDate),'DD/MM/YYYY')}</Moment>
				</td>
			),
			
		},
		{
			field: "feature",
			title: "Features",
			filter: true,
			width:223,
		},
		{
			field: "country",
			title: "Country",
			filter: true,
			width:270,
		},
		{
			field: "state",
			title: "State",
			filter: true,
			width: 180,
		},

		{
			field: "ipAddress",
			title: "IpAddress",
			filter: true,
			width: 180,
		},
		{
			field: "", title: "", width: 100,
			customCell: (props) => (
			  <td>
				<div className="d-flex align-center">
					<span className="icon info"
					  onClick={() => this.showMoreAuditLogs(props)}
					></span>
				</div>
			  </td>)
		  },
	
	];
	showMoreAuditLogs=(props)=>{
		let data=JSON.parse(props?.dataItem.info)
		this.setState({...this.state, auditDetailsModal: true,isLoading: true,logRowData:data });
	}
	handleAuditClose=()=>{
		this.setState({...this.state, auditDetailsModal: false});
	}
	render() {
		const { searchObj, gridUrl,logRowData,auditDetailsModal } = this.state;
		return (
			<>
				<div className=''>
					<div className=''>
						<h5 className="sub-title mb-3">Audit logs</h5>
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
				<Modal
				 title="Audit Logs Details"
                 size="lg"
                 aria-labelledby="contained-modal-title-vcenter"
                 centered
				 show={auditDetailsModal} className="settings-modal profile-modal audit-loga-info"
				 >
					<Modal.Header >
						<Modal.Title>AuditLog Info</Modal.Title><span className="icon close" onClick={this.handleAuditClose}></span>
					</Modal.Header>
					<Modal.Body>
                        <div className="row p-16">
					<div className="coin-info col-6">
							<label className="user-label">IP</label>
							<p className="profile-value">{logRowData?.ip}</p>
						</div>
						<div className="coin-info col-6" >
							<label className="user-label">State</label>
							<p className="profile-value">{logRowData?.region_name}</p>
						</div>
						<div className="coin-info col-6">
							<label className="user-label">State code</label>
							<p className="profile-value">{logRowData?.region_code}</p>
						</div>
						<div className="coin-info col-6">
							<label className="user-label">Country</label>
							<p className="profile-value">{logRowData?.country_name}</p>
						</div>
						<div className="coin-info col-6">
							<label className="user-label">Country code</label>
							<p className="profile-value">{logRowData?.country_code}</p>
						</div>
						<div className="coin-info col-6">
							<label className="user-label">Postal Code</label>
							<p className="profile-value">{logRowData?.zip}</p>
						</div>						
						<div className="coin-info col-6">
							<label className="user-label">Ip type</label>
							<p className="profile-value">{logRowData?.type}</p>
						</div>
						<div className="coin-info col-6">
							<label className="user-label">Latitude</label>
							<p className="profile-value">{logRowData?.latitude}</p>
						</div>
						<div className="coin-info col-6">
							<label className="user-label">Longitude</label>
							<p className="profile-value">{logRowData?.longitude}</p>
						</div>
						<div className="coin-info col-6">
							<label className="user-label">Continent</label>
							<p className="profile-value">{logRowData?.continent_name}</p>
						</div>
						<div className="coin-info col-6">
							<label className="user-label">Continent code</label>
							<p className="profile-value">{logRowData?.continent_code}</p>
						</div>
                        </div>
						<Accordion  flush>
					<Accordion.Item eventKey="0" > 
								<Accordion.Header>Currency</Accordion.Header>
								<Accordion.Body>
                                    <div className="row">
									<div className="coin-info col-6">
										<label className="user-label">Currency code</label>
										<p className="profile-value">{logRowData?.currency?.code}</p>
									</div>
									<div className="coin-info col-6">
										<label className="user-label">Currency name</label>
										<p className="profile-value">{logRowData?.currency?.name}</p>
									</div>
									<div className="coin-info col-6">
										<label className="user-label">Currency symbol</label>
										<p className="profile-value">{logRowData?.currency?.symbol}</p>
									</div>
                                    </div>
								</Accordion.Body>
							</Accordion.Item>
					 <Accordion.Item eventKey="1" > 
					 <Accordion.Header >location</Accordion.Header>
					 <Accordion.Body>
                        <div className="row">
								<div className="coin-info col-6">
							<label className="user-label">Capital</label>
							<p className="profile-value">{logRowData?.location?.capital}</p>
						</div>
						<div className="coin-info col-6">
							<label className="user-label">Calling code</label>
							<p className="profile-value">{logRowData?.location?.calling_code}</p>
						</div>
						<div className="coin-info col-6">
							<label className="user-label">Geo Name Id</label>
							<p className="profile-value">{logRowData?.location?.geoname_id}</p>
						</div>
                        </div>
								</Accordion.Body>
					 </Accordion.Item>
					 <Accordion.Item eventKey="2" > 
					 <Accordion.Header>time zone</Accordion.Header>
					 <Accordion.Body>
								<div className="coin-info ">
							<label className="user-label">Current time</label>
							<p className="profile-value">
								
							<Moment format='DD/MM/YYYY HH:mm:ss'>{moment(new Date(logRowData?.time_zone?.current_time),'DD/MM/YYYY HH:mm:ss')}</Moment></p>
						</div>
						<div className="coin-info">
							<label className="user-label">code</label>
							<p className="profile-value">{logRowData?.time_zone?.code}</p>
						</div>
						<div className="coin-info">
							<label className="user-label">Gmt Offset</label>
							<p className="profile-value">{logRowData?.time_zone?.gmt_offset}</p>
						</div>
								</Accordion.Body>
					 </Accordion.Item>
					 
					</Accordion>
					</Modal.Body>
					<Modal.Footer>
					<Button
                type="primary"
                className="primary-btn cancel-btn filled-btn"
                onClick={this.handleAuditClose}
              >
                Close
              </Button>
					</Modal.Footer>
				</Modal>

			</>
		);
	}
}

const connectStateToProps = ({oidc }) => {
	return { user:oidc?.custUser }
  }
export default connect(connectStateToProps)(AuditLog);