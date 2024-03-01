import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import apiCalls from 'src/api/apiCalls';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Alert from 'react-bootstrap/Alert';
import { Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import useContract from '../../hooks/useContract';
import { useSelector } from 'react-redux';
const SettingsDetails = () => {
    const [allocationDetails, setAllocationDetails] = useState({
        vestingTime: "",
    })
    const [listingDetails, setListingDetails] = useState({
        tokenListingTime: "",
    })
    const [fcfsDetails, setFcfsDetails] = useState({
        fcfsStartTime: "",
    })
    const [roundOneDetails, setRoundOneDetails] = useState({
        roundOneStartTime: "",
        roundOneEndTime: "",
    })
    const contractAddress = useSelector((reducerstate) => reducerstate.projectDetails?.details?.projectsViewModel?.contractAddress);
    const { projectId } = useParams();
    const [errorMgs, setErrorMgs] = useState(null);
    const [loader, setLoader] = useState(false);
    const [loader1, setLoader1] = useState(false);
    const [loader2, setLoader2] = useState(false);
    const [loader3, setLoader3] = useState(false);
    const [validated, setValidated] = useState(false);
    const [customerDetails, setCustomerDetails] = useState({})
    const { allocate, setFcfsStartTime, setTokenListingTime,
        setVestingTime, setRoundOneStartTime } = useContract();
    const handleChange = (event) => {
        let _data = { ...allocationDetails };
        _data[event.target.name] = event.target.value;
        setAllocationDetails(_data);
    }
    const handleVestingChange = (event) => {
        let _data = { ...listingDetails };
        _data[event.target.name] = event.target.value;
        setListingDetails(_data);
    }
    const handleFcfsDetailss = (event) => {
        let _data = { ...fcfsDetails };
        _data[event.target.name] = event.target.value;
        setFcfsDetails(_data);
    }
    const handleRoundDetails = (event) => {
        let _data = { ...roundOneDetails };
        _data[event.target.name] = event.target.value;
        setRoundOneDetails(_data);
    }

    const handleVestingDetails = async (event) => {
        event.preventDefault();
        setValidated(true);
        const form = event.currentTarget;
        setLoader(true)
        let obj = {
            "id": projectId,
            'vestingTime': allocationDetails.vestingTime
        }
        if (form.checkValidity() === true) {
            let response = await apiCalls.UpdateVestingTime(obj)
            if (response.ok) {
                await setVestingTime();
                setLoader(false)
                setErrorMgs(null)
                setLoader(false);
            } else {
                setLoader(false);
                setErrorMgs(isErrorDispaly(response.data))
                setErrorMgs(null)
                window.scroll(0, 0);
                setValidated(false);
            }
        } else {
            setLoader(false);
        }
    }
    const handleListingDetails = async (event) => {
        await setTokenListingTime();
        event.preventDefault();
        setValidated(true);
        const form = event.currentTarget;
        setLoader1(true)
        let obj = {
            "id": projectId,
            "tokenListingTime": listingDetails.tokenListingTime
        }
        if (form.checkValidity() === true) {
            let response = await apiCalls.UpdateTokenListingTime(obj)
            if (response.ok) {
                setLoader1(false)
                setErrorMgs(null)
                setLoader(false);
            } else {
                setLoader1(false);
                setErrorMgs(isErrorDispaly(response.data))
                setErrorMgs(null)
                window.scroll(0, 0);
                setValidated(false);
            }
        } else {
            setLoader1(false);
        }
    }
    const handleFcfsDetails = async (event) => {
        await setFcfsStartTime();
        event.preventDefault();
        setValidated(true);
        const form = event.currentTarget;
        setLoader2(true)
        let obj = {
            'id': projectId,
            'fcfsStartTime': fcfsDetails.fcfsStartTime,
        }
        if (form.checkValidity() === true) {
            let res = await apiCalls.UpdateFcfsStartTime(obj)
            if (res.ok) {
                setLoader2(false)
                setErrorMgs(null)
                setLoader2(false);
            } else {
                setLoader2(false);
                setErrorMgs(isErrorDispaly(res.data))
                setErrorMgs(null)
                window.scroll(0, 0);
                setValidated(false);
            }
        } else {
            setLoader2(false);
        }
    }
    const updateRoundOneDetails = async (event) => {
        await setRoundOneStartTime();
        event.preventDefault();
        setValidated(true);
        const form = event.currentTarget;
        setLoader3(true)
        let obj = {
            'id': projectId,
            'roundOneStartTime': roundOneDetails.roundOneStartTime,
            'roundOneEndTime': roundOneDetails.roundOneEndTime
        }
        if (form.checkValidity() === true) {
            let res = await apiCalls.UpdateRoundOneTimings(obj)
            if (res.ok) {
                setLoader3(false)
                setErrorMgs(null)
                setLoader3(false);
            } else {
                setLoader3(false);
                setErrorMgs(isErrorDispaly(res.data))
                setErrorMgs(null)
                window.scroll(0, 0);
                setValidated(false);
            }
        } else {
            setLoader3(false);
        }
    }

    const handleGetCustomerAddress = async () => {
        let response = await apiCalls.getCustomerAddress(projectId)
        if (response.ok) {
            setCustomerDetails(response.data);
            await allocate(response.data, contractAddress);
        }
    }
  
    const isErrorDispaly = (objValue) => {
        if (objValue.data && typeof objValue.data === "string") {
            return objValue.data;
        } else if (
            objValue.originalError &&
            typeof objValue.originalError.message === "string"
        ) {
            return objValue.originalError.message;
        } else {
            return "Something went wrong please try again!";
        }
    };
    return (
        <Form noValidate validated={validated}>
            {errorMgs && (
                <Alert variant="danger">
                    <div className='d-flex align-items-center'>
                        <span className='icon error-alert'></span>
                        <p className='m1-2' style={{ color: 'red' }}>{errorMgs}</p>
                    </div>
                </Alert>
            )}

            <Row>
                <Col lg={6} md={12}>
                    <label htmlFor='vestingTime' className='input-label mb-3 mt-2'>Set Vesting Time</label>
                    <FloatingLabel
                        controlId="floatingInput"
                        className="mb-3 input-style"
                    >
                        <input type="text" name='vestingTime' onChange={handleChange} placeholder="vesting Time" required />
                        <Form.Control.Feedback type="invalid">Is required</Form.Control.Feedback>
                    </FloatingLabel>
                    <Button className='primary-btn' onClick={handleVestingDetails}>
                        <span>{loader && <Spinner size="sm" />} </span>Set</Button>

                </Col>
                <Col lg={6} md={12}>
                    <label htmlFor='listingTime' className='input-label mb-3 mt-2'>Set Listing Time</label>
                    <FloatingLabel
                        controlId="floatingInput"
                        className="mb-3 input-style"
                    >
                        <input type="datetime-local" id="meeting-time" name="tokenListingTime" onChange={handleVestingChange} required></input>
                        <Form.Control.Feedback type="invalid">Is required</Form.Control.Feedback>
                    </FloatingLabel>
                    <Button className='primary-btn' onClick={handleListingDetails}>
                        <span>{loader1 && <Spinner size="sm" />} </span>Set</Button>
                </Col>
            </Row>
            <Row>
                <Col lg={6} md={12}>
                    <label htmlFor='round1Time' className='input-label mb-3 mt-2'>Set Round1 time</label>
                    <FloatingLabel
                        controlId="floatingInput"
                        className="mb-3 input-style"
                    >
                        <input type="time" name='roundOneStartTime' value={roundOneDetails.roundOneStartTime} onChange={handleRoundDetails}
                            required />
                        <Form.Control.Feedback type="invalid">Is required</Form.Control.Feedback>
                    </FloatingLabel>

                </Col>
                <Col lg={6} md={12}>
                    <label htmlFor='round2Time' className='input-label mb-3 mt-2'>Set Round2 time</label>
                    <FloatingLabel
                        controlId="floatingInput"
                        className="mb-3 input-style"
                    >
                        <input type="time" name='roundOneEndTime' value={roundOneDetails.roundOneEndTime} onChange={handleRoundDetails}
                            required />
                        <Form.Control.Feedback type="invalid">Is required</Form.Control.Feedback>
                    </FloatingLabel>
                    <Button className='primary-btn' onClick={updateRoundOneDetails}>
                        <span>{loader3 && <Spinner size="sm" />} </span>Set</Button>

                </Col>
                <Col lg={6} md={12}>
                    <label htmlFor='fsfsStartTime' className='input-label mb-3 mt-2'>Fcfs start time</label>
                    <FloatingLabel
                        controlId="floatingInput"
                        className="mb-3 input-style"
                    >
                        <input type="time" name='fcfsStartTime' value={fcfsDetails.fcfsStartTime} onChange={handleFcfsDetailss}
                            required />
                        <Form.Control.Feedback type="invalid">Is required</Form.Control.Feedback>
                    </FloatingLabel>
                    <Button className='primary-btn' onClick={handleFcfsDetails}>
                        <span>{loader2 && <Spinner size="sm" />} </span>Set</Button>{" "}

                </Col>
            </Row><br />

            <div className="bs-example">
                <Button type="button" className="btn btn-primary float-left ml-2" value={customerDetails} onClick={handleGetCustomerAddress}>Allocation</Button>{" "}
                <Button type="button" className="btn btn-primary float-left">Allocation Round2</Button>{" "}
                <Button type="button" className="btn btn-primary float-left" >Insert Token Claim </Button>
            </div>

        </Form>)
}
SettingsDetails.propTypes = {
}
export default SettingsDetails;