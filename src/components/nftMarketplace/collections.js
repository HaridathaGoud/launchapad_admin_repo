import React, { useEffect, useState,useRef } from "react";
import Image from 'react-bootstrap/Image';
import { connect } from 'react-redux';
import {Spinner,Card} from 'react-bootstrap';
import { getMarketPlaceData } from '../../utils/api';
import nodata from "src/assets/images/no-data.png"
import profileavathar from "../../assets/images/default-avatar.jpg";
import { Link,useNavigate } from "react-router-dom";
import { Button } from "antd";
const Collections = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState([])
    const [loader, setLoader] = useState(false);
    const pageSize = 4;
  const [pageNo, setPageNo] = useState(1);
    const [loadData,setLoadData]=useState()


    const shouldLog = useRef(true);
    useEffect(() => {
      if (shouldLog.current) {
        shouldLog.current = false;
      getCustomerCategory(1, pageSize)}
    }, []);
    const loadMore=()=>{
        getCustomerCategory(pageNo, pageSize);
    }
  
    const getCustomerCategory = async (pageNum, pageListSize) => {
      if (category.length == 0) {
        setLoader(true);
      }
      const skip = pageNum * pageListSize - pageListSize;
      const take = pageListSize;
       await getMarketPlaceData(`GetAllCategories/${take}/${skip}`)
        .then((response) => {
          let _pageNo = pageNum + 1;
          setPageNo(_pageNo);
          let mergeData = pageNum == 1 ? [...response.data] : [...category, ...response.data];
          setCategory(mergeData);
          setLoadData(response.data?.length>=3)
          setLoader(false);
        })
        .catch((error) => {
          setLoader(false);
        });
    };

    return (
    <>
         {loader && <div className="text-center"> <Spinner/></div>}
       {!loader && <div className="dashboard-page">
            <h3 className="page-title"> Categories</h3>
            <div className="collection-bg"> 

            <div className="row sm-justify-content-center">
          <div className="row mt-4">
            <div className="col-md-12">
              <div className="row creator-card create-by-row">
                <div className="text-center">{loader && <Spinner></Spinner>}</div>
                {!loader && (
                  <>
                    {category.length > 0 ?
                     (
                      category?.map((item, idx) => (
                        <div className="col-lg-3 mb-2" key={idx}>
                          <Card className="creator-bg created-card" 
                           onClick={() => navigate(`/marketplace/categoryview/${item.name}`)}
                           > 
                            <Link
                              className="nav-link"
                              href={`/assets/${item.tokenId}/${item.collectionContractAddress}/${item.id}`}
                            >
                              <div className="account-card-img">
                                <Image
                                  width={300}
                                  height={300}
                                  src={item?.image ? item?.image : profileavathar}
                                  alt=""
                                 
                                />
                              </div>
                            </Link>
                            <div className="creator-like">
                              <span
                                className={`icon md creator-icon ${item?.isFavorite ? 'active' : ''}`}
                                onClick={() => saveFavorite(item)}
                              ></span>
                            </div>
                            <Link
                              className="nav-link"
                              href={`/assets/${item?.tokenId}/${item?.collectionContractAddress}/${item?.id}`}
                            >
                              <Card.Body className="pb-0 pe-0 ps-0 pt-0">
                                <div className="card-body">
                                  <Card.Title>
                                    <h4 className="card-title mb-0">
                                      {item?.name}
                                    </h4>
                                  </Card.Title>
                                </div>
                               
                              </Card.Body>
                            </Link>                        
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
                </div>
                {loadData&&
                <div className="category-more">
                  <Button onClick={loadMore} className="c-pointer">See More</Button>
                  <div className="doenarrow-icon">
                    <span className="icon see-more c-pointer" onClick={loadMore}></span>
                  </div>
                </div>}
          </div>
        </div>
            </div>
        </div>}
      
    </>
    )
}

const connectStateToProps = ({walletAddress,oidc }) => {
	return { address: walletAddress,trackAuditLogData: oidc.trackAuditLogData,customerId:oidc?.adminDetails?.id }
  }
export default connect(connectStateToProps)(Collections);
