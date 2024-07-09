import { useEffect, useState } from 'react';
import Image from "react-bootstrap/Image"
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import nodata from "src/assets/images/no-data.png"
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useAccount } from 'wagmi';
import { connect, useSelector } from 'react-redux';
import defaultbannerimg from '../../../assets/images/default-banner.jpg';
import Moment from 'react-moment';
import apiCalls from 'src/api/apiCalls';
import { CBreadcrumb, CBreadcrumbItem, CLink } from '@coreui/react';


function projectdetails() {
  const [pjctInfo, setPjctInfo] = useState({});
  const [allocationsData, setAllocationsData] = useState([]);
  const [claimsData, setClaimsData] = useState([]);
  const [pjctFeed, setPjctFeed] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);
  const [loader, setLoader] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyBalance, setBuyBalance] = useState('');
  const [amountErrorMsg, setAmountErrorMsg] = useState(null);
  const [modalErrorMsg, setModalErrorMsg] = useState(null);
  const [btnLoader, setBtnLoader] = useState(false);
  const [claimErrorMsg, setClaimErrorMsg] = useState(null);
  const [allocationsLoader, setAllocationsLoader] = useState(false);
  const showJoinModal= false;
  const [isType, setIsType] = useState(false);
  const { isConnected } = useAccount();
  const navigate = useNavigate();
  const params = useParams();
  const userData = useSelector(reducerstate => reducerstate.launchpad?.userData);
  const [swapedPercentage, setSwapedPercentage] = useState(null)
  const [claimHide, setClaimHide] = useState(true)
  const stakedAmount = null;
  const claimsArray = [];
  useEffect(() => {
    getPjctDetails();
  }, []);
  const handlePrivateOrPublic = (data) => {
    data?.map((item) => {
      if (item.type === 'Private') {
        let privateStartDate = new Date(item.startDate).getTime();
        let privateEndDate = new Date(item.endDate).getTime();
        DatesCheck(privateStartDate, privateEndDate, item);
      } else if (item.type === 'Public') {
        let publicStartDate = new Date(pjctInfo.startDate).getTime();
        let publicEndDate = new Date(pjctInfo.endDate).getTime();
        DatesCheck(publicStartDate, publicEndDate, item);
      }
    });
  };

  const DatesCheck = (startDate, endDate, item) => {
    let nowDate = new Date().getTime();
    let allocationArray = [];
    if (startDate <= nowDate && nowDate <= endDate) {
      setIsType(true);
      allocationArray.push(item);
      setAllocationsData(allocationArray);
    }
  };

  const handleClaimsCheck = (calimsData) => {
    let privateEndDate = new Date(pjctInfo.privateEndDate).getTime();
    let publicEndDate = new Date(pjctInfo.publicEndDate).getTime();

    if (calimsData?.length > 0) {
      calimsData?.map((value) => {
        let claimDate = new Date(value.date).getTime();
        if (isType && (privateEndDate <= claimDate || publicEndDate <= claimDate)) {
          claimsArray.push(value);
        }
      });
    }
  };

  const getPjctDetails = async () => {
    const userId = userData.id ? userData.id : '00000000-0000-0000-0000-000000000000';
     await apiCalls.getTokenInfo(params.id, userId)
      .then((res) => {
        setPjctInfo(res.data);
        getPjctFeed();
        swapProgressBarCalculation(res);
      })

  };

  const getProjectClaimsDetails = async (e) => {
    setAllocationsLoader(true);
    setClaimErrorMsg(null);

    if (e === 'allocations') {
      const userId = userData.id ? userData.id : '00000000-0000-0000-0000-000000000000';
      await apiCalls.getAllocationDetails(params.id, userId)

        .then((res) => {
          setAllocationsData(res.data);
          handlePrivateOrPublic(res.data);
          getClaimsData(userId);

        })
        .catch((error) => {
          setClaimErrorMsg(apiCalls.isErrorDispaly(error));
          setAllocationsLoader(false);
        });
    }
  };

  const getClaimsData = async (userId) => {
     await apiCalls.getClames(params.id, userId)
      .then((response) => {
        setClaimsData(response.data);
        setAllocationsLoader(false);
        handleClaimsCheck(response.data);  //calim button private& public end dates check
        if (response.data?.length != 0) {
          setClaimHide(false);
        } else {
          setClaimHide(true);
        }
      })
      .catch((error) => {
        setClaimErrorMsg(error?.reason || apiCalls.isErrorDispaly(error));
        setAllocationsLoader(false);
      });
  };

  const getPjctFeed = async () => {
    const res = await apiCalls.getProjectFeed(params.id)
    if (res) {
      setPjctFeed(res.data);
      setLoader(false);
    } else {
      setErrorMsg(apiCalls.isErrorDispaly(res));
      setLoader(false);
    }
  };



  const statusColourList = {
    Ongoing: 'dot-green',
    Closed: 'dot-red',
    Upcoming: 'dot-orange',
  };

  const handleCancel = async () => {
    setShowBuyModal(false);
    setBuyBalance(null);
    setAmountErrorMsg(null);
    setModalErrorMsg(null);
    setBtnLoader(false);
  };

  const handleAmount = (e) => {
    if (!e.target.value || e.target.value?.match(/^\d{1,}(\.\d{0,4})?$/)) {
      setBuyBalance(e.target.value);
    }
  };

  const swapProgressBarCalculation = (res) => {
    let swapedData = (res.data.totalSoldTokens / res.data.totalSupply) * 100;
    setSwapedPercentage(swapedData);

  };



  const launchPadTabRedirection = (data) => {
    navigate(`/launchpad/customers/profileInfo/ProfileInfo/${userData?.walletAddress}/${data}`)

  }

  return (
    <>
      <div className="project-detail-view">
        <CBreadcrumb>
          <CBreadcrumbItem>
            <CLink href="#" onClick={() => navigate(`/launchpad/customers`)} className='c-pointer'>Customers</CLink>
          </CBreadcrumbItem>
          <CBreadcrumbItem>

            <CLink href="#" onClick={() => launchPadTabRedirection("launchpad")} className='c-pointer'>Launchpad</CLink>
          </CBreadcrumbItem>
          <CBreadcrumbItem active> {pjctInfo?.projectName}</CBreadcrumbItem>
          <CBreadcrumbItem active>Projects Details</CBreadcrumbItem>
        </CBreadcrumb>
        <div className="">
          {errorMsg && (
            <div className="cust-error-bg my-4">
              <Image src={error} alt="" width={32} height={32} className="me-2" />
              <div>
                <p className="error-title error-red">Error</p>
                <p className="error-desc">{errorMsg}</p>
              </div>
            </div>
          )}

          <div className="text-center">{loader && <Spinner></Spinner>}</div>
          {!loader && (
            <>
              {!errorMsg && (
                <div className="row mt-lg-0 height-flex mt-3">
                  <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12 detailview-leftpanel">
                    <div className="project-detail mb-0">
                      <div className="detail-card detal-viewcards">
                        <div className="d-flex align-items-start">
                          <div className="profile-image">

                            <img src={pjctInfo?.logo} className="project-image" alt="" width={120}
                              height={160} />
                          </div>
                          <div className="detail-text ms-4">
                            <h3 className="profile-title">{pjctInfo?.projectName}</h3>
                            <h4 className="profilecoin-title">{pjctInfo?.tokenSymbol}</h4>
                            <div className="d-flex">
                              <div className="tags-bg">
                                <p className="project-states">
                                  <span className={statusColourList[params?.projectType]}></span>
                                  {params.projectType}

                                </p>
                              </div>

                              {pjctInfo?.tokenNetwork && (
                                <div className="tags-bg">
                                  <p className="project-states">
                                    <span
                                      className={`icon sm ${pjctInfo?.tokenNetworkLogo?.toLowerCase() || 'matic'}`}
                                    ></span>
                                    {pjctInfo?.tokenNetwork || process.env.NEXT_PUBLIC_CURRENCY}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="total-status">
                          <div className="rght-divalign card-width">
                            <h5 className="blue-text mb-0">{pjctInfo.totalSupply?.toLocaleString()}</h5>
                            <p className="regular-text">Total Supply</p>
                          </div>
                          <div className="card-width">
                            {pjctInfo?.totalRaised && (
                              <h5 className="blue-text mb-0">${pjctInfo?.totalRaised?.toLocaleString()}</h5>
                            )}
                            {!pjctInfo?.totalRaised && <h5 className="blue-text">-</h5>}
                            <p className="regular-text">Total Raise</p>
                          </div>
                        </div>
                        <div className="total-status">
                          <div className="price-section card-width mb-1">
                            <h5 className="blue-text mb-0">
                              {pjctInfo?.tokenVolume} {pjctInfo?.tokenSymbol} = {pjctInfo?.paymentValue}{' '}
                              {pjctInfo?.paymentSymbol}
                            </h5>
                            <p className="regular-text">Price</p>
                          </div>
                          <div className="rght-divalign card-width">
                            <h5 className="blue-text mb-0">{pjctInfo?.intialsupply?.toLocaleString() || '--'}</h5>
                            <p className="regular-text">Initial Supply</p>
                          </div>
                        </div>
                        <div className="total-status">
                          <div className="fields-style">
                            <Moment format="DD/MM/YYYY hh:mm UTC" className="project-bal">
                              {pjctInfo.launchDate}
                            </Moment>
                            <p className="media-content">Launch date</p>
                          </div>
                          <div className="rght-divalign">
                            {isConnected &&
                              !pjctInfo?.isJoin &&
                              pjctInfo?.privateStatus === 'Upcoming' &&
                              stakedAmount != 0 && (
                                <div className="ms-4 mb-3 me-2" >
                                  <button type="button" className="button-style text-white">
                                    Join
                                  </button>
                                </div>
                              )}
                            {isConnected && pjctInfo?.isJoin && <div className="join-badge">Joined</div>}
                          </div>
                        </div>
                        <div className="paroject-status project-state-card">
                          <div className="d-flex justify-content-between">
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
                              {(pjctInfo?.privateStatus === 'Ongoing' && 'Ongoing') ||
                                (pjctInfo?.privateStatus === 'Upcoming' && 'Upcoming') ||
                                (pjctInfo?.privateStatus === 'Closed' && 'Closed')}
                            </p>
                          </div>
                        </div>
                        <div className="paroject-status project-state-card">
                          <div className="d-flex justify-content-between">
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
                              {(pjctInfo?.publicStatus === 'Ongoing' && 'Ongoing') ||
                                (pjctInfo?.publicStatus === 'Upcoming' && 'Upcoming') ||
                                (pjctInfo?.publicStatus === 'Closed' && 'Closed')}
                            </p>
                          </div>
                        </div>
                        <div>
                          <div className="vesting-details">
                            <h4 className="vestng-style text-bold">Vesting Details</h4>
                            <p className="vesting-des">{pjctInfo?.vesting}</p>
                          </div>
                          <div className="vesting-details">
                            <h4 className="vestng-style text-bold">Country Restrictions</h4>
                            <p className="vesting-des">{pjctInfo?.countryRestrictions?.join(', ')}</p>
                          </div>


                          <div className="swap-bar mt-5">
                            <p className="vestng-style mb-2">Swap Progress</p>
                            <ProgressBar
                              variant="info"
                              now={swapedPercentage?.toString().slice(0, 3)}
                            />
                            <div className="justify-content">
                              <p className="text-small mt-1 label-secondary">{swapedPercentage} %</p>
                              <p className="text-small mt-1 label-secondary">
                                {pjctInfo.totalSoldTokens?.toLocaleString()}/{pjctInfo.totalSupply?.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="detail-view-design"></div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 col-lg-8 col-xl-8 col-xxl-8 detailview-rightpanel-border">
                    <div className="project-detail">
                      <div>
                        <div className="projectdetail-right">

                          <img src={pjctFeed?.bannerImage || defaultbannerimg} className="image-style-banner" alt="" width={120}
                            height={160} />
                        </div>

                        <div className="row detail-tab">
                          <Tabs
                            defaultActiveKey="ProjectFeed"
                            id="uncontrolled-tab-example"
                            className="mb-3 detailview-customtabs"
                            onSelect={(e) => getProjectClaimsDetails(e)}
                          >
                            <Tab eventKey="ProjectFeed" title="Project Feed">
                              <div>
                                {pjctFeed?.introductionHtml ? <div
                                  className="detail-table"
                                  dangerouslySetInnerHTML={{ __html: pjctFeed?.introductionHtml }}
                                ></div> : <div className="nodata-text db-no-data">
                                  <Image src={nodata} className="text-center" alt=""></Image>
                                  <h3 className="text-center nodata">No data found</h3>
                                </div>}
                              </div>

                            </Tab>
                            <Tab eventKey="allocations" title="Allocation/Claim">
                              {allocationsLoader && (
                                <div className="text-center">
                                  <Spinner className="text-center"></Spinner>
                                </div>
                              )}
                              {!allocationsLoader && (
                                <>
                                  <div className="claim-tab row information">
                                    {claimErrorMsg && (
                                      <div className="cust-error-bg my-4">

                                        <div>
                                          <p className="error-title error-red">Error</p>
                                          <p className="error-desc">{claimErrorMsg}</p>
                                        </div>
                                      </div>
                                    )}
                                    <div>
                                      <h2 className="detail-intro">Your Allocations</h2>
                                    </div>
                                    <div className="table-scoll px-0 mb-3">
                                      <table className="table ps-0 pe-0">
                                        <thead>
                                          <tr className="claim-head">
                                            <th className="pool-data">No.</th>
                                            <th className="pool-data">Type</th>
                                            <th className="pool-data">Allocation Volume</th>
                                            <th className="pool-data">Price Per Token</th>
                                            <th className="pool-data">Purchase Volume</th>

                                          </tr>
                                        </thead>
                                        {allocationsData?.length != 0 && (
                                          <tbody>
                                              {allocationsData?.map((item, idx) => (
                                                <tr className="black-bg" key={idx}>
                                                  <td scope="row" className="pool-data">
                                                    {idx + 1}
                                                  </td>
                                                  <td className="pool-data">{item.type}</td>
                                                  <td className="pool-data">
                                                    {item.allocationVolume.toLocaleString()}
                                                  </td>
                                                  <td className="pool-data">{item.paymentValue}</td>
                                                  <td className="pool-data" style={{ textAlign: "left" }}>{item.purchaseVolume}</td>


                                                </tr>
                                              ))}

                                          </tbody>
                                        )}
                                      </table>
                                      {allocationsData?.length == 0 && (
                                          <div className="nodata-text db-no-data">
                                            <Image src={nodata} className="text-center" alt=""></Image>
                                            <h3 className="text-center nodata">No data found</h3>
                                          </div>
                                      )}
                                    </div>

                                  </div>
                                  {claimHide && (
                                    <div className="claim-tab row information">
                                      <div>
                                        <h2 className="detail-intro">Claim</h2>
                                      </div>
                                      <div className="">
                                        <p className="claim-desc">
                                          1. You first need to purchase the tokens on this page, when the{' '}
                                          {process.env.NEXT_PUBLIC_OFFERING_TITLE}’S is live on TBA
                                        </p>
                                        <p className="claim-desc">
                                          2. After that , claim your purchased tokens here at TGE
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  {!claimHide && (
                                    <div className="claim-tab row information">
                                      <div>
                                        <h2 className="detail-intro">CLAIM</h2>
                                      </div>
                                      <div className='table-scoll'>
                                        <table className="table  ps-0 pe-0">
                                          <thead>
                                            <tr className="claim-head">
                                              <th scope="col" className="pool-data">
                                                No.
                                              </th>
                                              <th scope="col" className="pool-data">
                                                Allocation
                                              </th>
                                              <th scope="col" className="pool-data">
                                                Date
                                              </th>
                                              <th scope="col" className="pool-data">
                                                Claimed
                                              </th>

                                            </tr>
                                          </thead>
                                          <tbody>
                                            {claimsData?.map((claims, index) => (
                                              <tr className="black-bg" key={index}>
                                                <td scope="row" className="pool-data">
                                                  {index + 1}
                                                </td>
                                                <td className="pool-data">{claims.allocation.toLocaleString()}</td>
                                                <td className="pool-data">

                                                  <Moment format="DD/MM/YYYY hh:mm UTC" className="status-content mb-0">
                                                    {claims.date}
                                                  </Moment>
                                                </td>
                                                <td className="pool-data" style={{ textAlign: "left" }}>{claims?.claimedValue}</td>

                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                        {claimsData?.length == 0 && (
                                            <div className="nodata-text db-no-data">
                                              <Image src={nodata} className="text-center" alt=""></Image>
                                              <h3 className="text-center nodata">No data found</h3>
                                            </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                            </Tab>
                          </Tabs>
                        </div>
                        <div className="detailview-rightpanel"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

      </div>
      <div className="modal show" style={{ display: 'block', position: 'initial' }}>
        <Modal show={showBuyModal} onHide={handleCancel} className="profile-edit">
          <Modal.Header d-flex justify-content-between>
            <Modal.Title className="modal-title">
              <h4 className="mb-0">Buy Now</h4>
            </Modal.Title>
            <span onClick={handleCancel} className="icon close"></span>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              {modalErrorMsg && (
                <div className="cust-error-bg my-4">

                  <div>
                    <p className="error-title error-red">Error</p>
                    <p className="error-desc">{modalErrorMsg}</p>
                  </div>
                </div>
              )}
              <div>
                <span className="text-label mb-2">Amount *</span>
              </div>
              <div className="mb-2 d-flex footer-btn stake-input">
                <div className="max-input">
                  <input
                    type="text"
                    placeholder="Enter Amount"
                    className="form-control cust-input"
                    id="amount"
                    value={buyBalance}
                    maxLength={20}
                    autoComplete="off"
                    style={{ color: 'black' }}
                    onChange={(e) => handleAmount(e)}
                  />
                </div>
              </div>
              <div>
                <div>
                  <span className="text-danger">{amountErrorMsg}</span>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="d-flex align-center moblie-margin">
              <button type="button" className="border-btn me-3" onClick={handleCancel} style={{ color: 'black' }}>
                Cancel
              </button>

              <Button type="button" className="btn-primary fill-btn" >
                {btnLoader && (
                    <Spinner
                      as="span"
                      animation="border"
                      variant="dark"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    ></Spinner>
                )}{' '}
                Ok
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
        <Modal show={showJoinModal} className="profile-edit">
          <Modal.Header className="d-flex justify-content-between">
            <Modal.Title className="modal-title">
              <h4 className="mb-0">Confirm</h4>
            </Modal.Title>
            <span className="icon close"></span>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              {modalErrorMsg && (
                <div className="cust-error-bg my-4">

                  <div>
                    <p className="error-title error-red">Error</p>
                    <p className="error-desc">{modalErrorMsg}</p>
                  </div>
                </div>
              )}
              <div>
                <p className="confirm-text mb-2">Are you sure do you want to join?</p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="d-flex">
            <div className="button-next">
              <div className="button-border"></div>
              <button type="button" className="border-btn">
                {' '}
                Cancel
              </button>
            </div>
            <div className="button-next ms-3" onClick={() => handleOk()}>
              <div className={`${loader ? 'load-button' : 'button-border'}`}></div>
              <button type="button" className="custom-button">
                {loader && (
                  <Spinner
                    as="span"
                    animation="border"
                    variant="dark"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  ></Spinner>
                )}{' '}
                Confirm
              </button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

const connectStateToProps = ({ auth }) => {
  return { auth: auth };
};
export default connect(connectStateToProps, (dispatch) => {
  return { dispatch };
})(projectdetails);
