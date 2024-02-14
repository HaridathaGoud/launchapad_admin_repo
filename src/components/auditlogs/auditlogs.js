import React, { Component } from "react";
import List from "../grid.component";
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import { CopyToClipboard } from "react-copy-to-clipboard";
import Moment from "react-moment";
import moment from 'moment';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/esm/Spinner';
import Accordion from 'react-bootstrap/Accordion';
class AuditLog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gridUrl: process.env.REACT_APP_API_END_POINT_KYCINFO +"/api/v1" + "/Projects/AdminAuditLogs",
			searchObj: {
				 customerId:this.props.user.id,
			},
			value: '',
			copied: false,
			selection: null,
			auditDetailsModal:false,
			isLoading:false,
			logRowData:{}
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
					 <Moment format='DD/MM/YYYY'>{moment(new Date(props.dataItem.createdDate),'DD/MM/YYYY')}</Moment>
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
	              <td style={{color:"white"}} onClick={() => this.showMoreAuditLogs(props)}>
			<span className="icon info c-pointer"></span>
				  </td>
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
		const { searchObj, gridUrl,isLoading,logRowData,auditDetailsModal } = this.state;
		return (
			<>
				<div className=''>
					<div className='container'>
						<h5 className="sub-title mb-3">Customers Audit logs</h5>
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
					className="profile-edit"
					show={auditDetailsModal}
					aria-labelledby="contained-modal-title-vcenter"
					centered
				>
					<Modal.Header closeButton onClick={() =>
                this.setState({ ...this.state, auditDetailsModal: false })
              }>
						<Modal.Title style={{color:"black"}}>AuditLog Info</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="coin-info" >
							<p style={{color:"black"}}>State</p>
							<p style={{color:"black"}}>{logRowData?.region_name}</p>
						</div>
						<div className="coin-info">
							<p style={{color:"black"}}>State code</p>
							<p style={{color:"black"}}>{logRowData?.region_code}</p>
						</div>
						<div className="coin-info">
							<p style={{color:"black"}}>Country</p>
							<p style={{color:"black"}}>{logRowData?.country_name}</p>
						</div>
						<div className="coin-info">
							<p style={{color:"black"}}>Country code</p>
							<p style={{color:"black"}}>{logRowData?.country_code}</p>
						</div>
						<div className="coin-info">
							<p style={{color:"black"}}>Postal Code</p>
							<p style={{color:"black"}}>{logRowData?.zip}</p>
						</div>
						<div className="coin-info">
							<p style={{color:"black"}}>Ip</p>
							<p style={{color:"black"}}>{logRowData?.ip}</p>
						</div>
						<div className="coin-info">
							<p style={{color:"black"}}>Ip type</p>
							<p style={{color:"black"}}>{logRowData?.type}</p>
						</div>
						<div className="coin-info">
							<p style={{color:"black"}}>Latitude</p>
							<p style={{color:"black"}}>{logRowData?.latitude}</p>
						</div>
						<div className="coin-info">
							<p style={{color:"black"}}>Longitude</p>
							<p style={{color:"black"}}>{logRowData?.longitude}</p>
						</div>
						<div className="coin-info">
							<p style={{color:"black"}}>Continent</p>
							<p style={{color:"black"}}>{logRowData?.continent_name}</p>
						</div>
						<div className="coin-info">
							<p style={{color:"black"}}>Continent code</p>
							<p style={{color:"black"}}>{logRowData?.continent_code}</p>
						</div>
						<Accordion  flush>
					<Accordion.Item eventKey="0" style={{width:"470px"}}> 
								<Accordion.Header>Currency</Accordion.Header>
								<Accordion.Body>
									<div className="coin-info">
										<p style={{ color: "black" }}>Currency code</p>
										<p style={{ color: "black" }}>{logRowData?.currency?.code}</p>
									</div>
									<div className="coin-info">
										<p style={{ color: "black" }}>Currency name</p>
										<p style={{ color: "black" }}>{logRowData?.currency?.name}</p>
									</div>
									<div className="coin-info">
										<p style={{ color: "black" }}>Currency symbol</p>
										<p style={{ color: "black" }}>{logRowData?.currency?.symbol}</p>
									</div>
								</Accordion.Body>
							</Accordion.Item>
					 <Accordion.Item eventKey="1" style={{width:"470px"}}> 
					 <Accordion.Header >location</Accordion.Header>
					 <Accordion.Body>
								<div className="coin-info">
							<p style={{color:"black"}}>Capital</p>
							<p style={{color:"black"}}>{logRowData?.location?.capital}</p>
						</div>
						<div className="coin-info">
							<p style={{color:"black"}}>Calling code</p>
							<p style={{color:"black"}}>{logRowData?.location?.calling_code}</p>
						</div>
						<div className="coin-info">
							<p style={{color:"black"}}>Geo Name Id</p>
							<p style={{color:"black"}}>{logRowData?.location?.geoname_id}</p>
						</div>
								</Accordion.Body>
					 </Accordion.Item>
					 <Accordion.Item eventKey="2" style={{width:"470px"}}> 
					 <Accordion.Header>time zone</Accordion.Header>
					 <Accordion.Body>
								<div className="coin-info">
							<p style={{color:"black"}}>Current time</p>
							<p style={{color:"black"}}>
								
							<Moment format='DD/MM/YYYY HH:mm:ss'>{moment(new Date(logRowData?.time_zone?.current_time),'DD/MM/YYYY HH:mm:ss')}</Moment></p>
						</div>
						<div className="coin-info">
							<p style={{color:"black"}}>code</p>
							<p style={{color:"black"}}>{logRowData?.time_zone?.code}</p>
						</div>
						<div className="coin-info">
							<p style={{color:"black"}}>Gmt Offset</p>
							<p style={{color:"black"}}>{logRowData?.time_zone?.gmt_offset}</p>
						</div>
								</Accordion.Body>
					 </Accordion.Item>
					 
					</Accordion>
					</Modal.Body>
					<Modal.Footer>
					<Button
              type="primary"
              className="primary-btn"
              onClick={() =>
                this.setState({ ...this.state, auditDetailsModal: false })
              }>
              Close
            </Button>
					</Modal.Footer>
				</Modal>
				
			</>
		);
	}
}

const connectStateToProps = ({oidc }) => {
	return { user: oidc?.adminDetails }
  }
export default connect(connectStateToProps)(AuditLog);