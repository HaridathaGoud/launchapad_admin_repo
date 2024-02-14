import React, { Component } from "react";
import List from "../grid.component";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import { Form, Button,Modal,Spinner } from 'react-bootstrap';
import moment from 'moment';
import Moment from "react-moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Alert from 'react-bootstrap/Alert';
import apiCalls from "src/api/apiCalls";
import ToasterMessage from "src/utils/toasterMessages";

class Referral extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gridUrl: process.env.REACT_APP_API_END_POINT + "api/v1" + `/Admin/GetBonusData/${this.state?.daoID}`,
			searchObj: {
				searchBy: null,
			},
			show: false,
			validated: false,
			selectedObjs: [],
			selection: [],
			selectedObj: {},
			warningMsg: null,
			isLoading: false,
			success: null,
			daoID: this.props.daoData?.defaultData?.id,
			totalBonusData: {},
		};
		this.gridRef = React.createRef();

	}

	handleCopy = (dataItem) => {
		this.setState({ ...this.state, selectedObjs: dataItem, copied: true })
		setTimeout(() => this.setState({ copied: false }), 2000)
	};

	totalBonus = async () => {
		await apiCalls.totalBonus(this.state?.daoID || this.props.daoData?.defaultData?.id)
			.then((response) => {
				this.setState({ ...this.state, totalBonusData: response.data })
			}).catch(
				
			)
	}
	componentDidMount() {
		this.totalBonus()
	}

	gridColumns = [
		{
			field: "",
			title: "",
			locked: true,
			width: `${this?.props?.daoData?.profile?.profile.role != "Admin" ? "60" : ""}`,
			customCell: (props) => (
				<>
					{this?.props?.daoData?.profile?.profile.role != "Admin" &&
						< >
							<label className="check-input-style">
								<input
									id={props.dataItem.id}
									name="check"
									type="checkbox"
									checked={this.state.selection.indexOf(props.dataItem.id) > -1}
									onChange={(e) => this.handleInputChange(props, e)}
								/>
								<span></span>{" "}
							</label>
						</>
					}
				</>
			)
		},
		{
			field: "date",
			title: "Date",
			filter: true,
			filterType: "date",
			width: 120,
			customCell: (props) => (
				<td>
					<div>
						<Moment format='DD/MM/YYYY'>{moment(new Date(props.dataItem.date), 'DD/MM/YYYY')}</Moment>

					</div>
				</td>
			)
		},
		{
			field: "name",
			title: "Name",
			filter: true,
			width: 200
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
							<span className="gridLink c-pointer batch-filename">
								<Link to={`/minting/customers/profileinfo/${props?.dataItem?.walletAddress}/${props?.dataItem?.id}`}>
									{props?.dataItem?.walletAddress}
								</Link>
							</span>
						</span>
						<CopyToClipboard text={props?.dataItem?.walletAddress} options={{ format: 'text/plain' }}
							onCopy={() => this.handleCopy(props?.dataItem)}>
							<span className={(this.state.copied && this.state.selectedObjs?.id === props?.dataItem?.id) ? "icon copied-check" : "icon copy c-pointer"}></span>
						</CopyToClipboard>
					</div>
				</td>
			),
		},

		{
			field: "value",
			title: "Value",
			filter: true,
			width: 180,
			dataType: "number",
			filterType: "numeric",
			customCell: (props) => (
				<div className="k-table-td">
					{parseFloat(props.dataItem.value).toLocaleString('en-US', {
						minimumFractionDigits: 2,
						maximumFractionDigits: 20,
					})}  {props.dataItem.coin}
				</div>
			)
		},

		{
			field: "status",
			title: "Status",
			filter: true,
			width: 200,
		},
	];
	handleChange = (e) => {
		if (e.target.value.trim() == "") {
			let { searchObj } = this.state;
			searchObj.searchBy = null;
			this.gridRef?.current?.refreshGrid();
		} else {
			let value = e.target.value.trim()
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


	handleInputChange = (prop, e) => {
		const rowObj = prop.dataItem;
		const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
		const name = e.target.name;
		let { selection, selectedObjs } = this.state;
		let idx = selection.indexOf(rowObj.id);
		if (idx > -1) {
			selection.splice(idx, 1);
			selectedObjs.splice(idx, 1);
		} else {
			selection.push(rowObj.id);
			selectedObjs.push(rowObj);
		}
		this.setState({ ...this.state, [name]: value, selectedObj: rowObj, stateChange: rowObj, selectedObjs, selection, warningMsg: null });
	};


	handleSearch = () => {
		let { searchObj } = this.state;
		let data = searchObj?.searchBy?.trim();
		if (data == "" || data == undefined || data.includes(".")) {

		} else {
			this.setState({ ...this.state, searchObj }, () => {
				this.gridRef.current.refreshGrid();
			});
		}
	};

	handleEnterSearch = async (e) => {
		let data = e.target.value.trim();
		if (e.key == 'Enter') {
			if (data == "" || data.includes(".")) {
				e.preventDefault();
			} else {
				this.gridRef?.current?.refreshGrid();
				e.preventDefault();
			}
		}
	}

	handleEdit = () => {
		this.setState({ ...this.state, warningMsg: null, success: null });
		let isUpdate = false
		const { selection, selectedObjs } = this.state
		if (selection.length === 0) {
			this.setState({ ...this.state, selection: [], selectedObjs: [], warningMsg: "Please select atleast one record" });
			this.useDivRef?.current?.scrollIntoView();
		} else if (selectedObjs.length > 0) {
			for (var i = 0; i < selectedObjs.length; i++) {
				if (selectedObjs[i]?.status?.toLowerCase() === "paid") {
					return this.setState({ ...this.state, selection: [], selectedObjs: [], warningMsg: "Please select pending records only" });

				} else {
					isUpdate = true
				}
			}
		}
		if (isUpdate) {
			this.setState({ ...this.state, show: true, success: null })
		}
	}

	handleCancel = () => {
		this.setState({ ...this.state, show: false, isLoading: false, selection: [], selectedObjs: [] })

	}


	saveAdminRefferal = async () => {
		this.setState({ ...this.state, isLoading: true })
		let obj = {
			ids: this.state.selection,
			status: "Paid"
		}
		let res = await apiCalls.updateRefferal(obj);
		if (res.ok) {
			this.setState({
				...this.state, show: false, isLoading: false, selection: [], selectedObjs: [],
				success: "Record paid successfully"
			})
			setTimeout(() => {
				this.setState({ success: null })
			}, 2000);
			this.gridRef.current.refreshGrid();
			this.totalBonus()
		} else {
			this.setState({ ...this.state, show: false, isLoading: false, selection: [], selectedObjs: [] })
		}

	}
	render() {
		const { searchObj, warningMsg } = this.state;
		if (this.props.daoData?.defaultData?.id != this.state?.daoID) {
			this.setState({ ...this.state, daoID: this.props.daoData?.defaultData?.id }, () => this.gridRef?.current?.refreshGrid())
			this.setState({ ...this.state, daoID: this.props.daoData?.defaultData?.id }, () => this.totalBonus())
		}

		return (
			<>
				<CBreadcrumb>
					<CBreadcrumbItem>
						Minting
					</CBreadcrumbItem>
					<CBreadcrumbItem active>Referral's Bonus</CBreadcrumbItem>
				</CBreadcrumb>
				{warningMsg && (

					<Alert variant="danger" className="cust-alert-design">
						<p className='d-flex  mb-0 text-danger align-items-center'><span className='icon error-alert c-pointer'></span>{warningMsg}</p>
					</Alert>
				)}
				<div className='custom-flex pb-4 pt-2 justify-content-between'>
					<Form className="d-lg-flex grid-search mobile-block sm-text-right" >
						<Form.Control
							style={{ width: "450px" }}
							name='searchBy'
							type="text"
							autoComplete="off"
							className="search-style  my-3 my-lg-0 ms-0"
							aria-label="Search"
							onChange={(e) => this.handleChange(e)}
							onKeyDown={(e) => this.handleEnterSearch(e)}
							maxLength={250}
							placeholder="Search by Name and Wallet Address" />
						<Button className="filled-btn ms-lg-3 " type="button" onClick={this.handleSearch} >
							Search</Button>
					</Form>
					{this?.props?.daoData?.profile?.profile.role != "Admin" && <div className="sm-text-end">
						<Button className="filled-btn ms-lg-3 w-2" type="button" onClick={this.handleEdit}  >
							Pay</Button>
					</div>}
				</div>

				<div className='profile-section'>
					<List
						additionalParams={searchObj}
						url={process.env.REACT_APP_API_END_POINT + "api/v1" + `/Admin/GetBonusData/${this.state?.daoID}`}
						ref={this.gridRef}
						columns={this.gridColumns}
						pSize={10}
						className="custom-grid"
					/>
					{this.state.success && <><div className="text-center toster-placement toster-place">
						<ToasterMessage isShowToaster={this.state.success} success={this.state.success}></ToasterMessage>
					</div>
					</>}
				</div>
				<Modal className="settings-modal pay-modal modal-tabview"
					show={this.state.show}
					size="lg"
					aria-labelledby="contained-modal-title-vcenter"
					centered
				>
					<Form  >
						<Modal.Header className="d-flex justify-content-between">
							<Modal.Title id="example-custom-modal-styling-title">
								Confirmation
							</Modal.Title>
							<span className="icon close" onClick={() => this.handleCancel()}></span>


						</Modal.Header>
						<Modal.Body>
							<p>Are you sure, Do you want to change the state from Pending to Paid ?</p>
						</Modal.Body>

						<Modal.Footer>
							<div className="text-end"><Button className="transparent-btn" onClick={() => { this.handleCancel() }} style={{ width: '100px' }}>No</Button>
								<Button className="filled-btn ms-lg-3 ms-2" onClick={() => this.saveAdminRefferal()} style={{ width: '100px' }}>
									<span>{this.state.isLoading && <Spinner size="sm" />}  </span> Yes</Button></div>
						</Modal.Footer>
					</Form>
				</Modal>
			</>

		);
	}
}
const connectStateToProps = ({ walletAddress, oidc }) => {
	return {
		address: walletAddress, trackAuditLogData: oidc.trackAuditLogData, customerId: oidc?.adminDetails?.id,
		daoData: oidc
	}
}
export default connect(connectStateToProps)(Referral);
