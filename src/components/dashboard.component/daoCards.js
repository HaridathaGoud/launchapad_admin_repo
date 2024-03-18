import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { daoCards, InvestorDaoCards } from '../proposalReducer/proposalReducer';
import { connect, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { Placeholder, Spinner } from 'react-bootstrap';
import profileavathar from '../../assets/images/default-avatar.jpg';
import votingFactory from '../../contract/votingFactory.json';
import { ethers } from 'ethers';
import apiCalls from 'src/api/apiCalls';
import PropTypes from 'prop-types'
import shimmers from '../shimmers/shimmers';
const Dashboard = (props) => {
    const [daoCardDetails, setDaoCardDetails] = useState([]);
    const loading = useSelector((state) => state?.proposal?.daoCards?.isLoading)
    const isAdmin = useSelector(state => state.oidc?.adminDetails);
    const [deployContractLoader, setDeployContractLoader]=useState(false);
    const [errorMsg,setErrorMsg]=useState(null);
    const [selectedDaoId, setSelectedDaoId]=useState(null);
    const router = useNavigate();
    useEffect(() => {
        if (isAdmin?.isInvestor === true) {
            props?.trackDaoWallet((callback) => {
                setDaoCardDetails(callback);
            },isAdmin?.id)
        } else {
            props?.trackWallet((callback) => {
                setDaoCardDetails(callback);
            })
        }

    }, [])
    const goToProposalList = (item) => {
        router(`/dao/proposal/${item?.daoId}`);
    }
    const deployDAO=async(daoDetails)=>{
        setDeployContractLoader(true) 
        setSelectedDaoId(daoDetails?.daoId);    
        try{
            const _provider = new ethers.providers.Web3Provider(window?.ethereum);
            const _contract = new ethers.Contract(votingFactory?.contractAddress, votingFactory.abi, _provider?.getSigner());
            const contractRes = await _contract.deployVotingContract(daoDetails.projectToken,1,2);
            contractRes.wait().then(async (receipt) => {
                const address = receipt.logs[0].address;
                const updateProject = {
                  daoId: daoDetails?.daoId,
                  contractAddress: address,
                  status: "Deployed"
                }
               try{                
              let res=  await apiCalls.updateVotingContractAddress(updateProject);
              if(res.ok){
                props?.trackWallet((callback) => {
                    setDaoCardDetails(callback);
                })
                    setDeployContractLoader(false);
                    setSelectedDaoId(null)
              }              
               } catch (error) {
                setSelectedDaoId(null)
                setErrorMsg( apiCalls.isErrorDispaly(res));
                setErrorMsg(error);
                setDeployContractLoader(false);
              }
            })
        }   catch (error) {
            setSelectedDaoId(null)
            setErrorMsg(apiCalls.isErrorDispaly(error));
            setDeployContractLoader(false);
          }
    }
    return (
        <> {errorMsg && (
            <Alert variant="danger" className='mt-3 ms-md-4'>
              <div className='d-flex align-items-center'>
                <span className='icon error-alert'></span>
                <p className='m1-2' style={{ color: 'red' }}>{errorMsg}</p>
              </div>
            </Alert>
    )}
        <div><div className='dao-mt'>
            <h5 className='mb-1 back-text'>DAO’s</h5>
                <Row className='gap-4 gap-md-0'>
                    {!loading && <>
                        { daoCardDetails?.map((item) => (
                            <Col lg={3} md={6} xs={12} className='mt-md-3' key={item?.daoId}>
                                {<Card className='dashboard-card mt-md-0 mt-3 sm-m-0 c-pointer h-full' key={item?.daoId} >
                                    <Card.Img variant="top" src={item?.logo || profileavathar} onClick={() => goToProposalList(item)} />
                                    <Card.Body>
                                        <Card.Text className='mb-1'>
                                            Name: {item.name}
                                        </Card.Text>
                                        <Card.Text className='card-description'>
                                            members: {item?.members?.toLocaleString()}
                                        </Card.Text>
                                        {item?.status?.toLowerCase() == "approved" && <Button className='button-secondary' onClick={() => deployDAO(item)}>{(deployContractLoader && selectedDaoId == item?.daoId) && <span><Spinner size='sm' className='text-light mr-1' /></span>} Deploy</Button>}
                                        {(item?.status?.toLowerCase() == "deploying" || item?.status?.toLowerCase() == "deployed") && <Button className='button-secondary'>{item?.status}</Button>}
                                    </Card.Body>
                                </Card>}
                            </Col>
                        ))}
                    </>
                    }
                </Row>
                      
                {loading &&
                 <div className='mt-4 mb-4'>
                    <shimmers.DaoCardShimmer count={8} />
                    </div>
                }
        </div>
        </div></>
    )
}
Dashboard.propTypes = {
    trackWallet: PropTypes.isRequired,
    trackDaoWallet: PropTypes.isRequired,
  };
const connectDispatchToProps = (dispatch) => {
    return {
        trackWallet: (callback) => {
            dispatch(daoCards(callback));
        },
        trackDaoWallet: (callback,inverstorId) => {
            dispatch(InvestorDaoCards(callback, inverstorId));
        },
        dispatch,
    }
}
export default connect(null, connectDispatchToProps)(Dashboard);