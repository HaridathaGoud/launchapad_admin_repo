import React,{useState,useEffect} from 'react';
import walletimg from '../../assets/images/wallet-img.svg'
import { proposalVotersData } from '../proposalReducer/proposalReducer';
import { connect,useSelector } from "react-redux";
import apiCalls from "../../api/apiCalls";
import InfiniteScroll from 'react-infinite-scroll-component';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useParams } from "react-router-dom";
import nodata from '../../assets/images/no-data.png';
import { Placeholder } from 'react-bootstrap';
 function Voters(props) {
  const [pageNo, setPageNo] = useState(1);
  const [copied,setCopied]=useState(false);
  const [selection, setCopySelections]=useState(null);
  const params = useParams()
  const pageSize = 10;
  const proposarDetailas = useSelector((state) => state?.proposal?.fetchVotersData);
  const [loading,setloading] = useState(true);
  useEffect(()=>{
    Load()
    window.scroll(0, 0);
    props.proposalVotersDetails(pageNo,pageSize,params.id,(callback)=>{
 if(callback){
  setErrorMsg(apiCalls.isErrorDispaly(callback))
   window.scroll(0, 0);
 }else{
  setErrorMsg(null)
 }
    })
    let _pageNo = pageNo + 1;
    setPageNo(_pageNo);
  },[]);

  const Load = async ()=>{
    if(proposarDetailas){
      await new Promise((resolve) => setTimeout(resolve, 1000)); 
      setloading(false)
    }   
  }

 const fetchMoreData=()=>{
  let _pageNo = pageNo + 1;
  setPageNo(_pageNo);
  props.proposalVotersDetails(pageNo,pageSize,params.id);
 }
 const handleCopy = (dataItem) => {
  setCopied(true)
  setCopySelections(dataItem)
  setTimeout(() => setCopied(false), 1000)
}
    return (
        <>
        
        <div className='mt-4 mb-2'>
        <span className='resource-title'>Voters</span><span className='common-text votes yellow-text ms-2'>({proposarDetailas?.length} voters)</span>
        </div>
        <div>
        {loading ?
        <Placeholder xs={12} animation="glow">
          <Placeholder xs={1} className='me-3 shimmer-icon' />
          <Placeholder xs={5} />&emsp;
          <Placeholder xs={5} />
        </Placeholder> :
        <div>
              <InfiniteScroll
        dataLength={proposarDetailas?.length}
        next={fetchMoreData}
        hasMore={true}
      >
           <div className='status-section test-dao bg-transparent px-0 mb-5 p-0'>
            <table className='voters-table'width='100%'>
              <thead>
                <tr>
                <th>wallet address</th>
                <th style={{width:'350px'}}>Vote Option</th></tr>
              </thead>
              <tbody>
               {proposarDetailas?.map((item)=>{
                return<tr>
                  <td className='copy-width' >
                  <div className="d-flex" >
                  {/* <div> */}
                   <img src={walletimg} className='me-3' />
                    <span className='vote-subtitle votes'>{item?.walletAddress}</span>
                    {/* </div> */}
                    <CopyToClipboard 
                      text={item?.walletAddress} 
                      options={{ format: 'text/plain' }}
						        	onCopy={() => handleCopy(item?.walletAddress)}
              >
							<span className={(copied && selection === item?.walletAddress) ? "icon-dao copy-check c-pointer ms-2" : "icon copy c-pointer ms-2 "}></span>
						</CopyToClipboard>
            </div>
                  </td>
                 
                  <td className='resource-title votes text-start'>{item?.options}</td>                  
                </tr>
               }) }
               <tr>{proposarDetailas?.length===0 && <td colSpan={2} className='ps-0'><div className='text-center'><img src={nodata} width={95} alt=""/><h4 className="text-center no-data-text">No data found</h4></div></td>}</tr>
               
              </tbody>
            </table>
             </div>
             </InfiniteScroll>
             </div>}
             </div>
        </>
    );
}
const connectDispatchToProps = (dispatch) => {
  return {
     proposalVotersDetails: (pageNo, pageSize,id,callback) => {
      dispatch(proposalVotersData(pageNo, pageSize,id,callback));
    },
  }
}
 export default connect(null,connectDispatchToProps)(Voters);