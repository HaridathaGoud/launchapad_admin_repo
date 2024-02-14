
import React, { useEffect, useState, useRef } from "react"
import apiCalls from "src/api/apiCalls";
import Alert from 'react-bootstrap/Alert';
import Spinner from "react-bootstrap/esm/Spinner";
import { useParams } from "react-router-dom";

export default function UserProfileInfo() {

    const [adminAllCustomerDetails, setAdminAllCustomerDetails] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null);
    const [loader, setLoader] = useState(false);
    const params = useParams();
    const shouldLog = useRef(true);

    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false;
            AdminCustomerDetails();
        }
    }, []);//eslint-disable-line react-hooks/exhaustive-deps

    const AdminCustomerDetails = async () => {
        setLoader(true)
        let response = await apiCalls.customerDetails(params?.id)
        if (response.ok) {
            setAdminAllCustomerDetails(response.data)
            setLoader(false)
        } else {
            setErrorMsg(apiCalls.isErrorDispaly(response))
            setLoader(false)
        }
    }

    return <>
        {errorMsg && (
            <Alert variant="danger">
                <div className='d-flex align-items-center'>
                    <span className='icon error-alert'></span>
                    <p className='m1-2' style={{ color: 'red' }}>{errorMsg}</p>
                </div>
            </Alert>
        )}
        <h3 className="text-center">Welcome to userprofile</h3>
        {loader && <Spinner fallback={loader}></Spinner>}
        <div className=''>
            <h4>WalletAddress</h4>
            <h2>{adminAllCustomerDetails?.walletAddress}</h2>
            <span className='icon add-participant'></span>
        </div>
        <div className=''>
            <h4>Email</h4>
            <h2>{adminAllCustomerDetails?.email}</h2>
            <span className='icon add-participant'></span>
        </div>

        <div className=''>
            <h4>FirstName</h4>
            <h2>{adminAllCustomerDetails?.name}</h2>
            <span className='icon add-participant'></span>
        </div>
        <div className=''>
            <h4>phoneNo</h4>
            <h2>{adminAllCustomerDetails?.phoneNo}</h2>
            <span className='icon add-participant'></span>
        </div>
    </>
}