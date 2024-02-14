import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useState, useEffect, useRef, useReducer } from 'react';
import Form from 'react-bootstrap/Form';
import apiCalls from 'src/api/apiCalls';
import { useNavigate, useParams,Link } from "react-router-dom";
import Moment from 'react-moment';
import Placeholder from 'react-bootstrap/Placeholder';
import nodata from "src/assets/images/no-data.png"
import Image from "react-bootstrap/Image"
import { Spinner } from 'react-bootstrap';
const reducer = (state, action) => {
  switch (action.type) {
    case "cardDetails":
      return { ...state, cardDetails: action.payload };
    case "totalCardData":
      return { ...state, totalCardData: action.payload };
    case "errorMsg":
      return { ...state, errorMsg: action.payload };
    case "key":
      return { ...state, key: action.payload };
    case "loadeMessage":
      return { ...state, loadeMessage: action.payload };
    case "loader":
      return { ...state, loader: action.payload };
    case "type":
      return { ...state, type: action.payload };

    default:
      return state;
  }
}
const initialState = {
  cardDetails: [],
  totalCardData: [],
  errorMsg: null,
  key: '',
  loadeMessage: 'Loading...',
  loader: false,
  type: 'Ongoing'

};



export default function Projects(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const pageSize = 3;
  const [pageNo, setPageNo] = useState(1);
  const [search, setSearch] = useState(null);
  const navigate = useNavigate();
  const onGoingIgosRef = useRef(null);
  const upComingIgosRef = useRef(null);
  const endedIgosRef = useRef(null);
  const [loadData, setLoadData] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [loadMore, setLoadMore] = useState(false)
  const [hide, setHide] = useState(false)
  let { address } = useParams();
  const fetchMoreData = () => {
    if (state.cardDetails.length >= 3) {
      getPrjectCardDetails(userDetails.id, pageSize, pageNo, search, state.type);
    }
  };


  const userProfile = async () => {
    let res = await apiCalls.customerDetails(address);
    if (res.ok) {
      setUserDetails(res.data);
      getPrjectCardDetails(res.data?.id, 3, 1, null, 'Ongoing');
    } else {
      setErrorMessage(apiCalls.isErrorDispaly(res));
    }
  }

  const addProposalList = () => {
    fetchMoreData()
  }



  const getPrjectCardDetails = async (id, pageListSize, pageNum, searchCard, type) => {
    setLoadMore(true)
    setHide(true)
    if (state.cardDetails?.length == 0) {
      dispatch({ type: 'loader', payload: true })
      setLoadMore(false)
      setHide(false)
    }
    const skip = pageNum * pageListSize - pageListSize;
    const take = pageListSize;
    let response = await apiCalls.getLaunchPadProjectData(id, take, skip, searchCard, type)
    if (response) {
      let _pageNo = pageNum + 1;
      setLoadMore(false)
      setHide(false)
      setPageNo(_pageNo);
      dispatch({ type: 'type', payload: type })
      setSearch(searchCard);
      let mergeData = pageNum == 1 ? [...response?.data] : [...state.cardDetails, ...response?.data];

      if (response?.data?.length == 0 || response?.data?.length < 10) {
        setHide(true)
        setLoadData(false)
      } else {
        setLoadData(false)
        setHide(false)
      }
      setLoadData(false)
      if (mergeData.length > 0) {
        dispatch({ type: 'loadeMessage', payload: ' ' })
      } else if (mergeData.length == 0) {
        dispatch({ type: 'loadeMessage', payload: 'No data found' })
      }
      dispatch({ type: 'cardDetails', payload: mergeData })
      if (search == null) {
        dispatch({ type: 'totalCardData', payload: mergeData })
      }
      dispatch({ type: 'loader', payload: false })
    } else {
      dispatch({ type: 'errorMsg', payload: apiCalls.isErrorDispaly(response) })

      dispatch({ type: 'loader', payload: false })
    }
  };
  useEffect(() => {
    dispatch({ type: 'type', payload: 'Ongoing' })
    userProfile()
  }, []);

  const handleTabSelect = (key) => {
    if (key === '1') {
      onGoingIgosRef.current.value = null;
      dispatch({ type: 'key', payload: key })
      dispatch({ type: 'type', payload: 'Ongoing' })
      getPrjectCardDetails(userDetails.id, 3, 1, null, 'Ongoing');
    } else if (key === '2') {
      upComingIgosRef.current.value = null;
      dispatch({ type: 'key', payload: key })
      dispatch({ type: 'type', payload: 'Upcoming' })
      getPrjectCardDetails(userDetails.id, 3, 1, null, 'Upcoming');
    } else if (key === '3') {
      endedIgosRef.current.value = null;
      dispatch({ type: 'key', payload: key })
      dispatch({ type: 'type', payload: 'Closed' })
      getPrjectCardDetails(userDetails.id, 3, 1, null, 'Closed');
    }
  };
  const handleWebSiteLinks = (item, type) => {
    if (type == 'TW') {
      window.open(item.twitter);
    } else if (type == 'FACEBOOK') {
      window.open(item.facebook);
    } else if (type == 'INSTAGRAM') {
      window.open(item.instagram);
    } else if (type == 'NETWORK') {
      window.open(item.websiteUrl);
    } else if (type == 'LINKDIN') {
      window.open(item.linkdin);
    }
  };


  const handleChange = (e) => {
    let data = e.target.value.trim();
    setSearch(data);
    if (!data) {
      if (state?.type == 'Ongoing') {
        getPrjectCardDetails(userDetails.id, 3, 1, null, 'Ongoing');
      } else if (state?.type == 'Upcoming') {
        getPrjectCardDetails(userDetails.id, 3, 1,  null, 'Upcoming');
      } else if (state?.type == 'Closed') {
        getPrjectCardDetails(userDetails.id, 3, 1,  null, 'Closed');
      }
      setSearch(null);
    }
  };
  const handleEnterSearch = (e) => {
    let data = e.target.value.trim();
    setSearch(data);
    if (e.key == 'Enter') {
      if (data == "") {
        if (state?.type == 'Ongoing') {
          getPrjectCardDetails(userDetails.id, 3, 1, null, 'Ongoing');
          e.preventDefault();
        } else if (state?.type == 'Upcoming') {
          getPrjectCardDetails(userDetails.id, 3, 1, null, 'Upcoming');
          e.preventDefault();
        } else if (state?.type == 'Closed') {
          getPrjectCardDetails(userDetails.id, 3, 1, null, 'Closed');
          e.preventDefault();
        }
        e.preventDefault();
      } else {
        if (state?.type == 'Ongoing') {
          getPrjectCardDetails(userDetails.id, 3, 1, data, 'Ongoing');
          e.preventDefault();
        } else if (state?.type == 'Upcoming') {
          getPrjectCardDetails(userDetails.id, 3, 1, data, 'Upcoming');
          e.preventDefault();
        } else if (state?.type == 'Closed') {
          getPrjectCardDetails(userDetails.id, 3, 1, data, 'Closed');
          e.preventDefault();
        }
        e.preventDefault();
      }
    }
  }

  const handleSearch = (e) => {
    let data = e
    if (state?.type == 'Ongoing') {
      getPrjectCardDetails(userDetails.id, 3, 1, data, 'Ongoing');
    } else if (state?.type == 'Upcoming') {
      getPrjectCardDetails(userDetails.id, 3, 1, data, 'Upcoming');
    } else if (state?.type == 'Closed') {
      getPrjectCardDetails(userDetails.id, 3, 1, data, 'Closed');
    }
    dispatch({ type: 'cardDetails', payload: state?.totalCardData })
  }



  const projectDetailsNavigate = (item) => {
    navigate(`/launchpad/projects/projectdetails/${item.publicOrPrivateStatus}/${item.id}`)
  }

  const statusColourList = {
    Ongoing: 'dot-green',
    Closed: 'dot-red',
    Upcoming: 'dot-orange',
  };


  const startDate = item?.privateStartDate == ' ' ? 'TBA': item.privateStartDate
  const endDate=item?.privateStartDate == ' ' ? 'TBA': item.privateStartDate
  return (
    <div className="ido-tab cust-tab projects-section">
      {state.errorMsg && (
        <div className="cust-error-bg my-4">
          <div>
            <p className="error-title error-red">Error</p>
            <p className="error-desc">{state.errorMsg}</p>
          </div>
        </div>
      )}

      <Tabs defaultActiveKey={1} className="profile-tabs inside-customtabs" style={{ "marginTop": "30px" }} onSelect={handleTabSelect}>
        <Tab eventKey={1} title="Open IGOs">
          <div className="container">
            <div className="srarch-right">
              <div>
                <h2 className="project-head"></h2>
              </div>
              <div className='custom-flex-launchpad'>
                <Form className="d-flex grid-search">
                  <Form.Control
                    placeholder="Search"
                    className="search-style"
                    aria-label="Search"
                    ref={onGoingIgosRef}
                    onKeyUp={(e) => handleChange(e)}
                    onKeyDown={(e) => handleEnterSearch(e)}
                  />
                  <i className="icon search-icon" onClick={() => { handleSearch(search) }}></i>
                </Form>
              </div>
            </div>
            <div className="text-center">
              {state.loader && (
                <div className="d-flex justify-content-center">
                  <div className="loading-overlay">
                    <div className="text-center image-container">

                    </div>
                  </div>
                </div>
              )}
            </div>
            {!state.loader && (
              <>
                <div>
                  {state.cardDetails?.length != 0 &&
                    <div className="row full-width">
                      {state.cardDetails?.map((item) => (
                        <>
                          <div className="col-md-6 col-sm-12 col-xs-4 col-xl-4 mb-3">
                            <div className="project-detail">
                              <div className="detail-card">
                                <Link
                                  className=""
                                  aria-current="page"
                                  href="#"
                                  onClick={() => projectDetailsNavigate(item)}
                                >
                                  <div className="image-crop">
                                    <img src={item.cardImage} className="project-image" alt="" />
                                  </div>
                                </Link>
                                <div className="project-content">
                                  <div className="detail-text">
                                    <h3 className="profile-title">{item.projectName}</h3>
                                    <div className="d-flex">
                                      <div className="tags-bg">
                                        <p className="project-states">
                                          <span className={statusColourList[item.publicOrPrivateStatus]}></span>{' '}
                                          {item.publicOrPrivateStatus === 'Ongoing' && 'Ongoing'}
                                        </p>
                                      </div>

                                      {item.tokenNetwork && (
                                        <div className="tags-bg">
                                          <p className="project-states">
                                            <span className={`icon sm ${item.tokenNetworkLogo || 'matic'} `}></span>{' '}
                                            {item.tokenNetwork || process.env.NEXT_PUBLIC_TOKENNAME}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <p className="declaration-text">{item.description}</p>
                                  <div className="my-3">
                                    {item.facebook && (
                                      <span
                                        className="icon icon-facebook c-pointer"
                                        onClick={() => handleWebSiteLinks(item, 'FACEBOOK')}
                                      ></span>
                                    )}
                                    {item.websiteUrl && (
                                      <span
                                        className="icon icon-network ms-2 c-pointer"
                                        onClick={() => handleWebSiteLinks(item, 'NETWORK')}
                                      ></span>
                                    )}
                                    {item.twitter && (
                                      <span
                                        className="icon icon-twitter ms-2 c-pointer"
                                        onClick={() => handleWebSiteLinks(item, 'TW')}
                                      ></span>
                                    )}
                                    {item.instagram && (
                                      <span
                                        className="icon icon-instagram ms-2 c-pointer"
                                        onClick={() => handleWebSiteLinks(item, 'INSTAGRAM')}
                                      ></span>
                                    )}
                                    {item.linkdin && (
                                      <span
                                        className="icon icon-linkdin ms-2 c-pointer"
                                        onClick={() => handleWebSiteLinks(item, 'LINKDIN')}
                                      ></span>
                                    )}
                                  </div>
                                  <div className="total-status">
                                    <div className="card-width">
                                      <h5 className="totall-supply mb-0">{`$${item?.totalSupply?.toLocaleString() || '-'
                                        }`}</h5>
                                      <p className="regular-text">Total Supply</p>
                                    </div>
                                  </div>
                                  <div className="total-status">
                                    <div className="card-width">
                                      <h5 className="totall-supply mb-0">
                                        {item.totalRaised?.toLocaleString() ? '$' : ''}
                                        {`${item.totalRaised?.toLocaleString() || '-'}`}
                                      </h5>
                                      <p className="regular-text">Total Raise</p>
                                    </div>
                                  </div>
                                  <div className="price-section">
                                    <h5 className="blue-text">
                                      {item.tokenVolume} {item.tokenSymbol} = {item.paymentValue?.toLocaleString()}{' '}
                                      {item.paymentSymbol}
                                    </h5>
                                    <p className="regular-text">Price</p>
                                  </div>
                                  <div className="paroject-status">
                                    <div className="d-flex align-center gradient-box">
                                      <div className="open-space">
                                        <p className="note-text">
                                          {item.accessType == 'Private' ? 'Private Opens' : 'Public Opens'}
                                        </p>
                                        <p className="project-date">
                                          <Moment format="DD/MM/YYYY hh:mm UTC" className="project-bal">
                                            {
                                              item.accessType == 'Private' ? startDate : item.publicStartDate
                                            }
                                          </Moment>

                                        </p>
                                      </div>
                                      <div className="vr vr-color"></div>
                                      <div className="close-space">
                                        <p className="note-text">
                                          {item.accessType == 'Private' ? 'Private Closes' : 'Public Closes'}
                                        </p>
                                        <p className="project-date">
                                          <Moment format="DD/MM/YYYY hh:mm UTC" className="project-bal">
                                            {
                                              item.accessType == 'Private' ? endDate : item.publicEndDate
                                            }
                                          </Moment>

                                        </p>
                                      </div>
                                    </div>
                                    <div className="project-badge">
                                      <p className="note-text">
                                        {item.publicOrPrivateStatus === 'Ongoing' && 'Ongoing'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="detailview-rightpanel"></div>
                              </div>
                            </div>
                          </div>
                        </>
                      ))}
                    </div>}
                  {state.cardDetails?.length == 0 &&

                    <>
                      <div className="nodata-text db-no-data">
                        <Image src={nodata} className="text-center" alt=""></Image>
                        <h3 className="text-center nodata">{state.loadeMessage}</h3>
                      </div>
                    </>

                  }
                  <>

                    <div className='text-center'>{loadMore && <Spinner size="sm" className='text-white' />}</div>
                    {(state.cardDetails?.length != 0 && loadData) && <div className='addmore-title' >
                      <>
                        {!hide && (<>  <span className='d-block'><span onClick={addProposalList}>See More</span></span>
                          <span onClick={addProposalList} className='icon blue-doublearrow'></span></>)}
                      </>
                    </div>}
                  </>
                </div>
              </>
            )}
          </div>
        </Tab>

        <Tab eventKey={2} title="Upcoming IGOs">
          <div className="container">
            <div className="srarch-right">
              <div>
                <h2 className="project-head"></h2>
              </div>
              <div className='custom-flex-launchpad'>
                <Form className="d-flex grid-search">
                  <Form.Control
                    placeholder="Search"
                    className="search-style"
                    aria-label="Search"
                    ref={upComingIgosRef}
                    onKeyUp={(e) => handleChange(e)}
                    onKeyDown={(e) => handleEnterSearch(e)}
                  />
                  <i className="icon search-icon" onClick={() => { handleSearch(search) }}></i>
                </Form>
              </div>
            </div>
            <div className="text-center">
              {state.loader && (
                <div className="d-flex justify-content-center">
                  <div className="loading-overlay">
                    <div className="text-center image-container">

                    </div>
                  </div>
                </div>
              )}
            </div>
            {!state.loader && (
              <>
                <div>

                  {state.cardDetails?.length != 0 &&
                    <div className="row full-width">
                      {state.cardDetails?.map((item) => (
                        <>
                          <div className="col-md-6 col-sm-12 col-xs-4 col-xl-4 mb-3">
                            <div className="project-detail">
                              <div className="detail-card">
                                <Link
                                  className=""
                                  aria-current="page"
                                  href="#"
                                  onClick={() => projectDetailsNavigate(item)}

                                >
                                  <div className="image-crop">
                                    <img src={item.cardImage} className="project-image" alt="" />

                                  </div>
                                </Link>
                                <div className="project-content">
                                  <div className="detail-text">
                                    <h3 className="profile-title">{item.projectName}</h3>
                                    <div className="d-flex">
                                      <div className="tags-bg">
                                        <p className="project-states">
                                          <span className={statusColourList[item.publicOrPrivateStatus]}></span>{' '}
                                          {item.publicOrPrivateStatus === 'Upcoming' && 'Upcoming'}
                                        </p>
                                      </div>

                                      <div className="tags-bg">
                                        <p className="project-states">
                                          <span className={`icon sm ${item.tokenNetworkLogo || 'matic'} `}></span>{' '}
                                          {item.tokenNetwork ? item.tokenNetwork : 'Matic'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <p className="declaration-text">{item.description}</p>
                                  <div className="my-3">
                                    {item.facebook && (
                                      <span
                                        className="icon icon-facebook c-pointer"
                                        onClick={() => handleWebSiteLinks(item, 'FACEBOOK')}
                                      ></span>
                                    )}
                                    {item.websiteUrl && (
                                      <span
                                        className="icon icon-network ms-2 c-pointer"
                                        onClick={() => handleWebSiteLinks(item, 'NETWORK')}
                                      ></span>
                                    )}
                                    {item.twitter && (
                                      <span
                                        className="icon icon-twitter ms-2 c-pointer"
                                        onClick={() => handleWebSiteLinks(item, 'TW')}
                                      ></span>
                                    )}
                                    {item.instagram && (
                                      <span
                                        className="icon icon-instagram ms-2 c-pointer"
                                        onClick={() => handleWebSiteLinks(item, 'INSTAGRAM')}
                                      ></span>
                                    )}
                                    {item.linkdin && (
                                      <span
                                        className="icon icon-linkdin ms-2 c-pointer"
                                        onClick={() => handleWebSiteLinks(item, 'LINKDIN')}
                                      ></span>
                                    )}
                                  </div>
                                  <div className="total-status">
                                    <div className="card-width">
                                      <h5 className="totall-supply mb-0">{`$${item?.totalSupply?.toLocaleString() || '-'
                                        }`}</h5>
                                      <p className="regular-text">Total Supply</p>
                                    </div>
                                  </div>
                                  <div className="total-status">
                                    <div className="card-width">
                                      <h5 className="totall-supply mb-0">
                                        {item.totalRaised?.toLocaleString() ? '$' : ''}
                                        {`${item?.totalRaised?.toLocaleString() || '-'}`}
                                      </h5>
                                      <p className="regular-text">Total Raise</p>
                                    </div>
                                  </div>
                                  <div className="price-section">
                                    <h5 className="blue-text">
                                      {item.tokenVolume} {item.tokenSymbol} = {item.paymentValue?.toLocaleString()}{' '}
                                      {item.paymentSymbol}
                                    </h5>
                                    <p className="regular-text">Price</p>
                                  </div>
                                  <div className="paroject-status">
                                    <div className="d-flex align-center gradient-box">
                                      <div className="open-space">
                                        <p className="note-text">
                                          {item.accessType == 'Private' ? 'Private Opens' : 'Public Opens'}
                                        </p>
                                        <p className="project-date">

                                          <Moment format="DD/MM/YYYY hh:mm UTC" className="project-bal">
                                            {
                                              item.accessType == 'Private'
                                                ? startDate
                                                : item.publicStartDate
                                            }
                                          </Moment>
                                        </p>
                                      </div>
                                      <div className="vr vr-color"></div>
                                      <div>
                                        <p className="note-text">
                                          {item.accessType == 'Private' ? 'Private Closes' : 'Public Closes'}
                                        </p>
                                        <p className="project-date">

                                          <Moment format="DD/MM/YYYY hh:mm UTC" className="project-bal">
                                            {
item.accessType == 'Private'? endDate: item.publicEndDate

                                            }
                                          </Moment>
                                        </p>
                                      </div>
                                    </div>
                                    <div className="project-badge">
                                      <p className="note-text">
                                        {' '}
                                        {item.publicOrPrivateStatus === 'Upcoming' && 'Upcoming'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="detailview-rightpanel"></div>
                              </div>
                            </div>
                          </div>
                        </>
                      ))}
                    </div>}
                  {state.cardDetails?.length == 0 && <>
                    <div className="nodata-text db-no-data">
                      <Image src={nodata} className="text-center" alt=""></Image>
                      <h3 className="text-center nodata">{state.loadeMessage}</h3>
                    </div>
                  </>}
                  <>

                    <div className='text-center'>{loadMore && <Spinner size="sm" className='text-white' />}</div>
                    {(state.cardDetails?.length != 0 && loadData) && <div className='addmore-title' >
                      <>
                        {!hide && (<> <span className='d-block'><span onClick={addProposalList}>See More</span></span>   <span className='icon blue-doublearrow' onClick={addProposalList}></span></>)}
                      </>
                    </div>}
                  </>

                </div>
              </>
            )}
          </div>
        </Tab>

        <Tab eventKey={3} title="Ended IGOs">
          <div className="container">
            <div className="srarch-right">
              <div>
                <h2 className="project-head"></h2>
              </div>

              <div className='custom-flex-launchpad'>
                <Form className="d-flex grid-search">
                  <Form.Control
                    placeholder="Search"
                    className="search-style"
                    aria-label="Search"
                    ref={endedIgosRef}
                    onKeyUp={(e) => handleChange(e)}
                    onKeyDown={(e) => handleEnterSearch(e)}
                  />
                  <i className="icon search-icon" onClick={() => { handleSearch(search) }}></i>
                </Form>
              </div>
            </div>

            {state.loader && (
              <div className="col-md-6 col-sm-12 col-xs-4 col-xl-4">
                <div className="project-detail shimmers-card">
                  <Placeholder animation="glow">
                    <Placeholder xs={12} className="project-img" />
                  </Placeholder>
                  <Placeholder animation="glow" className="px-1">
                    <Placeholder xs={10} className="mt-3" />
                  </Placeholder>
                  <Placeholder animation="glow" className="px-1">
                    <Placeholder xs={3} /> <Placeholder xs={3} /> <Placeholder xs={3} />
                  </Placeholder>
                  <Placeholder animation="glow" className="px-1 my-3">
                    <Placeholder xs={10} className="my-4" />
                  </Placeholder>
                  <Placeholder animation="glow" className="px-1">
                    <Placeholder xs={3} /> <Placeholder xs={3} /> <Placeholder xs={2} className="px-1" />
                    <Placeholder xs={2} />
                  </Placeholder>
                  <Placeholder animation="glow" className="px-1">
                    <Placeholder xs={7} className=" mt-4 mr-5" />
                    <Placeholder xs={5} className=" mt-1 mx-1" />
                  </Placeholder>
                  <Placeholder animation="glow" className="px-1">
                    <Placeholder xs={7} className=" mt-4 mr-5" />
                    <Placeholder xs={5} className=" mt-1 mx-1" />
                  </Placeholder>
                  <Placeholder animation="glow" className="px-1">
                    <Placeholder xs={7} className=" mt-4 mr-5" />
                    <Placeholder xs={5} className=" mt-1 mx-1" />
                  </Placeholder>
                  <div className="gradient-box mt-5">
                    <Placeholder animation="glow" className="px-1">
                      <Placeholder xs={12} className=" mt-4 mr-5" />
                      <Placeholder xs={12} className=" mt-1 mx-1" />
                    </Placeholder>
                  </div>
                </div>
              </div>
            )}
            {!state.loader && (
              <>
                <div>

                  {state.cardDetails?.length != 0 &&
                    <div className="row full-width">
                      {state.cardDetails?.map((item) => (
                        <>
                          <div className="col-md-6 col-sm-12 col-xs-4 col-xl-4 mb-3">
                            <div className="project-detail">
                              <div className="detail-card">
                                <Link
                                  className=""
                                  aria-current="page"
                                  href="#"
                                  onClick={() => projectDetailsNavigate(item)}

                                >
                                  <div className="image-crop">
                                    <img src={item.cardImage} className="project-image" alt="" />

                                  </div>{' '}
                                </Link>
                                <div className="project-content">
                                  <div className="detail-text">
                                    <h3 className="profile-title">{item?.projectName}</h3>
                                    <div className="d-flex">
                                      <div className="tags-bg">
                                        <p className="project-states">
                                          <span className={statusColourList[item?.publicOrPrivateStatus]}></span>{' '}
                                          {item?.publicOrPrivateStatus}
                                        </p>
                                      </div>

                                      <div className="tags-bg">
                                        <p className="project-states">
                                          <span className={`icon sm ${item?.tokenNetworkLogo || 'matic'} `}></span>{' '}
                                          {item?.tokenNetwork ? item?.tokenNetwork : process.env.NEXT_PUBLIC_CURRENCY}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <p className="declaration-text">{item?.description}</p>
                                  <div className="my-3">
                                    {item.facebook && (
                                      <span
                                        className="icon icon-facebook c-pointer"
                                        onClick={() => handleWebSiteLinks(item, 'FACEBOOK')}
                                      ></span>
                                    )}
                                    {item.websiteUrl && (
                                      <span
                                        className="icon icon-network  ms-2 c-pointer"
                                        onClick={() => handleWebSiteLinks(item, 'NETWORK')}
                                      ></span>
                                    )}
                                    {item.twitter && (
                                      <span
                                        className="icon icon-twitter  ms-2 c-pointer"
                                        onClick={() => handleWebSiteLinks(item, 'TW')}
                                      ></span>
                                    )}
                                    {item.instagram && (
                                      <span
                                        className="icon icon-instagram  ms-2 c-pointer"
                                        onClick={() => handleWebSiteLinks(item, 'INSTAGRAM')}
                                      ></span>
                                    )}
                                    {item.linkdin && (
                                      <span
                                        className="icon icon-linkdin ms-2 c-pointer"
                                        onClick={() => handleWebSiteLinks(item, 'LINKDIN')}
                                      ></span>
                                    )}
                                  </div>
                                  <div className="total-status">
                                    <div className="card-width">
                                      <h5 className="totall-supply mb-0">{`$${item?.totalSupply?.toLocaleString() || '-'
                                        }`}</h5>
                                      <p className="regular-text">Total Supply</p>
                                    </div>
                                  </div>
                                  <div className="total-status">
                                    <div className="card-width">
                                      <h5 className="totall-supply mb-0">
                                        {item.totalRaised?.toLocaleString() ? '$' : ''}
                                        {item?.totalRaised?.toLocaleString() || '-'}
                                      </h5>
                                      <p className="regular-text">Total Raise</p>
                                    </div>
                                  </div>
                                  <div className="price-section">
                                    <h5 className="blue-text">
                                      {item?.tokenVolume} {item?.tokenSymbol} = {item?.paymentValue?.toLocaleString()}{' '}
                                      {item?.paymentSymbol}
                                    </h5>
                                    <p className="regular-text">Price</p>
                                  </div>
                                  <div className="paroject-status">
                                    <div className="d-flex align-center gradient-box">
                                      <div className="open-space">
                                        <p className="note-text">
                                          {item?.accessType == 'Private' ? 'Private Opens' : 'Public Opens'}
                                        </p>
                                        <p className="project-date">

                                          <Moment format="DD/MM/YYYY hh:mm UTC" className="project-bal">
                                            {
                                              item?.accessType == 'Private'
                                                ? startDate
                                                : item?.publicStartDate
                                            }
                                          </Moment>
                                        </p>
                                      </div>
                                      <div className="vr vr-color"></div>
                                      <div>
                                        <p className="note-text">
                                          {item?.accessType == 'Private' ? 'Private Closes' : 'Public Closes'}
                                        </p>
                                        <p className="project-date">

                                          <Moment format="DD/MM/YYYY hh:mm UTC" className="project-bal">
                                            {
                                              item?.accessType == 'Private'
                                                ? endDate
                                                : item?.publicEndDate

                                            }
                                          </Moment>
                                        </p>
                                      </div>
                                    </div>
                                    <div className="project-badge">
                                      <p className="note-text">{item?.publicOrPrivateStatus}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="detailview-rightpanel"></div>
                              </div>
                            </div>
                          </div>
                        </>
                      ))}
                    </div>}
                  {state.cardDetails?.length == 0 && <>
                    <div className="nodata-text db-no-data">
                      <Image src={nodata} className="text-center" alt=""></Image>
                      <h3 className="text-center nodata">{state.loadeMessage}</h3>
                    </div>
                  </>}



                  <div className='text-center'>{loadMore && <Spinner size="sm" className='text-white' />}</div>
                  {(state.cardDetails?.length != 0 && loadData) && <div className='addmore-title ' >
                    <>
                      {!hide && (<>  <span className='d-block'><span className='c-pointer' onClick={addProposalList}>See More</span></span> <span className='icon blue-doublearrow c-pointer' onClick={addProposalList}></span></>)}
                    </>
                  </div>}


                </div>
              </>
            )}
          </div>
        </Tab>
      </Tabs>

    </div>
  );
}
