import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import apiCalls from 'src/api/apiCalls';
import Moment from "react-moment";
import moment from 'moment';
import nodata from "src/assets/images/no-data.png"
import Image from "react-bootstrap/Image";
import CopyToClipboard from 'react-copy-to-clipboard';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/esm/Spinner';


function Referrals(props) {
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 10;
  const [refferalData,setRefferalData] = useState({})
  const [selection, setCopySelections]=useState(null);
  const [copied,setCopied]=useState(false);
  const [referralCopied, setreferralCopied]=useState(false)
  const [walletId,setWalletId] = useState({})
  const [errorMsg, setErrorMsg] = useState(null);
  const [loadData, setLoadData] = useState()
  const [loader, setLoader] = useState(false);

  useEffect(()=>{
    if(props?.userDetails?.id){
      RefferalData(1,10)
    }   
  },[])

  const RefferalData = async (pageNo ,pageSize) => {
    setErrorMsg(null)
    setLoader(true)
    const skip = pageNo * pageSize - pageSize;
    const take = pageSize;
   let response =  await apiCalls.getRefferalData(props?.userDetails?.id,take,skip);
      if(response.ok) {
        setLoader(false)
        let _pageNo = pageNo + 1;
        setPageNo(_pageNo);
        let mergeData = pageNo == 1 ? [...response.data] : [...refferalData, ...response.data];
        setRefferalData(mergeData)
        setLoadData(response.data?.length>=10)
        
      }else{
        setErrorMsg(apiCalls.isErrorDispaly(response.data));
        setLoader(false)
      }
  };

  const handleCopy = (dataItem) => {
    setreferralCopied(false)
    setCopied(true)
    setCopySelections(dataItem)
    setTimeout(() => setCopied(false), 1000)
}
const handleAddressCopy = (item) => {
  setCopied(false)
  setreferralCopied(true)
  setWalletId(item?.walletAddress)
  setTimeout(() => setreferralCopied(false), 1000)
}
const loadMore=()=>{
  RefferalData(pageNo, pageSize);
} 
  return (
    <>
   
    <div className='Personal-Details border-0'>  
     <div className='mt-2 mb-2'>
     {errorMsg && (
        <Alert variant="danger">
          <p style={{ color: 'red', margin: 10 }}>{errorMsg}</p>
        </Alert>
      )}
     <span className='profile-label '>My Referral Code :  </span>
     <span className='profile-value'>{props?.userDetails?.customerReferralCode || "--"}</span>
     {props?.userDetails?.customerReferralCode && (
      <CopyToClipboard 
                      text={props?.userDetails?.customerReferralCode} 
                      options={{ format: 'text/plain' }}
						        	onCopy={() => handleCopy(props?.userDetails?.customerReferralCode)}
              >
							<span className={(copied && selection === props?.userDetails?.customerReferralCode) ? "icon copied-check ms-2" : "icon copy c-pointer"}></span>
						</CopyToClipboard>
       )}
     </div>
     <h1 className='main-title mb-3'>Referral’s</h1>
    </div>
    {refferalData?.length > 0 ?
      <div className='sm-auto'>
      {refferalData?.map((item)=>(
        <div>
          <div className='whitelist-rowcard mb-3'>
            <div className='flex-width text-start'>
              <p className='label-type'>Date</p>
              <p className='label-value'>
              <Moment format='DD/MM/YYYY'>{moment(new Date(item?.date),'DD/MM/YYYY')}</Moment>
              </p>

            </div>
            <div className='flex-width'>
              <p className='label-type'>Name</p>
              <p className='label-value'>{item?.name || "--"}</p>
            </div>
            <div className='flex-width'>
              <p className='label-type'>Wallet Address</p>
              <div className='label-value wallet-address d-flex '>{item?.walletAddress || "--"} 
              <CopyToClipboard text={item?.walletAddress} options={{ format: 'text/plain' }}
                    onCopy={() => handleAddressCopy(item)}>
                    <span className={(referralCopied && item?.walletAddress === walletId) ? "icon copied-check ms-2" : "icon copy c-pointer"} />
                  </CopyToClipboard>
              </div>
            </div>
            <div className='flex-width'>
              <p className='label-type'>Is Membership</p>
              <p className='label-value'>{item?.isMemberShip || "--"}</p>
            </div>
          </div>
        </div> ))}
          {loadData && (
            <div className="category-more">
              <p onClick={loadMore} className="mb-0">
               {loader && <div className='text-center'><Spinner size="sm" className='spinner-color' /></div>} <p className="mb-0 addmore-title"><span className='c-pointer'>See More</span></p></p>
              <div className="doenarrow-icon text-center">
                <span className="icon-dao double-arrowblue c-pointer" onClick={loadMore}></span>
              </div>
            </div>)}
      </div> : 
      <div className="nodata-text db-no-data">
                <Image src={nodata} className="text-center mt-4" alt=""></Image>
                <h3 className="text-center nodata">No data found</h3>
              </div>
    }

    </>
  );
}

const connectStateToProps = ({oidc }) => {
	return { user:oidc?.custUser,daoData: oidc.defaultData?.id }
  }
  export default connect(connectStateToProps)(Referrals);

