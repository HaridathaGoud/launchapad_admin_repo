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
            width: 60,
            customCell: (props) => (
				<>
                    <td>
                    <label className="check-input-style">
                        <input
                        className={this.state.currentCheckBox === props.dataItem.id ? 'active' : 'inactive'}
                            id={props.dataItem.id}
                            name="check"
                            type="checkbox"
                            checked={this.state.selection.indexOf(props.dataItem.id) > -1}
                            onChange={(e) => this.handleInputChange(props, e)}
                        />
                        <span></span>{" "}
                    </label>
                    </td>
                </>)
        },
        {
            field: "createdAt",
            title: "Created At",
            filter: true,
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
            title: "Email Id",
            filter: true,
            width: 200,
        },
        {
            field: "projectName",
            title: "Project Name",
            filter: true,
            width: 200,
        },
        {
            field: "initialSupply",
            title: "Initial Supply",
            filter: true,
            width: 200,
        },
        {
            field: "totalSupply",
            title: "Total Supply",
            filter: true,
            width: 200,
        },
        {
            field: "status",
            title: "Status",
            filter: false,
            width: 200,
        },
        {
            field: "",
            title: "",
            filter: false,
            width: 150,
            customCell: (props) => (
                <td className='text-end'>                   
                        <Button onClick={() => this.getOnePersonDetailsBasedOnId(props.dataItem)} className="button-secondary c-pointer" style={{minWidth:'112px',height:'36px',padding:'0'}}>                           
                           View                          
                        </Button>                   
                </td>
            )
        },
    ];
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

    handleSearch = () => {
        let { searchObj } = this.state;
        this.setState({ ...this.state, searchObj }, () => {
            this.gridRef.current.refreshGrid();
        });
    };
    handleEnterSearch = async (e) => {
        let data = e.target.value.trim();
        if (e.key == 'Enter') {
            if (data == "") {
                e.preventDefault();
            } else {
                this.gridRef?.current?.refreshGrid();
                e.preventDefault();
            }
        }
    }

	handleInputChange = (prop, e) => {
		const rowObj = prop.dataItem;
		const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
		const name = e.target.name;
		let { selection, selectedObj } = this.state;
		let idx = selection.indexOf(rowObj.id);
		if (idx > -1) {
			selection.splice(idx, 1);
			selectedObj.splice(idx, 1);
		} else {
			selection.push(rowObj.id);
			selectedObj.push(rowObj);
		}
		this.setState({ ...this.state, [name]: value, SelectData: rowObj, stateChange: rowObj, selectedObj, selection, errorMsg: null });
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
            setTimeout(() => {
                this.setState({ success: data });
            }, 2000);
        }
      }
      handleShow = () => {
        this.setState({
            errorMsg: null,
        });
        if (this.state.selection.length === 0) {
            this.setState({
                errorMsg: "Please select at least one record.",
            });
        } else {
            this.setState({
                show: true,
            });
        }
    };
      
   handleClose = () => {
    this.setState({
        show:false,
    })
  }
   idoStateChange = async () => {
    this.setState({
        errorMsg:null,
        btnLoader:true,
        show:true,
        loader:true,
        success:null,
    })
    let obj = {
      "projectId": this.state.SelectData.id,
      "state": this.state.selection
    }
    let res = await apiCalls.idoRequestStateChange(obj)
    if (res.ok) {
    this.setState({
      btnLoader:false,
      show:false,
      loader:false,
      success:true,
    successMessage:`Project ${this.state.selection} successfully`
    })
    this.gridRef.current.refreshGrid();
    setTimeout(() => {
        this.setState({ success: false });
    }, 2500);

    } else {
        this.setState({
            errorMsg:false,
            loader:false,
            btnLoader:false,
            show:false,
        })
    }
  }
  setField = (field, value) => {
    this.setState(prevState => ({
        form: {
            ...prevState.form,
            [field]: value
        },
        selection:value,
        errors: {
            ...prevState.errors,
            [field]: null
        }
    }));
};


    render() {
        const { searchObj, gridUrl } = this.state;
        return (
            <>
                {this.state.errorMsg && (
                    <Alert variant="danger">
                        <div className='d-flex align-items-center'>
                            <span className='icon error-alert'></span>
                            <p className='m1-2' style={{ color: 'red' }}>{this.state.errorMsg}</p>
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
                            maxLength={250}
                            placeholder="Search by Project Name"
                        />
                        <i className="icon search-icon" onClick={this.handleSearch}></i>
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
                                className="custom-grid filter-none"
                            />
                        </div>
                    </div>
                </div>
           <div>
           <Modal centered show={this.state.show} onHide={this.handleClose} backdrop={false} className="settings-modal profile-modal">
                  {this.state.errorMsg && (
                    <Alert variant="danger">
                      <div className='d-flex align-items-center'>
                        <span className='icon error-alert'></span>
                        <p className='m1-2' style={{ color: 'red' }}>{this.state.errorMsg}</p>
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
                          defaultValue={this.state.form?.status ? this.state.form?.status : this.state.SelectData?.status}
                          maxLength={20}
                          disabled={this.state.SelectData?.status == "Rejected"}
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

                      {this.state.SelectData?.status != "Rejected" &&
                        <Button className='button-secondary ms-3' onClick={this.idoStateChange}
                          disabled={this.state.btnLoader ||
                            (this.state.form?.status == null && this.state.SelectData?.status == "Submitted") ||
                            (this.state.form?.status == "Submitted" && this.state.SelectData?.status == "Submitted")
                          }
                        >
                          <span>{this.state.btnLoader && <Spinner size="sm" className='text-light' />}</span>
                          <span>Ok</span></Button>
                      }
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
          <Modal.Body>
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
  )}
        }
export default IdoRequestGrid