import React,{ useEffect, useState,useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from 'react-bootstrap/Spinner';
import { Card } from 'react-bootstrap';
import Image from "react-bootstrap/Image"
import { getMarketPlaceData,post  } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import nodata from "src/assets/images/no-data.png"
import defaultLogo from '../../assets/images/default-avatar.jpg';
import Alert from 'react-bootstrap/Alert';
import apiCalls from 'src/api/apiCalls';

const owned = (props) => {
  const [ownedNftCollection, setOwnedNftCollection] = useState([]);
  const [errorMsg, setErrorMsg] = useState(false);
  const pageSize = 10;
  const [pageNo, setPageNo] = useState(1);
  const [search, setSearch] = useState(null);
  const [type, setType] = useState();
  const [loader, setLoader] = useState(false);
  const [nftSearch,NftSearch]=useState(null)
  const navigate = useNavigate();
  const shouldLog = useRef(true);

  useEffect(() => {
    if (shouldLog.current) {
      shouldLog.current = false;
      getOwnedNfts(1, 10, type, null);
  }
  }, []);

  const fetchMoreData = () => {
    getOwnedNfts(pageNo, pageSize, type, search);
  };

  const getOwnedNfts = async (pageNum, pageListSize, nftType, searchBy) => {
    if (ownedNftCollection?.length == 0) {
      setLoader(true);
    }
    const skip = pageNum * pageListSize - pageListSize;
    const take = pageListSize;
    await getMarketPlaceData(`GetOwnNfts/${props?.walletAddress}/${take}/${skip}/${nftType}/${searchBy}`)
      .then((response) => {
        let _pageNo = pageNum + 1;
        setPageNo(_pageNo);
        setType(nftType);
        setSearch(search);
        let mergeData = pageNum == 1 ? [...response.data] : [...ownedNftCollection, ...response.data];
        setOwnedNftCollection(mergeData);
        setLoader(false);
      })
      .catch((error) => {
        setErrorMsg(apiCalls.isErrorDispaly(error));
        setLoader(false);
      });
  };


  const handleChange = ({ currentTarget: { value } }) => {
    let data= value.trim()
    NftSearch(data)
    if (!data) {
      getOwnedNfts(1, 10,null,null)
      NftSearch(null)
    }
  };
  const handleEnterSearch =  (e) => {	
		let data=e.target.value.trim();
			if (e.key == 'Enter') {
				if(data == ""){		
          getOwnedNfts(1, 10, null, null);		
				e.preventDefault();
				}else{
          getOwnedNfts(1, 10, null, nftSearch);
					e.preventDefault();
			   }	
			}
	}

  const handleSearch=()=>{
    getOwnedNfts(1, 10, null, nftSearch);
  }
  const saveFavorite = async (item) => {
    let obj = {
      nftId: item?.id,
      customerId: props.auth.user?.id,
      isFavourite: item?.isFavorite ? false : true,
    };
    await post(`User/SaveFavorite`, obj)
      .then((response) => {
        getOwnedNfts(1, 10, type, null);
      })
      .catch((error) => {
        setErrorMsg(apiCalls.isErrorDispaly(error));
      });
  };
  const handlePriceRangeSelection = (e) => {
    const query = e;
    if (query === 'high2low') {
      getOwnedNfts(1, 10, 'high to low', null);
    } else if (query === 'low2high') {
      getOwnedNfts(1, 10, 'low to high', null);
    }
  };

  const handleSelect=(item)=>{
   navigate(`/marketplace/customers/profileinfo/${item?.tokenId}/${item?.collectionContractAddress}/${props?.userDetails?.id}/view`)
  }
  const clearErrorMsg=()=>{
    setErrorMsg(null); 
  }
  return (
    <>
      {errorMsg && (
        <Alert variant="danger">
        <div className='d-flex gap-4'>
         <div className='d-flex gap-2 flex-1'>
         <span className='icon error-alert'></span>
         <p className='m1-2' style={{ color: 'red' }}>{errorMsg}</p>
         </div>
         <span className='icon close-red' onClick={clearErrorMsg}></span>
        </div>
      </Alert>
      )}

      <div className="items-tab">
        <div className=" align-items-center mobile-hide accounts-tabs">
         
          <div className="d-flex justify-content-between w-search d-sm-bloc">
            <div className="">
            <Form className="d-flex grid-search">
            <Form.Control
                          
                          placeholder="Search"
                          className=" search-style mb-3 my-lg-0"
                          aria-label="Search"
                          onKeyUp={(e) => handleChange(e)}
                          onKeyDown ={(e)=>handleEnterSearch(e)}
                        />
                        <i className="icon search-icon" onClick={handleSearch}></i>
              </Form>
            </div>
            <div className="cust-dropdown me-0">
              <Dropdown onSelect={handlePriceRangeSelection}>
                <Dropdown.Toggle variant="success" id="dropdown-basic" placeholder="Price: low to high">
                <span className="icon md filter-icon" /> Price: {type}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="high2low" className={type=='high to low' ? 'active' : ''}> Price: high to low</Dropdown.Item>
                  <Dropdown.Item eventKey="low2high" className={type=='low to high' ? 'active' : ''}>Price: low to high</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        <InfiniteScroll
        className='infinite-scroll-none'
          dataLength={ownedNftCollection?.length}
          next={fetchMoreData}
          hasMore={ownedNftCollection?.length < 100}
          loader={<h4 className="text-center"></h4>}
          scrollThreshold="0.8"
        >
          <div className="row mt-4">
            <div className="col-md-12">
              <div className="row creator-card create-by-row">
                <div className="text-center">{loader && <Spinner></Spinner>}</div>
                {!loader && (
                  <> 
                  {ownedNftCollection?.length > 0 ? (
                    ownedNftCollection?.map((item, idx) => (
                   
                    <div className="col-md-6 col-lg-3 col-xl-3 mt-3" >
                      <Card className="creator-bg c-pointer" 
                     onClick={()=>handleSelect(item)}
                      >
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
                          <div className="card-body card-bg-body pb-0">
                            {item.creator && <label className="card-text">{item.creator}</label>}
                            <Card.Title className="card-title text-white mt-1">
                              {item.name} 
                            </Card.Title>
                          </div>
                          <div className="card-footer explore-footer">
                            <div className="footer-price">
                              <label className="card-text">Price</label>
                              <h5 className="cardfooter-ellipse text-white">
                              {(item.price!=null && item.price!="0")?<>{item.price} {item.crypto}</>:"-"}
                                
                              </h5>
                            </div>
                            <div className="footer-price">
                              <label className="card-text">Highest bid</label>
                              <h5 className="cardfooter-ellipse text-white">
                              {(item.biddingAmount!=null && item.biddingAmount!="0")?<>{item.biddingAmount} {item.crypto}</>:"-"}
                                
                              </h5>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div> )) ) : (
                      <div className="nodata-text db-no-data">
                        <Image src={nodata} alt=""></Image>
                        <h3 className="text-center nodata">No data found</h3>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </InfiniteScroll>
      </div>
    </>
  )
}

export default owned
