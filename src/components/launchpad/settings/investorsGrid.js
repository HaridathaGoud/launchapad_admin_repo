import React, { Component } from "react";
import List from "src/components/grid.component";
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/esm/Spinner';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ToasterMessage from "src/utils/toasterMessages";
import jsonCountryCode from 'src/utils/countryCode.json';
import jsonPhoneCode from 'src/utils/phoneCode.json';
import InputGroup from 'react-bootstrap/InputGroup';
import { validateContentRules, emailValidation, validateContent } from "src/utils/custom.validator";
import apiCalls from 'src/api/apiCalls';
class InvestorsGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show:false,
            validated :false,
            loaderform:false,
            errorMessageProfile :null,
            success:false,
            successMessage:'',
            errors :{},
            form:{},
            gridUrl: process.env.REACT_APP_API_LAUNCHPAD_POINT + "/api/v1" + "/Projects/ProjectOwners",
            searchObj: {
                searchBy: null,
            },
            value: '',
        };
        this.gridRef = React.createRef();
    }

    gridColumns = [
        {
            field: "name",
            title: "Name",
            filter: true,
            width: 100,
        },
        {
            field: "mailId",
            title: "Mail Id",
            filter: true,
            width: 100,
        },
        {
            field: "phoneNumber",
            title: "Phone Number",
            filter: true,
            width: 100,
        },{
            field: "",
            title: "",
            filter: false,
            width: 30,
            customCell: (props) => (
                <td>
                    <div>
                    <Button onClick={() => this.handleProject(props.dataItem)} className='button-secondary py-1'>Projects</Button>
                    </div>
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

    
    addInvestors = () => {
            this.setState({
                show: true,
                form: {},
                errors: {},
                errorMessageProfile: false
            });
        };
    handleProject = (items) => {
        this.props.getRedirect(items);
     };

    handleCancel = () => {
        this.setState({
            show: false,
            form: {},
            errors: {},
            errorMessageProfile: false
        });
    };
  setShow=()=>{
    this.setState({
        show: false,
    })
  };
  setField = (field, value) => {
    this.setState(prevState => ({
        form: {
            ...prevState.form,
            [field]: value
        },
        errors: {
            ...prevState.errors,
            [field]: null
        }
    }));
};

    validateForm = (obj, isChange) => {
        const { firstName, lastName, phoneNo, email, userName, phoneNoCountryCode, country, password } = isChange ? obj : this.state.form;
        const whiteSpace = /\s/;
        const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
        const newErrors = {};
        if (!firstName || firstName === '') {
            newErrors.firstName = "Is required";
        }
        else if (!validateContentRules("", firstName) || firstName?.match(whiteSpace)) {
            newErrors.firstName = "Invalid first name";
        }
        if (!lastName || lastName === '') {
            newErrors.lastName = "Is required";
        }
        else if (!validateContentRules("", lastName) || lastName?.match(whiteSpace)) {
            newErrors.lastName = "Invalid last name";
        }
        if (!userName || userName === '') {
            newErrors.userName = "Is required";
        }
        else if (!validateContentRules("", userName) || userName?.match(whiteSpace)) {
            newErrors.userName = "Invalid User name";
        }

        if (!email || email == '') {
            newErrors.email = "Is required";
        } else if (emailValidation("", email)) {
            newErrors.email = "Invalid Email";
        } else if (!emailReg) {
            newErrors.email = "Invalid Email";
        }


        if (!phoneNo || phoneNo === '') {
            newErrors.phoneNo = "Is required";
        }
        else if (!validateContentRules("", phoneNo)) {
            newErrors.phoneNo = "Invalid phone number";
        }
        if ((!phoneNoCountryCode || phoneNoCountryCode === " ")) {
            newErrors.phoneNoCountryCode = "Is required";
        }
        if (!country || country === "Select Country") {
            newErrors.country = "Is required";
        }
        if (!password || password === '') {
            newErrors.password = "Please enter new password";
        }
        else if (password && !(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&_]).{8,15}$/.test(password))) {
            newErrors.password =
                "Password must have at least 8 characters and cannot contain common words or patterns. Try adding numbers, symbols, or characters to make your password longer and unique."

        }
        else if (!validateContent(password)) {
            newErrors.password =
                "Please enter valid content"
        }
        return newErrors;
    };

    handleCreateInvestors = async (event) => {
        event.preventDefault();
        this.setState({
            errors: {},
            success: false,
        });
        const formErrors = this.validateForm();
        if (Object.keys(formErrors).length > 0) {
            this.setState({
                errors: formErrors,
                loaderform: false,
            });
        } else {
            this.setState({ loaderform: true });

            let obj = { ...this.state.form };
            obj.id = "00000000-0000-0000-0000-000000000000";
            obj.userId = "00000000-0000-0000-0000-000000000000";
            obj.createdBy = `${this.state.form.firstName} ${this.state.form.lastName}`;
            obj.modifiedBy = `${this.state.form.firstName} ${this.state.form.lastName}`;
            obj.createdDate = new Date();
            obj.modifiedDate = new Date();
            obj.isInvestor = true;

            let response = await apiCalls.createInvestors(obj);
            if (response.ok) {
                this.setState({
                    success: true,
                    successMessage: "Investor created successfully",
                    loaderform: false,
                    show: false,
                    form: {},
                });
                this.gridRef.current.refreshGrid();
                setTimeout(() => {
                    this.setState({ success: false });
                }, 2500);
            } else {
                this.setState({
                    errorMessageProfile: apiCalls.isErrorDispaly(response),
                    loaderform: false,
                });
            }
            this.setState({ validated: true, loaderform: false });
        }
    };

    render() {
        const { searchObj, gridUrl } = this.state;
        return (
            <>
             {/* {state.loader && <div className="text-center"><Spinner ></Spinner></div>} */}
             {/* {!state.loader && <>  </> } */}
             
                <div className='custom-flex pb-4 pt-2 justify-content-between'>
                    <Form className="d-flex grid-search">
                        <Form.Control
                            style={{width:"450px"}}
                            name='searchBy'
                            type="text"
                            autoComplete="off"
                            className="search-style my-3 my-lg-0"
                            aria-label="Search"
                            onChange={(e) => this.handleChange(e)}
                            onKeyDown={(e) => this.handleEnterSearch(e)}
                            maxLength={250}
                            placeholder="Search by Name "
                        />
                        <i className="icon search-icon" onClick={this.handleSearch}></i>
                    </Form>
                    <div className='d-flex align-items-center justify-content-end'>
            <Button className='primary-btn mt-3 mt-md-0 button-style'
              onClick={() => this.addInvestors()}><span className='icon add-icon'></span> Add Investor</Button>
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
                                className="custom-grid"
                            />
                        </div>
                    </div>
                </div>

                <Modal className="settings-modal profile-modal modal-tabview"
                    show={this.state.show}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Form noValidate validated={this.state.validated} >
                        <Modal.Header className="d-flex justify-content-between">
                            <Modal.Title id="example-custom-modal-styling-title">
                                Add Inverstor
                            </Modal.Title>
                            <span className="icon close" onClick={() => this.setShow()}></span>


                        </Modal.Header>

                        <Modal.Body className='launchpadadmin-modal'>
                            {this.state.errorMessageProfile && (
                                <Alert variant="danger">
                                    <div className='d-flex align-items-center'>
                                        <span className='icon error-alert'></span>
                                        <p className='m1-2' style={{ color: 'red' }}>{this.state.errorMessageProfile}</p>
                                    </div>
                                </Alert>
                            )}
                            <Row className="mb-4">


                                <Col xl={12}>
                                    <Row className="mt-3 mt-xl-0">

                                        <Col xl={6} className="mb-3">
                                            <Form.Group className=" " controlId="exampleForm.ControlInput1">
                                                <Form.Label >First Name*</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="firstName"
                                                    value={this.state.form?.firstName}
                                                    defaultValue={this.state.form?.firstName}
                                                    autoComplete="off"
                                                    onChange={(e) => { this.setField('firstName', e.currentTarget.value) }}
                                                    isInvalid={!!this.state.errors.firstName}
                                                    required
                                                    placeholder="First Name"
                                                    maxLength={50}
                                                    className=""
                                                />
                                                <Form.Control.Feedback type="invalid">{this.state.errors.firstName}</Form.Control.Feedback>
                                            </Form.Group>

                                        </Col>
                                        <Col xl={6} className="mb-3">
                                            <Form.Group className=" " controlId="exampleForm.ControlInput1">
                                                <Form.Label >Last Name*</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="lastName"
                                                    value={this.state.form?.lastName}
                                                    defaultValue={this.state.form?.lastName}
                                                    onChange={(e) => { this.setField('lastName', e.currentTarget.value) }}
                                                    isInvalid={!!this.state.errors.lastName}
                                                    required
                                                    placeholder="Last Name *"
                                                    maxLength={50}
                                                />
                                                <Form.Control.Feedback type="invalid">{this.state.errors.lastName}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col xl={6} className="mb-3">
                                            <Form.Group className=" " controlId="exampleForm.ControlInput1">
                                                <Form.Label >User Name*</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="userName"
                                                    value={this.state.form?.userName}
                                                    defaultValue={this.state.form?.userName}
                                                    onChange={(e) => { this.setField('userName', e.currentTarget.value) }}
                                                    isInvalid={!!this.state.errors.userName}
                                                    required
                                                    placeholder="Username *"
                                                    maxLength={50}
                                                />
                                                <Form.Control.Feedback type="invalid">{this.state.errors.userName}</Form.Control.Feedback>
                                            </Form.Group>

                                        </Col>
                                        <Col xl={6} className="mb-3">
                                            <Form.Group className=" " controlId="exampleForm.ControlInput1">
                                                <Form.Label >Email*</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="email"
                                                    value={this.state.form?.email}
                                                    defaultValue={this.state.form?.email}
                                                    onChange={(e) => { this.setField('email', e.currentTarget.value) }}
                                                    isInvalid={!!this.state.errors.email}
                                                    required
                                                    placeholder="Email *"
                                                    maxLength={50}
                                                />
                                                <Form.Control.Feedback type="invalid">{this.state.errors.email}</Form.Control.Feedback>
                                            </Form.Group>

                                        </Col>
                                        <Col xl={6} className="mb-3">
                                            <Form.Group >
                                                <Form.Label >Phone No*</Form.Label>
                                                <InputGroup className="mb-2 input-style no-wrap mobile-noinput">

                                                    <Form.Control
                                                        required
                                                        as="select"
                                                        type="select"
                                                        name="phoneNoCountryCode"
                                                        className="code-width c-pointer zindex1"
                                                        aria-label="Default select example"
                                                        onChange={(e) => { this.setField('phoneNoCountryCode', e.currentTarget.value) }}
                                                        value={this.state.form?.phoneNoCountryCode}
                                                        defaultValue={this.state.form?.phoneNoCountryCode}
                                                        isInvalid={!!this.state.errors.phoneNoCountryCode}
                                                    >
                                                        <option>Select</option>
                                                        {jsonPhoneCode.map((item) => (
                                                            <option key={item?.id}>{item.code}</option>
                                                        ))}

                                                    </Form.Control>


                                                    <Form.Control
                                                        type="text"
                                                        className="form-number input-radius"
                                                        name={'Gold'}
                                                        onChange={(e) => { this.setField('phoneNo', e.currentTarget.value) }}
                                                        isInvalid={!!this.state.errors.phoneNo}
                                                        value={this.state.form?.phoneNo}
                                                        defaultValue={this.state.form?.phoneNo}
                                                        onKeyPress={(e) => {
                                                            if (!/[0-9]/.test(e.key)) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        required
                                                        autoComplete="off"
                                                        maxLength={12}
                                                    />
                                                    <Form.Control.Feedback type="invalid">{this.state.errors.phoneNo}</Form.Control.Feedback>

                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                        <Col xl={6} className="mb-3">
                                            <Form.Group controlId="floatingInput"  >
                                                <Form.Label >Country*</Form.Label>
                                                <InputGroup className="  input-style no-wrap mobile-noinput country-code-style">

                                                    <Form.Control
                                                        required
                                                        as="select"
                                                        type="select"
                                                        name="country"
                                                        className="c-pointer zindex1"
                                                        aria-label="Default select example"
                                                        value={this.state.form?.country}
                                                        defaultValue={this.state.form?.country}
                                                        maxLength={20}
                                                        isInvalid={!!this.state.errors.country}
                                                        onChange={(e) => { this.setField('country', e.currentTarget.value) }}
                                                    >
                                                        <option>Select Country</option>
                                                        {jsonCountryCode.map((item) => (
                                                            <option key={item?.id}>{item.name}</option>
                                                        ))}
                                                    </Form.Control>


                                                    <Form.Control.Feedback type="invalid">{this.state.errors.country}</Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>

                                        <Col xl={6} className="mb-3">

                                            <Form.Group className=" " controlId="exampleForm.ControlInput1">
                                                <Form.Label >Password*</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="password"
                                                    value={this.state.form?.password}
                                                    defaultValue={this.state.form?.password}
                                                    onChange={(e) => { this.setField('password', e.currentTarget.value) }}
                                                    isInvalid={!!this.state.errors.password}
                                                    required
                                                    placeholder="Password *"
                                                    maxLength={50}
                                                />
                                                <Form.Control.Feedback type="invalid">{this.state.errors.password}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>


                                    </Row>
                                </Col>
                            </Row>

                        </Modal.Body>
                        <Modal.Footer>
                            <div className="text-end"><Button className="cancel-btn" disabled={this.state.loaderform} onClick={() => { this.handleCancel() }}>Cancel</Button>
                                <Button className="button-secondary ms-lg-3 ms-2" type="button" onClick={(e) => this.handleCreateInvestors(e)} disabled={this.state.loaderform}>
                                    <span>{this.state.loaderform && <Spinner size="sm" />} </span>Save</Button></div>
                        </Modal.Footer>
                    </Form>
                </Modal>

        {this.state.success && <div className="">
          <ToasterMessage isShowToaster={this.state.success} success={this.state.successMessage}></ToasterMessage>
        </div>}
            </>
        );
    }
}
export default InvestorsGrid;