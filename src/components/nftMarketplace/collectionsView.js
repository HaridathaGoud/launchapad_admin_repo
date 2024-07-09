import React, { useEffect, useState,useRef } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { CBreadcrumb, CBreadcrumbItem, CLink } from '@coreui/react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import nodata from 'src/assets/images/no-data.png';
import InfiniteScroll from 'react-infinite-scroll-component';
import Image from 'react-bootstrap/Image';
import {getMarketPlaceData } from '../../utils/api';
import Spinner from 'react-bootstrap/Spinner';
import { connect, useSelector } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import defaultLogo from '../../assets/images/default-avatar.jpg';


const CollectionsView = (props) => {
  let { collectionId, category } = useParams();
  const navigate = useNavigate();
  const pageSize = 10;
  const [pageNo, setPageNo] = useState(1);
  const [loader, setLoader] = useState(false);
  const UserProfile = useSelector(state => state?.oidc?.custUser)
  const [errorMessage, setErrorMessage] = useState(null);
  const [nftDatafilter, setNftDatafilter] = useState([]);
  const [nftSearch,NftSearch]=useState(null)
  const shouldLog = useRef(true);
  useEffect(() => {
    if (shouldLog.current) {
      shouldLog.current = false;
      getExploreNftsDetails(1, 10, category?.toLowerCase());}
  }, [collectionId, props?.activeTab]);

  const fetchMoreData = () => {
    getExploreNftsDetails(pageNo, pageSize, category?.toLowerCase());
  };

  const getExploreNftsDetails = async (pageNum, pageListSize, value) => {
    if (nftDatafilter?.length == 0) {
      setLoader(true);
    }
    setErrorMessage(null);
    if (value?.includes('domain')) {
      category = 'domain names';
    }else{
      category=value
    }
    const skip = pageNum * pageListSize - pageListSize;
    const take = pageListSize;
    await getMarketPlaceData(`ExploreNfts/${take}/${skip}/${category?.toLowerCase()}/${UserProfile.id}`)
      .then((response) => {
        let _pageNo = pageNum + 1;
        setPageNo(_pageNo);
        let mergeData = pageNum == 1 ? [...response.data] : [...nftDatafilter, ...response.data];
        setNftDatafilter(mergeData);
        setLoader(false);
        setErrorMessage(null);
      })
      .catch((error) => {
        setErrorMessage(isErrorDispaly(error));
        setLoader(false);
      });
  };

  const handleChange = ({ currentTarget: { value } }) => {
    if (value) {
      NftSearch(value)
    } else {
      getExploreNftsDetails(1, 10, category?.toLowerCase());
    }
  };
  const handleEnterSearch =  (e) => {
		let data=e.target.value.trim();
			if (e.key == 'Enter') {
				if(data == ""){
          getExploreNftsDetails(1, 10, category?.toLowerCase());
				e.preventDefault();
				}else{
          getExploreNftsDetails(1, 10, nftSearch);
					e.preventDefault();
			   }
			}
	}
  const handleSearch=(e)=>{
    e.preventDefault()
    if(nftSearch==null){
      getExploreNftsDetails(1, 10, category);
    }else{
      getExploreNftsDetails(1, 10, nftSearch);
    }

  }


  return (
    <>
      <CBreadcrumb>
        <CBreadcrumbItem>
          <CLink href="#" onClick={() => navigate('/marketplace/customers')}>Customers</CLink>
        </CBreadcrumbItem>
        <CBreadcrumbItem>
          <CLink href="#" onClick={() => navigate('/marketplace/collections')}>Category</CLink>
        </CBreadcrumbItem>
        <CBreadcrumbItem active>Explore NFTs</CBreadcrumbItem>
      </CBreadcrumb>
      <h2 className="explore-title mt-5 mb-5 px-3">Explore NFTs</h2>
      <div className="dashboard-page">
            <div className="d-flex">
        <div className="p-relative">
        <Form className="d-flex nav-search position-relative">
                <Form.Control
                  placeholder="Search"
                  className="me-2 header-search search-width"
                  aria-label="Search"
                  onChange={(e) => handleChange(e)}
                  onKeyDown ={(e)=>handleEnterSearch(e)}
                />
                <span className="icon search"  onClick={(e)=>handleSearch(e)}></span>
              </Form>

        </div>
        {errorMessage && (
            <Alert variant="danger">
              <div className='d-flex align-items-center'>
                <span className='icon error-alert'></span>
                <p className='m1-2' style={{ color: 'red' }}>{errorMessage}</p>
              </div>
            </Alert>
        )}
        <div></div>
        </div>
        <InfiniteScroll
        className="explore-nfts"
          dataLength={nftDatafilter?.length}
          next={fetchMoreData}
          hasMore={nftDatafilter?.length < 100}
          loader={<h4 className="text-center"></h4>}
          scrollThreshold="0.8"
        >
          <div className="row creator-card create-by-row explorenft-card">
            <div className="text-center">{loader && <Spinner></Spinner>}</div>
            {!loader && (
              <>
                {nftDatafilter?.length > 0 ? (
                  nftDatafilter?.map((item, idx) => (
                    <div className="col-md-6 col-lg-3 space-x mt-3" key={idx}>
                      <Card className="creator-bg c-pointer"   onClick={() => navigate(`/marketplace/customers/profileinfo/${item.tokenId}/${item?.collectionContractAddress}/${UserProfile.id}/view`)}>
                        <div >
                          <div className="account-card-img">
                            {' '}
                            <Image
                              src={
                                item?.image && !item?.image?.includes('null')
                                  ? item.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
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
                            <label className="card-text">{item.creator}</label>
                            <Card.Title className="card-title">
                              {item.name}
                            </Card.Title>
                          </div>
                          <div className="card-footer explore-footer">
                            <div className="footer-price">
                              <label className="card-text">Price</label>
                              <h5 className="cardfooter-ellipse">
                                {item.price!=null?<>{item.price} {item.currency}</>:"--"}
                              </h5>
                            </div>
                            <div className="footer-price">
                              <label className="card-text">Highest bid</label>
                              <h5 className="cardfooter-ellipse">
                              {item.highestBid!=null?<>{item.highestBid} {item.currency}</>:"--"}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))
                ) : (
                  <div className="nodata-text db-no-data">
                    <Image src={nodata} alt=""></Image>
                    <h3 className="text-center nodata">No data found</h3>
                  </div>
                )}
              </>
            )}
          </div>
        </InfiniteScroll>

      </div>

    </>
  )
}

const connectStateToProps = ({walletAddress,oidc }) => {
	return { address: walletAddress,trackAuditLogData: oidc.trackAuditLogData,customerId:oidc?.adminDetails?.id }
  }
export default connect(connectStateToProps)(CollectionsView);
