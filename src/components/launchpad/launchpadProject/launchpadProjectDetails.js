import { useEffect, useRef, useState } from 'react';
import Image from 'react-bootstrap/Image';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import apiCalls from 'src/api/apiCalls';
import Moment from 'react-moment';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { connect, useSelector } from 'react-redux';
import cyber from '../../../assets/images/cyber-arena.svg'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
function Projectdetails({ projectCardId }) {
  const [errorMsg, setErrorMsg] = useState(null);
  const [loader, setLoader] = useState(false);
  const [pjctFeed, setPjctFeed] = useState({});
  const adminDetail = useSelector(reducerstate => reducerstate.oidc?.adminDetails)
  const [pjctInfo, setPjctInfo] = useState({})
  const shouldLog = useRef(true);

  useEffect(() => {
    if (shouldLog.current) {
      shouldLog.current = false;
      if (projectCardId) {
        getPjctDetails();
      }
    }
  }, []);

  const getPjctDetails = async () => {
    setLoader(true);
    const userId = adminDetail.id && adminDetail.id != '' ? adminDetail.id : '00000000-0000-0000-0000-000000000000';
    await apiCalls.getLaunchpadProjectDetails(projectCardId, userId)
      .then((res) => {
        setLoader(false);
        setPjctInfo(res.data);
        getPjctFeed();
      })
      .catch((error) => {
        setErrorMsg(apiCalls.isErrorDispaly(error));
        setLoader(false);
      });
  };

  const getPjctFeed = async () => {
    const res = await apiCalls.getProjectFeed(projectCardId);
    if (res) {
      setPjctFeed(res.data);
      setLoader(false);
    } else {
      setErrorMsg(apiCalls.isErrorDispaly(res));
      setLoader(false);
    }
  };

  const handleURLClcik = (projectInfo, type) => {
    if (type == 'FB') {
      window.open('https://www.facebook.com/');
    } else if (type == 'MIKE') {
      window.open(projectInfo.websiteUrl);
    } else if (type == 'TW') {
      window.open(projectInfo.twitter);
    } else if (type == 'TLGRM') {
      window.open(projectInfo.telegram);
    } else if (type == 'NETWORK') {
      window.open(projectInfo.websiteUrl);
    }
  };

  const statusColourList = {
    Ongoing: 'dot-green',
    Closed: 'dot-red',
    Upcoming: 'dot-orange',
  };

  const getProjectClaimsDetails = async (e) => {
    setAllocationsLoader(true);
    setClaimErrorMsg(null);
    if (isConnected) {
      getParticipantsData();
    }
    if (e === 'allocations') {
      const user = store.getState().auth;
      const userId = user.user.id && user.user.id != '' ? user.user.id : '00000000-0000-0000-0000-000000000000';
      await get('User/Allocations/' + pid + '/' + userId)
        .then((res) => {
          setAllocationsData(res.data);
          handlePrivateOrPublic(res.data);
          getClaimsData(userId);
          if (res.data?.length != 0 && claimsData?.length != 0) {
            setisHide(false);
          } else {
            setisHide(true);
          }
        })
        .catch((error) => {
          setClaimErrorMsg(apiCalls.isErrorDispaly(error));
          setAllocationsLoader(false);
        });
    }
  };
  return (

      <div className="">
        <div className="">
          {errorMsg && (
            <Alert variant="danger">
              <div className='d-flex align-items-center'>
                <span className='icon error-alert'></span>
                <p className='m1-2' style={{ color: 'red' }}>{errorMsg}</p>
              </div>
            </Alert>
          )}
          <div className="text-center">{loader && <Spinner></Spinner>}</div>
          {!loader && (
            <div className="row project-detail-view align-items-stretch">
              <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-12 detailview-leftpanel">
                <div className="project-detail">
                  <div className="detail-card detal-viewcards">
                    <div className="profile-image d-flex d-mobile-block gap-14 mb-4">
                      <Link className="" aria-current="page" href="">
                        <Image src={cyber} className="project-image" alt="" />
                      </Link>
                      <div className="detail-text">
                        <h3 className="profile-title">{pjctInfo.projectName}</h3>
                        <h4 className="profilecoin-title">{pjctInfo.tokenSymbol}</h4>
                        <div className="d-flex">
                          <div className="tags-bg">
                            <p className="project-states">
                              <span className={statusColourList[pjctInfo.privateStatus]}></span>
                              {(pjctInfo.privateStatus === 'Ongoing' && 'Ongoing') ||
                                (pjctInfo.privateStatus === 'Upcoming' && 'Upcoming') ||
                                (pjctInfo.privateStatus === 'Closed' && 'Closed')}
                            </p>
                          </div>
                          <div className="tags-bg">
                            <p className="project-states">
                              <span className={`icon matic ${pjctInfo.paymentSymbol?.toLowerCase()} `}> </span>
                              {pjctInfo.paymentSymbol}
                            </p>
                          </div>
                          <div className="tags-bg">
                            <p className="project-states">
                              <span className={`icon matic ${pjctInfo.tokenNetwork?.toLowerCase()}`}></span>
                              {pjctInfo.tokenNetwork}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="banner-smmicons socials-indetail mb-3">
                      <span className="icon md mike c-pointer" onClick={() => handleURLClcik(pjctInfo, 'MIKE')}></span>
                      <span className="icon md fb c-pointer" onClick={() => handleURLClcik(pjctInfo, 'FB')}></span>

                      <span className="icon md twitter c-pointer" onClick={() => handleURLClcik(pjctInfo, 'TW')}></span>
                      <span
                        className="icon md telegram c-pointer"
                        onClick={() => handleURLClcik(pjctInfo, 'TLGRM')}
                      ></span>
                      <span
                        className="icon md browser c-pointer"
                        onClick={() => handleURLClcik(pjctInfo, 'NETWORK')}
                      ></span>
                    </div>

                    <div className="row mb-3">
                      <div className="col-lg-6">
                        <h5 className="project-bal">{pjctInfo.totalSupply?.toLocaleString()}</h5>
                        <p className="media-content">Total Supply</p>
                      </div>

                      <div className="col-lg-6">
                        <h5 className="project-bal">${pjctInfo.totalRaised?.toLocaleString()}</h5>
                        <p className="media-content">Total Raise</p>
                      </div>

                      <div className="col-lg-6">
                        <h5 className="project-bal">
                          {pjctInfo.tokenVolume} {pjctInfo.tokenSymbol} = {pjctInfo.paymentValue}{' '}
                          {pjctInfo.paymentSymbol}
                        </h5>
                        <p className="media-content">Price</p>
                      </div>
                      <div className="col-lg-6">
                        <h5 className="project-bal">{pjctInfo.intialsupply?.toLocaleString()}</h5>
                        <p className="media-content">Initial Supply</p>
                      </div>


                      <div className="col-lg-6">
                        <Moment format="DD/MM/YYYY hh:mm UTC" className="project-bal">
                          {pjctInfo.launchDate}
                        </Moment>
                        <p className="media-content">Launch date</p>
                      </div>
                      <div className="rght-divalign">
                      </div>
                    </div>
                    <div className="paroject-status project-state-card mb-4">
                      <div className="d-flex align-center gradient-box justify-content-between">
                        <div>
                          <p className="status-lbl">Private Opens</p>
                          <Moment format="DD/MM/YYYY hh:mm UTC" className="status-content mb-0">
                            {pjctInfo.privateStartDate}
                          </Moment>
                        </div>
                        <div className="vr vr-color"></div>
                        <div>
                          <p className="status-lbl">Private Closes</p>
                          <Moment format="DD/MM/YYYY hh:mm UTC" className="status-content mb-0">
                            {pjctInfo.privateEndDate}
                          </Moment>
                        </div>
                      </div>
                      <div className="project-badge">
                        <p className="note-text">
                          {(pjctInfo.privateStatus === 'Ongoing' && 'Ongoing') ||
                            (pjctInfo.privateStatus === 'Upcoming' && 'Upcoming') ||
                            (pjctInfo.privateStatus === 'Closed' && 'Closed')}
                        </p>
                      </div>
                    </div>
                    <div className="paroject-status project-state-card mb-4">
                      <div className="d-flex align-center gradient-box justify-content-between">
                        <div>
                          <p className="status-lbl">Public Opens</p>
                          <Moment format="DD/MM/YYYY hh:mm UTC" className="status-content mb-0">
                            {pjctInfo?.publicStartDate}
                          </Moment>
                        </div>
                        <div className="vr vr-color"></div>
                        <div>
                          <p className="status-lbl">Public Closes</p>
                          <Moment format="DD/MM/YYYY hh:mm UTC" className="status-content mb-0">
                            {pjctInfo.publicEndDate}
                          </Moment>
                        </div>
                      </div>
                      <div className="project-badge">
                        <p className="note-text">
                          {(pjctInfo.publicStatus === 'Upcoming' && 'Upcoming') ||
                            (pjctInfo.publicStatus === 'Closed' && 'Closed')}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="vesting-details mb-4">
                        <h4 className="media-content">Vesting Details</h4>
                        <p className="vesting-des">{pjctInfo.vesting}
                        </p>
                      </div>
                      <div className="vesting-details">
                        <h4 className="media-content">Country Restrictions</h4>
                        <p className="vesting-des">{pjctInfo.countryRestrictions}
                        </p>
                      </div>
                      <div className="swap-bar mt-5">
                        <p className="text-small mb-2">Swap Progress</p>
                        <ProgressBar
                          variant="info"
                          now={pjctInfo?.percentageOfSuppliedTokens?.toString().slice(0, 3)}
                        />
                        <div className="justify-content">
                          <p className="text-small mt-1">{pjctInfo.percentageOfSuppliedTokens}</p>
                          <p className="text-small mt-1">
                            {pjctInfo.totalSupply?.toLocaleString()}/{pjctInfo.totalSupply?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="detail-view-design"></div>
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-lg-7 col-xl-7 col-xxl-8 detailview-rightpanel-border">
                <div className="project-detail-right">
                  <div className="projectdetail-right">
                    <div>
                      <Image src={pjctFeed.bannerImage} alt="" className="image-style-banner" />
                    </div>

                    <div className="detail-tab">
                      <div className='bg-black px-0'>
                        <Tabs
                          defaultActiveKey="ProjectFeed"
                          id="uncontrolled-tab-example"
                          className="mb-3 sub-tabs project-tabs mt-3"
                          onSelect={(e) => getProjectClaimsDetails(e)}
                        >
                          <Tab eventKey="ProjectFeed" title="Project Feed">
                            <div
                              className="detail-table"
                              dangerouslySetInnerHTML={{ __html: pjctFeed.introductionHtml }}
                            ></div>              
                          </Tab>
                          <Tab eventKey="allocations" title="Allocation/Claim">                           
                            <div className="claim-tab row information px-2">
                              <div className='px-2'>
                                <Alert variant="danger">
                                  Something went wrong please try again!
                                </Alert></div>
                              <div>
                                <h2 className="detail-intro">YOUR ALLOCATIONS</h2>
                              </div>
                              <div className='px-2 user-content'>
                                <table className="table allocation-table">
                                  <thead>
                                    <tr className="claim-head ">
                                      <th className="pool-data">No.</th>
                                      <th className="pool-data">Type</th>
                                      <th className="pool-data">Allocation Volume</th>
                                      <th className="pool-data">Price Per Token</th>
                                      <th className="pool-data">Purchase Volume</th>
                                      <th className="pool-data"></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>01</td>
                                      <td>private</td>
                                      <td>10000</td>
                                      <td>0.01 BUSD</td>
                                      <td>2000</td>
                                    </tr>
                                    <tr>
                                      <td>02</td>
                                      <td>Public</td>
                                      <td>NA</td>
                                      <td>0.01 BUSD</td>
                                      <td>0</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            <div className="claim-tab row information px-2 my-5">
                              <div>
                                <h2 className="detail-intro">CLAIM</h2>
                              </div>
                              <div className="">
                                <p className="claim-desc">
                                  1. You first need to purchase the tokens on this page, when the{' '}
                                  ’
                                  S is live on TBA
                                </p>
                                <p className="claim-desc">
                                  2. After that , claim your purchased tokens here at TGE
                                </p>
                              </div>
                            </div>

                          </Tab>
                        </Tabs>
                      </div>
                    </div>
                    <div className="detailview-rightpanel"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}

Projectdetails.propTypes = {
  projectCardId: PropTypes.isRequired,
};
const connectStateToProps = ({ auth }) => {
  return { auth: auth };
};
export default connect(connectStateToProps, (dispatch) => {
  return { dispatch };
})(Projectdetails);
