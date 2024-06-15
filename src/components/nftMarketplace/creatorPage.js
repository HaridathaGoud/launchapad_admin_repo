import UseCopyToClipboard from '../../utils/copyClipboard';
import React ,{ useEffect, useState,useRef } from 'react';
import {getMarketPlaceData } from '../../utils/api';
import moment from 'moment';
import { Alert, Spinner } from 'react-bootstrap';
import Nfts from './nfts'
import { useParams } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import defaultBanner from "../../assets/images/banner-default.jpg"
import apiCalls from 'src/api/apiCalls';
const creatorPage = () => {
    let { address } = useParams();
    const [errorMessage, setErrorMessage] = useState(null);
    const [loader, setLoader] = useState(false);
    const [profileDetails, setProfileDetails] = useState({});
    const [followersData,setFollowersData]=useState({})
    const shouldLog = useRef(true);
    
    useEffect(() => {
      if (shouldLog.current) {
        shouldLog.current = false;
          getCustomerDetails();
         
        }
      }, []);


      const getCustomerDetails = async () => {
        setLoader(true);
        await apiCalls.customerDetails(address)
          .then((response) => {
            setProfileDetails(response.data);
            getFOllowers(response.data.id)
            setLoader(false);
          })
      };
      const getFOllowers = async (id) => {
        setLoader(true);
        await getMarketPlaceData(`GetCustomerFollowers/${id}`)
          .then((response) => {
            setFollowersData(response.data);
            setLoader(false);
          })
          .catch((error) => {
            setErrorMessage(error)
          });
      };
      const getCReatedDate = (date) => {
        let dateIn = moment(date, 'YYYY/MM/DD');
        return dateIn.format('DD MMM YYYY');
      };
  return (
    <div className="container">
      {errorMessage && (
        <Alert variant="danger">
          <div className='d-flex align-items-center'>
            <span className='icon error-alert'></span>
            <p className='m1-2' style={{ color: 'red' }}>{errorMessage}</p>
          </div>
        </Alert>
      )}
       <div className="text-center">{loader && <Spinner></Spinner>}</div>
       {!loader &&<>
       <div className='position-relative'>
       <div className="uploded-profile-image">
              <Image
                src={profileDetails?.bannerImage != null ? profileDetails?.bannerImage: defaultBanner }
                className="creator-img"
                alt=""
                width="100"
                height="100"
              />
            </div>
            <div className=''>
            <div className="row bg-card">
              <div className="col-md-12 col-lg-4">
                <div className="original-bg position-absolute">
                  <div className="p-4 createdby-page position-relative">
                    <Image
                      src={profileDetails?.profilePicUrl != null? profileDetails?.profilePicUrl: defaultBanner }
                      className="profile-img position-absolute"
                      alt=""
                      width="100"
                      height="100"
                    />

                    <div className="mt-90">
                      <div className="creator-summary">
                        <label className="">Followers</label>
                        <div className="summary-price">{followersData?.followers}</div>
                      </div>
                      <div className="creator-summary">
                        <label className="">Following</label>
                        <div className="summary-price">{followersData?.following}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-lg-8">
                <div className="row sm-mt-space">
                  <div className="col-lg-9">
                    <h2 className="creator-head">
                      {profileDetails?.firstName != null ? profileDetails?.firstName : 'Un Named'}
                    </h2>
                    <div className="creator-by">
                      <span className="icon polygon"></span>
                      <p className="common-text mb-0 ms-1">
                        {address}
                      </p>
                      <div className='ms-1'>
                          {address && (
                            <UseCopyToClipboard address={address}></UseCopyToClipboard>
                          )}
                       </div>                     
                    </div>
                    <div>
                    {profileDetails?.createdDate && (
                        <p className="text-small mb-0 ">Joined on {getCReatedDate(profileDetails?.createdDate)}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3">
                    {profileDetails?.facebook && <span className="icon md fb c-pointer" onClick={() => handleclick('fb')} />}
                    {profileDetails?.linkedIn&&<span className="icon md mike  c-pointer" onClick={() => handleclick('linkedin')} />}
                    {profileDetails?.twitter&&<span className="icon md twitter c-pointer" onClick={() => handleclick('twiter')} />}
                    {profileDetails?.websiteUrl&&<span className="icon md browser c-pointer" onClick={() => handleclick('web')} />}
                  </div>
                </div>

                <div className="mt-3">
                  <p className="common-text">{profileDetails?.aboutUs}</p>
                </div>
              </div>
            </div></div>

            <div className="creator-tabs ss creatorby-banner-title">
                  <Nfts userDetailsId={profileDetails}/>
            </div>
       </div>
       </>}
    </div>
  )
}

export default creatorPage
