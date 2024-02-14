import React, { useEffect,useRef, useState } from "react"
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate,useParams } from "react-router-dom";
import { CBreadcrumb, CBreadcrumbItem, CLink, } from '@coreui/react';
import kingscull from '../../assets/images/king-scull.png';
import Image from "react-bootstrap/Image"
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import BiddingDetails from "./biddingdetails";
import { Card,Spinner } from 'react-bootstrap';
import { getMarketPlaceData } from '../../utils/api';
import moment from 'moment';
import { connect,useSelector } from 'react-redux';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import nodata from "src/assets/images/no-data.png"
import CopyToClipboard from 'react-copy-to-clipboard';
import defaultLogo from '../../assets/images/default-avatar.jpg';
const ProfileView = () => {
    let {tokenId, collectionContractAddress,id} = useParams();
    const [errorMsg, setErrorMsg] = useState(null);
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();
    const [favCount, setfavCount] = useState();
    const [nftDetails, setNftDetails] = useState(null);
    const [viewsCount, setviewsCount] = useState();
    const [nftcontractDetails, setNFTContractdetails] = useState({});
    const [nftPropAttributes, setnftAttributes] = useState([]);
    const [bidData,setBidData]=useState([])
    const UserProfile = useSelector(state => state?.profile?.user)
    const [moreCollection, setmoreCollection] = useState([]);
    const [copied,setCopied]=useState(false);
  const [selection, setCopySelections]=useState(null);

    const shouldLog = useRef(true);
    useEffect(() => {
      if (shouldLog.current) {
        shouldLog.current = false;
        if (tokenId && collectionContractAddress && id) {
          loadNftDetails(tokenId,collectionContractAddress,id);
          getNFTContractdetails(tokenId,collectionContractAddress);
          getNFTProperties(tokenId,collectionContractAddress);
        }
      }
        handleScrollToTop()
       
      }, [tokenId, collectionContractAddress, id]);

      const handleScrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth' // You can change this to 'auto' for instant scroll without smooth animation
        });
      };


      const handleSelect=(item)=>{
       navigate(`/marketplace/customers/profileinfo/${item.tokenId}/${item?.collectionContractAddress}/${id}/view`)
       loadNftDetails(item.tokenId,item.collectionContractAddress,id)
       loadFavoritesCount(item.id);
       loadNFTViewsCount(item.id);
       getNFTContractdetails(item.tokenId,item.collectionContractAddress);
        getNFTProperties(tokenId,collectionContractAddress);
       
      }



      const loadNftDetails = async (nftTokenId,nftCollectionContractAddress,nftId) => {
        setLoader(true);
       await getMarketPlaceData(`NFTDetails/${nftTokenId}/${nftCollectionContractAddress}/${nftId}`)
          .then((response) => {
            loadFavoritesCount(response.data.id);
            loadNFTViewsCount(response.data.id);
            getMoreNftsCollection(response.data);
            setNftDetails(response.data);
            getbidData(response.data.id);
            setFav(response.data.isFavorite);
            setLoader(false);
            
          })
          .catch((error) => {
            setLoader(false);
            setErrorMsg(isErrorDispaly(error));
          });
      };

      const loadFavoritesCount = async (userid) => {
        let response = await getMarketPlaceData(`NftFavoritesCount/${userid}`);
        if (response) {
          setfavCount(response.data);
        } else {
          setErrorMsg(isErrorDispaly(response));
        }
      };

      const loadNFTViewsCount = async (userid) => {
        let response = await getMarketPlaceData(`getviewerscount/${userid}`);
        if (response) {
          setviewsCount(response.data);
        } else {
          setErrorMsg(isErrorDispaly(response));
        }
      };

      const getNFTContractdetails = async (nftTokenId,nftCollectionContractAddress) => {
        let response = await getMarketPlaceData(`GetNFTContractDetails/${nftTokenId}/${nftCollectionContractAddress}`);
        if (response) {
          setNFTContractdetails(response.data);
        } else {
          setErrorMsg(isErrorDispaly(response));
        }
      };

      const getNFTProperties = async (nftTokenId,nftCollectionContractAddress) => {
        let response = await getMarketPlaceData(`NFTProperties/${nftTokenId}/${nftCollectionContractAddress}`);
        if (response) {
          setnftAttributes(JSON.parse(response.data?.attributes));
        } else {
          setErrorMsg(isErrorDispaly(response));
        }
      };

      const getbidData = async (nftBidId) => {
        let response = await getMarketPlaceData(`biddata/${nftBidId}/${10}/${0}`);
        if (response) {
          setBidData(response.data);
        } else {
          setErrorMsg(isErrorDispaly(response));
        }
      };

      const getDate = (date) => {
        let dateIn = moment(date, 'YYYY/MM/DD');
        return dateIn.format('DD/MM/YYYY');
      };

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
    }
   
   
     
      const getNFTImageUrl = (file) => {
        const filePath = file?.replace('ipfs://', '');
        return `https://ipfs.io/ipfs/${filePath}`;

      };
      const goToAccount = (item, type) => {
        if (type == 'creator') {
          navigate(`/marketplace/${type}/profile/${item?.creatorWalletAddress || address}`);
        } else if (type == 'currentOwner') {
          navigate(`/marketplace/${type}/profile/${item?.ownerAddress || address}`);
        }
      };

      const getMoreNftsCollection = async (data) => {
        let morenftRes = await getMarketPlaceData(`GetMoreNftsByCollection/${data.collectionId}/${data.creatorId}/${tokenId}`);
        if (morenftRes) {
          setmoreCollection(morenftRes.data);
        } else {
          setErrorMsg(isErrorDispaly(morenftRes));
        }
      };
      const responsive = {
        superLargeDesktop: {
          breakpoint: { max: 4000, min: 3000 },
          items: 5,
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 4,
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2,
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1,
        },
      };
      const handleCopy = (dataItem) => {
        setCopied(true)
        setCopySelections(dataItem)
        setTimeout(() => setCopied(false), 1000)
    }
   
    return (
        <div className="profile-aontainer">
            {errorMsg && (
        <Alert variant="danger">
          <div className='d-flex align-items-center'>
            <span className='icon error-alert'></span>
            <p className='m1-2' style={{ color: 'red' }}>{errorMsg}</p>
          </div>
        </Alert>
      )}
            <CBreadcrumb>
          <CBreadcrumbItem>
            <CLink href="#" onClick={() => navigate('/marketplace/customers')}>Customers</CLink>
          </CBreadcrumbItem>
          <CBreadcrumbItem active className="c-pointer"
           onClick={() => navigate(`/marketplace/customers/profileInfo/Nft/${UserProfile?.walletAddress}`)}
           >Nft
          </CBreadcrumbItem>
          <CBreadcrumbItem active>{`#${tokenId}`}</CBreadcrumbItem>
        </CBreadcrumb>
        <div className="text-center">{loader && <Spinner></Spinner>}</div>
        {!loader &&<>
   <section className="mt-5">
              <Row>
                <Col lg={6} sm={12}>
                  <div className="detail-image-card">
                    <div className="detail-icons d-flex">
                      <div>
                        <span className="icon polygon"></span>
                      </div>
                            </div>
                            <div className="card-fixes detail-card-fixes">                            
                  <Image
                    src={
                      nftDetails?.image && !nftDetails?.image?.includes('null')
                        ? `${getNFTImageUrl(nftDetails?.image)}`
                        : kingscull
                    }
                    alt=""
                    className={`${nftDetails?.isUnlockPurchased && (!nftDetails?.creatorWalletAddress)
                        ? 'detail-image blur-image'
                        : 'detail-image'
                      }`}
                    width="100"
                    height="100"
                  />
                            </div>

                  </div>
                </Col>
                <Col lg={6} sm={12}>
                  <div className="detail-text-card">
                    <div className="">
                      <div className="d-flex justify-content-between align-items-baseline mb-3">
                        <h1 className="detail-title">
                          {nftDetails?.name} 
                        </h1>
                      </div>
                      <div className="nft-details d-flex">
                        <div>
                          <label className="detail-label">Creator</label>
                          <div
                            onClick={() => goToAccount(nftDetails, 'creator')}
                            className="detail-creator-title c-pointer"
                          >
                            {nftDetails?.creatorName ||
                              (nftDetails?.creatorWalletAddress
                                ? nftDetails?.creatorWalletAddress?.slice(0, 4) +
                                  '....' +
                                  nftDetails?.creatorWalletAddress?.substring(
                                    nftDetails?.creatorWalletAddress?.length - 4,
                                  )
                                : 'Un named')}
                          </div>
                        </div>
                        <div>
                          <label className="detail-label">Current Owner</label>
                          <div
                            onClick={() => goToAccount(nftDetails, 'currentOwner')}
                            className="detail-creator-title c-pointer"
                          >
                            {nftDetails?.ownerName ||
                              (nftDetails?.ownerAddress
                                ? nftDetails?.ownerAddress?.slice(0, 4) +
                                  '....' +
                                  nftDetails?.ownerAddress?.substring(nftDetails?.ownerAddress?.length - 4)
                                : 'Un named')}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="details-favour d-flex flex-wrap">
                     <div>
                     <span className="icon eye ml-2"> </span>
                      <span className="detail-view-label">{viewsCount} views</span>
                     </div>
                     <div>
                     <span className="icon love-border"></span>
                      <span className="detail-view-label">{favCount} favorites</span>
                     </div>
                    
                    </div>
                    <hr className="detail-border" />
                    {nftDetails?.price && (
                      <div>
                        <h3 className="price-title">Current Price</h3>
                        <h1 className="detail-value">
                          {nftDetails?.price} {nftDetails?.currency?.toUpperCase()}
                        </h1>
                      </div>
                    )}
                  </div>
                </Col>
              
              </Row>
            </section>
        
             <section>
              <Row className="tab-section">
                <Col lg={6} sm={12}>
                  <div className="creator-tabs">
                    <Tabs className="tab-border mb-3 mt-3 sub-tabs nav nav-tabs" defaultActiveKey="first">
                      <Tab eventKey="first" title="Overview">
                        <div>
                          <h3 >
                            By{' '}
                            <span >
                              {nftDetails?.creatorName ||
                                nftDetails?.creatorWalletAddress?.slice(0, 4) +
                                  '....' +
                                  nftDetails?.creatorWalletAddress?.substring(
                                    nftDetails?.creatorWalletAddress?.length - 4,
                                    nftDetails?.creatorWalletAddress?.length,
                                  )}
                              <span className="copy-space ms-1">
                                {!nftDetails?.creatorName && nftDetails?.creatorWalletAddress && (
                                  <span
                                    className={`${
                                      'icon md copy c-pointer ms-0'
                                    }`}
                                    onClick={() => handleCopy(nftDetails?.creatorWalletAddress)}
                                  />
                                )}
                              </span>
                            </span>
                          </h3>
                          {nftDetails?.description && (
                            <>
                              <h3 className="overview-title">Description</h3>
                              <p className="overview-text">{nftDetails?.description}</p>
                            </>
                          )}
                        </div>
                      </Tab>
                      <Tab eventKey="second" title=" Details">
                        <div>
                          <Row className="mt-5">
                            
                            <Col lg={4}>
                              <label className="address-label">Token ID</label>
                              <h4 className="overview-value mt-2">{nftcontractDetails?.tokenId}</h4>
                            </Col>
                            <Col lg={4}>
                              <label className="address-label">Token Standard</label>
                              <h4 className="overview-value mt-2">{nftcontractDetails?.tokenStandard}</h4>
                            </Col>
                            <Col lg={4}>
                              <label className="address-label">Chain</label>
                              <h4 className="overview-value mt-2">{nftcontractDetails?.blockChain||"Polygon"}</h4>
                            </Col>
                          </Row>
                          <Row className="mt-3 update-address">
                            
                            <Col lg={4}>
                              <label className="address-label">Last Updated</label>
                              <h4 className="overview-value mt-2">{getDate(nftcontractDetails?.date)}</h4>
                            </Col>
                            <Col lg={4}>
                              <label className="address-label">Creator Earnings</label>
                              <h4 className="overview-value mt-2">{0}%</h4>
                            </Col>
                            <Col lg={12}>
                              <label className="address-label">Contract Address</label>
                              {nftcontractDetails?.contractAddress != null && (
                                <h4 className="overview-value mt-2">
                                  {nftcontractDetails?.contractAddress?.slice(0, 4) +
                                    '....' +
                                    nftcontractDetails?.contractAddress?.substring(
                                      nftcontractDetails?.contractAddress.length - 4,
                                      nftcontractDetails?.contractAddress.length,
                                    )}{' '}
                                  <span className="copy-space">
                                    {nftcontractDetails?.contractAddress && (
                                      <CopyToClipboard
                                      text={collectionContractAddress}
                                      options={{ format: 'text/plain' }}
                                      onCopy={() => handleCopy(collectionContractAddress)}
                                    >
                                      <span className={(copied && selection === collectionContractAddress) ? "icon copied-check ms-2" : "icon md copy c-pointer ms-0"}></span>
                                    </CopyToClipboard>
                                    )}
                                  </span>
                                </h4>
                              )}
                              <div className="d-flex align-items-center">
                              {nftcontractDetails?.contractAddress == null && (
                                <h4 className="overview-value mt-2 mb-0 contact">
                                  {collectionContractAddress}{' '}
                                  <CopyToClipboard
                                    text={collectionContractAddress}
                                    options={{ format: 'text/plain' }}
                                    onCopy={() => handleCopy(collectionContractAddress)}
                                  >
                                    <span className={(copied && selection === collectionContractAddress) ? "icon copied-check ms-2" : "icon md copy c-pointer ms-0"}></span>
                                  </CopyToClipboard>
                                </h4>
                              )}
                              {collectionContractAddress && nftcontractDetails?.contractAddress == null && (
                                      <CopyToClipboard
                                      text={collectionContractAddress}
                                      options={{ format: 'text/plain' }}
                                      onCopy={() => handleCopy(collectionContractAddress)}
                                    >
                                      <span className={(copied && selection === collectionContractAddress) ? "copied-check ms-2" : "md copy c-pointer ms-0"}></span>
                                    </CopyToClipboard>
                                    )}
                                    </div>
                            </Col>
                        <Col lg={12} className="my-4">
                          <label className="address-label">Description</label>
                          <h4 className="overview-value mt-2">{nftcontractDetails?.description}</h4>
                        </Col>
                        {nftcontractDetails?.externalLink!=null&&
                        <Col lg={12}>
                            <label className="address-label">External Link</label>
                            {nftcontractDetails?.externalLink ? <h4
                              className="overview-value mt-2 text-blue c-pointer text-green"
                              onClick={() => window.open(nftcontractDetails?.externalLink, '_blank')}
                            >
                              {(nftcontractDetails?.externalLink)}
                            </h4> : <h4
                              className="overview-value mt-2 "
                            >
                              {"-"}
                            </h4>}
                          
                        </Col>}
                       
                          </Row>
                        </div>
                      </Tab>
                    </Tabs>
                  </div>
                </Col>
                <Col lg={6} sm={12} className="ps-2">
                  <div className="ps-lg-4">
                    {nftPropAttributes.length > 0 && (
                      <h3 className="property-title overview-space text-lg-start">Properties</h3>
                    )}
                    <Row>
                      {nftPropAttributes?.map((attr) => (
                        <Col lg={4} md={4} sm={6} xs={6}>
                          <div className="property-card mb-3 d-flex align-items-center justify-content-center">
                            <div className="text-overflow-ellipse">
                              <span className="overview-title-color detail-card-label text-overflow-ellipse">
                                {attr.Avathar || attr.trait_type}
                              </span>
                              <span className="detail-card-label text-overflow-ellipse">{attr.value}</span>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </Col>
              </Row>
            </section>
           <div className="mt-4">
           <h2 className="section-title mt-5 mb-3">Bidding Details</h2>
           <BiddingDetails  bidData={bidData}></BiddingDetails>
           </div>


           <section className="my-5 detail-corousel detail-page">
              <h2 className="section-title mt-5 mb-3">More from this collection</h2>
              <div className="corousel">
                <Carousel autoPlaySpeed={1000} infinite responsive={responsive} className="corousel-arrows">
                  {moreCollection?.map((item) => (
                    <div className="creator-card">
                        <Card className="creator-bg c-pointer" 
                     onClick={()=>handleSelect(item)}
                      >
                        <div >
                          <div className="account-card-img">
                            {' '}
                            <Image
                             src={
                              item?.image && !item?.image?.includes('null')
                                ? `${getNFTImageUrl(item?.image)}`
                                : defaultLogo
                            }
                              width={200}
                              height={200}
                              alt=""
                              style={{ cursor: 'pointer' }}

                            />
                          </div>
                        </div>
                        <div className="creator-like">
                          <span
                            className={`icon md creator-icon ${item?.isFavourite ? 'active' : ''}`}
                            onClick={() => saveFavorite(item)}
                          ></span>
                        </div>
                        <div>
                          <div className="card-body card-bg-body">
                            {item.creator && <label className="card-text">{item.creator}</label>}
                            <Card.Title className="card-title text-white">
                              {item.name} 
                            </Card.Title>
                          </div>
                          <div className="card-footer explore-footer">
                            <div className="footer-price">
                              <label className="card-text">Price</label>
                              <h5 className="cardfooter-ellipse text-white">
                              {item.price ? item.price : "-"} {item.price ? item.currency  : ""}
                              </h5>
                            </div>
                            <div className="footer-price">
                              <label className="card-text">Highest bid</label>
                              <h5 className="cardfooter-ellipse text-white">
                              {item.highestBid ? item.highestBid : "-"} {item.highestBid ? item.currency  : ""}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </Carousel>
              </div>
              {moreCollection.length == 0 && (
                <>
                  <div className="nodata-text db-no-data">
                    <Image src={nodata} alt=""></Image>
                    <h3 className="text-center nodata">No data found</h3>
                  </div>
                </>
              )}
            </section>
            </>}
        </div>
    )
}
const connectStateToProps = ({walletAddress,oidc }) => {
	return { address: walletAddress,trackAuditLogData: oidc.trackAuditLogData,customerId:oidc?.adminDetails?.id }
  }
export default connect(connectStateToProps)(ProfileView);
