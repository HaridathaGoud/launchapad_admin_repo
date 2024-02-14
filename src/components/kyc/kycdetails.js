import React, { useEffect, useRef, useState } from "react";
import apiCalls from 'src/api/apiCalls';
import Alert from 'react-bootstrap/Alert';
import { Spinner } from 'react-bootstrap';
import profileavathar from "../../assets/images/profileavathar.png";
import PropTypes from 'prop-types';
import Moment from "react-moment";
import Image from "react-bootstrap/Image";
import nodata from "src/assets/images/no-data.png"
const KycDetails = (props) => {
  const [loader, setLoader] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [userDetailsNestedList, setUserDetailsNestedList] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const shouldLog = useRef(true);

  useEffect(() => {
    if (shouldLog.current) {
      shouldLog.current = false;
      if (props?.userDetailsId.id) {
        userProfileKyc();
      }
    }
  }, []);//eslint-disable-line react-hooks/exhaustive-deps

  const userProfileKyc = async () => {
    setLoader(true);
    let response = await apiCalls.getKYCInformation(props?.userDetailsId.id);
    if (response.ok) {
      setUserDetails(response.data);
      let products = response.data.idTypes
      const result = products?.reduce((acc, obj) => {
        const key = obj.idType;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});
      if (result) {
        const tableData = Object?.entries(result);
        setUserDetailsNestedList(tableData);
      }
      setLoader(false);
    } else {
      setErrorMessage(apiCalls.isErrorDispaly(response));
      setLoader(false);
    }
  }
  const idLabels = {
    'PASSPORT': 'Passport',
    'SELFIE': 'Selfie',
    'DRIVERS': "Driver's License",
    'ID_CARD': 'ID Card',
    'RESIDENCE_PERMIT': 'Residence Permit',
  };
  return (<>
    {(props?.userDetailsId?.kycStatus?.toLowerCase() === "completed" 
    || props?.userDetailsId?.kycStatus?.toLowerCase() === "pending" 
    || props?.userDetailsId?.kycStatus?.toLowerCase() === "rejected") ? <>
      {userDetails?.email ? <>


        <div className="Personal-Details">
          {errorMessage && (
            <Alert variant="danger">
              <div className='d-flex align-items-center'>
                <span className='icon error-alert'></span>
                <p className='m1-2' style={{ color: 'red' }}>{errorMessage}</p>
              </div>
            </Alert>
          )}

          <h2 className="tab-head">Personal</h2>
          <div className="text-center">{loader && <Spinner></Spinner>}</div>
          {!loader && <>
            {userDetails &&
              <>
                <div className="row mb-3">
                  <div className="col-md-3">
                    <p className="mb-0 tab-label">First Name </p>
                  </div>
                  <div className="col">
                    <p className="mb-0 tab-val">{userDetails?.firstName ? userDetails?.firstName : "--"}</p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-3">
                    <p className="mb-0 tab-label">Last Name</p>
                  </div>
                  <div className="col">
                    <p className="mb-0 tab-val">{userDetails?.lastName ? userDetails?.lastName : "--"}</p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-3">
                    <p className="mb-0 tab-label">Email</p>
                  </div>
                  <div className="col">
                    <p className="mb-0 tab-val word-break">{userDetails?.email ? userDetails?.email : "--"}</p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-3">
                    <p className="mb-0 tab-label">Phone No</p>
                  </div>
                  <div className="col">
                    <p className="mb-0 tab-val">{userDetails?.phoneNo ? userDetails?.phoneNo : "--"}</p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-3">
                    <p className="mb-0 tab-label">Date of Birth</p>
                  </div>
                  <div className="col">
                    <p className="mb-0 tab-val">
                      {userDetails?.dob && <>
                        <Moment format="DD/MM/YYYY">
                          {userDetails?.dob?.slice(0, 10)}
                        </Moment>
                      </>}
                      {!userDetails?.dob && "--"}
                    </p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-3">
                    <p className="mb-0 tab-label">Country</p>
                  </div>
                  <div className="col">
                    <p className="mb-0 tab-val">{userDetails?.country ? userDetails?.country : "--"}</p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-3">
                    <p className="mb-0 tab-label">Discord ID</p>
                  </div>
                  <div className="col">
                    <p className="mb-0 tab-val">{userDetails?.discordId ? userDetails?.discordId : "--"}</p>
                  </div>
                </div>
              </>}
          </>}
        </div>
        <br />
        <h2 className="tab-head">Identification</h2>
           <div className="mb-4 cust-img-render">
                                        {userDetailsNestedList?.map(([idType, items]) => (
                                          <div className='passport-img'>
                                            <p className="tab-label id-label">
                                            {idLabels[idType] || ''}
                                            </p>
                                            <div className="cust-kyc-img d-flex">
                                              {items?.map((item) => (<>

                                                <div className="identification-image ">

                                                  <span className="image-box">
                                                    <img
                                                     className={`image-setup ${
                                                      item?.idType === 'SELFIE' ? 'imagefit-cover' : 'imagefit-contain'
                                                    }`}
                                                      src={item?.url || profileavathar}
                                                      alt="image"
                                                    />
                                                  </span>
                                                </div>
                                              </>))}
                                            </div>
                                          </div>))}
                                      </div>
      </> : <div className="nodata-text db-no-data">
        <Image src={nodata} className="text-center mt-4" alt=""></Image>
        <h3 className="text-center nodata">No data found</h3>
      </div>}

    </>
      :
      <div className="nodata-text db-no-data">
        <Image src={nodata} className="text-center mt-4" alt=""></Image>
        <h3 className="text-center nodata">No data found</h3>
      </div>}
  </>
  );
}
export default KycDetails;
KycDetails.propTypes = {
  userDetailsId: PropTypes.any,
};