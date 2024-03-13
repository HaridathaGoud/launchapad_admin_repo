import React, { useEffect, useState, useRef, useReducer } from 'react'
import { useNavigate } from "react-router-dom";
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import Spinner from 'react-bootstrap/esm/Spinner';
import apiCalls from 'src/api/apiCalls';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { setProject } from '../../reducers/projectDetailsReducer';
import { useDispatch } from 'react-redux';
import nodata from '../../assets/images/no-data.png'
import { Modal, FloatingLabel } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import { validateContentRules, emailValidation, validateContent } from "src/utils/custom.validator";
import ToasterMessage from "src/utils/toasterMessages";
import jsonCountryCode from 'src/utils/countryCode.json';
import jsonPhoneCode from 'src/utils/phoneCode.json';
const reducer = (state, action) => {
  switch (action.type) {
    case "serachValue":
      return { ...state, serachValue: action.payload };
    case "hasMore":
      return { ...state, hasMore: action.payload };
    case "loader":
      return { ...state, loader: action.payload };
    case "errorMessage":
      return { ...state, errorMessage: action.payload };
    case "adminInvestorDetails":
      return { ...state, adminInvestorDetails: action.payload };
    case "loadeMessage":
      return { ...state, loadeMessage: action.payload };
    case "show":
      return { ...state, show: action.payload };
    case "totalCardData":
      return { ...state, totalCardData: action.payload };
    case "btnLoader":
      return { ...state, btnLoader: action.payload };
    case "investorDetails":
      return { ...state, investorDetails: action.payload };
    default:
      return state;
  }
}

const initialState = {
  serachValue: null,
  hasMore: true,
  loader: false,
  errorMessage: null,
  show: false,
  investorDetails: {},
  adminInvestorDetails: [],
  loadeMessage: '',
  totalCardData: []
};

const Investors = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [errorMessageProfile, setErrorMessageProfile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [loaderform, setLoaderform] = useState(false);
  const navigate = useNavigate();
  const shouldLog = useRef(true);
  const pageSize = 10;
  const [pageNo, setPageNo] = useState(0);
  const [search, setSearch] = useState(null);
  const dispatchInvestors = useDispatch();
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [investorCreated, setInvestorCreated] = useState(false)
  const [loadMore, setLoadMore] = useState(false);
  const [hide, setHide] = useState(false);
  useEffect(() => {
    if (shouldLog.current) {
      shouldLog.current = false;
      projectOwners(1, 10, null);
    }

  }, []);//eslint-disable-line react-hooks/exhaustive-deps




  useEffect(() => {
    if (investorCreated) {
      projectOwners(1, 10, null);
    }

  }, [investorCreated]);//eslint-disable-line react-hooks/exhaustive-deps

  const projectOwners = async (pageNum, pageListSize, searchIDO) => {
    dispatch({ type: 'errorMessage', payload: null })
    if (state.adminInvestorDetails?.length === 0) {
      dispatch({ type: 'loader', payload: true })
    }
    const skip = pageNum * pageListSize - pageListSize;
    const take = pageListSize;

    let response = await apiCalls.getProjectOwners(take, skip, searchIDO)
    if (response.ok) {
      dispatch({ type: 'loader', payload: false })
      let _pageNo = pageNum + 1;
      setPageNo(_pageNo);
      setSearch(searchIDO);
      let MergeGridData = pageNum === 1 ? [...response.data] : [...state.adminInvestorDetails, ...response.data];
      dispatch({ type: 'adminInvestorDetails', payload: MergeGridData })
      if (response?.data?.length < 10) {
        setHide(true)
        setLoadMore(false)
      }
      if (MergeGridData?.length > 0) {
        dispatch({ type: 'loadeMessage', payload: ' ' })
      } else if (MergeGridData?.length === 0) {
        dispatch({ type: 'loadeMessage', payload: 'No Data Found' })
      }
      if (search == null) {
        dispatch({ type: 'totalCardData', payload: MergeGridData })
      }
      dispatch({ type: 'loader', payload: false })
    }
    else {
      dispatch({ type: 'errorMessage', payload: apiCalls.isErrorDispaly(response) })
      dispatch({ type: 'loader', payload: false })
    }
  }


  const fetchMoreData = async (pageNum, pageListSize, searchIDO) => {
    setLoadMore(true)
    setHide(true)
    const skip = pageNum * pageListSize - pageListSize;
    const take = pageListSize;
    let response = await apiCalls.getProjectOwners(take, skip, searchIDO)
    if (response.ok) {
      let _pageNo = pageNum + 1;
      setPageNo(_pageNo);
      setSearch(searchIDO);
      let MergeGridData = pageNum === 1 ? [...response.data] : [...state.adminInvestorDetails, ...response.data];
      dispatch({ type: 'adminInvestorDetails', payload: MergeGridData })
      if (response?.data?.length == 0 || response?.data?.length < 10) {
        setHide(true)
        setLoadMore(false)
      } else {
        setLoadMore(false)
        setHide(false)
      }
      if (MergeGridData?.length > 0) {
        dispatch({ type: 'loadeMessage', payload: ' ' })
      } else if (MergeGridData?.length === 0) {
        dispatch({ type: 'loadeMessage', payload: 'No Data Found' })
      }
      if (search == null) {
        dispatch({ type: 'totalCardData', payload: MergeGridData })
      }
    }
    else {
      dispatch({ type: 'errorMessage', payload: apiCalls.isErrorDispaly(response) })
    }
  };

  const addProposalList = () => {
    if (state.adminInvestorDetails?.length > 0) {
      fetchMoreData(pageNo, pageSize, search);
    }

  };

  function handleProject(items) {
    dispatchInvestors(setProject(items))
    navigate(`/launchpad/investors/projects/${items?.id}`)
  }

  const handleChange = ({ currentTarget: { value } }) => {
    let data = value.trim()
    dispatch({ type: 'searchValue', payload: data })
    if (!data) {
      projectOwners(1, 10,  null)
      dispatch({ type: 'searchValue', payload: null })
      dispatch({ type: 'adminInvestorDetails', payload: state.totalCardData })
    }
  };
  const handleEnterSearch = (e) => {
    let data = e.target.value.trim();
    setSearch(data);
    if (e.key == 'Enter') {
      if (data == "") {
        projectOwners(1, 10, null)
        e.preventDefault();
      } else {
        projectOwners(1, 10, data)
        e.preventDefault();
      }
    }
  }

  const handleSearchh = () => {
    projectOwners(1, 10, search)
  }
  const handleCancel = () => {
    setForm({})
    setErrorMessageProfile(false)
    setShow(false)
  }

  const validateForm = (obj, isChange) => {
    const { firstName, lastName, phoneNo, email, userName, phoneNoCountryCode, country, password } = isChange ? obj : form
    const whiteSpace = /\s/;
    const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
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
  }

  const handleCreateInvestors = async (event) => {
    event.preventDefault();
    setErrors({});
    setSuccess(false)
    const formErrors = validateForm();
    if (Object.keys(formErrors)?.length > 0) {
      setErrors(formErrors);
      setLoaderform(false);
    } else {
      setLoaderform(true);
      let obj = { ...form};
      obj.id = "00000000-0000-0000-0000-000000000000"
      obj.userId = "00000000-0000-0000-0000-000000000000"
        obj.firstName = form.firstName
        obj.lastName = form.lastName
        obj.userName = form.userName
        obj.email = form.email
        obj.phoneNo = form.phoneNo
      obj.phoneNoCountryCode = form.phoneNoCountryCode
      obj.createdBy = `${form.firstName} ${form.lastName}`
        obj.modifiedBy = `${form.firstName} ${form.lastName}`
      obj.createdDate = new Date()
        obj.modifiedDate = new Date()
        obj.role = form.role
        obj.password = form.password
        obj.isInvestor = true
      let response = await apiCalls.createInvestors(obj)
      if (response.ok) {
        setSuccess(true)
        setSuccessMessage("Investor created successfully");
        setLoaderform(false);
        setShow(false)
        setForm({})
        setTimeout(function () {
          setSuccess(false)
        }, 2500);
        setInvestorCreated(true)
      }
      else {
        setErrorMessageProfile(apiCalls.isErrorDispaly(response));
        setLoaderform(false);
      }
      setValidated(true);
      setLoaderform(false);
    }


  }


  const addInvestors = () => {
    setForm({})
    setErrors({})
    setErrorMessageProfile(false)
    setShow(true)
  }


  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value
    })
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      })
    }
  }

  return (
    <>

      {state.loader && <div className="text-center"><Spinner ></Spinner></div>}
      {!state.loader && <>
        <CBreadcrumb>
          <CBreadcrumbItem>
            Launchpad
          </CBreadcrumbItem>
          <CBreadcrumbItem active>Investors</CBreadcrumbItem>
        </CBreadcrumb>

        {state.errorMessage && (
          <Alert variant="danger">
            <div className='d-flex align-items-center'>
              <span className='icon error-alert'></span>
              <p className='m1-2' style={{ color: 'red' }}>{state.errorMessage}</p>
            </div>
          </Alert>
        )}

        <div className='custom-flex-launchpad'>

          <Form className="d-flex grid-search">
            <Form.Control
              placeholder="Search by Name"
              className="search-style"
              aria-label="Search"
              onKeyUp={(e) => handleChange(e)}
              onKeyDown={(e) => handleEnterSearch(e)}
            />
            <i className="icon search-icon" onClick={handleSearchh}></i>
          </Form>
          <div className='d-flex align-items-center justify-content-end'>
            <Button className='primary-btn mt-3 mt-md-0 button-style'
              onClick={() => addInvestors()}><span className='icon add-icon'></span> Add Investor</Button>
          </div>
        </div>

        <div className='user-content'>
          {state.adminInvestorDetails?.map((items) => (
            <Row className='badge-style' key={items?.id}>
              <Col style={{ width: 350 }}><label htmlFor="nameInput" className='project-text text-lightpurpl'>Name</label><p className='mb-0 about-label text-overflow text-white' >{items.name}</p></Col>
              <Col style={{ width: 350 }}><label htmlFor="mailIdInput" className='project-text text-lightpurpl'>Mail Id</label><p className='mb-0 about-label text-overflow text-white'>{items.mailId}</p></Col>
              <Col style={{ width: 350 }}><label htmlFor="phoneNumberInput" className='project-text text-lightpurpl'>Phone Number</label><p className='mb-0 about-label text-overflow text-white'>{items.phoneNumber}</p></Col>
              <Col className='d-flex align-items-center justify-content-end'><Button onClick={() => handleProject(items)} className='button-style'>Projects</Button></Col>
            </Row>
          ))}
          {state.loadeMessage && 
          <>
            {state.adminInvestorDetails?.length === 0 &&
            <div className='text-center'>
                <img src={nodata} width={120} alt='' />
                <h4 className="text-center nodata-text db-no-data">No Data Found</h4>
            </div>
            }
          </>}
        </div>
        <>
          <div className='text-center'>
            {loadMore && <Spinner size="sm" className='text-white text-center' />} </div>
          <div className='addmore-title' >
            {!hide && <>
              <span className='d-block'><span onClick={addProposalList} className='c-pointer'>See More</span>
              </span>  <span className='icon blue-doublearrow c-pointer' onClick={addProposalList}></span>
            </>}
          </div></>
        {success && <div className="">
          <ToasterMessage isShowToaster={success} success={successMessage}></ToasterMessage>
        </div>}

        <Modal className="settings-modal profile-modal modal-tabview"
          show={show}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Form noValidate validated={validated} >
            <Modal.Header className="d-flex justify-content-between">
              <Modal.Title id="example-custom-modal-styling-title">
                Add Inverstor
              </Modal.Title>
              <span className="icon close" onClick={() => setShow(false)}></span>


            </Modal.Header>

            <Modal.Body className='launchpadadmin-modal'>
              {errorMessageProfile && (
                <Alert variant="danger">
                  <div className='d-flex align-items-center'>
                    <span className='icon error-alert'></span>
                    <p className='m1-2' style={{ color: 'red' }}>{errorMessageProfile}</p>
                  </div>
                </Alert>
              )}
              <Row className="mb-4">


                <Col xl={12}>
                  <Row className="mt-3 mt-xl-0">

                    <Col xl={6} className="mb-2">
                      <FloatingLabel
                        controlId="floatingInput"
                        label="First Name*"
                        className="mb-1 input-style mt-2"
                      >
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={form?.firstName}
                          defaultValue={form?.firstName}
                          autoComplete="off"
                          onChange={(e) => { setField('firstName', e.currentTarget.value) }}
                          isInvalid={!!errors.firstName}
                          required
                          placeholder="First Name *"
                          maxLength={50}
                        />
                        <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                      </FloatingLabel>
                    </Col>
                    <Col xl={6} className="mb-2">
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Last Name*"
                        className="mb-1 input-style mt-2"
                      >

                        <Form.Control
                          type="text"
                          name="lastName"
                          value={form?.lastName}
                          defaultValue={form?.lastName}
                          onChange={(e) => { setField('lastName', e.currentTarget.value) }}
                          isInvalid={!!errors.lastName}
                          required
                          placeholder="Last Name *"
                          maxLength={50}
                        />
                        <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                      </FloatingLabel>
                    </Col>
                    <Col xl={6} className="mb-2">
                      <FloatingLabel
                        controlId="floatingInput"
                        label="User Name*"
                        className="input-style"
                      >

                        <Form.Control
                          type="text"
                          name="userName"
                          value={form?.userName}
                          defaultValue={form?.userName}
                          onChange={(e) => { setField('userName', e.currentTarget.value) }}
                          isInvalid={!!errors.userName}
                          required
                          placeholder="Username *"
                          maxLength={50}
                        />
                        <Form.Control.Feedback type="invalid">{errors.userName}</Form.Control.Feedback>
                      </FloatingLabel>
                    </Col>
                    <Col xl={6} className="mb-2">
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Email*"
                        className="input-style"
                      >

                        <Form.Control
                          type="text"
                          name="email"
                          value={form?.email}
                          defaultValue={form?.email}
                          onChange={(e) => { setField('email', e.currentTarget.value) }}
                          isInvalid={!!errors.email}
                          required
                          placeholder="Email *"
                          maxLength={50}
                        />
                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                      </FloatingLabel>
                    </Col>
                    <Col xl={6} className="mb-2">
                      <FloatingLabel controlId="floatingInput" className="input-style">
                        <InputGroup className="mb-2 input-style no-wrap mobile-noinput">

                          <Form.Control
                            required
                            as="select"
                            type="select"
                            name="phoneNoCountryCode"
                            className="code-width c-pointer zindex1"
                            aria-label="Default select example"
                            onChange={(e) => { setField('phoneNoCountryCode', e.currentTarget.value) }}
                            value={form?.phoneNoCountryCode}
                            defaultValue={form?.phoneNoCountryCode}
                            isInvalid={!!errors.phoneNoCountryCode}
                          >
                            <option>Select</option>
                            {jsonPhoneCode.map((item) => (
                              <option key={item?.id}>{item.code}</option>
                            ))}

                          </Form.Control>

                          <label htmlFor="phoneNumberInput" className="floatingInput-number cust-zindex">Phone No*</label>
                          <Form.Control
                            type="text"
                            className="form-number input-radius"
                            name={'Gold'}
                            onChange={(e) => { setField('phoneNo', e.currentTarget.value) }}
                            isInvalid={!!errors.phoneNo}
                            value={form?.phoneNo}
                            defaultValue={form?.phoneNo}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            required
                            autoComplete="off"
                            maxLength={12}
                          />
                          <Form.Control.Feedback type="invalid">{errors.phoneNo}</Form.Control.Feedback>
                          
                        </InputGroup>
                      </FloatingLabel>
                    </Col>
                    <Col xl={6} className="mb-2">
                      <FloatingLabel controlId="floatingInput" className="mb-3 input-style" >
                        <InputGroup className="mb-3 input-style no-wrap mobile-noinput country-code-style">

                          <Form.Control
                            required
                            as="select"
                            type="select"
                            name="country"
                            className="c-pointer zindex1"
                            aria-label="Default select example"
                            value={form?.country}
                            defaultValue={form?.country}
                            maxLength={20}
                            isInvalid={!!errors.country}
                            onChange={(e) => { setField('country', e.currentTarget.value) }}
                          >
                            <option>Select Country</option>
                            {jsonCountryCode.map((item) => (
                              <option key={item?.id}>{item.name}</option>
                            ))}
                          </Form.Control>
                         
                          <label htmlFor='country' className="floatingInput-number cust-zindex">Country*</label>
                          <Form.Control.Feedback type="invalid">{errors.country}</Form.Control.Feedback>
                        </InputGroup>
                      </FloatingLabel>
                    </Col>

                    <Col xl={6} className="mb-2">
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Password*"
                        className="input-style"
                      >

                        <Form.Control
                          type="text"
                          name="password"
                          value={form?.password}
                          defaultValue={form?.password}
                          onChange={(e) => { setField('password', e.currentTarget.value) }}
                          isInvalid={!!errors.password}
                          required
                          placeholder="Password *"
                          maxLength={50}
                        />
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                      </FloatingLabel>
                    </Col>


                  </Row>
                </Col>
              </Row>

            </Modal.Body>
            <Modal.Footer>
              <div className="text-end"><Button className="cancel-btn" disabled={loaderform} onClick={() => { handleCancel() }}>Cancel</Button>
                <Button className="button-secondary ms-lg-3 ms-2" type="button" onClick={(e) => handleCreateInvestors(e)} disabled={loaderform}>
                  <span>{loaderform && <Spinner size="sm" />} </span>Save</Button></div>
            </Modal.Footer>
          </Form>
        </Modal>



      </>}
    </>
  )
}
export default Investors;