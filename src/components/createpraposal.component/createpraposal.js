import React, { useState, useEffect,useReducer } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import user from '../../assets/images/praposal-user.png';
import Alert from 'react-bootstrap/Alert';
import { useParams,useNavigate,Link } from 'react-router-dom';
import {validateContentRule} from '../../utils/custom.validator'
import {daoCards, proposalData} from '../proposalReducer/proposalReducer'
import store from 'src/store';
import StartedSteps from './proposalSteps';
import { Modal } from 'react-bootstrap';
import { ethers } from 'ethers/lib';
import MintContract from '../../contract/mint.json';
import UseEthers from '../../utils/useEthers';
import { connect } from 'react-redux';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { isMobile } from 'react-device-detect';

const reducers =(state ,action )=>{
  switch (action.type){
    case 'startingDate' :
   return {...state,startingDate:action.payload};
   case 'endingDate' :
    return {...state,endingDate:action.payload};
    case 'startingTime' :
    return {...state,startingTime:action.payload};
    case 'endingTime' :
      return {...state,endingTime:action.payload};
    case 'optionsModalShow' :
     return {...state,optionsModalShow:action.payload};
    case 'epochStartData' :
     return {...state,epochStartData:action.payload};
    case 'epochEndData' :
     return {...state,epochEndData:action.payload};
     case 'modalError' :
      return {...state,modalError:action.payload};
      case 'isChecked' :
        return {...state,isChecked:action.payload};
  }
  }

 function CreatePraposal() {
  const router = useNavigate();
  const params = useParams()
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const currentDate = new Date().toISOString().slice(0, 16);
  const [errorMsg, setErrorMsg] = useState(false);
  const [options, setOptions] = useState([{options: null,Id:"00000000-0000-0000-0000-000000000000",optionhash:null}]);
  const [attributes, setAttributes] = useState([]);
  const { getAddress } = UseEthers();
  const [walletAddres, setWalletAddres]=useState()
  const [state,dispatch]=useReducer(reducers,{startingDate:null,endingDate:null,optionsModalShow:false,startingTime:null,endingTime:null,
    epochStartTime:null,epochEndData:null,modalError:false,isChecked:false})
  const [copied,setCopied]=useState(false);
  const checkBoxChecked = (e) => {
    if(attributes?.length ==0 && !state.checked){
    dispatch({type:'isChecked',payload:e.target.checked})
    setErrorMsg(null)
    }
  
  }
  useEffect(() => {
    getWalletAddress()
  }, [])

  const getWalletAddress = async () => {
    let address = await getAddress();
    if (address) {
      window.scroll(0,0);
      setWalletAddres(address)
      getBalanceCount()
    }
  }
  async function getBalanceCount() {
    try {
        const _connector = window?.ethereum;
        const _provider = new ethers.providers.Web3Provider(_connector);
        const _contract = new ethers.Contract(process.env.REACT_APP_MINTING_CONTRACTOR, MintContract.abi, _provider);
        const _count = await _contract.balanceOf(address);
        const _hex = _count?._hex;
        const hexToDecimal = parseInt(_hex, 16);
        return hexToDecimal

    } catch (error) {
  
    }
}
  const addOption = () => {
    if (options.length >= 4) {
      dispatch({ type: 'modalError', payload: "Maximum four options are allowed." });
      return;
    }
    const newFields = [...options, { value: null,Id:"00000000-0000-0000-0000-000000000000",optionhash:null }];
    let optionsArray = newFields.map((item,index)=>{
     return {
      options: item.options,
        Id:"00000000-0000-0000-0000-000000000000",
        optionhash:null,
        index: String.fromCharCode(65 + index)
      }
    })
    setOptions(optionsArray); 
  };

 
  const deleteOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    if(updatedOptions?.length <2){      
      dispatch({type:'modalError',payload:"Please provide at least two option to continue."})
    }else if(updatedOptions?.length >4){      
      dispatch({type:'modalError',payload:"Maximum four options are allowed."})
    }else{
      setOptions(updatedOptions);
    }    
}; 
const optionSave = ()=>{
  if (options.length < 2) {
    return dispatch({ type: 'modalError', payload: "Please provide at least two options to continue." });
  }
  if (options.length > 4) {
    return dispatch({ type: 'modalError', payload: "Maximum four options are allowed." })
  }
  let isUpdate = false;
  let _properties = [...options];
  let _attribute = []; 
    for (let i in _properties) {
     let _obj = _properties[i];
     if(!_obj.options?.trim()){
      return dispatch({type:'modalError',payload:"Please fill the data."})
      }else if(validateContentRule("", _obj.options)){
        return dispatch({type:'modalError',payload:"Please provide valid content."})
      }else{
        const isDuplicate = _attribute.some(item => item?.options?.trim()?.toLowerCase() === _obj?.options?.trim()?.toLowerCase());
        if (isDuplicate) {
          return dispatch({ type: 'modalError', payload: "Options should be unique." });
        }else{
           dispatch({type:'modalError',payload:null})
        isUpdate = true;
        if(_obj.optionhash==null){
          _obj.optionhash=ethers.utils.keccak256(ethers.utils.toUtf8Bytes(_obj.options))
         }
          _attribute.push(_obj);
        }
      }
    }
    setAttributes(_attribute);
      if(isUpdate){
         dispatch({type:'optionsModalShow',payload:false})
      }
             
 
}

  const convertTo24HourFormat = (time) => {
    const [timeStr, amPm] = time.split(' ');
    const [hours, minutes] = timeStr.split(':');
    let hours24 = parseInt(hours, 10);

    if (amPm?.toLowerCase() === 'pm' && hours24 !== 12) {
      hours24 += 12;
    } else if (amPm?.toLowerCase() === 'am' && hours24 === 12) {
      hours24 = 0;
    }

    return hours24 * 60 + parseInt(minutes, 10);
  };

  const handleRedirectToPublishProposalScreen = (event) => {   
    setErrorMsg(null)
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors)?.length > 0) {
      setErrors(formErrors);
    } else if(state?.startingDate && state?.endingDate < state?.startingDate){
      setErrorMsg("Start date cannot be greater than the end date.")
      window.scroll(0,0);
    }else if((state?.startingDate == state?.endingDate) && state?.endingTime == state?.startingTime){
      setErrorMsg("Start time and end time cannot be the same.")
      window.scroll(0,0);
    }else if(!state?.isChecked || attributes?.length == 0 ){
      setErrorMsg("Please select proposal type")
      window.scroll(0,0);
    }else {
      const startTime = convertTo24HourFormat(state?.startingTime);
      const endTime = convertTo24HourFormat(state?.endingTime);
      if((state?.startingDate == state?.endingDate) && (startTime > endTime)) {
        setErrorMsg("Start time cannot be greater than the end time.")
        window.scroll(0,0);
     }else{
      let proposalType =state?.isChecked ? "voting" : "decision";
      let formData=form;
      formData.ProposalOptionDetails=attributes
      formData.startDate=state?.epochStartData
      formData.endDate=state?.epochEndData
      formData.proposalType=proposalType
      formData.membershipsCount=2
      formData.TitleHash=ethers.utils.keccak256(ethers.utils.toUtf8Bytes(form.proposal)) 
      store.dispatch(proposalData(formData));
      router(`/dao/publishproposal/${params.id}`)
    }
  }
  }
  function resetProperties() {
    if(attributes?.length !== 0){
      let _attributes = attributes.map((item) => { return { ...item } });
      for (let i in _attributes) {
        let _obj = {};
        for (let key in _attributes[i]) {
          _obj[key] = _attributes[i][key];
        }
      }
      setOptions(_attributes);
    } else{
      setOptions([{ value: null,Id:"00000000-0000-0000-0000-000000000000",optionhash:null }])
    }  
}

  const validateForm = (obj, isChange) => {
    const { proposal, summary, startdate, enddate } = isChange ? obj : form
    const specialCharsOnly = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    const newErrors = {};
    if (!proposal || proposal === '') {
      newErrors.proposal = "Is required";
    } else if (validateContentRule("", proposal) || proposal?.match(specialCharsOnly)) {
      newErrors.proposal = 'Accepts alphanumeric and special chars.';
    }
    if (!summary || summary === '') {
      newErrors.summary = "Is required";
    } else if (validateContentRule("", summary) || summary?.match(specialCharsOnly)) {
      newErrors.summary = 'Accepts alphanumeric and special chars.';
    }
    if (!startdate || startdate === '') {
      newErrors.startdate = "Is required";
    }
    if (!enddate || enddate === '') {
      newErrors.enddate = "Is required";
    }
    return newErrors;
  }

  const setField = (field, value) => {
    setForm({...form,[field]:value});
    if (errors[field]) {
      setErrors({ ...errors,[field]: null
      })
    }
  }

  const setOptionFeild =(value,index)=>{
    const newFields = [...options];
    newFields[index].options = value
   setOptions(newFields)
  }
  
  const openModalPopUp = () => { 
    dispatch({type:'optionsModalShow',payload:true})
    dispatch({type:'modalError',payload:null})
  };
  const handleClose = () => {
    resetProperties();
    dispatch({type:'optionsModalShow',payload:false})   
  };
 


  const startDate = (e) => {   
    const selectedDate = e.currentTarget.value
    const datetimeString = selectedDate.slice(0,10);
    const datetime = new Date(selectedDate);
    const dateTimeUtc=new Date(selectedDate).toUTCString();
    const epochStartTime = Math.floor(new Date(dateTimeUtc).getTime() / 1000);
    const selectedTime = datetime.toLocaleTimeString();
    dispatch({type:'epochStartData',payload:epochStartTime})
    setField('startdate', selectedDate);
    dispatch({type:'startingDate',payload:datetimeString}) 
    dispatch({type:'startingTime',payload:selectedTime}) 

  }
 
  
  const endDate = (e) => {
    const selectedDate = e.currentTarget.value;
    const datetimeString = selectedDate.slice(0,10);
    const datetime = new Date(selectedDate);
    const dateTimeUtc=new Date(selectedDate).toUTCString();
    const epochEndTime = Math.floor(new Date(dateTimeUtc).getTime() / 1000);
    const selectedTime = datetime.toLocaleTimeString();
    dispatch({type:'epochEndData',payload:epochEndTime})
    setField('enddate', selectedDate);
    dispatch({type:'endingDate',payload:datetimeString})
    dispatch({type:'endingTime',payload:selectedTime})
  }

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }

  let inputStartClassName = "form-control form-select bg-none";

if (isMobile && !state?.startingDate) {
  inputStartClassName += " mobile";
} else if (isMobile && state?.startingDate) {
  inputStartClassName += " mobile-icon";
}

let inputEndClassName = "form-control form-select bg-none";

if (isMobile) {
  if (!state?.endingDate) {
    inputEndClassName += " mobile";
  } else if (state?.endingDate) {
    inputEndClassName += " mobile-icon";
  }
}

    return (
       
        <Container className='dao-mt'>
         <Link className=' title-width-fit' to={`/dao/proposal/${params.id}`}><div className='d-flex align-items-center'> <span className='icon-dao back mr-2 c-pointer'></span><span className='mb-0 ms-2 back-text'>Create Proposal</span></div></Link>
          
          <Row className='mt-5 gap-4 gap-md-0'>
            <Col md={4}>
            <StartedSteps formSteps={33} stepsOne={1} number={1}/>
            </Col>
            <Col md={8}>
            {errorMsg && (
                <Alert variant="danger" className='mt-3'>
                  <div className='d-flex align-items-center'>
                    <span className='icon error-alert'></span>
                    <p className='m1-2' style={{ color: 'red' }}>{errorMsg}</p>
                  </div>
                </Alert>
        )}
              <div className='praposal-left-card ms-md-4'>
                <Form noValidate onSubmit={(e) => handleRedirectToPublishProposalScreen(e)}>
                  <Form.Label className='starlabel mb-0'>Author</Form.Label>
                  <div className='login-user'><img src={user} alt=''></img><span className='text-word-br'>{walletAddres}</span>
                  <CopyToClipboard text={walletAddres} options={{ format: 'text/plain' }}
                        onCopy={() => handleCopy()}
                      >
                        <span className={copied ? "icon copied-check ms-2" : "icon copy c-pointer"} />
                      </CopyToClipboard></div>
                  <Form.Group className="mb-3 mt-3" >
                    <Form.Label className='starlabel mb-0'>Proposal Title</Form.Label>
                    <Form.Control
                     className='input-height'
                     value={form.proposal}
                    type="text"
                    placeholder="Proposal Title"
                    name="proposal"
                    maxLength={250}
                    isInvalid={!!errors.proposal}
                    onChange={(e) => { setField('proposal', e.currentTarget.value) }}
                    onBlur={(e) => setField('proposal',e.target.value.trim().replace(/\s+/g, " "))}
                     />

                  <Form.Control.Feedback type="invalid">{errors.proposal}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label className='starlabel mb-0'>Summary</Form.Label>
                    <Form.Control as="textarea"
                    value={form.summary}
                    rows={5}
                    placeholder="Summary"
                    name='summary'
                    isInvalid={!!errors.summary}
                    onChange={(e) => { setField('summary', e.currentTarget.value) }}
                    onBlur={(e) => setField('summary',e.target.value.trim().replace(/\s+/g, " "))} />
                   <Form.Control.Feedback type="invalid">{errors.summary}</Form.Control.Feedback>
                  </Form.Group>
                  <div>
                <Form.Label className='starlabel mb-0'>Select Your Proposal Type</Form.Label> 
                </div>    

                <div className='col-md-6 mb-3 '>
                 <div className= 'proposal-type justify-content-between mb-0'>
              <div>  <input 
                type='checkbox' 
                checked={attributes?.length !== 0 ?  state?.isChecked : ""}
                onChange={checkBoxChecked}
                onClick={openModalPopUp} /><span className='icon-check c-pointer'> </span><span className='mb-0'>Voting</span>
               
                 </div>
                </div>
                {/* <p type="invalid" className='invalid-feedback'>{errors?.proposalType}</p> */}
                </div> 

                <div className='col-md-12'>
                <div className='option-style'>
                {attributes?.map((item)=>(
                 <><div className='option-display create-proposal-mr'>
                <span className='mb-0'>{item?.index || "A"}. {item?.options}</span>
                </div> </>
                ))}
                </div>
                </div>
                 
                  <div className='d-md-flex  mt-3'>
                    <Form.Group className="mb-3 d-flex-1 position-relative me-md-3" controlId="formBasicPassword">
                      <Form.Label className='starlabel mb-0'>Start Date & Time (Local time zone)</Form.Label>
                      <Form.Control type="datetime-local" 
                      className={inputStartClassName}
                      placeholder='Start Date'
                      name='startdate'
                      min={currentDate}
                      isInvalid={!!errors.startdate}
                      onChange={(e) => startDate(e)}
                    />
                    <Form.Control.Feedback type="invalid">{errors.startdate}</Form.Control.Feedback></Form.Group>
                    <Form.Group className="mb-3 d-flex-1 position-relative" controlId="formBasicPassword">
                      <Form.Label className='starlabel mb-0'>End Date & Time (Local time zone)</Form.Label>
                      <Form.Control type="datetime-local" 
                      className={inputEndClassName} placeholder='End Date'
                      name="enddate"
                      min={currentDate}
                      isInvalid={!!errors.enddate}
                      onChange={(e) => endDate(e)}
                    />
                    <Form.Control.Feedback type="invalid">{errors.enddate}</Form.Control.Feedback></Form.Group>
                  </div>
                  <div className='d-flex justify-content-end align-items-center mt-2 btn-width'>
                    <Link to={`/dao/proposal/${params.id}`} className='cancel-btn me-3 mb-4'>Cancel</Link>
                    <Button variant="primary" type="submit" className=' mb-4 button-secondary ' >
                      Next
                    </Button>
                  </div>
                </Form>
              </div> </Col>
          </Row>
          <Modal
          show={state?.optionsModalShow}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="settings-modal profile-modal add-option
          " >
            <Modal.Header>     
            <Modal.Title>Add Your Options</Modal.Title> 
            <span className="icon close c-pointer" onClick={handleClose}></span>
          </Modal.Header>
          <Modal.Body> 
          {state?.modalError && (
                <Alert variant="danger" className='mt-3'>
                  <div className='d-flex align-items-center'>
                    <span className='icon error-alert'></span>
                    <p className='m1-2' style={{ color: 'red' }}>{state?.modalError}</p>
                  </div>
                </Alert>
        )}        
            <div >
            <Col sm={12} xs={12} md={12} lg={12} xl={12} xxl={12} className='text-end mb-4'>
                <Button type="button" className="text-center filled-btn" onClick={addOption}>
               <span className='icon option-add'></span>Add new option
             </Button>
             </Col>
            <Row>
            
            {options.map((option, index) => (
              <Col sm={12} xs={12} md={6} lg={6} xl={6} xxl={6} key={option?.Id}>
              <div className='d-flex align-items-center add-block' key={option?.Id}>
                 <label className="mb-0 ms-3">{index+1}</label>
                 <Form.Control
                 type="text"
                 className='border-none-modal'
                 placeholder='Enter your option'
                 maxLength={50}
                 onChange={(e) => { setOptionFeild(e.currentTarget.value,index) }}
                 value={option.options ? option.options :""} 
                 />                 
                <span className='icon delete-icon' onClick={() => deleteOption(index)}></span>
              </div>
              
            </Col>
            ))}
             </Row>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="mt-4 text-end btn-width">
              <Button   className="cancel-btn text-center" onClick={handleClose}>
                Cancel
              </Button>
              <Button  className="button-secondary ms-lg-3 ms-2 " onClick={optionSave}>
                Save
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
        </Container>
        
    );
}
const connectDispatchToProps = (dispatch) => {
  return {
        trackWallet: (callback) => {
          dispatch(daoCards(callback));
      },
      dispatch,
    }
  }
export default connect(null, connectDispatchToProps)(CreatePraposal);