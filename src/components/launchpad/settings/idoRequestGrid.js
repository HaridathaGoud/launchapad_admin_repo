import React, { Component } from 'react'
import List from "src/components/grid.component";
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/esm/Spinner';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Projects from '../../launchpad/projects/projects';
import ToasterMessage from "src/utils/toasterMessages";
import apiCalls from 'src/api/apiCalls';
import moment from 'moment';
import Moment from "react-moment";

class IdoRequestGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show:false,
            errorMsg:null,
            validated :false,
            currentCheckBox:'',
            idoRequestDetails: [],
            loader: false,
            btnLoader: false,
            stateChange: '',
            selectedObj: [],
            selection: [],
            SelectData: {},
            success:false,
            successMessage:'',
            errors :{},
            form:{},
            informationProjectView:'',
            showProjectInformationView:false,
            gridUrl: process.env.REACT_APP_API_LAUNCHPAD_POINT + "/api/v1" + "/Projects/IdosRequests",
            searchObj: {
                searchBy: null,
            },
            value: '',
        };
        this.gridRef = React.createRef();
    }
    statusValues = [{ name: "Submitted" }, { name: "Approved" }, { name: "Rejected" }]
    gridColumns = [
        {
            field: "",
            title: "",
            filter: false,
            sortable: false,
            width: 60,
            customCell: (props) => (
                <td className="text-center">
                  <label className="check-input-style">
                    <input
                     className={this.state.currentCheckBox === props.dataItem.id ? 'active' : 'inactive'}
                      id={props.dataItem.id}
                      name="check"
                      type="checkbox"
                      checked={this.state.selection.indexOf(props.dataItem.id) > -1}
                      onChange={(e) => this.handleInputChange(props, e)}
                    />
                    <span></span>
                  </label>
                </td>
              )
        },
        {
            field: "createdAt",
            title: "Created At",
            filter: true,
			filterType: "date",
            sortable: true,
            width: 200,
            customCell: (props) => (
                <td>
                    <div>
                        <Moment format='DD/MM/YYYY'>{moment(new Date(props.dataItem.createdAt), 'DD-MM-YYYY')}</Moment>

                    </div>
                </td>
            )
        },

        {
            field: "emailId",
            title: "Email",
            filter: true,
            sortable: true,
            width: 200,
        },
        {
            field: "projectName",
            title: "Project Name",
            filter: true,
            sortable: true,
            width: 200,
        },
        {
            field: "initialSupply",
            title: "Initial Supply",
            filter: true,
            sortable: true,
            filterType: "numeric",
            width: 200,
        },
        {
            field: "totalSupply",
            title: "Total No Of Tokens",
            filter: true,
            sortable: true,
            filterType: "numeric",
            width: 200,
        },
        {
            field: "status",
            title: "Status",
            filter: true,
            sortable: true,
            width: 200,
        },
        {
            field: "",
            title: "",
            filter: false,
            sortable: false,
            width: 150,
            customCell: (props) => (
                <td className='text-end'>
                    <Button onClick={() => this.getOnePersonDetailsBasedOnId(props.dataItem)} className="button-secondary c-pointer" style={{ minWidth: '112px', height: '36px', padding: '0' }}>
                        View
                    </Button>
                </td>
            )
        },
    ];
    handleBlur = (e) => {
        let value = e.target.value.trim();
        e.target.value = value;
      };
    handleChange = (e) => {
        if (e.target.value == "") {
            let { searchObj } = this.state;
            searchObj.searchBy = null;
            this.gridRef?.current?.refreshGrid();
        } else {
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

    handleSearch = (data) => {
        let { searchObj } = this.state;
        if(data ==""){
            searchObj.searchBy = null;
        }else{
            searchObj.searchBy = data;
            this.setState({ ...this.state, searchObj }, () => {
                this.gridRef.current.refreshGrid();
            });
        }
    };
    handleEnterSearch = async (e) => {
        let data = e.target.value.trim();
        if (e.key == 'Enter') {
            if (data == "") {
                e.target.value = data;
                e.preventDefault();
            } else {
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

    handleInputChange = (prop, e) => {
        const rowObj = prop.dataItem;
        const value =
            e.target.type === "checkbox" ? e.target.checked : e.target.value;
        const name = e.target.name;
        let { selection,selectedObj } = this.state;
        let idx = selection.indexOf(rowObj.id);
        if (selection) {
            selection = [];
        }
        if (idx > -1) {
            selection.splice(idx, 1);
        } else {
            selection.push(rowObj.id);
        }
        this.setState({
            ...this.state,
            [name]: value,
            SelectData: rowObj,
            stateChange: rowObj, selectedObj, selection, errorMsg: null
        });
    };

    getOnePersonDetailsBasedOnId = (item) => {
        this.setState({
            showProjectInformationView: true,
            informationProjectView: item.id,
        });
    };
    handleCloseProjectInformationView() {
        this.setState({
            showProjectInformationView: false,
            show: false,
        });
    }
    closeProject = (data, projectFlag) => {
        this.setState({
            success: projectFlag,
            showProjectInformationView: false,
            show: false,
        });
        if (projectFlag) {
            this.setState({
                successMessage: `Project saved successfully`,
                success: true
            });
            this.gridRef.current.refreshGrid();
            setTimeout(() => {
                this.setState({ success: data });
            }, 2000);
        }else{
            this.gridRef.current.refreshGrid();
        }
    }
    handleShow = () => {
        this.setState({
            errorMsg: null,
        });
         if (!this.state.SelectData.id) {
            this.setState({
                errorMsg: "Please select a record.",
            });
        } else if (this.state.selection.length === 0) {
            this.setState({
                errorMsg: "Please select a record.",
                show: false,
            });
        }
        // else if (this.state.SelectData.status==='Rejected') {
        //     this.setState({
        //         errorMsg: "You cannot change the state of a Rejected record.",
        //     });
        // }
        else {
            this.setState({
                show: true,
            });
        }
    };
    refreshGrid=()=>{
        this.gridRef.current.refreshGrid();
    }
    handleClose = () => {
        this.setState({
            show: false,
            selection: [],
            SelectData: {},
            form:{},
        })
    }
    idoStateChange = async () => {
        this.setState({
            errorMsg: null,
            btnLoader: true,
            show: true,
            loader: true,
            success: null,
        })
        let obj = {
            "projectId": this.state.SelectData.id,
            "state": this.state.selection
        }
        let res = await apiCalls.idoRequestStateChange(obj)
        if (res.ok) {
            this.gridRef.current.refreshGrid();
            this.setState({
                btnLoader: false,
                show: false,
                loader: false,
                success: true,
                successMessage: `Project ${this.state.selection} successfully`,
                selection: [],
                SelectData: {},
                form:{},
            })
            setTimeout(() => {
                this.setState({ success: false });
            }, 2500);

        } else {
            this.setState({
                errorMsg: false,
                loader: false,
                btnLoader: false,
                show: false,
            })
        }
    }
    setField = (field, value) => {
        this.setState(prevState => ({
            form: {
                ...prevState.form,
                [field]: value
            },
            selection: value,
            errors: {
                ...prevState.errors,
                [field]: null
            }
        }));
    };
     clearErrorMsg=()=>{
        this.setState({errorMsg: false }) 
      }

    render() {
        const { searchObj, gridUrl } = this.state;
        return (
            <>
                {this.state.errorMsg && (
                    <Alert variant="danger">
                    <div className='d-flex gap-4'>
                     <div className='d-flex gap-2 flex-1'>
                     <span className='icon error-alert'></span>
                     <p className='m1-2' style={{ color: 'red' }}>{this.state.errorMsg}</p>
                     </div>
                     <span className='icon close-red' onClick={this.clearErrorMsg}></span>
                    </div>
                  </Alert>
                )}
                <div className='custom-flex-launchpad statechange-sm'>
                    <Form className="d-flex grid-search">
                        <Form.Control

                            name='searchBy'
                            type="text"
                            autoComplete="off"
                            className="search-style mb-3 my-lg-0"
                            aria-label="Search"
                            onChange={(e) => this.handleChange(e)}
                            onKeyDown={(e) => this.handleEnterSearch(e)}
                            onBlur={(e) => this.handleBlur(e)}
                            maxLength={250}
                            placeholder="Search By Project Name"
                        />
                        <i className="icon search-icon" onClick={()=>this.handleSearch(this.state.searchObj.searchBy)}></i>
                    </Form>
                    <div className='d-flex align-items-center justify-content-end'>
                        <div className='d-flex align-items-center filter-style c-pointer mb-2 mb-md-0' onClick={this.handleShow} >
                            <span className='icon state-change'></span><p className='ms-2 mb-0 project-text text-purple'>State Change</p></div>
                    </div>
                </div>
                <div className=''>
                    <div className=''>
                        <div className=''>
                            <List
                                additionalParams={searchObj}
                                url={gridUrl}
                                ref={this.gridRef}
                                columns={this.gridColumns}
                                pSize={10}
                                className="custom-grid filter-none ido-grid"
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <Modal centered show={this.state.show} onHide={this.handleClose} backdrop={false} className="settings-modal profile-modal">
                        {this.state.errorMsg && (
                            <Alert variant="danger">
                                <div className='d-flex gap-4'>
                                    <div className='d-flex gap-2 flex-1'>
                                        <span className='icon error-alert'></span>
                                        <p className='m1-2' style={{ color: 'red' }}>{this.state.errorMsg}</p>
                                    </div>
                                    <span className='icon close-red' onClick={this.clearErrorMsg}></span>
                                </div>
                            </Alert>
                        )}
                        <Modal.Header >
                            <Modal.Title className='modal-title'>Confirm Approve/Reject?</Modal.Title><span onClick={this.handleClose} className='icon close c-pointer'></span>
                        </Modal.Header>
                        <Modal.Body className='px-4 py-5 launchpad-labels'>
                            <Row>
                                <Col>
                                    <Form>

                                    </Form>
                                    <Form.Label
                                        controlId="floatingSelectGrid"
                                        label="State"
                                        className=''
                                        name="status"
                                    >State</Form.Label>
                                    <Form.Control
                                        required
                                        as="select"
                                        type="select"
                                        name="state"
                                        className={`${this.state.SelectData?.status != "Rejected" && "c-pointer"}`}
                                        aria-label="Floating label select example"
                                        value={this.state.form?.status ? this.state.form?.status : this.state.SelectData?.status}
                                        // defaultValue={this.state.form?.status ? this.state.form?.status : this.state.SelectData?.status}
                                        maxLength={20}
                                        // disabled={this.state.SelectData?.status == "Rejected"}
                                        isInvalid={!!this.state.errors.country}
                                        onChange={(e) => { this.setField('status', e.currentTarget.value) }}
                                    >
                                        {this.statusValues?.map((item) => (
                                            <option key={item?.name}>{item.name}</option>
                                        ))}
                                    </Form.Control>

                                </Col>
                            </Row>
                            <div className='d-flex justify-content-end mt-5 btn-width'><span></span><div>
                                <Button className='cancel-btn' onClick={this.handleClose}
                                >Cancel</Button>

                                {/* {this.state.SelectData?.status != "Rejected" && */}
                                    <Button className='button-secondary ms-3' onClick={this.idoStateChange}
                                        disabled={this.state.btnLoader ||
                                            (this.state.form?.status == null && this.state.SelectData?.status == "Submitted") ||
                                            (this.state.form?.status == "Submitted" && this.state.SelectData?.status == "Submitted")
                                        }
                                    >
                                        <span>{this.state.btnLoader && <Spinner size="sm" className={`${this.state.btnLoader ? "text-black" : "text-light"}`} />}</span>
                                        <span>Ok</span></Button>
                                 {/* } */}
                            </div></div>
                        </Modal.Body>
                    </Modal>
                </div>
                <Modal
                    show={this.state.showProjectInformationView}
                    onHide={() => this.handleCloseProjectInformationView()}
                    className="project-detailview"
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Project Details
                        </Modal.Title>
                        <span className="icon close" onClick={() => this.handleCloseProjectInformationView()}></span>
                    </Modal.Header>
                    <Modal.Body className='project-details-popup'>
                        <div className="row">
                            <Projects informationProjectView={this.state.informationProjectView} closeProject={this.closeProject} />
                        </div>
                    </Modal.Body>
                </Modal>




                {this.state.success && <div className="">
                    <ToasterMessage isShowToaster={this.state.success} success={this.state.successMessage}></ToasterMessage>
                </div>
                }
            </>
        )
    }
}
export default IdoRequestGrid