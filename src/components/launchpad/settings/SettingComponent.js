import React, { useEffect,useReducer, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import apiCalls from 'src/api/apiCalls';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/esm/Spinner';
import { ethers } from 'ethers';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import moment from 'moment';
import project from '../../../contract/project.json';
import store from 'src/store/index';
import { fcfsStartTime } from 'src/reducers/authReducer';
import ToasterMessage from "src/utils/toasterMessages";
import { NumericFormat } from 'react-number-format';
import { useAccount ,useNetwork} from 'wagmi'
import { useConnectWallet } from 'src/hooks/useConnectWallet';
import {initialState,settingsReducer } from './settingsReducer';
import { switchNetwork } from 'wagmi/actions';
import { useParams } from 'react-router-dom';
import { projectDetailsData } from '../launchpadReducer/launchpadReducer';

const SettingsComponent = (props) => {
  const { isConnected } = useAccount()
  const { connectWallet } = useConnectWallet();
  const [state, dispatch] = useReducer(settingsReducer, initialState);
  const currentDate = new Date().toISOString().slice(0, 16);
  const [data,setData] = useState({});
  const { chain } = useNetwork();
  let { pId } = useParams();


  useEffect(() => {
    dispatch({ type: "setPageLoader", payload: true });
    props.projectDetailsReducerData(pId, (callback) => {
      setData(callback.data)
      dispatch({ type: "setPageLoader", payload: false })
    })
  }, [])
  
  async function handleNetwork() {
    try {
      if (chain?.id !== Number(process.env.REACT_APP_POLYGON_CHAIN_NUMARIC_ID)) {
        await switchNetwork({
          chainId: Number(process.env.REACT_APP_POLYGON_CHAIN_NUMARIC_ID) || 0,
        });
      } else {
        return true;
      }
    } catch (error) {
      dispatch({ type: "setBtnLoader", payload: false });
      dispatch({ type: "setErrorMgs", payload: "User rejected transaction." });
      throw new Error('User rejected transaction.');
    }
  }
  const getWalletAddress = async () => {
    dispatch({ type: "setErrorMgs", payload: null });
    dispatch({ type: "setBtnLoader", payload: true });
    try {
      if (isConnected) {
        await handleNetwork();
      } else {
        await connectWallet();
      }
      updateData();
    } catch (error) {
      dispatch({ type: "setErrorMgs", payload: "User rejected transaction." });
      dispatch({ type: "setBtnLoader", payload: false });
    }
  }

  const handleChange = (event) => {
    dispatch({ type: "setValidated", payload: false });
    dispatch({ type: "setErrorMgs", payload: null });
    let _data = event.target.value;
    dispatch({ type: "setSettingValue", payload: _data });
  }

  const convertdateToMinutes = (date) => {
    return Math.floor(moment(date).valueOf() / 1000);
  }

const convertUtcToLocal = (date) => {
  if (!date) {
    return '';
  }
  const utcTime = date;
  const utcMoment = moment.utc(utcTime);
  const localMoment = utcMoment.local();
  return localMoment.format('YYYY-MM-DDTHH:mm');
}

  const updateData = async () => {
    dispatch({ type: "setSuccess", payload: null });
    dispatch({ type: "setErrorMgs", payload: null });
    dispatch({ type: "setIsTransactionSuccess", payload: false });
    dispatch({ type: "setBtnLoader", payload: true });

    const form = document.forms["settingsForm"];
    const currentDatetime = Math.floor(new Date().getTime() / 1000);
    if (state?.settingValue && !props.funcName == "setVestingTime") {
      store.dispatch(fcfsStartTime(state?.settingValue));
      const projectDetailsStartDate = convertUtcToLocal(data?.claimsAndAllocations?.publicStartDate);
      const inputDatetime = convertdateToMinutes(moment.utc(state?.settingValue).format("YYYY-MM-DDTHH:mm"));
      const projectsStartDateTime = convertdateToMinutes(moment.utc(projectDetailsStartDate).format("YYYY-MM-DDTHH:mm"));
      if (inputDatetime < currentDatetime && props?.funcName?.includes('setfcfsstarttime')) {
        dispatch({ type: "setErrorMgs", payload: apiCalls.isErrorDispaly({ data: "Please choose a date and time that is not before now." }) });
        dispatch({ type: "setBtnLoader", payload: false });
        return;
      }
      else if (inputDatetime <= projectsStartDateTime && (props?.funcName?.includes('setfcfsendtime') ||
        (props?.funcName?.includes('setTokenListingTime')) ||
        (props?.funcName?.includes('setVestingTime')) ||
        (props?.funcName?.includes('setroundOneStartTime')))) {
        dispatch({ type: "setErrorMgs", payload: apiCalls.isErrorDispaly({ data: "Please choose a date and time that is not before fcfcs start time." }) });
        dispatch({ type: "setBtnLoader", payload: false });
        return;
      } 
      else if (inputDatetime >= projectsStartDateTime && (props?.funcName?.includes('setroundOneEndTime'))) {
        dispatch({ type: "setErrorMgs", payload: apiCalls.isErrorDispaly({ data: "Please choose a date and time that is less than fcfcs start time." }) });
        dispatch({ type: "setBtnLoader", payload: false });
        return
      }
    }
    if (form.checkValidity() === true) {
      try {
        dispatch({ type: "setBtnLoader", payload: true });
        if (props.funcName == "setVestingTime") {
          const numericSettingValue = parseFloat(state?.settingValue.replace(/,/g, ''));
          if (numericSettingValue > 0) {
            let timeData = numericSettingValue * 60 * 60 * 24;
            const provider = new ethers.providers.Web3Provider(window?.ethereum)
            const factory = new ethers.Contract(data?.projectsViewModel?.contractAddress, project.abi, provider.getSigner());
            const res = await factory[props.funcName](timeData);
            res.wait().then(async (receipt) => {
              dispatch({ type: "setSettingValue", payload: null });
              dispatch({ type: "setSuccess", payload: "Vesting Details Updated Successfully" });
              dispatch({ type: "setIsTransactionSuccess", payload: true });
              setTimeout(function () {
                dispatch({ type: "setIsTransactionSuccess", payload: false });
              }, 3000);
              dispatch({ type: "setBtnLoader", payload: false });
            }).catch((err) => {
              dispatch({ type: "setSettingValue", payload: null });
              dispatch({ type: "setErrorMgs", payload: apiCalls.isErrorDispaly(res) });
              dispatch({ type: "setBtnLoader", payload: false });
            })
          }else{
            dispatch({ type: "setErrorMgs", payload: "VestingTime cannot be zero" });
            dispatch({ type: "setValidated", payload: true });
            dispatch({ type: "setBtnLoader", payload: false });
          }
          
        }else{
          let timeData = convertdateToMinutes(moment.utc(state?.settingValue).format("YYYY-MM-DDTHH:mm:ss"));
          const provider = new ethers.providers.Web3Provider(window?.ethereum)
          const factory = new ethers.Contract(data?.projectsViewModel?.contractAddress, project.abi, provider.getSigner());
          const res = await factory[props.funcName](timeData);
          res.wait().then(async () => {
            dispatch({ type: "setSettingValue", payload: null });
            dispatch({ type: "setSuccess", payload: "Date Saved Successfully" });
            dispatch({ type: "setIsTransactionSuccess", payload: true });
            setTimeout(function () {
              dispatch({ type: "setIsTransactionSuccess", payload: false });
            }, 3000);
            dispatch({ type: "setBtnLoader", payload: false });
          }).catch(() => {
            dispatch({ type: "setErrorMgs", payload: apiCalls.isErrorDispaly(res) });
            dispatch({ type: "setBtnLoader", payload: false });
            dispatch({ type: "setSettingValue", payload: null });
          })
        }
      } catch (error) {
        dispatch({ type: "setErrorMgs", payload: apiCalls.isErrorDispaly(error) });
        dispatch({ type: "setBtnLoader", payload: false });
      }
    } else {
      dispatch({ type: "setValidated", payload: true });
      dispatch({ type: "setBtnLoader", payload: false });
    }
  }
  const clearErrorMsg=()=>{
    dispatch({ type: "setErrorMgs", payload: null }); 
  }

  return (
    
    <>
    {state.pageLoader ? <div className="text-center"><Spinner ></Spinner></div> : <>
    <div className='token-listing'>
      {state.errorMgs && (
        <Alert variant="danger">
        <div className='d-flex gap-4'>
         <div className='d-flex gap-2 flex-1'>
         <span className='icon error-alert'></span>
         <p className='m1-2' style={{ color: 'red' }}>{state.errorMgs}</p>
         </div>
         <span className='icon close-red' onClick={clearErrorMsg}></span>
        </div>
      </Alert>

      )}

      <Form noValidate validated={state.validated} action="" name="settingsForm" >
        <Row className='mt-5'>
        {props.funcName !="setVestingTime"&&  <Col lg={6} md={12}>
          <div className='w-fit p-relative'>
            <Form.Label
              controlId="floatingInput"
              label={props?.label}
              className=""
            >{props?.label}<span className='text-danger'>*</span></Form.Label>
              <Form.Control min={currentDate}
               value={state?.settingValue !== null ? state?.settingValue : ""} 
               name='settingValue' 
               type="datetime-local"
               placeholder={props?.placeholder}
               onChange={(e) => handleChange(e)}
               max={`${new Date().getFullYear() + 9999}-12-31T23:59`}
               required 
                 />
              <Form.Control.Feedback type="invalid" className='error-absolute'>Is required</Form.Control.Feedback>
              </div>
          </Col>}
              {props.funcName=="setVestingTime"&&  
               <Col lg={6} md={12}> <div className='w-fit p-relative'>
                <Form.Label 
                controlId="floatingInput"
                label={props?.label}
                className=""
                >{props?.label}<span className='text-danger'>*</span></Form.Label>

              <NumericFormat
                value={state?.settingValue !== null ? state?.settingValue : ""}
                name='settingValue'
                allowNegative={false}
                className='form-control'
                thousandSeparator={true}
                placeholder={props?.placeholder}
                onChange={(e) => handleChange(e)}
                required
              />

              <Form.Control.Feedback type="invalid" className='error-absolute'>Is required</Form.Control.Feedback>
              </div> </Col>}
        
          <Col lg={6} md={12} className='d-flex align-items-end btnalign-mobile'>
            <Button type="button" onClick={() => getWalletAddress()} className="filled-btn"
             disabled={state?.btnLoader}>{state?.btnLoader && <Spinner size='sm' />} Update</Button>{" "}
          </Col>
         
        </Row>
      </Form>
    </div>
      {!state?.isTransactionSuccess && (
        <div >
        <ToasterMessage isShowToaster={state?.isTransactionSuccess} success={state?.success}></ToasterMessage>
        </div>
      )}
      </>}
      </>
      )
}
SettingsComponent.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  funcName: PropTypes.string,
  projectDetailsReducerData: PropTypes.any,
}

const connectStateToProps = ({ auth,settings,launchpad }) => {
  return { auth: auth,launchpad:launchpad,settings: settings };
};
const connectDispatchToProps = (dispatch) => {
  return {
    projectDetailsReducerData: (id, callback) => {
      dispatch(projectDetailsData(id, callback))
    },
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(SettingsComponent);
