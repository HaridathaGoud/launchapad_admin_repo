import React, { useEffect, useState, useRef, useReducer } from 'react'
import apiCalls from 'src/api/apiCalls';
import { NumericFormat } from 'react-number-format';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import Spinner from "react-bootstrap/esm/Spinner";
import Projects from '../launchpad/projects/projects'
import { useSelector } from 'react-redux';
import ToasterMessage from "src/utils/toasterMessages";
import nodata from '../../assets/images/no-data.png'
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import List from '../grid.component';
import IdoRequestGrid from './settings/idoRequestGrid';
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import PropTypes from 'prop-types'

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "errorMsg":
//       return { ...state, errorMsg: action.payload };
//     case "show":
//       return { ...state, show: action.payload };
//     case "idoRequestDetails":
//       return { ...state, idoRequestDetails: action.payload };
//     case "loader":
//       return { ...state, loader: action.payload };
//     case "btnLoader":
//       return { ...state, btnLoader: action.payload };
//     case "stateChange":
//       return { ...state, stateChange: action.payload };
//     case "selectedObj":
//       return { ...state, selectedObj: action.payload };
//     case "selection":
//       return { ...state, selection: action.payload };
//     case "SelectData":
//       return { ...state, SelectData: action.payload };
//     case "hasMore":
//       return { ...state, hasMore: action.payload };
//     case "btnDisabled":
//       return { ...state, btnDisabled: action.payload };
//     case "searchValue":
//       return { ...state, searchValue: action.payload };
//     case "select":
//       return { ...state, select: action.payload };
//     case "loadeMessage":
//       return { ...state, loadeMessage: action.payload };
//     case "showProjectInformationView":
//       return { ...state, showProjectInformationView: action.payload };
//     case "informationProjectView":
//       return { ...state, informationProjectView: action.payload };
//     case "successMessage":
//       return { ...state, successMessage: action.payload };
//     case "success":
//       return { ...state, success: action.payload };
//     default:
//       return state;
//   }
// }

// const initialState = {
//   errorMsg: null,
//   show: false,
//   idoRequestDetails: [],
//   loader: false,
//   btnLoader: false,
//   stateChange: '',
//   selectedObj: {},
//   selection: [],
//   SelectData: {},
//   hasMore: true,
//   btnDisabled: false,
//   searchValue: '',
//   select: '',
//   loadeMessage: '',
//   showProjectInformationView: false,
//   informationProjectView: '',
//   successMessage: null,
//   success: false
// };


// const IDORequest = () => {
//   // const gridRef = useRef(false);
//   const [success, setSuccess] = useState(null);
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const [pageNo, setPageNo] = useState(1);
//   const pageSize = 10;
//   const shouldLog = useRef(true);
//   const [search, setSearch] = useState(null);
//   const [currentCheckBox, setCurrentCheckBox] = useState()
//   const [errors, setErrors] = useState({});
//   const [form, setForm] = useState({});
//   const [loadData, setLoadData] = useState();
//   const [seeMoreLoader, setSeeMoreLoader] = useState(false);
//   const projectedSaved = useSelector(reducerstate => reducerstate.launchpad?.projectedSaved);
//   useEffect(() => {
//     if (shouldLog.current) {
//       shouldLog.current = false;
//       getIdoRequestDetails(1, 10, null);
//     }

//   }, []);//eslint-disable-line react-hooks/exhaustive-deps

//   useEffect(() => {
//     closeProject(projectedSaved)
//   }, [projectedSaved]);

//   const gridUrl=process.env.REACT_APP_API_LAUNCHPAD_POINT +  `${"/api/v1"}/${"Projects"}/${'boqSearchData' || null}`; //"/api/v1" + "/Projects/ProjectOwners";



//   const handleClose = () => {
//     dispatch({ type: 'hasMore', payload: false })
//     dispatch({ type: 'show', payload: false })
//   }

//   const closeProject = (data, projectFlag) => {
//     setSuccess(projectFlag)
//     dispatch({ type: 'showProjectInformationView', payload: data })
//     if (projectFlag) {
//       setSuccess(`Project saved successfully`);
//       setTimeout(function () {
//         setSuccess(null);
//       }, 2000);
//     }
//   }

//   const handleShow = () => {
//     dispatch({ type: 'errorMsg', payload: null })
//     if (state.SelectData?.id?.length && currentCheckBox) {
//       dispatch({ type: 'show', payload: true })
//     } else if (!state.SelectData?.id?.length || !currentCheckBox) {
//       dispatch({ type: 'errorMsg', payload: "Please select the one record" })
//     }
//   }
//   const fetchMoreData = (pageNum, pageListSize, searchIDO) => {
//     if (state.idoRequestDetails?.length < 100) {
//       setTimeout(() => {
//         getIdoRequestDetails(pageNum, pageListSize, searchIDO);
//       }, 500);
//     }
//     else {
//       dispatch({ type: 'hasMore', payload: false })
//     }
//   };

//   const addProposalList = () => {
//     if (state.idoRequestDetails?.length < 100) {
//       fetchMoreData(pageNo, pageSize, search);
//     }

//   };

//   const getIdoRequestDetails = async (pageNum, pageListSize, searchIDO) => {
//     setSeeMoreLoader(true);
//     dispatch({ type: 'errorMgs', payload: null })
//     if (state.idoRequestDetails?.length === 0) {
//       dispatch({ type: 'loader', payload: true })
//     }
//     const skip = pageNum * pageListSize - pageListSize;
//     const take = pageListSize;
//     let res = await apiCalls.getIdoRequest(take, skip, searchIDO)
//     if (res.ok) {
//       setSeeMoreLoader(false);
//       dispatch({ type: 'loader', payload: false })
//       let _pageNo = pageNum + 1;
//       setPageNo(_pageNo);
//       setSearch(searchIDO);
//       let mergeData = pageNum == 1 ? [...res.data] : [...state.idoRequestDetails, ...res.data];
//       dispatch({ type: 'idoRequestDetails', payload: mergeData })
//       setLoadData(res.data?.length >= 10)
//       if (mergeData?.length > 0) {
//         dispatch({ type: 'loadeMessage', payload: ' ' })
//         setSeeMoreLoader(false)
//       } else if (mergeData?.length === 0) {
//         dispatch({ type: 'loadeMessage', payload: 'No Data Found' })
//       }
//     } else {
//       dispatch({ type: 'loader', payload: false })
//       dispatch({ type: 'errorMsg', payload: apiCalls.isErrorDispaly(res) })
//       window.scroll(0, 0);
//       setSeeMoreLoader(false);
//     }
//   }

//   const handleChange = ({ currentTarget: { value } }) => {
//     let data = value.trim()
//     dispatch({ type: 'searchValue', payload: data })
//     if (!data) {
//       getIdoRequestDetails(1, 10, null)
//       dispatch({ type: 'searchValue', payload: null })
//     }
//   };
//   const handleEnterSearch = (e) => {
//     let data = e.target.value.trim();
//     setSearch(data);
//     if (e.key == 'Enter') {
//       if (data == "") {
//         getIdoRequestDetails(1, 10, null)
//         e.preventDefault();
//       } else {
//         getIdoRequestDetails(1, 10, data)
//         e.preventDefault();
//       }
//     }
//   }

//   const handleSearchh = () => {
//     getIdoRequestDetails(1, 10, search)
//   }

//   const getOnePersonDetailsBasedOnId = (item) => {
//     dispatch({ type: 'showProjectInformationView', payload: true })
//     dispatch({ type: 'informationProjectView', payload: item?.id })
//   }

//   function handleCloseProjectInformationView() {
//     dispatch({ type: 'show', payload: false })
//     dispatch({ type: 'showProjectInformationView', payload: false })
//   }

//   const idoStateChange = async () => {
//     setSuccess(null);
//     dispatch({ type: 'errorMsg', payload: null })
//     dispatch({ type: 'btnLoader', payload: true })
//     dispatch({ type: 'show', payload: true })
//     dispatch({ type: 'loader', payload: true })
//     dispatch({ type: 'btnDisabled', payload: true })
//     let obj = {
//       "projectId": state.SelectData?.id,
//       "state": state.selection
//     }
//     let res = await apiCalls.idoRequestStateChange(obj)
//     if (res.ok) {
//       dispatch({ type: 'btnLoader', payload: false })
//       dispatch({ type: 'show', payload: false })
//       dispatch({ type: 'loader', payload: false })
//       dispatch({ type: 'btnDisabled', payload: false })
//       getIdoRequestDetails(1, 10, null);
//       setSuccess(`Project ${state.selection} successfully`);
//       setTimeout(function () {
//         setSuccess(null);
//       }, 2000);

//     } else {
//       dispatch({ type: 'errorMsg', payload: false })
//       window.scroll(0, 0);
//       dispatch({ type: 'btnLoader', payload: false })
//       dispatch({ type: 'errorMsg', payload: false })
//       dispatch({ type: 'loader', payload: false })
//       dispatch({ type: 'btnDisabled', payload: false })
//     }
//   }

//   const handleInputChange = (item, e) => {
//     setForm(null)
//     const rowChecked = item;
//     const value = e.currentTarget.type === "checkbox" ? e.currentTarget.checked : e.currentTarget.value;
//     dispatch({ type: 'errorMsg', payload: null })
//     const name = e.currentTarget.name;
//     let _selection = [...state.selection];
//     let idx = _selection.indexOf(rowChecked?.id);
//     if (state.selection) {
//       _selection = [];
//     }
//     if (idx > -1) {
//       _selection.splice(idx, 1);
//     } else {
//       _selection.push(rowChecked?.id);
//     }
//     dispatch({ type: 'stateChange', payload: { ...state.stateChange, [name]: value, _selection: _selection, selectedObj: { state: rowChecked?.status } } })

//     if (currentCheckBox === rowChecked.id) {
//       setCurrentCheckBox(null);
//     } else {
//       setCurrentCheckBox(rowChecked.id);
//     }

//     dispatch({ type: "SelectData", payload: rowChecked });
//     dispatch({ type: "selectedObj", payload: rowChecked.id });
//     dispatch({ type: "select", payload: _selection });
//   };

//   const setField = (field, value) => {
//     setForm({
//       ...form,
//       [field]: value
//     })
//     dispatch({ type: 'btnDisabled', payload: false })
//     dispatch({ type: 'selection', payload: value })
//     dispatch({ type: 'btnDisabled', payload: true })
//     if (errors[field]) {
//       setErrors({
//         ...errors,
//         [field]: null
//       })
//     }
//   }

//   const renderTooltip = (e, data) => (
//     <Tooltip id="button-tooltip" {...e}>
//       {data}
//     </Tooltip>
//   ); 

//   const renderTooltipEmail = (e, data) => renderTooltip(e, data);

//   const renderTooltipProject = (e, data) => renderTooltip(e, data);

//   const statusValues = [{ name: "Submitted" }, { name: "Approved" }, { name: "Rejected" }]
//   return (
//     <>
//       {state.loader && <div className="text-center"><Spinner ></Spinner></div>}
//       <h3 className='page-title mb-3'>IDO Request</h3>

//       {!state.loader && <>
//         <CBreadcrumb>
//           <CBreadcrumbItem>
//             Launchpad
//           </CBreadcrumbItem>
//           <CBreadcrumbItem>IDO Request</CBreadcrumbItem>
//         </CBreadcrumb>

//         {state.errorMsg && (
//           <Alert variant="danger">
//             <div className='d-flex align-items-center'>
//               <span className='icon error-alert'></span>
//               <p className='m1-2' style={{ color: 'red' }}>{state.errorMsg}</p>
//             </div>
//           </Alert>
//         )}
//         <div className='custom-flex-launchpad statechange-sm'>

//           <Form className="d-flex grid-search">
//             <Form.Control
//               placeholder="Search by Project Name"
//               className="search-style"
//               aria-label="Search"
//               onKeyUp={(e) => handleChange(e)}
//               onKeyDown={(e) => handleEnterSearch(e)}
//             />
//             <i className="icon search-icon" onClick={handleSearchh}></i>
//           </Form>

//           {state.idoRequestDetails?.length != 0 && <div className='d-flex align-items-center sm-justify-content-end'>
//             <div className='d-flex align-items-center filter-style c-pointer' onClick={handleShow} >
//               <span className='icon state-change'></span><p className='ms-2 mb-0 project-text text-purple'>State Change</p></div>

//           </div>}
//         </div>
//         <div className='user-content'>

//           <div className="text-center">{state.loader && <Spinner></Spinner>}</div>
//           {!state.loader && (
//               <div className='user-contentz'>

//                 {state.idoRequestDetails?.map((item) => (
//                   <div className='badge-style' key={item?.id}>
//                     <div style={{ width: 350 }} className="d-flex align-items-center justify-content-left">
//                       <label htmlFor='checkBoxId' className='check-input-style  c-pointer d-flex align-items-center'>
//                         <input
//                           className={currentCheckBox === item.id ? 'active' : 'inactive'}
//                           id={item.id}
//                           name='isCheck'
//                           type="checkbox"
//                           checked={currentCheckBox === item.id}
//                           onChange={(e) => handleInputChange(item, e)}
//                         />
//                         <span></span>
//                       </label>
//                       <div className='ms-3'><label htmlFor='createdAt' className='project-text text-lightpurpl'>Created At</label>
//                         <p className='mb-0 about-label active text-overflow text-white'>{moment.utc(item?.createdAt).local().format("DD-MM-YYYY hh:mm ")}</p></div>
//                     </div>
//                     <div style={{ width: 150 }}><label htmlFor='emailId' className='project-text text-lightpurpl'>Email Id</label>
//                       <OverlayTrigger
//                         placement="top"
//                         overlay={renderTooltipEmail({}, item.emailId)}>
//                         <p className='mb-0 about-label text-overflow text-white'>{item.emailId ? item.emailId : '-'}</p>

//                       </OverlayTrigger>
//                     </div>
//                     <div style={{ width: 150 }}><label  htmlFor='projectName' className='project-text text-lightpurpl'>Project Name</label>
//                       <OverlayTrigger
//                         placement="top"
//                         overlay={renderTooltipProject({}, item.projectName)}>
//                         <p className='mb-0 about-label text-overflow text-white'>{item.projectName ? item.projectName : '-'}</p>
//                       </OverlayTrigger>
//                     </div>
//                     <div style={{ width: 150 }}><label htmlFor='initialSupply' className='project-text text-lightpurpl'>Initial Supply</label>
//                       <p className='mb-0 about-label text-overflow text-white'>
//                         <NumericFormat value={item?.initialSupply ? item?.initialSupply : '-'} decimalSeparator="." displayType={'text'} thousandSeparator={true} />
//                       </p></div>
//                     <div style={{ width: 150 }}>
//                       <div>
//                         <label htmlFor='totalSupply' className="project-text text-lightpurpl">Total Supply</label>
//                         <p className=" kpi-val mb-0">
//                           <NumericFormat value={item?.totalSupply ? item?.totalSupply : '-'} decimalSeparator="." displayType={'text'} thousandSeparator={true} />
//                         </p>
//                       </div>
//                     </div>
//                     <div style={{ width: 150 }}><label htmlFor='status' className='project-text text-lightpurpl'>Status</label>
//                       <p className='mb-0'>{item?.status ? item.status : "-"}</p>
//                     </div>
//                     <div style={{ width: 150 }} className='d-flex align-items-center justify-content-end'><Button onClick={() => getOnePersonDetailsBasedOnId(item)} className="button-secondary d-flex align-items-center justify-content-left c-pointer"><span className='icon view c-pointer'></span><div className='ps-2'><p className='mb-0 text-light text-overflow c-pointer'>View</p></div></Button></div>
//                   </div>
//                 ))}
             
//              <IdoRequestGrid/>
             
//                 {/* {state.loadeMessage && <>
//                   {state.idoRequestDetails?.length === 0 &&
//                     <div className='text-center'>
//                       <img src={nodata} width={120} alt=''/>
//                       <h4 className="text-center nodata-text db-no-data">No Data Found</h4>
//                     </div>
//                   }
//                 </>} */}
//                 <Modal centered show={state.show} onHide={handleClose} backdrop={false} className="settings-modal profile-modal">
//                   {state.errorMsg && (
//                     <Alert variant="danger">
//                       <div className='d-flex align-items-center'>
//                         <span className='icon error-alert'></span>
//                         <p className='m1-2' style={{ color: 'red' }}>{state.errorMsg}</p>
//                       </div>
//                     </Alert>
//                   )}
//                   <Modal.Header >
//                     <Modal.Title className='modal-title'>Confirm Approve/Reject?</Modal.Title><span onClick={handleClose} className='icon close c-pointer'></span>
//                   </Modal.Header>
//                   <Modal.Body className='px-4 py-5 launchpad-labels'>
//                     <Row>
//                       <Col>
//                         <Form>

//                         </Form>
//                         <Form.Label
//                           controlId="floatingSelectGrid"
//                           label="State"
//                           className=''
//                           name="status"
//                         >State</Form.Label>
//                         <Form.Control
//                           required
//                           as="select"
//                           type="select"
//                           name="state"
//                           className={`${state.SelectData?.status != "Rejected" && "c-pointer"}`}
//                           aria-label="Floating label select example"
//                           value={form?.status ? form?.status : state.SelectData?.status}
//                           defaultValue={form?.status ? form?.status : state.SelectData?.status}
//                           maxLength={20}
//                           disabled={state.SelectData?.status == "Rejected"}
//                           isInvalid={!!errors.country}
//                           onChange={(e) => { setField('status', e.currentTarget.value) }}
//                         >
//                           {statusValues.map((item) => (
//                             <option key={item?.name}>{item.name}</option>
//                           ))}
//                         </Form.Control>

//                       </Col>
//                     </Row>
//                     <div className='d-flex justify-content-end mt-5'><span></span><div>
//                       <Button className='cancel-btn' onClick={handleClose}
//                       >Cancel</Button>

//                       {state.SelectData?.status != "Rejected" &&
//                         <Button className='button-secondary ms-3' onClick={() => idoStateChange()}
//                           disabled={state.btnLoader ||
//                             (form?.status == null && state.SelectData?.status == "Submitted") ||
//                             (form?.status == "Submitted" && state.SelectData?.status == "Submitted")
//                           }
//                         >
//                           <span>{state.btnLoader && <Spinner size="sm" className='text-light' />}</span>
//                           <span>Ok</span></Button>
//                       }
//                     </div></div>
//                   </Modal.Body>
//                 </Modal>
//               </div>
//             )}
          
//             {loadData && (<div className='addmore-title' >
//               <span className='d-block'> <span className='c-pointer' onClick={addProposalList}>
//                 <span>{seeMoreLoader && <Spinner size="sm" />} </span> See More</span></span>  <span className='icon blue-doublearrow c-pointer' onClick={addProposalList}></span>
//             </div>)}
//         </div>

//         <Modal
//           show={state.showProjectInformationView}
//           onHide={() => setShowProjectInformationView(false)}
//           className="project-detailview"
//           size="lg"
//           aria-labelledby="contained-modal-title-vcenter"
//           centered
//         >
//           <Modal.Header>
//             <Modal.Title id="contained-modal-title-vcenter">
//               Project Details
//             </Modal.Title>
//             <span className="icon close" onClick={() => handleCloseProjectInformationView()}></span>
//           </Modal.Header>
//           <Modal.Body>
//             <div className="row">
//               <Projects informationProjectView={state.informationProjectView} closeProject={closeProject} />
//             </div>
//           </Modal.Body>
//         </Modal>
//       </>}
//       {success && <div className="">
//         <ToasterMessage isShowToaster={success} success={success}></ToasterMessage>
//       </div>
//       }
//     </>

//   )
// }
const IDORequest=()=>{
 
  return(<>
    <h3 className='page-title mb-3'>IdoRequests</h3>
    <CBreadcrumb>
      <CBreadcrumbItem>
        Launchpad
      </CBreadcrumbItem>
      <CBreadcrumbItem>IDO Request</CBreadcrumbItem>
    </CBreadcrumb>

    <IdoRequestGrid/>
  </>)
}

IDORequest.propTypes = {
  informationProjectView: PropTypes.string,
}

export default IDORequest;