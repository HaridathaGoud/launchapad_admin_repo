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
import Alert from 'react-bootstrap/Alert';
import { AutoComplete } from "@progress/kendo-react-dropdowns";
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
            showPassword:true,
            filteredCountries: [],
            filteredPhnCodes :[],
        };
        this.gridRef = React.createRef();
    }

    gridColumns = [
        {
            field: "name",
            title: "Name",
            filter: true,
            sortable: true,
            width: 200,
        },
        {
            field: "mailId",
            title: "Email",
            filter: true,
            sortable: true,
            width: 200,
        },
        {
            field: "phoneNumber",
            title: "Phone Number",
            filter: true,
            sortable: true,
            width: 120,
        },{
            field: "",
            title: "",
            filter: false,
            sortable: false,
            width: 150,
            customCell: (props) => (
                <td>
                   
                    <Button onClick={() => this.handleProject(props.dataItem)} className='button-secondary py-1'>Projects</Button>
                   
                </td>
            )
        },
    ];

    handleBlur = (e) => {
        let value = e.target.value?.trim();
        e.target.value = value;
      };
      trimField = (field) => {
        let value = this.state.form[field]?.trim() || '';
        this.setField(field, value);
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
                let data = value?.trim();
                searchObj.searchBy = data;
            }
            this.setState({ ...this.state, searchObj });
            e.preventDefault();
        }
    };

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
        },
        errorMessageProfile:null,
    }));
};

    validateForm = (obj, isChange) => {
        const { firstName, lastName, phoneNo, email, userName, phoneNoCountryCode, country, password } = isChange ? obj : this.state.form;
        const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
        const newErrors = {};
        const numbersOnly = /^\d+$/;
        const alphabetsOnly = /^[a-zA-Z\s]+$/;
        const specialCharsOnly = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
        if (!firstName?.trim() || firstName?.trim() === '') {
            newErrors.firstName = "Is required";
        }
        else if (!validateContentRules("", firstName?.trim()) || firstName?.trim()?.match(numbersOnly) || firstName?.trim()?.match(specialCharsOnly)) {
            newErrors.firstName = "Accepts alphanumeric and special chars.";
        }
        if (!lastName?.trim() || lastName?.trim() === '') {
            newErrors.lastName = "Is required";
        }
        else if (!validateContentRules("", lastName?.trim())|| lastName?.trim()?.match(numbersOnly) || lastName?.trim()?.match(specialCharsOnly)) {
            newErrors.lastName = "Accepts alphanumeric and special chars.";
        }
        if (!userName || userName === '') {
            newErrors.userName = "Is required";
        }
        else if (!validateContentRules("", userName)  || userName?.match(numbersOnly) || userName?.match(specialCharsOnly)) {
            newErrors.userName = "Accepts alphanumeric and special chars.";
        }

        if (!email || email == '') {
            newErrors.email = "Is required";
        } else if (emailValidation("", email)) {
            newErrors.email = "Invalid email address";
        } else if (!emailReg) {
            newErrors.email = "Invalid email address";
        }
        if (!phoneNo || phoneNo === '') {
            newErrors.phoneNo = "Is required";
        }
        else if (!validateContentRules("", phoneNo) || phoneNo.length <6|| phoneNo?.match(specialCharsOnly) ) {
            newErrors.phoneNo = "Invalid phone number";
        }
        if ((!phoneNoCountryCode || phoneNoCountryCode === " ") ||phoneNoCountryCode ==="Select" || phoneNoCountryCode===undefined) {
            newErrors.phoneNo = "Is required";
        }
        else if (!validateContentRules("", phoneNoCountryCode) || phoneNoCountryCode?.match(specialCharsOnly)) {
            newErrors.phoneNo = "Accepts numeric only";
        }
        if (!country || country === "Select Country") {
            newErrors.country = "Is required";
        }
        else if (!validateContentRules("", country)  || !country?.match(alphabetsOnly) ) {
            newErrors.country = "Accepts alphabets only.";
        }
        if (!password || password === '') {
            newErrors.password = "Please enter your password";
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
            const { firstName, lastName, ...rest } = this.state.form;
            const trimmedFirstName = firstName?.trim();
            const trimmedLastName = lastName?.trim();
            const updatedForm = { ...rest, firstName: trimmedFirstName, lastName: trimmedLastName };
            
            let obj = updatedForm;

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
    filterCountries = (event) => {
        const value = event.target.value;
        if (typeof value !== 'string') {
            value = ''; 
        }
        const filtered = jsonCountryCode?.filter(item =>
            item.name && item.name?.toLowerCase()?.includes(value?.toLowerCase())
        ).slice(-10); 

        this.setState({ filteredCountries: filtered });
        this.setField('country', value);
    }
    filterPhoneCodes= (event) => {
        const value = event.target.value;
        if (typeof value !== 'string') {
            value = ''; 
        }
        const filtered = jsonPhoneCode?.filter(item =>
            item.code && item.code?.toLowerCase()?.includes(value?.toLowerCase())
        ).slice(-10); 

        this.setState({ filteredPhnCodes: filtered });
        this.setField('phoneNoCountryCode', value);
    }
     clearErrorMsg=()=>{
        this.setState({
            errorMessageProfile: null,
        });
      }
    render() {
        const { searchObj, gridUrl } = this.state;
        return (
            <>
                <div className='custom-flex pb-4 pt-2 justify-content-between'>
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
                            placeholder="Search By Name "
                        />
                        <i className="icon search-icon" onClick={()=>this.handleSearch(this.state.searchObj.searchBy)}></i>
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
                                className="custom-grid filter-none"
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
                                    <div className='d-flex gap-4'>
                                        <div className='d-flex gap-2 flex-1'>
                                            <span className='icon error-alert'></span>
                                            <p className='m1-2' style={{ color: 'red' }}>{this.state.errorMessageProfile}</p>
                                        </div>
                                        <span className='icon close-red' onClick={this.clearErrorMsg}></span>
                                    </div>
                                </Alert>
                            )}
                            
                            <Row className="mb-4">


                                <Col xl={12}>
                                    <Row className="mt-3 mt-xl-0">

                                        <Col xl={6} className="mb-3">
                                            <Form.Group className=" " controlId="exampleForm.ControlInput1">
                                                <Form.Label >First Name<span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="firstName"
                                                    value={this.state.form?.firstName}
                                                    defaultValue={this.state.form?.firstName}
                                                    autoComplete="off"
                                                    onChange={(e) => { this.setField('firstName', e.currentTarget.value) }}
                                                    onBlur={() => this.trimField('firstName')}
                                                    isInvalid={!!this.state.errors.firstName}
                                                    required
                                                    placeholder="Enter First Name"
                                                    maxLength={49}
                                                    className=""
                                                />
                                                <Form.Control.Feedback className="error-space" type="invalid">{this.state.errors.firstName}</Form.Control.Feedback>
                                            </Form.Group>

                                        </Col>
                                        <Col xl={6} className="mb-3">
                                            <Form.Group className=" " controlId="exampleForm.ControlInput1">
                                                <Form.Label >Last Name<span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="lastName"
                                                    value={this.state.form?.lastName}
                                                    defaultValue={this.state.form?.lastName}
                                                    onChange={(e) => { this.setField('lastName', e.currentTarget.value) }}
                                                    onBlur={() => this.trimField('lastName')}
                                                    isInvalid={!!this.state.errors.lastName}
                                                    required
                                                    placeholder="Enter Last Name "
                                                    maxLength={49}
                                                />
                                                <Form.Control.Feedback className="error-space" type="invalid">{this.state.errors.lastName}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col xl={6} className="mb-3">
                                            <Form.Group className=" " controlId="exampleForm.ControlInput1">
                                                <Form.Label >User Name<span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="userName"
                                                    value={this.state.form?.userName}
                                                    defaultValue={this.state.form?.userName}
                                                    onChange={(e) => { this.setField('userName', e.currentTarget.value) }}
                                                    isInvalid={!!this.state.errors.userName}
                                                    required
                                                    placeholder="Enter Username "
                                                    maxLength={20}
                                                    onBlur={(e) => {
                                                        this.setField(
                                                          "userName",
                                                          e.target.value.trim().replace(/\s+/g, " ")
                                                        );
                                                      }}
                                                />
                                                <Form.Control.Feedback className="error-space" type="invalid">{this.state.errors.userName}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col xl={6} className="mb-3">
                                            <Form.Group className=" " controlId="exampleForm.ControlInput1">
                                                <Form.Label >Password<span className="text-danger">*</span></Form.Label>
                                                <div className="p-relative">
                                                <Form.Control
                                                    type={this.state?.showPassword ? "password" : "text"}
                                                    name="password"
                                                    value={this.state.form?.password}
                                                    defaultValue={this.state.form?.password}
                                                    onChange={(e) => { this.setField('password', e.currentTarget.value) }}
                                                    isInvalid={!!this.state.errors.password}
                                                    required
                                                    placeholder="Enter Password "
                                                    maxLength={50}
                                                    email
                                                    onBlur={(e) => {
                                                        this.setField(
                                                          "password",
                                                          e.target.value.trim().replace(/\s+/g, " ")
                                                        );
                                                      }}
                                                />
                                                <span onClick={()=>{
                                                    this.setState(prevState => ({
                                                        ...prevState,
                                                        showPassword: !prevState.showPassword
                                                    }));
                                                }} className={`icon ${this.state?.showPassword ? "pwd-eye-close" : "pwd-eye"} position-absolute c-pointer`}></span>
                                                </div>
                              {this.state.errors.password && <div className="text-invalid error-space">{this.state.errors.password} </div>}
                                            </Form.Group>
                                        </Col>

                                        <Col xl={6} className="mb-3">
                                            <Form.Group className=" " controlId="exampleForm.ControlInput1">
                                                <Form.Label >Email<span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="email"
                                                    value={this.state.form?.email}
                                                    defaultValue={this.state.form?.email}
                                                    onChange={(e) => { this.setField('email', e.currentTarget.value) }}
                                                    isInvalid={!!this.state.errors.email}
                                                    required
                                                    placeholder="Enter Email "
                                                    maxLength={30}
                                                    onBlur={(e) => {
                                                        this.setField(
                                                          "email",
                                                          e.target.value.trim().replace(/\s+/g, " ")
                                                        );
                                                      }}
                                                />
                                                <Form.Control.Feedback className="error-space" type="invalid">{this.state.errors.email}</Form.Control.Feedback>
                                            </Form.Group>

                                        </Col>
                                        <Col xl={6} className="mb-3">
                                            <Form.Group >
                                                <Form.Label >Phone No<span className="text-danger">*</span></Form.Label>
                                                <InputGroup className="mb-2 input-style no-wrap mobile-noinput phone-select">

                                                    <AutoComplete
                                                        className="form-control auto-complete-dropdown phone-code"
                                                        data={this.state.filteredPhnCodes?.map(item => item?.code)}
                                                        value={this.state.form?.phoneNoCountryCode}
                                                        defaultValue={this.state.form?.phoneNoCountryCode}
                                                        placeholder="Country Code..."
                                                        style={{ width: "150px" }}
                                                        onChange={this.filterPhoneCodes}
                                                    />
                                                    <Form.Control
                                                        type="text"
                                                        className="form-number input-radius"
                                                        name={'Gold'}
                                                        placeholder="Enter Phone Number"
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
                                                    <Form.Control.Feedback className="phonecode-error error-space" type="invalid">{this.state.errors.phoneNo}</Form.Control.Feedback>

                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                        <Col xl={6} className="mb-3">
                                            <Form.Group controlId="floatingInput">
                                                <Form.Label>Country<span className="text-danger">*</span></Form.Label>
                                                <InputGroup className="input-style no-wrap mobile-noinput country-code-style">
                                                    <div className="w-100">
                                                        <AutoComplete
                                                            className="form-control auto-complete-dropdown"
                                                            data={this.state.filteredCountries?.map(item => item?.name)}
                                                            value={this.state.form?.country}
                                                            defaultValue={this.state.form?.country}
                                                            placeholder="Enter Country"
                                                            style={{ width: "100%" }}
                                                            onChange={this.filterCountries}
                                                        />
                                                    </div>
                                                    <Form.Control.Feedback className="error-space" type="invalid" style={{ display: this.state.errors.country ? 'block' : 'none' }}>
                                                        {this.state.errors.country}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                        </Modal.Body>
                        <Modal.Footer>
                            <div className="text-end btn-width"><Button className="cancel-btn" disabled={this.state.loaderform} onClick={() => { this.handleCancel() }}>Cancel</Button>
                                <Button className="button-secondary ms-lg-3 ms-2" type="button" onClick={(e) => this.handleCreateInvestors(e)} disabled={this.state.loaderform}>
                                    <span>{this.state.loaderform && <Spinner size="sm" className={`${this.state.loaderform ? "text-black" : "text-light"}`}/>} </span>Save</Button></div>
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