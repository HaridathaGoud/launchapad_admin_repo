import React, { useEffect, useRef, useState, useReducer } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ProjectTokenDetails from './projectTokenDetails';
import apiCalls from 'src/api/apiCalls';
import Image from 'react-bootstrap/Image';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/esm/Spinner';
import PropTypes from 'prop-types'
import { useSelector, connect, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { setProjectDetail } from '../../../reducers/projectDetailsReducer';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { CBreadcrumb, CBreadcrumbItem, CLink } from '@coreui/react'
import { projectDetailsData, projectDetailsSave, projectePayment } from '../launchpadReducer/launchpadReducer';
import moment from 'moment';
import { validateContentRules } from '../../../utils/custom.validator';
import jsonCountryCode from '../../../utils/countryCode.json';
import store from 'src/store';
import Dropdown from 'react-bootstrap/Dropdown';
import Multiselect from 'multiselect-react-dropdown';
import { NumericFormat } from 'react-number-format';
import { setSettingsLoaders } from 'src/reducers/authReducer';
import profileavathar from "../../../assets/images/default-avatar.jpg";
import { FloatingLabel, InputGroup, Modal } from 'react-bootstrap';
const reducer = (state, action) => {
  switch (action.type) {
    case "errorMgs":
      return { ...state, errorMgs: action.payload };
    case "errors":
      return { ...state, errors: action.payload };
    case "loading":
      return { ...state, loading: action.payload };
    case "bannerImgLoader":
      return { ...state, bannerImgLoader: action.payload };
    case "cardImgLoader":
      return { ...state, cardImgLoader: action.payload };
    case "projectSaveDetails":
      return { ...state, projectSaveDetails: action.payload };
    case "projectLogoImages":
      return { ...state, projectLogoImages: action.payload };
    case "projectBannerImages":
      return { ...state, projectBannerImages: action.payload };
    case "projectCardImages":
      return { ...state, projectCardImages: action.payload };
    case "projectTokenShow":
      return { ...state, projectTokenShow: action.payload };
    case "projectData":
      return { ...state, projectData: action.payload };
    case "projectDetails":
      return { ...state, projectDetails: action.payload };
    case "loader":
      return { ...state, loader: action.payload };
    case "buttonLoader":
      return { ...state, buttonLoader: action.payload };
    case "validated":
      return { ...state, validated: action.payload };
    case "scuess":
      return { ...state, scuess: action.payload };
    case "address":
      return { ...state, address: action.payload };
    case "introductionHtml":
      return { ...state, introductionHtml: action.payload };
    default:
      return state;
  }
}
const initialState = {
  errorMgs: null,
  loading: false,
  bannerImgLoader: false,
  projectLogoImages: null,
  projectBannerImages: null,
  projectCardImages: null,
  cardImgLoader: false,
  projectSaveDetails: {},
  projectTokenShow: false,
  projectData: null,
  loader: false,
  buttonLoader: false,
  validated: false,
  scuess: false,
  address: false,
  errors: {}
};
const Projects = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  let { projectId, mode } = useParams();
  const dispatchData = useDispatch()
  const editorRef = useRef(null);
  const inputRef = useRef();
  const inputRef1 = useRef();
  const inputRef2 = useRef();
  const walletAddress = useSelector((state) => state.walletAddress.walletAddress)
  const projectDetails = useSelector((state) => state.launchpad.projectDetails)
  const isProjectCardsId = useSelector(state => state.oidc?.isProjectCardsId)
  const projectItem = useSelector(state => state.projectDetails?.project)
  const isAdmin = useSelector(state => state.oidc?.adminDetails);
  const projectSaveDetails = useSelector(state => state.launchpad?.projectSaveDetails);
  const navigate = useNavigate();
  const currentDate = new Date().toISOString().slice(0, 16);
  const [errors, setErrors] = useState({});
  const [selectedValues, setSelectedValues] = useState([]);
  const [countryData, setCountryData] = useState([])
  const [imageError, setImageError] = useState()
  const [isValid, setIsValid] = useState(true);
  const [show, setShow] = useState(false);
  useEffect(() => {
    dispatch({ type: 'loader', payload: true })
    dispatch({ type: 'loading', payload: true })
    dispatch({ type: 'bannerImgLoader', payload: true })
    dispatch({ type: 'cardImgLoader', payload: true })
    window.scroll(0, 0);
    props.projectDetailsReducerData(projectId || props.informationProjectView, (callback) => {
      dispatch({ type: 'projectSaveDetails', payload: callback.data?.projectsViewModel })
      dispatch({ type: 'projectLogoImages', payload: callback.data?.projectsViewModel?.tokenLogo })
      dispatch({ type: 'projectBannerImages', payload: callback.data?.projectsViewModel?.bannerImage })
      dispatch({ type: 'projectCardImages', payload: callback.data?.projectsViewModel?.cardImage })
      dispatch({ type: 'projectDetails', payload: callback.data })
      dispatch({ type: 'loading', payload: false })
      dispatch({ type: 'bannerImgLoader', payload: false })
      dispatch({ type: 'cardImgLoader', payload: false })
      dispatchData(setProjectDetail(callback?.data?.claimsAndAllocations))
      setSelectedValues(callback.data?.projectsViewModel?.countryRestrictions)
      getSelectedCountries(callback.data?.projectsViewModel?.countryRestrictions)
      store.dispatch(projectePayment(callback.data?.projectPayment))
      dispatch({ type: 'loader', payload: false })
      getClaimsandAllocations(callback.data?.projectsViewModel)
    })
    getWalletAddress();


  }, []);
  useEffect(() => {
    handledescription();
  }, [])

  useEffect(() => {
    props.projectDetailsReducerData(projectId || props.informationProjectView, (callback) => {
      dispatch({ type: 'projectSaveDetails', payload: callback.data?.projectsViewModel })
      dispatch({ type: 'projectDetails', payload: callback.data })
      dispatchData(setProjectDetail(callback?.data?.claimsAndAllocations))
      setSelectedValues(callback.data?.projectsViewModel?.countryRestrictions)
      getSelectedCountries(callback.data?.projectsViewModel?.countryRestrictions)
      store.dispatch(projectePayment(callback.data?.projectPayment))
      dispatch({ type: 'loader', payload: false })
      getClaimsandAllocations(callback.data?.projectsViewModel)
    })
  }, [])

  const getWalletAddress = async () => {
    if (projectSaveDetails == {}) {
      props.projectDetailsReducerData(projectSaveDetails.id, (callback) => {
        dispatch({ type: 'projectSaveDetails', payload: callback.data?.projectsViewModel })

        dispatch({ type: 'projectDetails', payload: callback.data })
        dispatchData(setProjectDetail(callback?.data?.claimsAndAllocations))
        dispatch({ type: 'loader', payload: false })
      })
    }
  }

  const handledescription = () => {
    if (editorRef.current) {
      dispatch({ type: 'introductionHtml', payload: editorRef.current.getContent() })
    }
  };
  const handleUpload = () => {
    inputRef.current?.click();
  }
  const handleEdit = () => {
    setShow(true)
  }
  const handleCancell = () => {
    setShow(false)
  }

  const validateForm = (obj) => {
    const { projectName, tokenLogo, cardImage, bannerImage, countryRestrictions, networkSymbol, tokenListingDate, description, contractAddress,
      tokenName, tokenSymbol, tokenDecimal, totalNumberOfTokens, initialSupply } = obj;
    const newErrors = {};
    const emojiRejex =
      /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff]|[\u2010-\u2017])/g;

    if (!projectName || projectName === '') {
      newErrors.projectName = 'Is required';
    } else if (!validateContentRules('', projectName)) {
      newErrors.projectName = 'Please provide valid content.';
    }

    if (!countryRestrictions || countryRestrictions === '' || countryRestrictions?.length == 0) {
      newErrors.countryRestrictions = 'Is required';
    }
    if (!networkSymbol || networkSymbol === '') {
      newErrors.networkSymbol = 'Is required';
    }
    if (!tokenLogo || tokenLogo == '') {
      newErrors.tokenLogo = 'Is required';
    }
    if (!cardImage || cardImage == '') {
      newErrors.cardImage = 'Is required';
    }
    if (!bannerImage || bannerImage == '') {
      newErrors.bannerImage = 'Is required';
    }
    if (!tokenListingDate || tokenListingDate === '') {
      newErrors.tokenListingDate = 'Is required';
    }
    if (!initialSupply || initialSupply === '') {
      newErrors.initialSupply = 'Is required';
    }
    if (!description || description == '') {
      newErrors.description = 'Is required';
    }
    if (!contractAddress || contractAddress == '') {
      newErrors.tokenContractAddress = 'Is required';
    } else if (contractAddress && (emojiRejex.test(contractAddress))) {
      newErrors.contractAddress = 'Please provide valid content.';
    }
    if (!contractAddress || contractAddress == '') {
      newErrors.contractAddress = 'Is required';
    } else if (contractAddress && (emojiRejex.test(contractAddress))) {
      newErrors.contractAddress = 'Please provide valid content.';
    }
    if (!tokenName || tokenName == '') {
      newErrors.tokenName = 'Is required';
    } else if (tokenName && (emojiRejex.test(tokenName))) {
      newErrors.tokenName = 'Please provide valid content.';
    }
    if (!tokenSymbol || tokenSymbol == '') {
      newErrors.tokenSymbol = 'Is required';
    } else if (tokenSymbol && (emojiRejex.test(tokenSymbol))) {
      newErrors.tokenSymbol = 'Please provide valid content.';
    }
    if (!tokenDecimal || tokenDecimal == '') {
      newErrors.tokenDecimal = 'Is required';
    } else if (tokenDecimal && (emojiRejex.test(tokenDecimal))) {
      newErrors.tokenDecimal = 'Please provide valid content.';
    }
    if (!totalNumberOfTokens || totalNumberOfTokens == '') {
      newErrors.totalNumberOfTokens = 'Is required';
    } else if (totalNumberOfTokens && (emojiRejex.test(totalNumberOfTokens))) {
      newErrors.totalNumberOfTokens = 'Please provide valid content.';
    }

    return newErrors;
  };

  const getClaimsandAllocations = (projectObj) => {
    let obj = projectObj;
    if (projectObj?.projectStatus == "Submitted" ||
      projectObj?.projectStatus == "Approved" ||
      projectObj?.projectStatus == "Rejected" ||
      projectObj?.projectStatus == "Draft" ||
      projectObj?.projectStatus == "Deployed") {
      obj.tokenListingDate = convertUtcToLocal(projectObj?.tokenListingDate)
    }
    dispatch({ type: 'projectSaveDetails', payload: obj })
  }

  const convertUtcToLocal = (date) => {
    const utcTime = date;
    const utcMoment = moment.utc(utcTime);
    const localMoment = utcMoment.local();
    const localTimeString = localMoment.format('YYYY-MM-DDTHH:mm');
    return localTimeString
  }

  const handleSaveProjectDetails = async (event) => {
    event.preventDefault();
    const validationStatus = validateSelection(selectedValues);
    setIsValid(validationStatus);
    dispatch({ type: 'errorMgs', payload: null })
    event.preventDefault();
    if (state.projectSaveDetails?.projectStatus &&
      state.projectSaveDetails?.projectStatus !== "Submitted" && state.projectSaveDetails?.projectStatus !== "Draft") {
      dispatch({ type: 'projectTokenShow', payload: true })
      store.dispatch(projectDetailsSave(state.projectSaveDetails));
    } else {
      dispatch({ type: 'buttonLoader', payload: true })
      let obj = {
        "id": projectSaveDetails?.id == null ? projectId ? projectId : "00000000-0000-0000-0000-000000000000" : projectSaveDetails?.id,
        "contractAddress": state.projectSaveDetails?.contractAddress,
        "tokenName": state.projectSaveDetails?.tokenName,
        "tokenSymbol": state.projectSaveDetails?.tokenSymbol,
        "tokenLogo": state.projectLogoImages,
        "tokenDecimal": state.projectSaveDetails?.tokenDecimal,
        "totalNumberOfTokens": state.projectSaveDetails?.totalNumberOfTokens,
        "bannerImage": state.projectBannerImages,
        "cardImage": state.projectCardImages,
        "projectName": state.projectSaveDetails?.projectName,
        "networkSymbol": "Matic",
        "vestingDetails": "string",
        "countryRestrictions": countryData,
        "raisedFund": state.projectSaveDetails?.raisedFund,
        "walletAddress": walletAddress || null,
        "description": state.projectSaveDetails?.description,
        "tokenListingDate": state.projectSaveDetails?.tokenListingDate,
        "tokenContractAddress": state.projectSaveDetails?.contractAddress,
        "introductionHtml": state.introductionHtml || state.projectSaveDetails?.introductionHtml,
        "projectOwnerId": projectItem?.id ? projectItem.id : isAdmin?.id,
        "initialSupply": state.projectSaveDetails?.initialSupply,
      }

      dispatch({ type: 'projectSaveDetails', payload: obj })
      if (window.location.pathname.includes('/launchpad/idorequest')) {
        obj.id = state.projectSaveDetails?.id
      }
      let initialSupplyValue = obj?.initialSupply
      let totalNumberOfTokenValue = obj?.totalNumberOfTokens
      if (typeof totalNumberOfTokenValue === 'string') {
        obj.totalNumberOfTokens = parseFloat(totalNumberOfTokenValue.replace(/[^0-9.-]+/g, ''));
      }
      if (typeof initialSupplyValue === 'string') {
        obj.initialSupply = parseFloat(initialSupplyValue.replace(/[^0-9.-]+/g, ''));
      }
      const formErrors = validateForm(obj);
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors)
        dispatch({ type: 'errors', payload: formErrors })
        dispatch({ type: 'loader', payload: false })
      } else {
        obj.tokenListingDate = moment(obj.tokenListingDate).utc().format("YYYY-MM-DDTHH:mm:ss")
        let res = await apiCalls.UpdateProjectDetail(obj);
        if (res.ok) {
          dispatch({ type: 'projectTokenShow', payload: true })
          dispatch({ type: 'scuess', payload: true })
          dispatch({ type: 'buttonLoader', payload: false })
          setTimeout(function () {
            dispatch({ type: 'scuess', payload: false })
          }, 2000);
          dispatch({ type: 'projectData', payload: res.data })
          window.scroll(0, 0);
          store.dispatch(projectDetailsSave(res.data));
        }
        else {
          dispatch({ type: 'errorMgs', payload: apiCalls.isErrorDispaly(res) })
          dispatch({ type: 'projectTokenShow', payload: false })
          dispatch({ type: 'buttonLoader', payload: false })
          window.scroll(0, 0);
        }
      }
    }
    dispatch({ type: 'validated', payload: true })
    dispatch({ type: 'buttonLoader', payload: false })
    window.scroll(0, 0);

  }


  const uploadToClient = (event, type) => {
    setImageError(null)
    dispatch({ type: 'errorMgs', payload: null })
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.name.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        setImageError("It is not permitted to upload a file. Only jpg,jpeg,png,gif,webp files can be uploaded.")
        window.scroll(0, 0);
      } else {
        uploadToServer(file, type);
        if (type === 'banner') {
          dispatch({ type: 'bannerImgLoader', payload: true })
          if (!!errors[type]) {
            setErrors({ ...errors, [field]: null })
          }
        } else if (type === 'LOGO') {
          dispatch({ type: 'loading', payload: true })
          if (!!errors[type]) {
            setErrors({ ...errors, [field]: null })
          }
        }
        else {
          dispatch({ type: 'cardImgLoader', payload: true })
          if (!!errors[type]) {
            setErrors({ ...errors, [field]: null })
          }
        }
      }
    }
  };
  const uploadToServer = async (file, type) => {
    const body = new FormData();
    body.append('file', file);
    try {
      const res = await apiCalls.apiUploadPost(`/Upload/UploadFileNew`, body)
      if (res.title) {
        window.scroll(0, 0);
        dispatch({ type: 'loading', payload: false })
        dispatch({ type: 'cardImgLoader', payload: false })
        dispatch({ type: 'bannerImgLoader', payload: false })
        dispatch({ type: 'errorMgs', payload: apiCalls.uploadErrorDisplay(res) })
      } else {
        let data = res
        let _obj = { ...state.projectImages };
        if (type == "LOGO") {
          _obj.tokenLogo = data[0];
          dispatch({ type: 'loading', payload: false })
          dispatch({ type: 'projectLogoImages', payload: data[0] })
        } else if (type == "banner") {
          _obj.bannerImage = data[0];
          dispatch({ type: 'bannerImgLoader', payload: false })
          dispatch({ type: 'projectBannerImages', payload: data[0] })
        } else if (type == "CARD") {
          _obj.cardImage = data[0];
          dispatch({ type: 'cardImgLoader', payload: false })
          dispatch({ type: 'projectCardImages', payload: data[0] })
        }
      }
    } catch (error) {
      dispatch({ type: 'bannerImgLoader', payload: false })
      dispatch({ type: 'errorMgs', payload: apiCalls.isErrorDispaly(error) })
      dispatch({ type: 'loading', payload: false })
      dispatch({ type: 'cardImgLoader', payload: false })
      window.scroll(0, 0);
    }
  };


  const onBack = () => {
    dispatch({ type: 'projectTokenShow', payload: false })
    dispatch({ type: 'projectSaveDetails', payload: projectSaveDetails })
  }

  const handleCancel = () => {
    if (isAdmin?.isAdmin) {
      if (window.location.pathname.includes('/launchpad/investors')) {
        navigate(`/launchpad/investors/projects/${projectItem.id}`)
      }
      else {
        props.closeProject(false)
        navigate(`/launchpad/idorequest`)
      }
    } else {
      navigate(`/launchpad/projects/${isAdmin.id}`)
    }
  }
  const idoRequestBredCrumd = () => {
    navigate(mode === "projectsDetails" ? `/launchpad/investors` : `/launchpad/idorequest`)
    if (isAdmin?.isAdmin) {
      props.closeProject(false)
    }
  }


  const getSelectedCountries = (countrys) => {
    const countries = jsonCountryCode.filter(obj => countrys?.includes(obj.name));
    const selectedNames = countrys?.map(item => item);
    setCountryData(selectedNames)
    setSelectedValues(countries)
  }

  const validateSelection = (selectedOptions) => {
    return selectedOptions?.length > 0;
  };

  const handleChange = (field, event) => {
    event.preventDefault()
    let _data = { ...state.projectSaveDetails };
    _data[event.target.name] = event.target.value;
    dispatch({ type: 'projectSaveDetails', payload: _data })
    if (!!errors[field]) {
      setErrors({ ...errors, [field]: null })
    }
  }

  const onSelect = (selectedList) => {
    let _data = { ...state.projectSaveDetails };
    const selectedNames = selectedList?.map(item => item.name);
    _data.countryRestrictions = selectedNames
    dispatch({ type: 'projectSaveDetails', payload: _data })

    if (!!errors?.countryRestrictions) {
      setErrors({ ...errors, countryRestrictions: null })

    }
    else if (errors?.countryRestrictions == 'Is required' && selectedList?.length == 0) {
      setErrors({ ...errors, countryRestrictions: 'Is required' })
    }
    setCountryData(selectedNames)
    setSelectedValues(selectedList);

  };
  return (<>
    {state.loader && <div className="text-center"><Spinner ></Spinner></div>}
    {!state.loader && <>
      {!state.projectTokenShow &&
        <>
          {state?.errorMgs && (
            <Alert variant="danger">
              <div className='d-flex align-items-center'>
                <span className='icon error-alert'></span>
                <p className='m1-2' style={{ color: 'red' }}>{state?.errorMgs}</p>
              </div>
            </Alert>
          )}

          {projectDetails?.errorMgs && (
            <Alert variant="danger">
              <div className='d-flex align-items-center'>
                <span className='icon error-alert'></span>
                <p className='m1-2' style={{ color: 'red' }}>{projectDetails?.errorMgs}</p>
              </div>
            </Alert>
          )}
          <Form noValidate validated={state?.validated} onSubmit={(e) => handleSaveProjectDetails(e)}>

            {isAdmin?.isAdmin && window.location.pathname.includes('investors') &&
              <CBreadcrumb>
                <CBreadcrumbItem>
                  <CLink href="#" onClick={() => navigate(mode === "projectsDetails" ? `/launchpad/investors` : '/launchpad/investors')}>{mode === "projectsDetails" ? "Investors" : "Projects"}</CLink>
                </CBreadcrumbItem>
                {mode &&
                  <CBreadcrumbItem>
                    <CLink href="#" onClick={() => navigate(mode === "projectsDetails" ? `/launchpad/investors/projects/${isProjectCardsId}` : `/launchpad/idorequest`)}>{mode === "projectsDetails" && "Projects"}</CLink>
                  </CBreadcrumbItem>}
                <CBreadcrumbItem active>{projectId === "00000000-0000-0000-0000-000000000000" ? "Add Project" : "View"}</CBreadcrumbItem>
              </CBreadcrumb>}

            {isAdmin?.isAdmin && window.location.pathname.includes('idorequest') &&
              <CBreadcrumb>
                <CBreadcrumbItem>
                  <CLink href="#" onClick={() => idoRequestBredCrumd()}>{"IDO Request"}</CLink>
                </CBreadcrumbItem>
                <CBreadcrumbItem active>{"View"}</CBreadcrumbItem>
              </CBreadcrumb>}



            {!isAdmin?.isAdmin && <CBreadcrumb>
              <CBreadcrumbItem>
                <CLink href="#" onClick={() => navigate(`/launchpad/projects/${isAdmin?.id}`)}>Projects</CLink>
              </CBreadcrumbItem>
              <CBreadcrumbItem active>{projectId === "00000000-0000-0000-0000-000000000000" ? "Add Project" : "View"}</CBreadcrumbItem>
            </CBreadcrumb>}

            {imageError && (
              <Alert variant="danger">
                <div className='d-flex align-items-center'>
                  <span className='icon error-alert'></span>
                  <p className='m1-2' style={{ color: 'red' }}>{imageError}</p>
                </div>
              </Alert>
            )}

            <div className="text-center"> {state.loader && <div className="text-center"><Spinner ></Spinner></div>}</div>
            {!state.loader && <><div className='launchpad-labels'>

              <div className='d-lg-flex align-items-center justify-content-between mb-2'><h3 className='section-title mb-1 mt-2'>Project Details</h3><p className='mb-0 page-number'><span className='active-number'>1</span> of 3</p></div>
              <Row className='mb-4'>
                <Col lg={3} md={12}>
                  <Form.Label className="input-label upload-file">Upload Image*</Form.Label>
                  <div

                    className={`${(state.projectSaveDetails?.projectStatus == "Deployed"
                      || state.projectSaveDetails?.projectStatus == "Approved") ?
                      'upload-img mb-2 position-relative c-notallowed' :
                      'upload-img mb-2 position-relative '}`}


                    onClick={() => inputRef.current?.click()}>
                    {state.loading && <Spinner fallback={state.loading} className='position-absolute'></Spinner>}
                    {state.projectLogoImages && !state.loading && <span className='imgupload-span'>
                      <Image src={state.projectLogoImages} width="100" height="100" alt="" /></span>}
                    {!state.projectLogoImages && !state.loading &&
                      <div className="choose-image">
                        <div>
                          <Form.Control
                            required
                            className="d-none custom-btn active btn"
                            type="file"
                            ref={inputRef}
                            isInvalid={!!state.errors.tokenLogo}
                            onChange={(e) => uploadToClient(e, 'LOGO')}
                            disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                              || state.projectSaveDetails?.projectStatus == "Rejected"
                              || state.projectSaveDetails?.projectStatus == "Approved"
                            ) && true}
                          />
                          <span
                            className="icon camera"
                          ></span>

                          <p className="c-pointer pt-3">
                            Jpg, Jpeg, Png, Gif, Webp

                          </p>
                          <Form.Control.Feedback type="invalid">{state.errors.tokenLogo}</Form.Control.Feedback>
                        </div>
                      </div>
                    }
                    {state.projectLogoImages && !state.loading &&
                      <div

                        className={`${(state.projectSaveDetails?.projectStatus == "Deployed"
                          || state.projectSaveDetails?.projectStatus == "Approved") ?
                          'onhover-upload c-notallowed' :
                          'onhover-upload'}`}>
                        <div className='bring-front'>
                          <Form.Control
                            required
                            className="d-none custom-btn active btn"
                            type="file"
                            ref={inputRef}
                            isInvalid={!!state.errors.tokenLogo}
                            onChange={(e) => uploadToClient(e, 'LOGO')}
                            disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                              || state.projectSaveDetails?.projectStatus == "Rejected"
                              || state.projectSaveDetails?.projectStatus == "Approved"
                            ) && true}
                          />
                          <span
                            className="icon camera"
                          ></span>
                          <Form.Control.Feedback type="invalid">{state.errors.tokenLogo}</Form.Control.Feedback>
                        </div>
                      </div>
                    }
                  </div>

                </Col>
                <Col lg={9} md={12}>
                  <Form.Label className="input-label upload-file">Upload Banner Image*</Form.Label>
                  <div
                    className={`${(state.projectSaveDetails?.projectStatus == "Deployed"
                      || state.projectSaveDetails?.projectStatus == "Approved") ?
                      'upload-img mb-2 position-relative c-notallowed' :
                      'upload-img mb-2 position-relative '}`}
                    onClick={() => inputRef1.current?.click()}
                  >
                    {state.bannerImgLoader && <Spinner fallback={state.bannerImgLoader} className='position-absolute'></Spinner>}
                    {state.projectBannerImages && <span className='imgupload-span'>
                      <Image src={state.projectBannerImages} width="100" height="100" alt="" /></span>}
                    {!state.projectBannerImages &&
                      <div className="choose-image">
                        <div>
                          <Form.Control
                            required
                            className="d-none custom-btn active btn"
                            type="file"
                            ref={inputRef1}
                            isInvalid={!!state.errors.bannerImage}
                            onChange={(e) => uploadToClient(e, 'banner')}
                            disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                              || state.projectSaveDetails?.projectStatus == "Rejected"
                              || state.projectSaveDetails?.projectStatus == "Approved"
                            ) && true}
                          />
                          <span
                            className="icon camera"
                          ></span>
                          <p className="c-pointer pt-3">
                            Jpg, Jpeg, Png, Gif, Webp

                          </p>
                          <Form.Control.Feedback type="invalid">{state.errors.bannerImage}</Form.Control.Feedback>
                        </div>
                      </div>
                    }
                    {state.projectBannerImages && !state.bannerImgLoader &&
                      <div
                        className={`${(state.projectSaveDetails?.projectStatus == "Deployed"
                          || state.projectSaveDetails?.projectStatus == "Approved") ?
                          'onhover-upload c-notallowed' :
                          'onhover-upload'}`}>
                        <div className='bring-front'>
                          <Form.Control
                            required
                            className="d-none custom-btn active btn"
                            type="file"
                            ref={inputRef1}
                            isInvalid={!!state.errors.bannerImage}
                            onChange={(e) => uploadToClient(e, 'banner')}
                            disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                              || state.projectSaveDetails?.projectStatus == "Rejected"
                              || state.projectSaveDetails?.projectStatus == "Approved"
                            ) && true}
                          />
                          <span
                            className="icon camera"
                          ></span>
                          <Form.Control.Feedback type="invalid">{state.errors.bannerImage}</Form.Control.Feedback>
                        </div>
                      </div>
                    }
                  </div>

                </Col>
              </Row>
              <Row>


                <Col lg={6} md={12}>
                  <Form.Label
                    controlId="floatingInput"
                    label="Project Name*"
                    className=""
                  >Project Name* </Form.Label>
                  <Form.Control
                    value={state.projectSaveDetails?.projectName}
                    name='projectName'
                    type="text"
                    placeholder="Name"
                    onChange={(e) => handleChange('projectName', e)}
                    required
                    isInvalid={!!errors?.projectName}
                    disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                      || state.projectSaveDetails?.projectStatus == "Rejected"
                      || state.projectSaveDetails?.projectStatus == "Approved"
                    ) && true}

                  />
                  <Form.Control.Feedback type="invalid">{errors?.projectName || state?.errors?.projectName}</Form.Control.Feedback>

                </Col>




                <Col lg={6} md={12}>
                  <Form.Label
                    controlId="floatingInput"
                    label="Country Restriction*"
                    className=""
                  > Country Restriction*</Form.Label >


                  <Multiselect
                    className='multiselecter'
                    options={jsonCountryCode}
                    selectedValues={selectedValues}
                    onSelect={onSelect}
                    onRemove={onSelect}
                    displayValue="name"
                    disable={(state.projectSaveDetails?.projectStatus == "Deployed"
                      || state.projectSaveDetails?.projectStatus == "Rejected"
                      || state.projectSaveDetails?.projectStatus == "Approved"
                    ) && true}
                  />

                  {errors?.countryRestrictions == "Is required" && (
                    <p style={{ color: "#e55353", fontSize: 14 }}>Is required</p>

                  )}



                </Col>


                <Col lg={6} md={12}>

                  <Form.Label className='input-label'>Network Symbol*</Form.Label>
                  <Dropdown className='matic-dropdown' defaultValue={"Matic"} value="Matic">
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic"
                      disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                        || state.projectSaveDetails?.projectStatus == "Rejected"
                        || state.projectSaveDetails?.projectStatus == "Approved"
                      ) && true}
                    >
                      <span className="icon md matic-icon" /> Matic
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item >
                        <span className="icon md matic-icon" /><span>Matic</span>
                      </Dropdown.Item>
                    </Dropdown.Menu>

                  </Dropdown>
                </Col>
                <Col lg={6} md={12}>

                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label className='input-label'>Listing Time & Date*</Form.Label>
                    <Form.Control type="datetime-local" placeholder='Listing Time&Date'
                      id="meeting-time"
                      name="tokenListingDate"
                      value={state.projectSaveDetails != null ? state.projectSaveDetails?.tokenListingDate : null}
                      isInvalid={!!errors?.tokenListingDate}
                      onChange={(e) => handleChange("tokenListingDate", e)}
                      min={currentDate}
                      disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                        || state.projectSaveDetails?.projectStatus == "Rejected"
                        || state.projectSaveDetails?.projectStatus == "Approved"
                      ) && true}
                    />
                    <Form.Control.Feedback type="invalid">{errors?.tokenListingDate || state?.errors?.tokenListingDate}</Form.Control.Feedback>

                  </Form.Group>


                </Col>
                <Col lg={12} md={12} className='mb-3'>

                  <Form.Label
                    controlId="floatingTextarea"
                    label="Description*"
                    className="text-area-input"
                  >Description*</Form.Label>
                  <Form.Control value={state.projectSaveDetails?.description}
                    name='description' className='project-description'
                    as="textarea"
                    placeholder="Description"
                    maxLength={1000}
                    isInvalid={errors?.description}
                    disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                      || state.projectSaveDetails?.projectStatus == "Rejected"
                      || state.projectSaveDetails?.projectStatus == "Approved"
                    ) && true}
                    onChange={(e) => handleChange("description", e)} required
                  />
                  <Form.Control.Feedback type="invalid">{errors?.description || state?.errors?.description}</Form.Control.Feedback>


                </Col>


                <div><h6 className='input-label section-title mb-2 mt-2'>Project Feed</h6></div>
                <div className='projects-editor'>
                  <Editor
                    apiKey='myyg2t1wdqdsjfdk71z1cyy0ts5iwq5u638ze7ub8sccahbh'
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue={state.projectSaveDetails?.introductionHtml}
                    onChange={handledescription}
                    disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                      || state.projectSaveDetails?.projectStatus == "Rejected"
                      || state.projectSaveDetails?.projectStatus == "Approved"
                    ) && true}
                    init={{
                      height: 500,
                      menubar: false,
                      plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                      ],
                      toolbar: 'undo redo | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; color:#fff;  }'
                    }}
                  />
                </div>
              </Row>
              <h3 className='section-title mb-2 mt-5'>Token Details</h3>
              <Row className='mb-4 Token-Details'>
                <Col lg={6} md={12} className='mb-0'>
                  <Form.Label className="input-label upload-file">Upload Token Image*</Form.Label>
                  <div
                    className={`${(state.projectSaveDetails?.projectStatus == "Deployed"
                      || state.projectSaveDetails?.projectStatus == "Approved") ?
                      'upload-img token-upload mb-2 c-notallowed' :
                      'upload-img token-upload mb-2'}`}

                    onClick={() => inputRef2.current?.click()}>
                    {state.cardImgLoader && <Spinner fallback={state.cardImgLoader}></Spinner>}
                    {state.projectCardImages && !state.cardImgLoader &&
                      <span className='imgupload-span'>
                        <Image src={state.projectCardImages} width="100" height="100" alt="" />
                      </span>}
                    {!state.projectCardImages && !state.cardImgLoader &&
                      <div className="choose-image">
                        <div>
                          <Form.Control
                            required
                            className="d-none custom-btn active btn"
                            type="file"
                            ref={inputRef2}
                            onChange={(e) => uploadToClient(e, 'CARD')}
                            isInvalid={!!state.errors.cardImage}
                            disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                              || state.projectSaveDetails?.projectStatus == "Rejected"
                              || state.projectSaveDetails?.projectStatus == "Approved"
                            ) && true}
                          />
                          <span
                            className="icon camera"
                          ></span>
                          <p className="c-pointer pt-3">
                            Jpg, Jpeg, Png, Gif, Webp
                          </p>
                          <Form.Control.Feedback type="invalid">{state.errors.cardImage}</Form.Control.Feedback>
                        </div>

                      </div>
                    }
                    {state.projectCardImages && !state.cardImgLoader &&
                      <div
                        className={`${(state.projectSaveDetails?.projectStatus == "Deployed"
                          || state.projectSaveDetails?.projectStatus == "Approved") ?
                          'onhover-upload c-notallowed' :
                          'onhover-upload'}`}>
                        <div className='bring-front'>
                          <Form.Control
                            required
                            className="d-none custom-btn active btn"
                            type="file"
                            ref={inputRef2}
                            onChange={(e) => uploadToClient(e, 'CARD')}
                            isInvalid={!!state.errors.cardImage}
                            disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                              || state.projectSaveDetails?.projectStatus == "Rejected"
                              || state.projectSaveDetails?.projectStatus == "Approved"
                            ) && true}
                          />
                          <span
                            className="icon camera"
                          ></span>
                          <Form.Control.Feedback type="invalid">{state.errors.cardImage}</Form.Control.Feedback>
                        </div>

                      </div>
                    }
                  </div>
                </Col>


                <Col lg={6} md={12} className='mb-0'>
                  <Row >
                    <Col lg={12} md={12} className='mb-2'>
                      <Form.Label
                        controlId="floatingInput"
                        label="Token Contract Address*"
                        className=""
                      >Token Contract Address*</Form.Label>
                      <Form.Control
                        value={state.projectSaveDetails?.contractAddress}
                        name='contractAddress'
                        type="text"
                        placeholder="Contract Address*"
                        onChange={(e) => handleChange("contractAddress", e)}
                        isInvalid={!!errors?.contractAddress}
                        required
                        disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                          || state.projectSaveDetails?.projectStatus == "Rejected"
                          || state.projectSaveDetails?.projectStatus == "Approved"
                        ) && true}
                      />
                      <Form.Control.Feedback type="invalid">{errors?.contractAddress || state?.errors?.contractAddress}</Form.Control.Feedback>


                    </Col>
                    <Col lg={12} md={12} className='mb-2'>
                      <Form.Label
                        controlId="floatingInput"
                        label="Token Name*"
                        className=""
                      >Token Name*</Form.Label>
                      <Form.Control
                        value={state.projectSaveDetails?.tokenName}
                        name='tokenName'
                        type="text"
                        placeholder="Token Name"
                        onChange={(e) => handleChange("tokenName", e)}
                        isInvalid={!!errors?.tokenName}
                        required
                        disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                          || state.projectSaveDetails?.projectStatus == "Rejected"
                          || state.projectSaveDetails?.projectStatus == "Approved"
                        ) && true}
                      />
                      <Form.Control.Feedback type="invalid">{errors?.tokenName || state?.errors?.tokenName}</Form.Control.Feedback>

                    </Col>
                    <Col lg={12} md={12} className='mb-2'>
                      <Form.Label
                        controlId="floatingInput"
                        label="Token Symbol*"
                        className=""
                      >Token Symbol*</Form.Label>
                      <Form.Control
                        value={state.projectSaveDetails?.tokenSymbol}
                        name='tokenSymbol'
                        type="text"
                        placeholder="Token Symbol"
                        onChange={(e) => handleChange("tokenSymbol", e)}
                        isInvalid={!!errors?.tokenSymbol}
                        required
                        disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                          || state.projectSaveDetails?.projectStatus == "Rejected"
                          || state.projectSaveDetails?.projectStatus == "Approved"
                        ) && true}
                      />
                      <Form.Control.Feedback type="invalid">{errors?.tokenSymbol || state?.errors?.tokenSymbol}</Form.Control.Feedback>

                    </Col>
                    <Col lg={12} md={12} className='mb-2'>
                      <Form.Label
                        controlId="floatingInput"
                        label="Token Decimals*"
                        className=""
                      >Token Decimals*</Form.Label>
                      <Form.Control value={state.projectSaveDetails?.tokenDecimal}
                        name='tokenDecimal'
                        onKeyPress={(event) => {
                          const allowedKeys = /[0-9\b.]/;
                          if (!allowedKeys.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        type="text" placeholder="Token Decimal"
                        isInvalid={!!errors?.tokenDecimal}
                        onChange={(e) => handleChange("tokenDecimal", e)}
                        required
                        disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                          || state.projectSaveDetails?.projectStatus == "Rejected"
                          || state.projectSaveDetails?.projectStatus == "Approved"
                        ) && true}
                      />
                      <Form.Control.Feedback type="invalid">{errors?.tokenDecimal || state?.errors?.tokenDecimal}</Form.Control.Feedback>

                    </Col>
                    <Col lg={12} md={12} className='mb-2'>
                      <Form.Label
                        controlId="floatingInput"
                        label="Total No Of Tokens*"
                        className=""
                      >Total No Of Tokens*</Form.Label>



                      <NumericFormat
                        value={state.projectSaveDetails?.totalNumberOfTokens}
                        name='totalNumberOfTokens'
                        allowNegative={false}
                        className='form-control'
                        thousandSeparator={true}
                        placeholder="Total No of Token"
                        onChange={(e) => handleChange("totalNumberOfTokens", e)}
                        required
                        isInvalid={!!errors?.totalNumberOfTokens}
                        disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                          || state.projectSaveDetails?.projectStatus == "Rejected"
                          || state.projectSaveDetails?.projectStatus == "Approved"
                        ) && true}
                      />

                      <Form.Control.Feedback type="invalid">{errors?.totalNumberOfTokens || state?.errors?.totalNumberOfTokens}</Form.Control.Feedback>

                    </Col>
                    <Col lg={12} md={12}>
                      <Form.Label
                        controlId="floatingInput"
                        label="Initial Supply*"
                        className=""
                      >Initial Supply* </Form.Label>

                      <NumericFormat
                        value={state.projectSaveDetails?.initialSupply}
                        name='initialSupply'
                        allowNegative={false}
                        className='form-control'
                        thousandSeparator={true}
                        placeholder="Initial Supply"
                        onChange={(e) => handleChange('initialSupply', e)}
                        required
                        isInvalid={!!errors?.initialSupply}
                        disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                          || state.projectSaveDetails?.projectStatus == "Rejected"
                          || state.projectSaveDetails?.projectStatus == "Approved"
                        ) && true}
                      />

                      <Form.Control.Feedback type="invalid">{errors?.initialSupply || state?.errors?.initialSupply}</Form.Control.Feedback>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <div className='text-end mt-xl-5 mb-5'>
                <Button className='cancel-btn me-2' onClick={() => handleCancel()} >
                  Cancel</Button>{' '}
                <Button className='primary-btn' type="submit" projectTokenData={props?.projectTokenData}

                >
                  <span>{state.buttonLoader && <Spinner size="sm" />} </span>
                  {(state.projectSaveDetails?.projectStatus == "Deployed"
                    || state.projectSaveDetails?.projectStatus == "Rejected"
                    || state.projectSaveDetails?.projectStatus == "Approved"
                  ) ?
                    "Next" : "Save & Next"}


                </Button>{' '}
              </div>
            </div>
              <div className='d-flex justify-content-between align-items-center mb-2 mt-5'>
                <h3 className='section-title '>Cast And Crew</h3>
                <Button className='primary-btn mt-3 mt-md-0' onClick={handleEdit} ><span className='icon add-icon'></span> Add </Button>
              </div>
              <Row className='px-lg-3 px-2 mb-4'>
                <Col className="profile-panel card-style p-0 home-card" lg={3}>
                  <div >
                    <div className="">
                      <Form.Group>
                        <div className='profile-size identification-image  no-hover' >
                          <span className='image-box'>
                            <img className='image-setup'
                              src={profileavathar} alt="profile img"
                            />
                          </span>
                        </div>
                      </Form.Group>
                    </div>


                    <Row className="px-lg-3 px-2 mt-3">
                      <Col md={6}>
                        <label className="profile-label">Name</label>
                        <p className="profile-value">Prabhas</p>
                      </Col>

                      <Col md={6}>
                        <label className="profile-label">Website URL</label>
                        <p className="profile-value">ergargqgrgaerg</p>
                      </Col>
                      <Col md={6}>
                        <label className="profile-label">Insta URL</label>
                        <p className="profile-value">ergargqgrgaerg</p>
                      </Col>
                      <Col md={6}>
                        <label className="profile-label">FB URL</label>
                        <p className="profile-value">ergargqgrgaerg</p>
                      </Col>
                      <Col md={6}>
                        <label className="profile-label">Role</label>
                        <p className="profile-value">Actor</p>
                      </Col>
                      <Col md={12}>
                        <label className="profile-label">Bio</label>
                        <p className="profile-value">
                          Tollywood best Film Actor
                        </p>
                      </Col>
                    </Row>

                  </div>

                  <Modal className="settings-modal profile-modal modal-tabview"
                    show={show}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Form   >
                      <Modal.Header className="d-flex justify-content-between">
                        <Modal.Title id="example-custom-modal-styling-title">
                          Add Cast and Crew
                        </Modal.Title>
                        <span className="icon close" onClick={handleCancell}></span>


                      </Modal.Header>

                      <Modal.Body className="launchpadadmin-modal">

                        <Row className="mb-4">
                          <Col xl={12}>
                            <Col xl={6} className="mb-3">
                              <Form.Group>
                                <div className='profile-size identification-image  no-hover' >
                                  <span className='image-box'>

                                    <img className='image-setup'
                                      src={profileavathar} alt="profile img"
                                    />
                                  </span>
                                  <span>
                                    <input ref={inputRef} type="file" name="myImage" id="input-file" onChange={uploadToClient} className="d-none" />
                                    <Button onClick={handleUpload} className="icon camera cam-position upload-transparent">
                                    </Button>
                                  </span>
                                </div>
                              </Form.Group>
                            </Col>
                            <Row className="mt-3 mt-xl-0">

                              <Col xl={6} className="mb-3">
                                <FloatingLabel
                                  controlId="floatingInput"
                                  label="Name*"
                                  className="mb-1 input-style mt-2"
                                >
                                  <Form.Control
                                    type="text"
                                    name="firstName"


                                    autoComplete="off"
                                    onChange={(e) => { setField('firstName', e.currentTarget.value) }}
                                    isInvalid={!!errors.firstName}
                                    required
                                    placeholder="First Name *"
                                    maxLength={50}
                                  />
                                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                                </FloatingLabel>
                              </Col>
                              <Col xl={6} className="mb-3">
                                <FloatingLabel
                                  controlId="floatingInput"
                                  label="Bio"
                                  className="mb-1 input-style mt-2"
                                >

                                  <Form.Control
                                    as="textarea"
                                    placeholder="Enter Bio"
                                    style={{ height: '100px' }}
                                    onChange={(e) => { setField('lastName', e.currentTarget.value) }}
                                    isInvalid={!!errors.lastName}
                                    required
                                    maxLength={50}
                                  />
                                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                                </FloatingLabel>
                              </Col>
                              <Col xl={6} className="mb-3">
                                <FloatingLabel
                                  controlId="floatingInput"
                                  label="Website URL"
                                  className="mb-1 input-style mt-2"
                                >
                                  <Form.Control
                                    type="text"
                                    name="firstName"
                                    autoComplete="off"
                                    onChange={(e) => { setField('firstName', e.currentTarget.value) }}
                                    isInvalid={!!errors.firstName}
                                    required
                                    placeholder="First Name *"
                                    maxLength={50}
                                  />
                                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                                </FloatingLabel>
                              </Col>
                              <Col xl={6} className="mb-3">
                                <FloatingLabel
                                  controlId="floatingInput"
                                  label="Insta URL"
                                  className="mb-1 input-style mt-2"
                                >
                                  <Form.Control
                                    type="text"
                                    name="firstName"
                                    autoComplete="off"
                                    onChange={(e) => { setField('firstName', e.currentTarget.value) }}
                                    isInvalid={!!errors.firstName}
                                    required
                                    placeholder="First Name *"
                                    maxLength={50}
                                  />
                                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                                </FloatingLabel>
                              </Col>
                              <Col xl={6} className="mb-3">
                                <FloatingLabel
                                  controlId="floatingInput"
                                  label="FB URL"
                                  className="mb-1 input-style mt-2"
                                >
                                  <Form.Control
                                    type="text"
                                    name="firstName"
                                    autoComplete="off"
                                    onChange={(e) => { setField('firstName', e.currentTarget.value) }}
                                    isInvalid={!!errors.firstName}
                                    required
                                    placeholder="First Name *"
                                    maxLength={50}
                                  />
                                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                                </FloatingLabel>
                              </Col>
                              <Col lg={6} md={12}>

                                <FloatingLabel
                                  controlId="floatingInput"
                                  label="Role"
                                  className="mb-1 input-style role mt-2"
                                >
                                  <Multiselect
                                    className='multiselecter role-select'
                                    options={jsonCountryCode}
                                    selectedValues={selectedValues}
                                    onSelect={onSelect}
                                    onRemove={onSelect}
                                    displayValue="name"
                                    disable={(state.projectSaveDetails?.projectStatus == "Deployed"
                                      || state.projectSaveDetails?.projectStatus == "Rejected"
                                      || state.projectSaveDetails?.projectStatus == "Approved"
                                    ) && true}
                                  />
                                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                                </FloatingLabel>
                                


                              </Col>
                            </Row>
                          </Col>
                        </Row>

                      </Modal.Body>
                      <Modal.Footer>
                        <div className="text-end"><Button className="transparent-btn" onClick={() => { handleCancel() }}>Cancel</Button>
                          <Button className="filled-btn ms-lg-3 ms-2" type="submit" >
                            Save</Button></div>
                      </Modal.Footer>
                    </Form>
                  </Modal>
                </Col>
              </Row>
            </>}

          </Form>
        </>
      }
      {state?.projectTokenShow && <ProjectTokenDetails onBack={onBack} closeProject={props.closeProject} projectData={state.projectData} projectDetails={state.projectDetails} />}
    </>}
  </>)
}
Projects.propTypes = {
  onBack: PropTypes.bool,
  projectTokenData: PropTypes.isRequired,
  walletAddress: PropTypes.isRequired,
  informationProjectView: PropTypes.string,

}


const connectStateToProps = ({ oidc, launchpad }) => {
  return { oidc: oidc, launchpad: launchpad };
};
const connectDispatchToProps = (dispatch) => {
  return {
    projectDetailsReducerData: (id, callback) => {

      dispatch(projectDetailsData(id, callback));
    },
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(Projects);