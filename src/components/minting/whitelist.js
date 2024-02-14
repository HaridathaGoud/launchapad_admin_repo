import React, { Component } from "react";
import List from "../grid.component";
import { connect } from 'react-redux';
import { Col, Form, Button, Row, Spinner,Modal, FloatingLabel  } from "react-bootstrap";
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react';
import InputGroup from 'react-bootstrap/InputGroup';
import { getPeriodsType, getWhiteListedData, saveWhitelist } from "src/reducers/authReducer";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ToasterMessage from "src/utils/toasterMessages";
import Alert from 'react-bootstrap/Alert';
class MintWhitelist extends Component {
	constructor(props) {
		super(props);
		this.handleValueChange = this.handleValueChange.bind(this);
		this.state = {
			gridUrl: process.env.REACT_APP_API_GRID + "/api/v1" + `/Admin/whitelistingK/${this.state?.daoID}`,
			searchObj: {
				type: "All",
				searchBy: null,
			},
			whitelistedModal: false,
			copied: false,
			selection: null,
			remarksValue: null,
			keys: null,
			selectedObj: {},
			taskData: null,
			success: null,
			remarksError: null,
			required: false,
			daoID: this.props.daoData,
			saveError: null,
			selectedURL: null,
		};
		this.gridRef = React.createRef();
	}

	componentDidMount() {
		this.props.getPeriodsType();
	}
	gridColumns = [
		{
			field: "name",
			title: "Name",
			filter: true,
			width: 260,
		},
		{
			field: "walletAddress",
			title: "Wallet Address",
			filter: true,
			width: 430,
			customCell: (props) => (
				<td className='copy-width'>
					<div className="d-flex justify-content-between text-white" >
						<span className="d-flex justify-content-between">
							{props?.dataItem?.walletAddress}
						</span>
						<CopyToClipboard text={props?.dataItem?.walletAddress} options={{ format: 'text/plain' }}
							onCopy={() => this.handleCopy(props?.dataItem)}>
							<span className={(this.state.copied && this.state.selection?.id === props?.dataItem?.id) ? "icon copied-check" : "icon copy c-pointer"}></span>
						</CopyToClipboard>

					</div>
				</td>
			),
		},
		{
			field: "type",
			title: "Type",
			filter: true,
			width: 180,
		},
		{
			field: "taskCount",
			title: "Task's",
			filter: true,
			dataType: "number",
			filterType: "numeric",
			width: 180,
			customCell: (props) => (
				<td className='copy-width'>
					<div className="" >
						<div className="whitelist-count gridLink batch-filename d-flex align-items-center">
							<span className="gridLink c-pointer batch-filename " onClick={() => this.getWhiteListedData(props.dataItem)}>{props.dataItem.taskCount}
							</span>
							<span className="icon sm expand ms-2" onClick={() => this.getWhiteListedData(props.dataItem)}></span>
						</div>
					</div>
				</td>
			),
		},
		{
			field: "whiteListStatus",
			title: "Whitelisted Status",
			filter: true,
			width: 200,
		},
		{
			field: "country",
			title: "Country",
			filter: true,
			width: 200,
		},
	];

	handleCopy = (dataItem) => {
		this.setState({ ...this.state, selection: dataItem, copied: true })
		setTimeout(() => this.setState({ copied: false }), 2000)
	}
	handleCopyURL = (dataItem) => {
		this.setState({ ...this.state, selectedURL: dataItem, copied: true })
		setTimeout(() => this.setState({ copied: false }), 2000)
	}

	handleSearch = (e) => {
		let { searchObj } = this.state;
		searchObj.type = e.target.value == 'Select' ? "All" : e.target.value
		this.setState({ ...this.state, searchObj }, () => {
			this.gridRef.current.refreshGrid();
		});
	};

	handleSearchByName = () => {
		let { searchObj } = this.state;
		let data = searchObj?.searchBy?.trim();
		if (data == "" || data == undefined) {

		} else {
			this.setState({ ...this.state, searchObj }, () => {
				this.gridRef.current.refreshGrid();
			});
		}
	};


	getWhiteListedData = (data) => {
		this.setState({ ...this.state, whitelistedModal: true, selectedObj: data, remarksError: null, required: null }, () => {
			this.props.getWitelistingData(data.id);
		});
	}
	saveWhitelistData = (e, value) => {
		e.preventDefault();
		let obj = {
			whitelistingId: this.props.whitelistingData?.data?.id,
			status: value,
			remarks: this.state.remarksValue || this.props.whitelistingData?.data.remarks,
		}
		if ((obj.remarks == "" || obj.remarks == null || this.state.remarksValue == null || this.state.remarksValue == "") && obj.status == "Rejected") {
			this.setState({ remarksError: "Please enter remarks", required: "true" })
		} else {
			this.props.saveWhitelist(obj)
			setTimeout(() => {
				if (!this.state.saveError) {
					setTimeout(() => this.setState({ whitelistedModal: false }, () => this.gridRef?.current?.refreshGrid()), 1000,)
					this.setState({ ...this.state, success: `Registration ${value} successfully`, remarksError: null, required: null })
					setTimeout(() => {
						this.setState({ success: null })
					}, 2000);
				}
			}, 1000)
		}

	}
	handleChange = (e) => {
		if (!e.target.value.includes(".")) {
			if (e.target.value == "") {
				let { searchObj } = this.state;
				searchObj.searchBy = null;
				this.gridRef?.current?.refreshGrid();
			} 
			let value = e.target.value
			let { searchObj } = this.state;
			if (value == "") {
				searchObj.searchBy = null;
			} else {
				let data = value.trim();
				searchObj.searchBy = data;
			}
			this.setState({ ...this.state, searchObj });
			e.preventDefault();
		}
	};
	handleValueChange = (e) => {
		const reg = /<(.|\n)*?>/g;
		const emojiRejex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff]|[\u2010-\u2017])/g;
		if (e.target.value && (reg.test(e.target.value) || e.target.value.match(emojiRejex))) {
			this.setState({ remarksError: "Please enter valid content" })
		} else {
			this.setState({ remarksValue: e?.target?.value?.trim(), remarksError: null })
		}
	}
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
	closeWhitelistModal = () => {
		this.setState({ whitelistedModal: false })
		this.gridRef?.current?.refreshGrid()
	}

	render() {
		const { success } = this.state
		if (this.props.whitelistingData?.data?.taskData != this.state.taskData) {
			const taskData = this.props.whitelistingData?.data?.taskData;
			const keys = taskData ? Object.keys(taskData) : [];
			const remarks = this.props.whitelistingData?.data?.remarks;
			this.setState({ ...this.state, taskData: taskData, keys: keys, remarksValue: remarks })
		}
		if (this.props?.daoData != this.state?.daoID) {
			this.setState({ ...this.state, daoID: this.props?.daoData }, () => this.gridRef?.current?.refreshGrid())
		}
		if (this.state.saveError != this.props?.savewhitelistobj?.error) {
			this.setState({ saveError: this.props?.savewhitelistobj?.error })
		}
		return (
			<>
				<div className=''>
					<CBreadcrumb>
						<CBreadcrumbItem>
							Minting
						</CBreadcrumbItem>
						<CBreadcrumbItem active>Whitelisting</CBreadcrumbItem>
					</CBreadcrumb>
					<div className=''>
						<div className="whitelist-flex my-lg-5 my-5">
							<FloatingLabel controlId="floatingInput" className="input-style db-lookupstyle mb-0" >
								<InputGroup className="input-style no-wrap mobile-noinput country-code-style">
									<Form.Control
										as="select"
										type="select"
										name="Type"
										className="c-pointer"
										onChange={(e) => this.handleSearch(e)}
										placeholder="Select Any One"
									>
										<option>Select</option>
										{this.props?.proposarDetailas?.map((item, index) => (<>
											<option key={index} value={item.type}>{item.type}</option>
										</>
										))}
									</Form.Control>
									<label className="floatingInput-number cust-zindex">Type</label>
								</InputGroup>
							</FloatingLabel>
							<Form.Control
								name='searchBy'
								type="text"
								autoComplete="off"
								className="search-style customer-grid-search ms-md-4 my-3 my-lg-0"
								aria-label="Search"
								onChange={(e) => this.handleChange(e)}
								onKeyDown={(e) => this.handleEnterSearch(e)}
								maxLength={45}
								placeholder="Search by Name and Wallet Address" />
							<div className="ms-md-3 text-end"><Button className="filled-btn" type="button" onClick={this.handleSearchByName} >
								Search</Button></div>
						</div>

						<Form className="d-flex align-center">
						</Form>
						<Modal className="settings-modal profile-modal modal-tabview whitelist-modal-wd"
							size="lg"
							centered
							aria-labelledby="contained-modal-title-vcenter"
							show={this.state.whitelistedModal}>
							<Modal.Header className="d-flex justify-content-between">
								<Modal.Title id="example-custom-modal-styling-title">
									{this.state.selectedObj?.whiteListStatus && <span className={`${this.state.selectedObj?.whiteListStatus == "Rejected" && "complitedRed kyc-badge ms-2" || this.state.selectedObj?.whiteListStatus == "Approved" && "kyc-badge completedGreen ms-2" || this.state.selectedObj?.whiteListStatus != "Completed" && "kyc-badge ms-2"}`}>{this.state.selectedObj?.whiteListStatus}</span>}
								</Modal.Title>
								<span className="icon close" onClick={() => this.closeWhitelistModal()}></span>
							</Modal.Header>
							{this.props?.whitelistingerror?.error && (
								<Alert variant="danger">
									<div className='d-flex align-items-center'>
										<span className='icon error-alert'></span>
										<p className='m1-2' style={{ color: 'red' }}>{this.props?.whitelistingerror?.error}</p>
									</div>
								</Alert>
							)}
							{this.props?.savewhitelistobj?.error && (
								<Alert variant="danger">
									<div className='d-flex align-items-center'>
										<span className='icon error-alert'></span>
										<p className='m1-2' style={{ color: 'red' }}>{this.props?.savewhitelistobj?.error}</p>
									</div>
								</Alert>
							)}
							<Modal.Body>
								<div className="text-center">{this.props?.whitelistingData?.loading && <Spinner></Spinner>}</div>
								<Row className="px-lg-4 mb-2 px-2">
									{this.state.keys?.map((key) => (
										<Col key={key} xl={6} sm={12} md={6}>
											{typeof this.state.taskData[key] === 'object' ? (
												Object.keys(this.state.taskData[key]).map((nestedKey, nestedValue) => (
													<div key={nestedKey} value={nestedValue}>
														<p className="user-label mb-0">{nestedKey}</p>
														<div className="d-flex">
															<p className="profile-value">{this.state.taskData[key][nestedKey]}</p>
															<CopyToClipboard text={this.state.taskData[key][nestedKey]} options={{ format: 'text/plain' }}
																onCopy={() => this.handleCopyURL(nestedKey)}>
																<span className={(this.state.copied && this.state.selectedURL === nestedKey) ? "icon copied-check" : "icon copy c-pointer"}></span>
															</CopyToClipboard></div>
													</div>
												))
											) : (
												<div>
													<Form.Label className='price-label'>{key}</Form.Label>
												</div>
											)}
										</Col>
									))}
									{!this.props?.whitelistingData?.loading && <Col lg={12} md={12}>
										<FloatingLabel
											controlId="floatingTextarea"
											label={this.state.required ? "Remarks*" : "Remarks"}
											className="mb-1 input-style mt-2 text-area-input text-Width"
										>
											<Form.Control defaultValue={this.state?.remarksValue} rows={8} name='remarks' as="textarea" placeholder="Remarks"
												maxLength={250}
												onSelect={this.handleValueChange}
												onChange={(e) => this.handleValueChange(e)}
												disabled={this.state?.selectedObj?.whiteListStatus == "Approved" || this.props?.userInfo.role != "Admin" || this.state?.selectedObj?.whiteListStatus == "Rejected" ? true : false}
												isInvalid={!!this.state?.remarksError}
												feedback={this.state?.remarksError} />
											<Form.Control.Feedback type="invalid">{this.state?.remarksError}</Form.Control.Feedback>
										</FloatingLabel>
									</Col>}
								</Row>
							</Modal.Body>

							<Modal.Footer>
								<div className="text-end whitelist-btns">
									{this.props?.userInfo.role == "Admin" &&
										<>
											<Button className="whitlist-reject-btn"
												disabled={this.state.selectedObj.whiteListStatus == "Approved" || this.state?.selectedObj?.whiteListStatus == "Rejected" ? true : false}
												onClick={(e) => this.saveWhitelistData(e, "Rejected")} >Reject Whitelist{this.props?.savewhitelistobj?.loading && this.props?.savewhitelistobj?.status == "Rejected" && <Spinner size="sm" />}</Button>
											<Button className="filled-btn ms-lg-3 ms-2" type="submit" onClick={(e) => this.saveWhitelistData(e, "Approved")}
												disabled={this.state?.selectedObj?.whiteListStatus == "Approved" || this.state?.selectedObj?.whiteListStatus == "Rejected" ? true : false}
											>
												Approve Whitelist{this.props?.savewhitelistobj?.loading && this.props?.savewhitelistobj?.status == "Approved" && <Spinner size="sm" />}</Button>
										</>}
								</div>
							</Modal.Footer>
						</Modal>
						<div className='profile-section'>
							<List
								additionalParams={this.state.searchObj}
								url={process.env.REACT_APP_API_GRID + "/api/v1" + `/Admin/whitelistingK/${this.state?.daoID}`}
								ref={this.gridRef}
								columns={this.gridColumns}
								pSize={10}
								className="custom-grid whitelist-grid"
							/>
							{success && <><div className="text-center toster-placement toster-place">
								<ToasterMessage isShowToaster={success} success={success}></ToasterMessage>
							</div>
							</>}
						</div>
					</div>
				</div>
			</>
		);
	}
}


const connectStateToProps = ({ oidc }) => {
	return { userInfo: oidc?.profile?.profile, user: oidc?.adminDetails, proposarDetailas: oidc.fetchperiodtype, whitelistingData: oidc.fetchwhitelistingdata, daoData: oidc.defaultData?.id, savewhitelistobj: oidc.savewhitelistdata, whitelistingerror: oidc?.fetchwhitelistingerror }
}
const connectDispatchToProps = (dispatch) => {
	return {
		getPeriodsType: () => {
			dispatch(getPeriodsType());
		},
		getWitelistingData: (id) => {
			dispatch(getWhiteListedData(id));
		},
		saveWhitelist: (obj) => {
			dispatch(saveWhitelist(obj))
		}
	}
}
export default connect(connectStateToProps, connectDispatchToProps)(MintWhitelist);