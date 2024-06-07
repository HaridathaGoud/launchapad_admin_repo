import React, { useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { connect,useSelector } from "react-redux";
import { contractDetailsData ,daoCards, InvestorDaoCards ,saveProposalCall} from '../proposalReducer/proposalReducer';
import { useParams,useNavigate,Link} from 'react-router-dom';
import shimmers from '../shimmers/shimmers';
import PlaceHolder from '../shimmers/placeHolder';
import StartedSteps from './proposalSteps';
import apiCalls from 'src/api/apiCalls';
import { Spinner } from 'react-bootstrap';
import { useContract } from 'src/contract/useContract';
import { useAccount,useNetwork } from 'wagmi';
import UseEthers from '../../utils/useEthers';
import Moment from 'react-moment';
import { ethers } from 'ethers';
import PropTypes from 'prop-types'
import { switchNetwork } from 'wagmi/actions';
import { useConnectWallet } from 'src/hooks/useConnectWallet';

const polygonUrl=process.env.REACT_APP_ENV==="production"?process.env.REACT_APP_CHAIN_MAIN_POLYGON_SCAN_URL:process.env.REACT_APP_CHAIN_MUMBAI_POLYGON_SCAN_URL
const take=8;
function PublishProposal(props) {
  const { connectWallet } = useConnectWallet();
  const { chain } = useNetwork();
  const params = useParams()
  const { isConnected,address } = useAccount();
  const { getAddress } = UseEthers();
  const [btnLoader, setBtnLoader] = useState(false);
  const PublishShimmers = shimmers.PublishProposal(3);
  const contractData = useSelector((state) => state?.proposal?.contractDetails)
  const proposalDetails= useSelector((state) => state?.proposal?.proposalDetails)
  const getCustomerId = useSelector((state) => state?.oidc?.profile?.profile?.sub);
  const saveProposal = useSelector((state) => state?.proposal?.saveProposal)
  const  DaoDetail =  useSelector((state) => state?.proposal?.daoCards?.data);
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
 const getDaosList = async (data,page) => {
  await props.trackWallet({
    page: page,
    take: take,
    data: data,
  });
};
const getInvestorDaosList = async (data,page) => {
  await props.trackDaoWallet({
    page: page,
    take: take,
    data: data ,
  },adminDetails?.id);
}

useEffect(() => {
  if (adminDetails?.isInvestor === true) {
    getInvestorDaosList(null,1);
  } else {
    getDaosList(null,1);
  }
}, [])
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
  async function handleNetwork() {
    try {
      if (chain?.id !== Number(process.env.REACT_APP_POLYGON_CHAIN_NUMARIC_ID)) {
        await switchNetwork({
          chainId: Number(process.env.REACT_APP_POLYGON_CHAIN_NUMARIC_ID) || 0,
        });
      } else {
        return true;
      }
    } catch (error) {
      setBtnLoader(false)
      setErrorMsg("User rejected transaction.");
      throw new Error('User rejected transaction.');
    }
  }

  const getOptionHashes=()=>{
    let hashes=proposalDetails?.ProposalOptionDetails;
    for (let i in hashes) {
       let _obj = hashes[i];
       optionVotingHashs.push(_obj?.optionhash);
    }
  }

  const publishProposalWalletCOnnect = async () => {
    setErrorMsg(null);
    setDeployContractLoader(true);
    try {
      if (isConnected) {
        await handleNetwork();
      } else {
        await connectWallet();
      }
      await publishProposal();
    } catch (error) {
      setErrorMsg("User rejected transaction.");
      setBtnLoader(false);
    }
  }

const publishProposal =  async() => {
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
    CreatorAddress:address,
    image: daoLogo,
    creatorImage :adminDetails?.profilePicUrl ,
    proposalOptionDetails:proposalDetails?.ProposalOptionDetails
  }
  try {
        const provider = new ethers.providers.Web3Provider(window?.ethereum);
        const response = await addQuestion(votingContractAddress,proposalDetails?.TitleHash, optionVotingHashs, startDateEpoch, endDateEpoch);
        setTxHash(response.hash)
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
    <div className='dao-mt'>
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

                <Button variant="primary" disabled={!isConnected || btnLoader} className='float-end mb-4 filled-btn' onClick={publishProposalWalletCOnnect}>
                <span>{(saveProposal?.loading || btnLoader) && <Spinner size="sm" />} </span> Publish Proposal <span className='icon-dao btn-arrow'></span>
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
  );
}
PublishProposal.propTypes = {
  proposal: PropTypes.string,
  contractDetails: PropTypes.isRequired,
  saveProposalData:PropTypes.isRequired,
  trackWallet: PropTypes.isRequired,
  trackDaoWallet: PropTypes.isRequired,
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
    },
    trackWallet: (information) => {
      dispatch(daoCards(information));
    },
    trackDaoWallet: (information, inverstorId) => {
      dispatch(InvestorDaoCards(information, inverstorId));
    },
    
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(PublishProposal);
