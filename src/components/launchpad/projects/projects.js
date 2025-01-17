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
import { projectDetailsData, projectDetailsSave, projectePayment, fetchCastCrewRolesData ,fetchTokenTypeLu,viewedProjects} from '../launchpadReducer/launchpadReducer';
import moment from 'moment';
import jsonCountryCode from '../../../utils/countryCode.json';
import store from 'src/store';
import Dropdown from 'react-bootstrap/Dropdown';
import Multiselect from 'multiselect-react-dropdown';
import { NumericFormat } from 'react-number-format';
import { Modal } from 'react-bootstrap';
import { uuidv4 } from 'src/utils/uuid';
import { erc20FormValidation,erc721FormValidation,validateCastCrewForm } from './formValidation';
import CastcrewCards from './castcrewCards';
import CastCrewForm from './castcrewForm';

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
    case "cast_CrewsFormDeatils":
      return { ...state, cast_CrewsFormDeatils: action.payload };
    case "cast_CrewsImage":
      return { ...state, cast_CrewsImage: action.payload };
    case "castImgLoader":
      return { ...state, castImgLoader: action.payload };
    case "castCrewDataList":
      return { ...state, castCrewDataList: action.payload };
    case "castCrewImageError":
      return { ...state, castCrewImageError: action.payload };
    case "castCrewFormLoader":
      return { ...state, castCrewFormLoader: action.payload };
    case "MediaImage":
      return { ...state, MediaImage: action.payload };
    case "MediaImageLoader":
    return { ...state, MediaImageLoader: action.payload };
    case "SetProjectHeroImg":
      return { ...state, ProjectHeroImg: action.payload };
    case "ProjectHeroImgLoader":
    return { ...state, ProjectHeroImgLoader: action.payload };
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
  errors: {},
  cast_CrewsFormDeatils: {
    id: "00000000-0000-0000-0000-000000000000",
    image: null,
    name: '',
    bio: '',
    webisite: '',
    instagram: '',
    facebook: '',
    role: [],
    recordStatus:''
  },
  castImgLoader: false,
  castCrewDataList: [],
  castCrewImageError: '',
  castCrewFormLoader:false,
  MediaImage:null,
  MediaImageLoader:false,
  ProjectHeroImg:null,
  ProjectHeroImgLoader:false,
};
const Projects = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  let { pId, mode } = useParams();
  const dispatchData = useDispatch()
  const editorRef = useRef(null);
  const inputRef = useRef();
  const inputRef1 = useRef();
  const inputRef2 = useRef();
  const inputRef3 = useRef();
  const inputRef4 = useRef();
  const inputRef5 = useRef();
  const walletAddress = useSelector((state) => state.walletAddress.walletAddress)
  const projectDetails = useSelector((state) => state.launchpad.projectDetails)
  const isProjectCardsId = useSelector(state => state.oidc?.isProjectCardsId)
  const userId = sessionStorage.getItem('userId');
  const isAdmin = useSelector(state => state.oidc?.adminDetails);
  const projectSaveDetails = useSelector(state => state.launchpad?.projectSaveDetails);
  const selectedProject = useSelector(state => state.projectDetails.project);
  const userName = sessionStorage.getItem('userName');
  const prjctName = selectedProject?.name || userName;
  const projectName = isAdmin?.isAdmin ? prjctName :isAdmin?.firstName;
  const projectownerId = isAdmin?.isAdmin ? userId : isAdmin?.id
  const isIdeoRequest = window.location.pathname.includes('/launchpad/idorequest');
  const navigate = useNavigate();
  const currentDate = new Date().toISOString().slice(0, 16);
  const [errors, setErrors] = useState({});
  const [selectedValues, setSelectedValues] = useState([]);
  const [countryData, setCountryData] = useState([])
  const [imageError, setImageError] = useState()
  const [show, setShow] = useState(false);
  const castCrewRolesLu = useSelector(state => state.launchpad?.castCrewRolesLuData?.data);
  const ercTokeType = useSelector(state => state.launchpad?.tokenTypeLuData?.data);
  const [selectedroleValues, setSelectedroleValues] = useState([]);
  const [castCrewLoader,setCastCrewLoader]=useState(false);
  const [selectedTokeType, setSelectedTokeType] = useState('ERC-20');
  useEffect(() => {
    dispatch({ type: 'loader', payload: true })
    dispatch({ type: 'loading', payload: true })
    dispatch({ type: 'bannerImgLoader', payload: true })
    dispatch({ type: 'MediaImageLoader', payload: true })
    dispatch({ type: 'cardImgLoader', payload: true })
    dispatch({ type: 'ProjectHeroImgLoader', payload: true })
    window.scroll(0, 0);
    props.projectDetailsReducerData(pId || props.informationProjectView, (callback) => {
      dispatch({ type: 'projectSaveDetails', payload: callback.data?.projectsViewModel })
      dispatch({ type: 'projectLogoImages', payload: callback.data?.projectsViewModel?.cardImage })
      dispatch({ type: 'projectBannerImages', payload: callback.data?.projectsViewModel?.bannerImage })
      dispatch({ type: 'MediaImage', payload: callback.data?.projectsViewModel?.mediaImage })
      dispatch({ type: 'SetProjectHeroImg', payload: callback.data?.projectsViewModel?.heroImage })
      dispatch({ type: 'projectCardImages', payload: callback.data?.projectsViewModel?.tokenLogo })
      dispatch({ type: 'castCrewDataList', payload: callback.data?.projectsViewModel?.castCrews ? callback.data?.projectsViewModel?.castCrews : [] });
      dispatch({ type: 'projectDetails', payload: callback.data })
      dispatch({ type: 'loading', payload: false })
      dispatch({ type: 'bannerImgLoader', payload: false })
      dispatch({ type: 'MediaImageLoader', payload: false })
      dispatch({ type: 'ProjectHeroImgLoader', payload: false })
      dispatch({ type: 'cardImgLoader', payload: false })
      dispatchData(setProjectDetail(callback?.data?.claimsAndAllocations))
      setSelectedValues(callback.data?.projectsViewModel?.countryRestrictions)
      getSelectedCountries(callback.data?.projectsViewModel?.countryRestrictions)
      store.dispatch(projectePayment(callback.data?.projectPayment))
      store.dispatch(viewedProjects(callback.data?.projectsViewModel));
      dispatch({ type: 'loader', payload: false })
      getClaimsandAllocations(callback.data?.projectsViewModel)
      setSelectedTokeType(callback.data?.projectsViewModel?.tokenType ?callback.data?.projectsViewModel?.tokenType : 'ERC-20'  )
    })
    getWalletAddress();
  }, []);
  useEffect(() => {
    handledescription();
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

  const handleCancell = () => {
    setShow(false)
    dispatch({ type: "cast_CrewsFormDeatils", payload: {} });
    dispatch({ type: 'castCrewImageError', payload: null })
    setSelectedroleValues([])
    setErrors({});
  }

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
    dispatch({ type: 'errorMgs', payload: null })
    event.preventDefault();
    if (isIdeoRequest) {
      dispatch({ type: 'projectTokenShow', payload: true })
      store.dispatch(projectDetailsSave(state.projectSaveDetails));
    } else {
      dispatch({ type: 'buttonLoader', payload: true })
      let obj = {
        "id": projectSaveDetails?.id != null ? projectSaveDetails.id : (pId ?? "00000000-0000-0000-0000-000000000000"),
        "contractAddress": state.projectSaveDetails?.contractAddress ||null,
        "tokenName": state.projectSaveDetails?.tokenName || null,
        "tokenSymbol": state.projectSaveDetails?.tokenSymbol || null,
        "tokenLogo": state.projectCardImages,
        "tokenDecimal": state.projectSaveDetails?.tokenDecimal || null,
        "totalNumberOfTokens": state.projectSaveDetails?.totalNumberOfTokens || null,
        "bannerImage": state.projectBannerImages,
        "mediaImage" : state.MediaImage,
        "heroImage":state.ProjectHeroImg,
        "cardImage":state.projectLogoImages || null,
        "projectName": state.projectSaveDetails?.projectName,
        "networkSymbol": "Matic",
        "vestingDetails": "string",
        "countryRestrictions": countryData,
        "raisedFund": state.projectSaveDetails?.raisedFund,
        "walletAddress": walletAddress || null,
        "description": state.projectSaveDetails?.description,
        "tokenListingDate": state.projectSaveDetails?.tokenListingDate,
        "tokenContractAddress": state.projectSaveDetails?.tokenContractAddress || null,
        "introductionHtml": state.introductionHtml || state.projectSaveDetails?.introductionHtml,
        "projectOwnerId":  projectownerId ,
        "initialSupply": state.projectSaveDetails?.initialSupply || null,
        "cast_Crews": state.castCrewDataList,
        "category": "string",
        "tokenType": selectedTokeType || 'ERC-20',
        "nftImagesCount": state.projectSaveDetails?.nftImagesCount || null,
        "projectStatus" : state.projectSaveDetails?.projectStatus,
      }
      dispatch({ type: 'projectSaveDetails', payload: obj })
      if (window.location.pathname.includes('/launchpad/idorequest')) {
        obj.id = state.projectSaveDetails?.id
      }
      if(selectedTokeType == 'ERC-20'){
        let initialSupplyValue = obj?.initialSupply
        let totalNumberOfTokenValue = obj?.totalNumberOfTokens
        if (typeof totalNumberOfTokenValue === 'string') {
          obj.totalNumberOfTokens = parseFloat(totalNumberOfTokenValue.replace(/[^0-9.-]+/g, ''));
        }
        if (typeof initialSupplyValue === 'string') {
          obj.initialSupply = parseFloat(initialSupplyValue.replace(/[^0-9.-]+/g, ''));
        }
        
        const formErrors = erc20FormValidation(obj);
        if (Object.keys(formErrors)?.length > 0) {
          setErrors(formErrors)
          dispatch({ type: 'errors', payload: formErrors })
          dispatch({ type: 'loader', payload: false })
          dispatch({ type: 'buttonLoader', payload: false })
        } else {
        //   if (obj.cast_Crews?.length === 0) {
        //     dispatch({ type: 'errorMgs', payload: 'Please add at least one cast and crew' });
        //     window.scroll(0, 0);
        //     dispatch({ type: 'buttonLoader', payload: false })
        //     return; 
        // }
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
        
      }else{
        const formErrors = erc721FormValidation(obj);
        if (Object.keys(formErrors)?.length > 0) {
          setErrors(formErrors)
          dispatch({ type: 'errors', payload: formErrors })
          dispatch({ type: 'loader', payload: false })
          dispatch({ type: 'buttonLoader', payload: false })
        } else {
        //   if (obj.cast_Crews?.length === 0) {
        //     dispatch({ type: 'errorMgs', payload: 'Please add at least one cast and crew' });
        //     window.scroll(0, 0);
        //     dispatch({ type: 'buttonLoader', payload: false })
        //     return; 
        // }
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
   }
    dispatch({ type: 'validated', payload: true })
    dispatch({ type: 'buttonLoader', payload: false })
    window.scroll(0, 0);

  }

  const uploadToClient = (event, type) => {
    setImageError(null)
    dispatch({ type: 'castCrewImageError', payload: null })
    dispatch({ type: 'errorMgs', payload: null })
    if (event.target.files) {
      const file = event.target.files[0];
      if (!file.name.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        if (type !== 'image') {
          setImageError("It is not permitted to upload a file. Only jpg,jpeg,png,gif,webp files can be uploaded.")
          window.scroll(0, 0);
        } else {
          dispatch({ type: 'castCrewImageError', payload: "It is not permitted to upload a file. Only jpg,jpeg,png,gif,webp files can be uploaded." })
          window.scroll(0, 0);
        }
      } else {
        uploadToServer(file, type);
        if (type === 'banner') {
          dispatch({ type: 'bannerImgLoader', payload: true }) 
          if (errors[type]) {
            setErrors({ ...errors, [field]: null })
          }
        } else if (type === 'LOGO') {
          dispatch({ type: 'loading', payload: true })
          if (errors[type]) {
            setErrors({ ...errors, [field]: null })
          }
        } else if (type === 'image') {
          dispatch({ type: 'castImgLoader', payload: true })
          if (errors[type]) {
            dispatch({ type: 'castCrewImageError', payload:  null })
          }
        }else if (type === 'MediaImage') {
          dispatch({ type: 'MediaImageLoader', payload: true })
          if (errors[type]) {
            setErrors({ ...errors, MediaImage: null })
          }
        } 
        else if (type === 'ProjectHeroImg') {
          dispatch({ type: 'ProjectHeroImgLoader', payload: true })
          if (errors[type]) {
            setErrors({ ...errors, ProjectHeroImg: null })
          }
        }
        else {
          dispatch({ type: 'cardImgLoader', payload: true })
          if (errors[type]) {
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
        dispatch({ type: 'castImgLoader', payload: false })
        dispatch({ type: 'MediaImageLoader', payload: false })
        dispatch({ type: 'ProjectHeroImgLoader', payload: false })
        if(type !='image'){
          dispatch({ type: 'errorMgs', payload: apiCalls.uploadErrorDisplay(res) })
        }else{
          dispatch({ type: 'castCrewImageError', payload: apiCalls.uploadErrorDisplay(res) })
        }
      } else {
        let data = res
        let _obj = { ...state.projectImages };
        if (type == "LOGO") {
          _obj.tokenLogo = data[0];
          dispatch({ type: 'errors', payload:{ ...state.errors,  cardImage: ''}  });
          dispatch({ type: 'loading', payload: false })
          dispatch({ type: 'projectLogoImages', payload: data[0] })
        } else if (type == "banner") {
          _obj.bannerImage = data[0];
          dispatch({ type: 'errors', payload:{ ...state.errors,  bannerImage: ''}  });
          dispatch({ type: 'bannerImgLoader', payload: false })
          dispatch({ type: 'projectBannerImages', payload: data[0] })
        } else if (type == "CARD") {
          _obj.cardImage = data[0];
          dispatch({ type: 'errors', payload:{ ...state.errors,  tokenLogo: ''}  });
          dispatch({ type: 'cardImgLoader', payload: false })
          dispatch({ type: 'projectCardImages', payload: data[0] })
        } else if (type == "image") {
          _obj.cardImage = data[0];
          dispatch({ type: 'castImgLoader', payload: false })
          dispatch({ type: 'cast_CrewsFormDeatils', payload: { ...state.cast_CrewsFormDeatils, image: data[0] } })
        } else if (type == "MediaImage") {
          _obj.MediaImage = data[0];
          dispatch({ type: 'errors', payload:{ ...state.errors,  MediaImage: ''}  });
          dispatch({ type: 'MediaImageLoader', payload: false })
          dispatch({ type: 'MediaImage', payload: data[0] })
        }
        else if (type == "ProjectHeroImg") {
          _obj.ProjectHeroImg = data[0];
          dispatch({ type: 'errors', payload:{ ...state.errors,  ProjectHeroImg: ''}  });
          dispatch({ type: 'ProjectHeroImgLoader', payload: false })
          dispatch({ type: 'SetProjectHeroImg', payload: data[0] })
        }
      }
    } catch (error) {
      if(type !='image'){
        dispatch({ type: 'errorMgs', payload: apiCalls.isErrorDispaly(error) })
      }else{
        dispatch({ type: 'castCrewImageError', payload: apiCalls.isErrorDispaly(error) })
      }
      dispatch({ type: 'bannerImgLoader', payload: false })
      dispatch({ type: 'loading', payload: false })
      dispatch({ type: 'cardImgLoader', payload: false })
      dispatch({ type: 'castImgLoader', payload: false })
      dispatch({ type: 'ProjectHeroImgLoader', payload: false })
      window.scroll(0, 0);
    }
  };


  const onBack = () => {
    dispatch({ type: 'projectTokenShow', payload: false })
    dispatch({ type: 'projectSaveDetails', payload: projectSaveDetails })
    dispatch({ type: 'castCrewDataList', payload: projectDetails?.data?.projectsViewModel?.castCrews });
  }

  const handleCancel = () => {
    if (isAdmin?.isAdmin) {
      if (window.location.pathname.includes('/launchpad/investors')) {
        navigate(`/launchpad/investors/projects/${projectownerId }`)
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

  const handleChange = (field, value) => {
    dispatch({ type: 'projectSaveDetails', payload:{ ...state.projectSaveDetails,[field]: value }  })
    if (errors[field]) {
      setErrors({ ...errors, [field]: null })
      dispatch({ type: 'errors', payload: { ...state.errors,[field]: null } })
    }
  }

  const trimField = (field) => {
    let value = state.projectSaveDetails[field]?.trim() || '';
    dispatch({ type: 'projectSaveDetails', payload:{ ...state.projectSaveDetails,[field]: value }  })
}

  const handlecastCrewData = (field,value) => {
    dispatch({type: 'cast_CrewsFormDeatils', payload: {...state.cast_CrewsFormDeatils,[field]: value}  });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null })
    }
  }
  const trimcastCrewField = (field) => {
    let value = state.cast_CrewsFormDeatils[field]?.trim() || '';
    dispatch({type: 'cast_CrewsFormDeatils', payload: {...state.cast_CrewsFormDeatils,[field]: value}  });
}


  const handleEdit = (index) => {
    setShow(true)
    if (index !== null) {
      dispatch({ type: 'castCrewFormLoader', payload: true })
      const selectedItem = state.castCrewDataList[index];
      setSelectedroleValues(selectedItem?.role?.map(role => ({ role })));
      dispatch({ type: "cast_CrewsFormDeatils", payload: selectedItem });
      setTimeout(() => {
        dispatch({ type: 'castCrewFormLoader', payload: false })
      }, 1000);
    } else {
      dispatch({ type: "cast_CrewsFormDeatils", payload: {} });
    }
  }

  const onSelect = (selectedList) => {
    let _data = { ...state.projectSaveDetails };
    const selectedNames = selectedList?.map(item => item.name);
    _data.countryRestrictions = selectedNames
    dispatch({ type: 'projectSaveDetails', payload: _data })

    if (errors?.countryRestrictions) {
      setErrors({ ...errors, countryRestrictions: null })

    }
    else if (errors?.countryRestrictions == 'Is required' && selectedList?.length == 0) {
      setErrors({ ...errors, countryRestrictions: 'Is required' })
    }
    setCountryData(selectedNames)
    setSelectedValues(selectedList);

  };


  const onRolsSelect = (selectedList) => {
    const selectedRoleNames = selectedList?.map(item => item.role).flat();
    setSelectedroleValues(selectedList);
    dispatch({ type: 'cast_CrewsFormDeatils', payload: { ...state.cast_CrewsFormDeatils, role: selectedRoleNames } })
    setErrors({ ...errors, role: null })
  };
  
  const handleCastCrewDataSave = async (event) => {
    event.preventDefault();
    const validatingForm = { ...state.cast_CrewsFormDeatils };
    const formErrors = validateCastCrewForm(validatingForm);
    setCastCrewLoader(true)
    if (Object.keys(formErrors)?.length > 0) {
      setErrors(formErrors);
      setCastCrewLoader(false);
    } else {
      const formDetails = { ...state.cast_CrewsFormDeatils };
      const existingIndex = state.castCrewDataList?.findIndex(item => item.id === formDetails.id);
      if (existingIndex !== -1) {
        const updatedList = [...state.castCrewDataList];
        updatedList[existingIndex] = { ...formDetails, recordStatus: formDetails?.recordStatus === "added" ? "added" : "modified" };
        dispatch({ type: 'castCrewDataList', payload: updatedList });
      } else {
        const formData = { ...state.cast_CrewsFormDeatils, id: uuidv4() };
        dispatch({ type: 'castCrewDataList', payload: [...state.castCrewDataList, { ...formData, recordStatus: "added" }] });
      }
      dispatch({ type: 'errorMgs', payload: '' })
      dispatch({ type: 'castCrewImageError', payload: null })
      setErrors({});
      setTimeout(() => {
        setCastCrewLoader(false)
      }, 1000);
      setShow(false)
      setSelectedroleValues([])
    }
  }

  const handleTokenTypeChange = (event) => {
    setSelectedTokeType(event.target.value);
  };
const clearErrorMsg=()=>{
  setImageError(null)
  dispatch({ type: 'errorMgs', payload: null })
  dispatch({ type: 'projectDetails', payload: { ...projectDetails, errorMsg: null } });
  dispatch({ type: 'castCrewImageError', payload: null })
}

return (<>
    {state.loader && <div className="text-center"><Spinner ></Spinner></div>}
    {!state.loader && <>
      {!state.projectTokenShow &&
        <>
          {state?.errorMgs && (
            <Alert variant="danger">
              <div className='d-flex gap-4'>
               <div className='d-flex gap-2 flex-1'>
               <span className='icon error-alert'></span>
               <p className='m1-2' style={{ color: 'red' }}>{state?.errorMgs}</p>
               </div>
               <span className='icon close-red' onClick={clearErrorMsg}></span>
              </div>
            </Alert>
          )}

          {projectDetails?.errorMgs && (
            <Alert variant="danger">
              <div className='d-flex gap-4'>
               <div className='d-flex gap-2 flex-1'>
               <span className='icon error-alert'></span>
               <p className='m1-2' style={{ color: 'red' }}>{projectDetails?.errorMgs}</p>
               </div>
               <span className='icon close-red' onClick={clearErrorMsg}></span>
              </div>
            </Alert>
          )}
          <Form noValidate validated={state?.validated} onSubmit={(e) => handleSaveProjectDetails(e)}>

            {isAdmin?.isAdmin && window.location.pathname.includes('investors') &&
              <CBreadcrumb>
                <CBreadcrumbItem>
                  <CLink href="#" onClick={() => navigate(mode === "projectsDetails" ? `/launchpad/investors` : '/launchpad/investors')}>{mode === "projectsDetails" ? "Project Owners" : "Projects"}</CLink>
                </CBreadcrumbItem>
                {projectName && <CBreadcrumbItem >{projectName}</CBreadcrumbItem>}
                  {mode &&
                  <CBreadcrumbItem>
                    <CLink href="#" onClick={() => navigate(mode === "projectsDetails" ? `/launchpad/investors/projects/${isProjectCardsId}` : `/launchpad/idorequest`)}>{mode === "projectsDetails" && "Projects"}</CLink>
                  </CBreadcrumbItem>}
                  <CBreadcrumbItem >{pId === "00000000-0000-0000-0000-000000000000" ? "Add Project" :`${state.projectSaveDetails?.projectName}`}</CBreadcrumbItem>
                  {pId !== "00000000-0000-0000-0000-000000000000" && <CBreadcrumbItem > {"View"}</CBreadcrumbItem>}
              </CBreadcrumb>} 

            {isAdmin?.isAdmin && window.location.pathname.includes('idorequest') &&
              <CBreadcrumb>
                <CBreadcrumbItem>
                  <CLink href="#" onClick={() => idoRequestBredCrumd()}>{"IDO Request"}</CLink>
                </CBreadcrumbItem>
                <CBreadcrumbItem >{state.projectSaveDetails?.projectName}</CBreadcrumbItem>
                <CBreadcrumbItem active>{"View"}</CBreadcrumbItem>
              </CBreadcrumb>}



            {!isAdmin?.isAdmin && <CBreadcrumb>
              <CBreadcrumbItem>
                <CLink href="#" onClick={() => navigate(`/launchpad/projects/${isAdmin?.id}`)}>Projects</CLink>
              </CBreadcrumbItem>
              <CBreadcrumbItem >{pId === "00000000-0000-0000-0000-000000000000" ? "Add Project" :`${state.projectSaveDetails?.projectName}`}</CBreadcrumbItem>
              {pId !== "00000000-0000-0000-0000-000000000000" && <CBreadcrumbItem > View</CBreadcrumbItem>}
            </CBreadcrumb>}

            {imageError && (
              <Alert variant="danger">
                <div className='d-flex gap-4'>
               <div className='d-flex gap-2 flex-1'>
               <span className='icon error-alert'></span>
               <p className='m1-2' style={{ color: 'red' }}>{imageError}</p>
               </div>
               <span className='icon close-red' onClick={clearErrorMsg}></span>
              </div>
              </Alert>
            )}

            <div className="text-center"> {state.loader && <div className="text-center"><Spinner ></Spinner></div>}</div>
            {!state.loader && <>
           
            <div className='launchpad-labels'>
              <div className='d-lg-flex align-items-center justify-content-between mb-2'><h3 className='section-title mb-1 mt-2'>Project Details</h3><p className='mb-0 page-number'><span className='active-number'>1</span> of 3</p></div>               
              <div className='px-2'>
              <Row className='mb-4 border p-3 rounded'>
                <Col lg={4} md={12} className='col-width py-0 d-md-flex flex-column justify-content-between' >
                <div>
                  <Form.Label className="input-label upload-file ms-2">Project Logo<span className="text-danger">*</span></Form.Label>
                  <div
                    className={`media-image ${isIdeoRequest ?
                      'upload-img mb-2 position-relative c-notallowed' :
                      'upload-img mb-2 position-relative '}`}
                  >
                    {state.MediaImageLoader && <Spinner fallback={state.MediaImageLoader} className='position-absolute'></Spinner>}
                    {state.MediaImage && !state.MediaImageLoader && <span className='imgupload-span'>
                      <Image src={state.MediaImage} width="100" height="100" alt="" /></span>}
                    {!state.MediaImage && !state.MediaImageLoader &&
                      <div className="choose-image">
                        <div>
                          <Form.Control
                            required
                            className="d-none custom-btn active btn"
                            type="file"
                            ref={inputRef4}
                            isInvalid={!!state.errors.MediaImage}
                            onChange={(e) => uploadToClient(e, 'MediaImage')}
                            disabled={isIdeoRequest}
                          />
                          <span
                            className="icon camera"
                            onClick={() => inputRef4.current?.click()}
                          ></span>
                        </div>
                        
                      </div>                      
                    }
                    {state.MediaImage && !state.MediaImageLoader &&
                      <div

                        className={`${isIdeoRequest ?
                          'onhover-upload c-notallowed' :
                          'onhover-upload'}`}>
                        <div className='bring-front'>
                          <Form.Control
                            required
                            className="d-none custom-btn active btn"
                            type="file"
                            ref={inputRef4}
                            isInvalid={!!state.errors.MediaImage}
                            onChange={(e) => uploadToClient(e, 'MediaImage')}
                            disabled={isIdeoRequest}
                          />
                          <span
                            className="icon camera"
                            onClick={() => inputRef4.current?.click()}
                          ></span>
                          <Form.Control.Feedback type="invalid">{state.errors.MediaImage}</Form.Control.Feedback>
                        </div>
                      </div>
                    }
                  </div>
                  <p className='error-space ps-0 text-center' type="invalid">{state.errors.MediaImage}</p>
                  {!state.MediaImage &&<p className="image-types text-center mb-2">
                      Jpg, Jpeg, Png, Gif, Webp
                      
                      </p>}
                      <p className='note-resolution text-center'><span>Note:</span> For Better Appearance Upload <br/> 46 * 46 Resolution</p>
                  </div>
                 <div>
                 <Form.Label className="input-label upload-file ms-2">Project Card Image<span className="text-danger">*</span></Form.Label>
                  <div
                    className={`Project-Card ${isIdeoRequest ?
                      'upload-img mb-2 position-relative c-notallowed' :
                      'upload-img mb-2 position-relative '}`}
                  >
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
                            isInvalid={!!state.errors.cardImage}
                            onChange={(e) => uploadToClient(e, 'LOGO')}
                            disabled={isIdeoRequest}
                          />
                          <span
                            className="icon camera"
                            onClick={() => inputRef.current?.click()}
                          ></span>

                          <p className="c-pointer pt-3 mb-2">
                            Jpg, Jpeg, Png, Gif, Webp <br/>
                          </p>
                          <p className='note-resolution text-center'><span>Note:</span> For Better Appearance Upload <br/> 345 * 200 Resolution</p>
                          <Form.Control.Feedback type="invalid">{state.errors.cardImage}</Form.Control.Feedback>
                        </div>
                      </div>
                    }
                    {state.projectLogoImages && !state.loading &&
                      <div

                        className={`${isIdeoRequest ?
                          'onhover-upload c-notallowed' :
                          'onhover-upload'}`}>
                        <div className='bring-front'>
                          <Form.Control
                            required
                            className="d-none custom-btn active btn"
                            type="file"
                            ref={inputRef}
                            isInvalid={!!state.errors.cardImage}
                            onChange={(e) => uploadToClient(e, 'LOGO')}
                            disabled={isIdeoRequest}
                          />
                          <span
                            className="icon camera"
                            onClick={() => inputRef.current?.click()}
                          ></span>
                          <Form.Control.Feedback type="invalid">{state.errors.cardImage}</Form.Control.Feedback>
                        </div>
                      </div>
                    }
                  </div>
                 </div>
                 
                </Col>
                {/* BANNER IMAGE */}
                <Col lg={8} md={12}>
                  <Form.Label className="input-label upload-file ms-2">Project Banner Image<span className="text-danger">*</span></Form.Label>
                  <div
                    className={`banner-size ${isIdeoRequest ?
                      'upload-img mb-2 position-relative c-notallowed' :
                      'upload-img mb-2 position-relative '}`}
                    role="button"
                  >
                    {state.bannerImgLoader && <Spinner fallback={state.bannerImgLoader} className='position-absolute'></Spinner>}
                    {state.projectBannerImages && !state.bannerImgLoader && <span className='imgupload-span'>
                      <Image src={state.projectBannerImages} width="100" height="100" alt="" /></span>}
                    {!state.projectBannerImages && !state.bannerImgLoader &&
                      <div className="choose-image">
                        <div>
                          <Form.Control
                            required
                            className="d-none custom-btn active btn"
                            type="file"
                            ref={inputRef1}
                            isInvalid={!!state.errors.bannerImage}
                            onChange={(e) => uploadToClient(e, 'banner')}
                            disabled={isIdeoRequest}
                          />
                          <span
                            className="icon camera"
                            onClick={() => inputRef1.current?.click()}
                          ></span>
                          <p className="c-pointer pt-3">
                            Jpg, Jpeg, Png, Gif, Webp <br/>
                          </p>
                          <p className='note-resolution text-center'><span>Note:</span> For Better Appearance Upload <br/> 870 * 380 Resolution</p>
                          <Form.Control.Feedback type="invalid">{state.errors.bannerImage}</Form.Control.Feedback>
                        </div>
                      </div>
                    }
                    {state.projectBannerImages && !state.bannerImgLoader &&
                      <div
                        className={`${isIdeoRequest ?
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
                            disabled={isIdeoRequest}
                          />
                          <span
                            className="icon camera"
                            onClick={() => inputRef1.current?.click()}
                          ></span>
                          <Form.Control.Feedback type="invalid">{state.errors.bannerImage}</Form.Control.Feedback>
                        </div>
                      </div>
                    }
                  </div>

                </Col>
                {/* HERO IMAGE */}
                <Col lg={12} md={12} className='mt-3'>
                  <Form.Label className="input-label upload-file ms-2">Project Hero Image<span className="text-danger">*</span></Form.Label>
                  <div
                    className={`hero-img ${isIdeoRequest ?
                      'upload-img mb-2 position-relative c-notallowed' :
                      'upload-img mb-2 position-relative '}`}
                    role="button"
                  >
                    {state.ProjectHeroImgLoader && <Spinner fallback={state.ProjectHeroImgLoader} className='position-absolute'></Spinner>}
                    {state.ProjectHeroImg && !state.ProjectHeroImgLoader && <span className='imgupload-span'>
                      <Image src={state.ProjectHeroImg} width="100" height="100" alt="" /></span>}
                    {!state.ProjectHeroImg && !state.ProjectHeroImgLoader &&
                      <div className="choose-image">
                        <div>
                          <Form.Control
                            required
                            className="d-none custom-btn active btn"
                            type="file"
                            ref={inputRef5}
                            isInvalid={!!state.errors.ProjectHeroImg}
                            onChange={(e) => uploadToClient(e, 'ProjectHeroImg')}
                            disabled={isIdeoRequest}
                          />
                          <span
                            className="icon camera"
                            onClick={() => inputRef5.current?.click()}
                          ></span>
                          <p className="c-pointer pt-3">
                            Jpg, Jpeg, Png, Gif, Webp <br/>
                          </p>
                          <p className='note-resolution text-center'><span>Note:</span> For Better Appearance Upload <br/> 1140 * 380 Resolution</p>
                          <Form.Control.Feedback type="invalid">{state.errors.ProjectHeroImg}</Form.Control.Feedback>
                        </div>
                      </div>
                    }
                    {state.ProjectHeroImg && !state.ProjectHeroImgLoader &&
                      <div
                        className={`${isIdeoRequest ?
                          'onhover-upload c-notallowed' :
                          'onhover-upload'}`}>
                        <div className='bring-front'>
                          <Form.Control
                            required
                            className="d-none custom-btn active btn"
                            type="file"
                            ref={inputRef5}
                            isInvalid={!!state.errors.ProjectHeroImg}
                            onChange={(e) => uploadToClient(e, 'ProjectHeroImg')}
                            disabled={isIdeoRequest}
                          />
                          <span
                            className="icon camera"
                            onClick={() => inputRef5.current?.click()}
                          ></span>
                          <Form.Control.Feedback type="invalid">{state.errors.ProjectHeroImg}</Form.Control.Feedback>
                        </div>
                      </div>
                    }
                  </div>

                </Col>
              </Row>
              </div>
              <Row>
                 
                  <Col lg={6} md={12}>
                  <Form.Label
                    controlId="floatingInput"
                    label="Project Name*"
                    className=""
                  >Project Name<span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    value={state.projectSaveDetails?.projectName}
                    name='projectName'
                    type="text"
                    placeholder="Name"
                    onChange={(e)=>handleChange('projectName',e.currentTarget.value)}
                    onBlur={() => trimField('projectName')}
                    required
                    maxLength={100}
                    isInvalid={!!errors?.projectName}
                    disabled={isIdeoRequest}
                  />
                  <Form.Control.Feedback className='error-space' type="invalid">{errors?.projectName || state?.errors?.projectName}</Form.Control.Feedback>

                </Col>
                <Col lg={6} md={12}>
                  <Form.Label
                    controlId="floatingInput"
                    label="Country Restriction*"
                    className=""
                  > Country Restriction<span className="text-danger">*</span></Form.Label >
                  <Multiselect
                    className='multiselecter'
                    options={jsonCountryCode}
                    selectedValues={selectedValues}
                    onSelect={onSelect}
                    onRemove={onSelect}
                    displayValue="name"
                    disable={isIdeoRequest}
                  />
                  {errors?.countryRestrictions == "Is required" && (
                    <p className='error-space'>Is required</p>

                  )}
                </Col>
                <Col lg={6} md={12}>
                  <Form.Label className='input-label'>Network Symbol<span className="text-danger">*</span></Form.Label>
                  <Dropdown className='matic-dropdown' defaultValue={"Matic"} value="Matic">
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic"
                      disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                        || state.projectSaveDetails?.projectStatus == "Deploying"
                        || isIdeoRequest
                      )}
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
                    <Form.Label className='input-label'>Listing Time & Date<span className="text-danger">*</span></Form.Label>
                    <Form.Control type="datetime-local" placeholder='Listing Time&Date'
                      id="meeting-time"
                      name="tokenListingDate"
                      value={state.projectSaveDetails != null ? state.projectSaveDetails?.tokenListingDate : null}
                      isInvalid={!!errors?.tokenListingDate}
                      onChange={(e)=>handleChange('tokenListingDate',e.currentTarget.value)}
                      min={currentDate}
                      max={`${new Date().getFullYear() + 9999}-12-31T23:59`}
                      disabled={ isIdeoRequest}
                    />
                    <Form.Control.Feedback className='error-space' type="invalid">{errors?.tokenListingDate || state?.errors?.tokenListingDate}</Form.Control.Feedback>

                  </Form.Group>


                </Col>
              
                <Col lg={12} md={12} className='mb-3'>

                  <Form.Label
                    controlId="floatingTextarea"
                    label="Description*"
                    className="text-area-input"
                  >Description<span className="text-danger">*</span></Form.Label>
                  <Form.Control value={state.projectSaveDetails?.description}
                    name='description' className='project-description ps-3'
                    as="textarea"
                    placeholder="Description"
                    onChange={(e)=>handleChange('description',e.currentTarget.value)}
                    onBlur={() => trimField('description')}
                    maxLength={1000}
                    isInvalid={errors?.description}
                    required
                    disabled={isIdeoRequest}
                  />
                  <Form.Control.Feedback className='error-space' type="invalid">{errors?.description || state?.errors?.description}</Form.Control.Feedback>

                </Col>

                <div><h6 className='input-label section-title mb-2 mt-2'>Project Feed</h6></div>
            <div className='projects-editor'>
              <Editor
                // apiKey='sr9qzkyye574at479qfqi56rc3bprw5vols3fvpvmewh491f'
                apiKey='iyxb6xszeihmrg8x8aaj5b2605ajvgmyu79o08ej20sxr6li'
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={state.projectSaveDetails?.introductionHtml}
                onChange={handledescription}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: 'advlist autolink lists link image charmap preview anchor ' +
                    'searchreplace visualblocks code fullscreen ' +
                    'insertdatetime media table code help wordcount',
                  toolbar: 'undo redo | formatselect | bold italic backcolor | ' +
                    'alignleft aligncenter alignright alignjustify | ' +
                    'bullist numlist outdent indent | removeformat | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; color:#000;background:#fff; }'
                }}
                disabled={isIdeoRequest}
              />
            </div>
              </Row>
              <h3 className='section-title mb-2 mt-5'>Token Details</h3>
           <Col lg={6} md={12} className='pe-2' >
            <Form.Label className='input-label'>Token Type<span className="text-danger">*</span></Form.Label>
              <Form className='radio-select d-flex gap-4 ms-3'>
                <Form.Check
                  type='radio'
                  label='ERC-20'
                  value='ERC-20'
                  onChange={handleTokenTypeChange}
                  checked={selectedTokeType === 'ERC-20'}
                  disabled={
                    state.projectSaveDetails?.projectStatus === 'Deployed' ||
                    state.projectSaveDetails?.projectStatus === 'Deploying' ||
                    isIdeoRequest
                  }
                />
                <Form.Check
                  type='radio'
                  label='ERC-721'
                  value='ERC-721'
                  onChange={handleTokenTypeChange}
                  checked={selectedTokeType === 'ERC-721'}
                  disabled={
                    state.projectSaveDetails?.projectStatus === 'Deployed' ||
                    state.projectSaveDetails?.projectStatus === 'Deploying' ||
                    isIdeoRequest
                  }
                />
              </Form>
             {/* <Dropdown className={`matic-dropdown ${selectedTokeType =='ERC-721' ? 'token-type':''}`} onSelect={handleTokenType}>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic"
                disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                  || state.projectSaveDetails?.projectStatus == "Deploying"
                  || isIdeoRequest
                )}
              > {selectedTokeType}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {ercTokeType?.map((option) => (
                  <Dropdown.Item eventKey={option.tokenName}>{option.tokenName} </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>  */}
          </Col> 
              {selectedTokeType =='ERC-20' &&
              <Row className='mb-4 Token-Details mt-4'>
                <Col lg={12} md={12} className='mb-0'>
                  <Form.Label className="input-label upload-file ms-2">Upload Token Icon<span className="text-danger">*</span></Form.Label>
                  <div
                    className={`token-icon ${(state.projectSaveDetails?.projectStatus == "Deployed"
                      || isIdeoRequest) ?
                      'upload-img token-upload mb-2 c-notallowed' :
                      'upload-img token-upload mb-2'}`}
                  >
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
                            isInvalid={!!state.errors.tokenLogo}
                            disabled={isIdeoRequest}
                          />
                          <span
                            className="icon camera"
                            onClick={() => inputRef2.current?.click()}
                          ></span>                          
                        </div>

                      </div>
                    }
                    {state.projectCardImages && !state.cardImgLoader &&
                      <div
                        className={`${(state.projectSaveDetails?.projectStatus == "Deployed" || state.projectSaveDetails?.projectStatus == "Deploying" ||isIdeoRequest) ?
                          'onhover-upload c-notallowed' :
                          'onhover-upload'}`}>
                        <div className='bring-front'>
                          <Form.Control
                            required
                            className="d-none custom-btn active btn"
                            type="file"
                            ref={inputRef2}
                            onChange={(e) => uploadToClient(e, 'CARD')}
                            isInvalid={!!state.errors.tokenLogo}
                            disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                              || state.projectSaveDetails?.projectStatus == "Deploying"
                              || isIdeoRequest
                            )}
                          />
                          <span
                            className="icon camera"
                            onClick={() => inputRef2.current?.click()}
                          ></span>
                          {/* <Form.Control.Feedback className='error-space' type="invalid">{state.errors.tokenLogo}</Form.Control.Feedback> */}
                        </div>

                      </div>
                    }
                  </div>
                  <p className='error-space ps-0' type="invalid">{state.errors.tokenLogo}</p>

                 {!state.projectCardImages &&  <>
                  <p className="image-types text-start mb-2">Jpg, Jpeg, Png, Gif, Webp </p></>}
                   <p className='note-resolution'><span>Note:</span> For Better Appearance Upload 50 * 50 Resolution</p>
                 
                </Col>


                <Col lg={6} md={12} className='mb-0'>
                  <Row >
                    <Col lg={12} md={12} className='mb-3'>
                      <Form.Label
                        controlId="floatingInput"
                        label="Token Contract Address*"
                        className=""
                      >Token Contract Address<span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        value={state.projectSaveDetails?.tokenContractAddress}
                        name='tokenContractAddress'
                        type="text"
                        placeholder="Contract Address"
                        onChange={(e)=>handleChange('tokenContractAddress',e.currentTarget.value)}
                        onBlur={(e) => handleChange('tokenContractAddress',e.target.value.trim().replace(/\s+/g, " "))}
                        isInvalid={!!errors?.tokenContractAddress}
                        required
                        maxLength={250 }
                        disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                          || state.projectSaveDetails?.projectStatus == "Deploying"
                          || isIdeoRequest
                        )}
                      />
                      <Form.Control.Feedback className='error-space' type="invalid">{errors?.tokenContractAddress || state?.errors?.tokenContractAddress}</Form.Control.Feedback>


                    </Col>
                    <Col lg={12} md={12} className='mb-3'>
                      <Form.Label
                        controlId="floatingInput"
                        label="Token Name*"
                        className=""
                      >Token Name<span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        value={state.projectSaveDetails?.tokenName}
                        name='tokenName'
                        type="text"
                        placeholder="Token Name"
                        onChange={(e)=>handleChange('tokenName',e.currentTarget.value)}
                        onBlur={(e) => trimField('tokenName')}
                        isInvalid={!!errors?.tokenName}
                        required
                        maxLength={100 }
                        disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                          || state.projectSaveDetails?.projectStatus == "Deploying"
                          || isIdeoRequest
                        )}
                      />
                      <Form.Control.Feedback className='error-space' type="invalid">{errors?.tokenName || state?.errors?.tokenName}</Form.Control.Feedback>

                    </Col>
                    <Col lg={12} md={12} className='mb-3'>
                      <Form.Label
                        controlId="floatingInput"
                        label="Token Symbol*"
                        className=""
                      >Token Symbol<span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        value={state.projectSaveDetails?.tokenSymbol}
                        name='tokenSymbol'
                        type="text"
                        placeholder="Token Symbol"
                        onChange={(e)=>handleChange('tokenSymbol',e.currentTarget.value)}
                        onBlur={(e) => handleChange('tokenSymbol',e.target.value.trim().replace(/\s+/g, " "))}
                        isInvalid={!!errors?.tokenSymbol}
                        required
                        maxLength={10 }
                        disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                          || state.projectSaveDetails?.projectStatus == "Deploying"
                          || isIdeoRequest
                        )}
                      />
                      <Form.Control.Feedback className='error-space' type="invalid">{errors?.tokenSymbol || state?.errors?.tokenSymbol}</Form.Control.Feedback>

                    </Col>
                    
                  </Row>
                </Col>
                <Col lg={6} md={12} className='mb-0'>
                 <Row className='mt-space'>
                 <Col lg={12} md={12} className='mb-3'>
                      <Form.Label
                        controlId="floatingInput"
                        label="Token Decimals*"
                        className="d-block"
                      >Token Decimals<span className="text-danger">*</span></Form.Label>
                      <NumericFormat
                      className='form-control'
                       value={state.projectSaveDetails?.tokenDecimal}
                        name='tokenDecimal'
                        allowNegative={false}
                        thousandSeparator={true}
                        type="text" placeholder="Token Decimal"
                        isInvalid={!!errors?.tokenDecimal}
                        maxLength={2 }
                        decimalScale={0}
                        onChange={(e)=>handleChange('tokenDecimal',e.currentTarget.value)}
                        onBlur={(e) => handleChange('tokenDecimal',e.target.value.trim().replace(/\s+/g, " "))}
                        required
                        disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                          || state.projectSaveDetails?.projectStatus == "Deploying"
                          || isIdeoRequest
                        )}
                      />
                      {(errors?.tokenDecimal || state?.errors?.tokenDecimal) &&<span className='error-space'>{errors?.tokenDecimal || state?.errors?.tokenDecimal}</span>}
                    </Col>
                    <Col lg={12} md={12} className='mb-3'>
                      <Form.Label
                        controlId="floatingInput"
                        label="Total No Of Tokens*"
                        className=""
                      >Total No Of Tokens<span className="text-danger">*</span></Form.Label>

                      <NumericFormat
                        value={state.projectSaveDetails?.totalNumberOfTokens}
                        name='totalNumberOfTokens'
                        allowNegative={false}
                        className='form-control'
                        thousandSeparator={true}
                        placeholder="Total No of Token"
                        maxLength={ 20}
                        decimalScale={0}
                        onChange={(e)=>handleChange('totalNumberOfTokens',e.currentTarget.value)}
                        onBlur={(e) => handleChange('totalNumberOfTokens',e.target.value.trim().replace(/\s+/g, " "))}
                        required
                        isInvalid={!!errors?.totalNumberOfTokens}
                        disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                          || state.projectSaveDetails?.projectStatus == "Deploying"
                          || isIdeoRequest
                        )}
                      />
                      {/* <Form.Control.Feedback type="invalid">{errors?.totalNumberOfTokens || state?.errors?.totalNumberOfTokens}</Form.Control.Feedback> */}
                      {(errors?.totalNumberOfTokens || state?.errors?.totalNumberOfTokens) &&<p className='invaliid-textstyle error-space mb-0'>{errors?.totalNumberOfTokens || state?.errors?.totalNumberOfTokens}</p>}
                    </Col>
                    <Col lg={12} md={12} className='mb-3'>
                      <Form.Label
                        controlId="floatingInput"
                        label="Initial Supply*"
                        className=""
                      >Initial Supply<span className="text-danger">*</span> </Form.Label>

                      <NumericFormat
                        value={state.projectSaveDetails?.initialSupply}
                        name='initialSupply'
                        allowNegative={false}
                        className='form-control'
                        thousandSeparator={true}
                        placeholder="Initial Supply"
                        maxLength={20 }
                        decimalScale={0}
                        onChange={(e)=>handleChange('initialSupply',e.currentTarget.value)}
                        onBlur={(e) => handleChange('initialSupply',e.target.value.trim().replace(/\s+/g, " "))}
                        required
                        isInvalid={!!errors?.initialSupply}
                        disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                          || state.projectSaveDetails?.projectStatus == "Deploying"
                          || isIdeoRequest
                        )}
                      />
                      {(errors?.initialSupply || state?.errors?.initialSupply) &&<p className='invaliid-textstyle error-space mb-0'>{errors?.initialSupply || state?.errors?.initialSupply}</p>}
                    </Col>
                 </Row>
                </Col>
              </Row>
            }
            {selectedTokeType =='ERC-721' && 
            <div className='mb-4 Token-Details mt-4 row-details'>
            <div className='mb-0'>
              <Form.Label className="input-label upload-file">Upload NFT Image<span className="text-danger">*</span></Form.Label>
              <div
                className={`nft-img ${(state.projectSaveDetails?.projectStatus == "Deployed"
                  || isIdeoRequest) ?
                  'upload-img token-upload mb-2 c-notallowed' :
                  'upload-img token-upload mb-2'}`}
              >
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
                        isInvalid={!!state.errors.tokenLogo}
                        disabled={isIdeoRequest}
                      />
                      <span
                        className="icon camera"
                        onClick={() => inputRef2.current?.click()}
                      ></span>
                      <p className="c-pointer pt-3 mb-2">   Jpg, Jpeg, Png, Gif, Webp </p>                     
                       <p className='note-resolution text-center'><span>Note:</span> For Better Appearance Upload <br/> 516 * 516 Resolution</p>
                      <Form.Control.Feedback className='error-space' type="invalid">{state.errors.tokenLogo}</Form.Control.Feedback>
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
                        isInvalid={!!state.errors.tokenLogo}
                        disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                          || state.projectSaveDetails?.projectStatus == "Deploying"
                          || isIdeoRequest
                        )}
                      />
                      <span
                        className="icon camera"
                        onClick={() => inputRef2.current?.click()}
                      ></span>
                      <Form.Control.Feedback className='error-space' type="invalid">{state.errors.tokenLogo}</Form.Control.Feedback>
                    </div>

                  </div>
                }
              </div>
            </div>


            <div className='mb-0 w-100'>
                  <Form.Label
                    controlId="floatingInput"
                    label="Token Decimals*"
                    className="d-block"
                  >Member Ship Count<span className="text-danger">*</span></Form.Label>
                  <NumericFormat
                  className='form-control'
                   value={state.projectSaveDetails?.nftImagesCount === 0 ? '' : state.projectSaveDetails?.nftImagesCount }
                    name='nftImagesCount'
                    allowNegative={false}
                    thousandSeparator={false}
                    type="text" placeholder="Member Ship Count"
                    isInvalid={!!errors?.nftImagesCount}
                    maxLength={5 }
                    decimalScale={0}
                    onChange={(e)=>handleChange('nftImagesCount',e.currentTarget.value)}
                    onBlur={(e) => handleChange('nftImagesCount',e.target.value.trim())}
                    required
                    disabled={(state.projectSaveDetails?.projectStatus == "Deployed"
                      || state.projectSaveDetails?.projectStatus == "Deploying"
                      || isIdeoRequest
                    )}
                  />
                  {(errors?.nftImagesCount || state?.errors?.nftImagesCount) &&<p className='invaliid-textstyle error-space mb-0'>{errors?.nftImagesCount || state?.errors?.nftImagesCount}</p>}
                
            </div>
          </div>}
            </div>


              {/* <div className='profile-section'>
                <div className='d-flex justify-content-between  align-items-center mb-2'>
                  <h3 className='section-title '>Cast And Crew <span className="text-danger">*</span></h3>
                  <Button className='button-style mt-3 mt-md-0' onClick={() => handleEdit(null)}
                  disabled={isIdeoRequest}><span className='icon add-icon'></span> Add </Button>
                </div>
                <Row className='mb-4 mt-4'>
                  <CastcrewCards castCrewDataList={state?.castCrewDataList} handleEdit={handleEdit}/>
                </Row>
              </div> */}

              <div className='text-end mt-5 mb-5'>
                <Button className='cancel-btn me-2' onClick={() => handleCancel()} >
                  Cancel</Button>{' '}
                <Button className='button-secondary' type="submit" projectTokenData={props?.projectTokenData}

                >
                  <span>{state.buttonLoader && <Spinner size="sm" className='text-light' />} </span>
                  {isIdeoRequest ?"Next" : "Save & Next"}
                </Button>{' '}
              </div>
            </>}
            <Modal className="settings-modal profile-modal modal-tabview"
              show={show}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <CastCrewForm projectSaveDetails={state.projectSaveDetails} 
              castCrewImageError={state.castCrewImageError}
              cast_CrewsFormDeatils={state.cast_CrewsFormDeatils}
              uploadToClient={uploadToClient}
              errors={errors}
              handlecastCrewData={handlecastCrewData}
              trimcastCrewField={trimcastCrewField}
              handleCancell={handleCancell}
              handleCastCrewDataSave={handleCastCrewDataSave}
              castCrewRolesLu={castCrewRolesLu}
              selectedroleValues={selectedroleValues}
              onRolsSelect={onRolsSelect}
              castCrewLoader={castCrewLoader}
              inputRef3={inputRef3}
              castImgLoader={state.castImgLoader}
              isIdeoRequest={isIdeoRequest}
              clearErrorMsg={clearErrorMsg} />
            </Modal>
          </Form>
        </>
      }
      {state?.projectTokenShow && <ProjectTokenDetails 
      isIdeoRequest={isIdeoRequest} 
      onBack={onBack} 
      closeProject={props.closeProject} 
      projectData={state.projectData} 
      projectDetails={state.projectDetails}
      projectOwner={projectName} />}
    </>}
  </>)
}
Projects.propTypes = {
  projectTokenData: PropTypes.any,
  informationProjectView: PropTypes.any,
  closeProject: PropTypes.any,
  projectDetailsReducerData: PropTypes.any,
}


const connectStateToProps = ({ oidc, launchpad }) => {
  return { oidc: oidc, launchpad: launchpad };
};
const connectDispatchToProps = (dispatch) => {
  return {
    projectDetailsReducerData: (id, callback) => {

      dispatch(projectDetailsData(id, callback));
      dispatch(fetchCastCrewRolesData());
      dispatch(fetchTokenTypeLu());
    },
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(Projects);