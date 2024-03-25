import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import apiCalls from 'src/api/apiCalls';
import Alert from 'react-bootstrap/Alert';
import { Spinner } from 'react-bootstrap';
import { ethers } from 'ethers';
import { useSelector ,connect} from 'react-redux';
import PropTypes from 'prop-types'
import moment from 'moment';
import project from '../../../contract/project.json';
import store from 'src/store/index';
import { fcfsStartTime, setSettingsLoaders } from 'src/reducers/authReducer';
import useEthers from 'src/utils/useEthers';
import ToasterMessage from "src/utils/toasterMessages";
import { NumericFormat } from 'react-number-format';
const SettingsComponent = (props) => {
  const { getAddress } = useEthers();
  const [errorMgs, setErrorMgs] = useState(null);
  const projectContractDetails = useSelector((reducerstore) => reducerstore.launchpad.projectDetails?.data?.projectsViewModel)
  const [settingValue, setSettingValue] = useState(null);
  const [btnLoader, setBtnLoader] = useState(false)
  const [validated, setValidated] = useState(false);
  const [isTransactionSuccess, setTransactionSuccess] = useState(false);
  const settingsFcfsStartTime = useSelector(reducerstate => reducerstate.settings?.isFcfsStartDate);
  const [success, setSuccess] = useState(null);
  const currentDate = new Date().toISOString().slice(0, 16);
  const [loader,setLoader] = useState(false);
  const [dataUpdated,setDataUpdated]=useState(false)
  const settingLoader = useSelector(state => state.oidc?.isSettingsLoading)
  useEffect(() => {
    getWalletAddress();
  }, [])
  useEffect(() => {
    getWalletAddress();
  }, [dataUpdated])

  const getWalletAddress = async () => {
    setLoader(true)
    let walletAddress = await getAddress();
    if (walletAddress) {
      setLoader(false)
    }
  }

  const handleChange = (event) => {
    setValidated(false);
    setErrorMgs(null);
    let _data = event.target.value;
    setSettingValue(_data)
  }

  const convertdateToMinutes = (date) => {
    return Math.floor(new Date(date).getTime() / 1000)
  }



  const updateData = async () => {
    
    setSuccess(null);
    setErrorMgs(null);
    setTransactionSuccess(false);
    setBtnLoader(true)
    const form = document.forms["settingsForm"];
    const currentDatetime = Math.floor(new Date().getTime() / 1000);
    if(settingValue){
      store.dispatch(fcfsStartTime(settingValue));
      const fcfsStartDateTime = convertdateToMinutes(moment(settingsFcfsStartTime).format("YYYY-MM-DDTHH:mm"));
      const inputDatetime = convertdateToMinutes(moment(settingValue).format("YYYY-MM-DDTHH:mm"));
      if(inputDatetime < currentDatetime && props?.funcName?.toLowerCase().includes('setfcfsstarttime')){
        setErrorMgs(apiCalls.isErrorDispaly({data:"Please choose a date and time that is not before now."}));
        setBtnLoader(false)
        return;
      }
      else if(inputDatetime < fcfsStartDateTime && (props?.funcName?.toLowerCase().includes('setfcfsendtime') ||
      (props?.funcName?.toLowerCase().includes('setVestingTime'))||
      (props?.funcName?.toLowerCase().includes('setTokenListingTime'))||
      (props?.funcName?.toLowerCase().includes('setVestingTime'))||
      (props?.funcName?.toLowerCase().includes('setroundOneStartTime'))||
      (props?.funcName?.toLowerCase().includes('setroundOneEndTime')))){
        setErrorMgs(apiCalls.isErrorDispaly({data:"Please choose a date and time that is not before fcfcs start time."}));
        setBtnLoader(false)
        return;
      }
    }
    if (form.checkValidity() === true  ) {
      try {
        setBtnLoader(true)
        if(props.funcName=="setVestingTime"){
          if( settingValue>0){
            let timeData = settingValue * 60 * 60 * 24;
            const provider = new ethers.providers.Web3Provider(window?.ethereum)
            const factory = new ethers.Contract(projectContractDetails.contractAddress, project.abi, provider.getSigner());
            const res = await factory[props.funcName](timeData);
            res.wait().then(async (receipt) => {
             
              setSuccess("Vesting Details updated successfully");
              setTransactionSuccess(true)
              setTimeout(function () {
                setTransactionSuccess(false)
              }, 3000);
              setBtnLoader(false)
            }).catch((err) => {
              setErrorMgs(apiCalls.isErrorDispaly(res));
              setBtnLoader(false)
              
            })
          }else{
            setErrorMgs("VestingTime cannot be zero");
            setValidated(true);
            setBtnLoader(false);
          }
          
        }else{
          let timeData = convertdateToMinutes(moment(settingValue).format("YYYY-MM-DDTHH:mm:ss"));
          const provider = new ethers.providers.Web3Provider(window?.ethereum)
          const factory = new ethers.Contract(projectContractDetails.contractAddress, project.abi, provider.getSigner());
          const res = await factory[props.funcName](timeData/1000);
          res.wait().then(async () => {
            setSettingValue(null)
            setDataUpdated(true)
            setSuccess("Date saved successfully");
            setTransactionSuccess(true)
            setTimeout(function () {
              setTransactionSuccess(false)
            }, 3000);
           
            setBtnLoader(false)
          }).catch(() => {
            setErrorMgs(apiCalls.isErrorDispaly(res));
            setBtnLoader(false)
            setSettingValue(null)
          })
        }
        

      } catch (error) {
        setErrorMgs(apiCalls.isErrorDispaly(error));
        setBtnLoader(false);
      }
    } else {
      setValidated(true);
      setBtnLoader(false);
    }
    
  }

  return (
    
    <>
    {settingLoader? <div className="text-center"><Spinner ></Spinner></div> : <>
    <div className='token-listing'>
      {errorMgs && (
        <Alert variant="danger">
          <div className='d-flex align-items-center'>
            <span className='icon error-alert'></span>
            <p className='m1-2' style={{ color: 'red' }}>{errorMgs}</p>
          </div>
        </Alert>
      )}
      {loader ? <div className="text-center"><Spinner ></Spinner></div> :
      <Form noValidate validated={validated} action="" name="settingsForm" >
        <Row className='mt-5'>
        {props.funcName !="setVestingTime"&&  <Col lg={6} md={12}>
          <div className='w-fit p-relative'>
            <Form.Label
              controlId="floatingInput"
              label={props?.label}
              className=""
            >{props?.label}<span className='text-danger'>*</span></Form.Label>
              <Form.Control min={currentDate}
               value={settingValue} 
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
                >{props?.label}</Form.Label>

              <NumericFormat
                value={settingValue}
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
            <Button type="button" onClick={() => updateData()} className="filled-btn"
             disabled={btnLoader}>{btnLoader && <Spinner size='sm' />} Update</Button>{" "}
          </Col>
         
        </Row>
      </Form>}
    

    </div>
      {isTransactionSuccess && (
        <div >
        <ToasterMessage isShowToaster={isTransactionSuccess} success={success}></ToasterMessage>
        </div>
      )}
      </>}
      </>
      )
}
SettingsComponent.propTypes = {
  title: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  funcName: PropTypes.string
}

const connectStateToProps = ({ auth }) => {
  return { auth: auth };
};
export default connect(connectStateToProps, (dispatch) => {
  return { dispatch };
})(SettingsComponent);
