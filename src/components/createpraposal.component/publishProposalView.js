import React, { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import { connect,useSelector } from "react-redux";
import { proposalViewData } from '../proposalReducer/proposalReducer';
import shimmers from '../shimmers/shimmers';
import PlaceHolder from '../shimmers/placeHolder';
import { useParams } from "react-router-dom";
import { useAccount } from 'wagmi';
import PropTypes from 'prop-types'
import ConvertLocalFormat from 'src/utils/convertToLocal';

function TestingPraposalflow(props) {
   const proposalView = useSelector((state) => state?.proposal?.proViewData)
  const errorMsg=useSelector((state)=> state?.proposal?.proViewData?.error)
  const proposalId=useSelector((state)=> state?.proposal?.saveProposal?.data?.id)
  const params = useParams()
  const PublishShimmers = shimmers.PublishProposal(3);
  const [loading,setLoading] = useState(true)
  const { isConnected } = useAccount();


  useEffect(() => {
    Load()
    if(params?.id && params?.daoId){
      props?.proViewData( params?.id);
    }else{
      props?.proViewData( proposalId );
    }
   
  }, [])

  
  const Load = async ()=>{
    if (proposalView?.data) {     
     if (!proposalView?.data?.loading) {
       await new Promise((resolve) => setTimeout(resolve, 1000)); 
       setLoading(false);  
   }else if(!isConnected){
     setLoading(false);  
   }
  }
  }

  const getRecorderValue = (recorder) => {
    const recorderValues = ["A", "B", "C", "D", "E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    return recorderValues[recorder - 1];
  };


  return (
      <div className='praposal-left-card mb-5'>
      {errorMsg && (
          <Alert variant="danger">
            <div className='d-flex align-items-center'>
              <span className='icon error-alert'></span>
              <p className='m1-2' style={{ color: 'red' }}>{errorMsg}</p>
            </div>
          </Alert>
            )}
       {!loading?<div className='voting-card'>
          <div className='p-voting'>
            <div className='d-flex align-items-center'>
            <h1 className='testing-title mb-0 me-2'>{proposalView?.data?.title}</h1>
            <span className='published-text'> (Published by <span className='yellow-text'>{proposalView?.data?.createdBy ||            
           proposalView?.data?.walletAddress?.slice(0, 4) + '.......' +  proposalView?.data?.walletAddress?.substring( proposalView?.data?.walletAddress?.length - 4,  proposalView?.data?.walletAddress?.length)}</span>)</span> 
            </div>
            <p className='mt-3 mb-2 testing-flow'>{proposalView?.data?.description}</p>
             
          </div>
          <hr />
          <div className='p-voting pb-0'>
            <div className='md-d-flex align-items-center justify-content-between'>
              <h1 className='vote-subtitle mb-3 mt-4'>Voting </h1>
            </div>
           
            <div>
                    <p className='prtype-font'>Proposal options</p>
                    {proposalView?.data?.options?.map((item)=>(
                      <p className='prtype-font' key={item?.recorder}>{getRecorderValue(item?.recorder)}. {item?.option} {`(${item?.votersCount || "0"})`}</p>
                    ))}                  
                    </div>

          </div><hr />
          <div className='p-voting pb-0'>

            <h3 className='vote-subtitle mb-3'>Duration </h3>

            <div className='md-d-flex align-items-center justify-content-between mb-4'>
              <p className='kp-lbl'>Start Date & Time</p>
              <p className='kp-value'>
              {ConvertLocalFormat(proposalView?.data?.startDate)}{" "}
                </p>
            </div>
            <div className='md-d-flex align-items-center justify-content-between mb-4'>
              <p className='kp-lbl'>End Date & Time</p>
              <p className='kp-value'> 
              {ConvertLocalFormat(proposalView?.data?.endDate)}{" "}
              </p>
            </div>

          </div>
        </div>:<PlaceHolder contenthtml={PublishShimmers}/>}
      </div>

  );
}
TestingPraposalflow.propTypes = {
  proViewData: PropTypes.isRequired,
};
const connectStateToProps = ({ oidc }) => {
  return { oidc: oidc };
};
const connectDispatchToProps = (dispatch) => {
  return {
    proViewData: (proposalId) => {
      dispatch(proposalViewData(proposalId,null));
    }
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(TestingPraposalflow);
