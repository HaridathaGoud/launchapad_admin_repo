import React, { useEffect, useState,useRef } from "react";
import { useParams } from 'react-router-dom';
import { get, getCUstomer } from '../../utils/api';
import cyberarena from '../../assets/images/cyber-arena.svg'

const JoinedProjects = () => {
  let { address } = useParams();
  const [creatorscount, setCreatorsCount] = useState(0);
  const [favouritesCount, setFavouritesCount] = useState(0);
  const [ownedCount, setOwnedCount] = useState(0);
  const [profileDetails, setProfileDetails] = useState({});
  const [errorMsg, setErrorMsg] = useState(false);



  const shouldLog = useRef(true);
  useEffect(() => {
    if (shouldLog.current) {
      shouldLog.current = false;
  getCreatedCount();
  getFavoritedCount();
  getOwnedCount();
  getCustomerDetails()}
  }, []);



  const handleTabChange = (e) => {
    setActiveTab(e);
    setErrorMsg(null);
  };

  const getCreatedCount = async () => {
    await get(`Admin/CreatorsCount/${address}`)
      .then((response) => {
        setCreatorsCount(response.data);
        setErrorMsg(null);
      })
      .catch((error) => {
        setErrorMsg(isErrorDispaly(error));
      });
  };

  const getFavoritedCount = async () => {
    await get(`Admin/FavoritesCount/${address}`)
      .then((response) => {
        setFavouritesCount(response.data);
        setErrorMsg(null);
      })
      .catch((error) => {
        setErrorMsg(isErrorDispaly(error));
      });
  };

  const getOwnedCount = async () => {
    await get(`Admin/currentownerscount/${address}`)
      .then((response) => {
        setOwnedCount(response.data);
        setErrorMsg(null);
      })
      .catch((error) => {
        setErrorMsg(isErrorDispaly(error));
      });
  };

  const getCustomerDetails = async () => {
    setLoader(true);
    await getCUstomer(`User/CustomerDetails/${address}`)
      .then((response) => {
        setProfileDetails(response.data);
        setErrorMsg(null);
        setLoader(false);
      })
      .catch((error) => {
        setErrorMsg(isErrorDispaly(error.response));
        setLoader(false);
      });
  };
    return(
        <>
         <div>
          
                    <div className="project-detail-view">
                        <div className="detail-card">
                           
                            <div className="project-content">
                                <div className="detail-text">
                                  <div className="d-flex gap-14 mb-4">
                                    <div>
                                      <img src={cyberarena}></img>
                                    </div>
                                  <div>
                                    <h3 className="profile-title"> CyberArena </h3>                                 
                                    <p className="mb-3">ANIM</p>
                                    <div className="d-flex gap-14">
                                        <div className="tags-bg">
                                            <p className="project-states">
                                                <span className="dot-green"></span>Closed
                                            </p>
                                        </div>
                                        <div className="tags-bg">
                                            <p className="project-states">
                                                <span className="icon matic"></span>BUSD
                                            </p>
                                        </div>
                                        <div className="tags-bg">
                                            <p className="project-states">
                                                <span className="icon matic"></span>Matic
                                            </p>
                                        </div>
                                    </div></div></div>
                                   
                                    <div className="mb-2">
                                      <span className="icon mike"></span>
                                      <span className="icon fb"></span>
                                      <span className="icon twitter"></span>
                                      <span className="icon telegram"></span>
                                      <span className="icon browser"></span>
                                    </div>
                                    <div className="row">
                                    <div className="col-lg-6">
                                      <p className="project-bal">$148,000</p>
                                      <p className="media-content">Total Raise</p>
                                    </div>
                                    <div className="col-lg-6">
                                      <p className="project-bal">$148,000</p>
                                      <p className="media-content">Total Supply</p>
                                    </div>
                                    <div className="col-lg-6">
                                      <p className="project-bal">2022-02-16 19:00 UTC</p>
                                      <p className="media-content">Launch date</p>
                                    </div>
                                    </div>
                                </div>
                                <div className="project-status position-relative mb-4">
                                  <div className="d-flex align-center gradient-box">
                                    <div>
                                      <p className="status-lbl">Public Opens</p>
                                      <p className="status-content mb-0">2022-02-16 09:00 UTC</p>
                                    </div>
                                    <div>
                                      <p className="status-lbl">Private Closes</p>
                                      <p className="status-content mb-0">2022-02-16 09:00 UTC</p>
                                    </div>
                                    <div></div>
                                  </div>
                                  <span className="ongo">On going</span>
                                </div>
                                <div className="project-status position-relative">
                                  <div className="d-flex align-center gradient-box">
                                    <div>
                                      <p className="status-lbl">Public Opens</p>
                                      <p className="status-content mb-0">2022-02-16 09:00 UTC</p>
                                    </div>
                                    <div>
                                      <p className="status-lbl">Private Closes</p>
                                      <p className="status-content mb-0">2022-02-16 09:00 UTC</p>
                                    </div>
                                    <div></div>
                                  </div>
                                  <span className="ongo">On going</span>
                                </div>
                                <div>
                            <p className="media-content">Vesting Details</p>
                           </div>
                            </div>
                        </div>
                    </div>
                </div>
          
        </>
    );

}
export default JoinedProjects