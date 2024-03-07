import React, { useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { connect,useSelector } from "react-redux";
import { contractDetailsData ,saveProposalCall} from '../proposalReducer/proposalReducer';
import { useParams,useNavigate,Link} from 'react-router-dom';
import shimmers from '../shimmers/shimmers';
import PlaceHolder from '../shimmers/placeHolder';
import StartedSteps from './proposalSteps';
import apiCalls from 'src/api/apiCalls';
import { Spinner } from 'react-bootstrap';
import { useContract } from 'src/contract/useContract';
import { useAccount } from 'wagmi';
import UseEthers from '../../utils/useEthers';
import Moment from 'react-moment';
import { ethers } from 'ethers/lib';
import { waitForTransaction } from "wagmi/actions";
import PropTypes from 'prop-types'

const polygonUrl=process.env.REACT_APP_ENV==="production"?process.env.REACT_APP_CHAIN_MAIN_POLYGON_SCAN_URL:process.env.REACT_APP_CHAIN_MUMBAI_POLYGON_SCAN_URL

function PublishProposal(props) {
  const params = useParams()
  const { isConnected,address } = useAccount();
  const { getAddress } = UseEthers();
  const [btnLoader, setBtnLoader] = useState(false);
  const PublishShimmers = shimmers.PublishProposal(3);
  const contractData = useSelector((state) => state?.proposal?.contractDetails)
  const proposalDetails= useSelector((state) => state?.proposal?.proposalDetails)
  const getCustomerId = useSelector((state) => state?.oidc?.profile?.profile?.sub);
  const saveProposal = useSelector((state) => state?.proposal?.saveProposal)
  const  DaoDetail = useSelector((state)=>state?.proposal?.daoCards.data)
  const adminDetails = useSelector((state)=>state?.oidc?.adminDetails)
  const [errorMsg, setErrorMsg] = useState(null)
  const router = useNavigate();
  const { addQuestion} = useContract();
 const [optionVotingHashs,setOptionVotingHashs]=useState([])
 const [daoLogo,setDaoLogo]=useState()
 const [txHash,setTxHash]=useState(null)
 const [startDateEpoch,setStartDateEpoch] = useState()
 const [endDateEpoch,setEndDateEpoch] = useState()
 const [votingContractAddress,setVotingContractAddress] = useState();
  useEffect(() => {
    let localDate1 = new Date(proposalDetails?.startdate); 
    let utcDate = localDate1.toISOString();   
    let utcDateObject = new Date(utcDate); 
    let startEpochTime = utcDateObject.getTime(); 
    let stEpochTime = startEpochTime/1000
    setStartDateEpoch(stEpochTime);   
    
    let localDate2 = new Date(proposalDetails?.enddate); 
    let utcDate2 = localDate2.toISOString();   
    let utcDateObject2 = new Date(utcDate2); 
    let endEpochTime = utcDateObject2.getTime(); 
    let enEpochTime = endEpochTime/1000
    setEndDateEpoch(enEpochTime); 

    props?.contractDetails(params);
    getDaoItem()
    setErrorMsg(props?.proposal?.contractDetails?.error)
  }, [address])

  const getDaoItem=()=>{
    setTxHash(null)
    let daoData=DaoDetail?.find((item)=>item?.daoId==params.id?.toLocaleLowerCase())
    setDaoLogo(daoData?.logo)
    setVotingContractAddress(daoData?.votingContractAddress)
  }
  
  const getOptionHashes=()=>{
    let hashes=proposalDetails?.ProposalOptionDetails;
    for (let i in hashes) {
       let _obj = hashes[i];
       optionVotingHashs.push(_obj?.optionhash);
    }
  }
  const getWalletAddress = async () => {
    let walletAddress = await getAddress();
    if (walletAddress) {
     publishProposal(walletAddress);
    }
  }
const publishProposalWalletCOnnect=async ()=>{
  if (isConnected) {
    getWalletAddress();
}
else {
    try {
         await getWalletAddress()
    } catch (error) {
        setErrorMsg(error?.reason);
        setBtnLoader(false)
    }

}
}


const publishProposal =  async(walletAddress) => {
  setBtnLoader(true)
  getOptionHashes()
  let localDate = new Date(proposalDetails?.startdate); 
    let stUTC= localDate.toISOString(); 
    let stDateData = stUTC?.slice(0, 19)
    
    let localDate2 = new Date(proposalDetails?.enddate); 
    let endUTC = localDate2.toISOString(); 
    let endDateData  = endUTC?.slice(0, 19)
  
  const obj = {
    id: "00000000-0000-0000-0000-000000000000",
    customerId: getCustomerId,
    daoId: params.id,
    title: proposalDetails?.proposal,
    description: proposalDetails?.summary,
    titleHash: proposalDetails.TitleHash,
    startTime: stDateData,
    endTime: endDateData,
    membershipsCount:proposalDetails?.membershipsCount,
    proposalType:proposalDetails?.proposalType,
    CreatorAddress:walletAddress,
    image: daoLogo,
    creatorImage :adminDetails?.profilePicUrl ,
    proposalOptionDetails:proposalDetails?.ProposalOptionDetails
  }
  try {
        const response = await addQuestion(votingContractAddress,proposalDetails?.TitleHash, optionVotingHashs, startDateEpoch, endDateEpoch);
        setTxHash(response.hash)
        const _connector = window?.ethereum;
        const provider = new ethers.providers.Web3Provider(_connector);
        const txResponse = await provider.waitForTransaction(response.hash);
      if (txResponse && txResponse.status === 0) {
        setErrorMsg("Transaction failed");
        setBtnLoader(false)
      }else{
        props?.saveProposalData(obj, (callback) => {
          if (callback?.id) {
            router(`/dao/success/${params.id}`)
            setBtnLoader(false)
          } else {
            setErrorMsg(apiCalls.isErrorDispaly(callback));
            window.scroll(0, 0);
            setBtnLoader(false)
  
          }
        })
      }
    } catch (error) {
        setOptionVotingHashs([])
        setErrorMsg(apiCalls.isErrorDispaly((error)));
        window.scroll(0, 0);
        setBtnLoader(false)
      }
}


  return (
    <Container className='dao-mt'>
      <Link className=' title-width-fit' to={`/dao/createpraposal/${params.id}`}><div className='d-flex align-items-center title-width-fit'>  <span className='icon-dao back mr-2 c-pointer'></span><span className='mb-0 ms-2 back-text'>Create Proposal</span></div></Link>
        <Row>
          <Col md={4} className='mt-5'>
            <StartedSteps formSteps={66} stepsOne={1} stepsTwo={2} number={2} />

          </Col>
          <Col md={8} className='mt-5'>
            <div className='praposal-left-card ms-md-4'>
              {errorMsg && (
                <Alert variant="danger" className="cust-alert-design">
                  <div className='d-flex align-items-center justify-content-between mobile-d-block'>
                    <p style={{ color: 'red', }} className="d-flex align-items-start error-align mb-0">
                      <span className="icon error-alert me-2 alert-error mt-0"></span>
                      {errorMsg}
                    </p>
                    {txHash &&
                      <div>
                        <Link className='text-end hyper-text' to={`${polygonUrl}${txHash}`} >
                          Click here </Link>
                        <span className='mr-25 mb-0 ' style={{ color: 'red', }}>to see details</span></div>}
                  </div>
                </Alert>
              )}

              {!contractData?.loading ? 
              <div className='voting-card'>
                <div className=' p-voting'>
                  <h1 className='testing-title mb-0 me-4'>{proposalDetails?.proposal}</h1>
                  <p className='mt-3 mb-2 testing-flow'>{proposalDetails?.summary}</p>
                  
                </div>
                <hr />
                <div className='p-voting pb-0'>
                  <div className='md-d-flex align-items-center justify-content-between'>
                    <h1 className='vote-subtitle mb-3 mt-4'>Voting </h1>
                  </div>
                  <div>
                    <p className='prtype-font'>Your proposal options</p>
                    {proposalDetails?.ProposalOptionDetails?.map((item)=>(
                      <p className='prtype-font' key={item?.id}>{item?.index || "A"}. {item?.options}</p>
                    ))}                  
                    </div>

                </div><hr />
                <div className='p-voting pb-0'>

                  <h3 className='vote-subtitle mb-3'>Duration </h3>

                  <div className='md-d-flex align-items-center justify-content-between mb-4'>
                    <p className='kp-lbl'>Start Date & Time</p>
                    <p className='kp-value'>
                    <Moment format={"DD/MM/YYYY HH:mm"}>
                          {proposalDetails?.startdate}
                        </Moment>
                      </p>
                  </div>
                  <div className='md-d-flex align-items-center justify-content-between mb-4'>
                    <p className='kp-lbl'>End Date & Time</p>
                    <p className='kp-value'>
                    <Moment format={"DD/MM/YYYY HH:mm"}>
                          {proposalDetails?.enddate}
                        </Moment>
                     </p>
                  </div>

                </div>
              </div> 
              : <PlaceHolder contenthtml={PublishShimmers} />}
              <div className='d- justify-content-between mt-3'>

                <Button variant="primary" disabled={btnLoader} className='float-end mb-4' onClick={publishProposalWalletCOnnect}>
                <span>{(saveProposal?.loading || btnLoader) && <Spinner size="sm" />} </span> Publish Proposal <span className='icon-dao btn-arrow'></span>
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
  );
}
PublishProposal.propTypes = {
  proposal: PropTypes.string,
  contractDetails: PropTypes.isRequired,
  saveProposalData:PropTypes.isRequired,
}
const connectStateToProps = ({ oidc, proposal }) => {
  return { oidc: oidc, proposal: proposal };
};
const connectDispatchToProps = (dispatch) => {
  return {
    contractDetails: (params) => {
      dispatch(contractDetailsData(params));
    },
    saveProposalData: (obj, callback) => {
      dispatch(saveProposalCall(obj, callback))
    }
    
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(PublishProposal);
