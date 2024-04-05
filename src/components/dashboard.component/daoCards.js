import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { daoCards,clearDaos, InvestorDaoCards } from '../proposalReducer/proposalReducer';
import { connect, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { Spinner } from 'react-bootstrap';
import nodata from '../../assets/images/no-data.png';
import ToasterMessage from "src/utils/toasterMessages";
import profileavathar from '../../assets/images/default-avatar.jpg';
import votingFactory from '../../contract/votingFactory.json';
import { ethers } from 'ethers';
import apiCalls from 'src/api/apiCalls';
import PropTypes from 'prop-types'
import shimmers from '../shimmers/shimmers';
import { useAccount } from 'wagmi'
import { useConnectWallet } from 'src/hooks/useConnectWallet';
const take = 8;

const Dashboard = (props) => {
    const loading = useSelector((state) => state?.proposal?.daoCards?.loading)
    const daoCardDetails = useSelector((state) => state?.proposal?.daoCards);
    const isAdmin = useSelector(state => state.oidc?.adminDetails);
    const [deployContractLoader, setDeployContractLoader]=useState(false);
    const [errorMsg,setErrorMsg]=useState(null);
    const [selectedDaoId, setSelectedDaoId]=useState(null);
    const [success,setSuccess]=useState(null)
    const router = useNavigate();
    const { isConnected } = useAccount()
    const { connectWallet } = useConnectWallet();

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
        },isAdmin?.id);
      };

    useEffect(() => {
        if (isAdmin?.isInvestor === true) {
            getInvestorDaosList(null,1);
        } else {
            getDaosList(null,1);
        }
        return () => {
            props.clearDaos();
          };
    }, [])
    const loadMoreDaoCards = () => {
        if (daoCardDetails?.data?.length >=8) {
            if (isAdmin?.isInvestor === true) {
                getInvestorDaosList(daoCardDetails?.data,daoCardDetails?.nextPage);
            } else {
                getDaosList(daoCardDetails?.data,daoCardDetails?.nextPage);
            }
        }
      };

    const goToProposalList = (item) => {
        router(`/dao/proposal/${item?.daoId}`);
    }
    const handleDeployDao = async (item) => {
        setSelectedDaoId(null)
        setErrorMsg(null);
        if (isConnected) {
            deployDAO(item);
        }
        else {
          try {
            await connectWallet();
            deployDAO(item);
            setErrorMsg(null);
          } catch (error) {
            setSelectedDaoId(null)
            setErrorMsg(apiCalls.isErrorDispaly(error));
            setDeployContractLoader(false);
          }
    
        }
      }

    const deployDAO = async (daoDetails) => {
        setDeployContractLoader(true)
        setSelectedDaoId(daoDetails?.daoId);
        try {
            const _provider = new ethers.providers.Web3Provider(window?.ethereum);
            const _contract = new ethers.Contract(votingFactory?.contractAddress, votingFactory.abi, _provider?.getSigner());
            const contractRes = await _contract.deployVotingContract(daoDetails.projectToken, 1, 2);
            contractRes.wait().then(async (receipt) => {
                const address = receipt.logs[0].address;
                const updateProject = {
                    daoId: daoDetails?.daoId,
                    contractAddress: address,
                    status: "Deployed"
                }
                try {
                    let res = await apiCalls.updateVotingContractAddress(updateProject);
                    if (res.ok) {
                        if (isAdmin?.isInvestor === true) {
                            getInvestorDaosList(null,1);
                        } else {
                            getDaosList(null,1);
                        }
                        setDeployContractLoader(false);
                        setSelectedDaoId(null)
                        setErrorMsg(null);
                        setSuccess(`Dao deployed successfully`);
                        setTimeout(function () {
                            setSuccess(null);
                        }, 2000);
                    }
                } catch (error) {
                    setSelectedDaoId(null)
                    setErrorMsg(apiCalls.isErrorDispaly(res));
                    setErrorMsg(error);
                    setDeployContractLoader(false);
                }
            })
        } catch (error) {
            setSelectedDaoId(null)
            setErrorMsg(apiCalls.isErrorDispaly(error));
            setDeployContractLoader(false);
        }
    }
    return (
        <> {errorMsg && (
            <Alert variant="danger" className='mt-3'>
              <div className='d-flex align-items-center'>
                <span className='icon error-alert'></span>
                <p className='m1-2' style={{ color: 'red' }}>{errorMsg}</p>
              </div>
            </Alert>
    )}
        <div><div className='dao-mt'>
            <h5 className='mb-1 page-title'>DAO’s</h5>
                <Row className='gap-4 gap-md-0'>
                    {!loading && <>
                        { daoCardDetails?.data?.map((item) => (
                            <Col lg={3} md={6} xs={12} className='mt-md-3' key={item?.daoId}>
                                {<Card className='dashboard-card mt-md-0 mt-3 sm-m-0 c-pointer h-full' key={item?.daoId} >
                                    <Card.Img variant="top" src={item?.logo || profileavathar} onClick={() => goToProposalList(item)} />
                                    <Card.Body>
                                        <Card.Text className='mb-1 d-flex'>
                                            <p className='m-0 col-3'>Name : </p><p className='m-0 '>{item.name}</p>
                                        </Card.Text>
                                        <Card.Text className='card-description d-flex mb-1'>
                                            <p className='m-0 col-3'>members :</p> <p className='m-0 '>{item?.members?.toLocaleString()}</p>
                                        </Card.Text>
                                        {!isAdmin?.isInvestor&&<> 
                                        {item?.status?.toLowerCase() == "approved" && <Button className='button-secondary w-100 mt-2' onClick={() => handleDeployDao(item)}>{(deployContractLoader && selectedDaoId == item?.daoId) && <span><Spinner size='sm' className='text-light mr-1' /></span>} Deploy</Button>}
                                        {(item?.status?.toLowerCase() == "deploying" || item?.status?.toLowerCase() == "deployed") && <Button className='button-secondary w-100 mt-2' onClick={() => goToProposalList(item)}>{item?.status}</Button>}
                                        </>}
                                     { isAdmin?.isInvestor && (item?.status?.toLowerCase() == "deploying" || item?.status?.toLowerCase() == "deployed" || item?.status?.toLowerCase() == "approved" ) && 
                                     <Button className='button-secondary w-100 mt-2' onClick={() => goToProposalList(item)}>{item?.status}</Button>}
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

                { !loading && daoCardDetails?.data?.length==0 &&  <div className='text-center'>
                    <img src={nodata} width={80} alt='' />
                    <h4 className="text-center no-data-text">No Data Found</h4>
                </div>
                }
                {loading && <div className='text-center'>{loading && <Spinner size="sm" className='text-white text-center' />} </div>}

                  { !loading && daoCardDetails?.data?.length > 0 &&
                    daoCardDetails?.data?.length === take * (daoCardDetails?.nextPage - 1) && (
                        <div className='addmore-title' >
                            <span className='d-block'><span onClick={loadMoreDaoCards} role="button" className='c-pointer'>See More</span></span>  <span className='icon blue-doublearrow c-pointer' onClick={loadMoreDaoCards}></span>
                        </div>
                    )}
                {success && <div className="text-center toster-placement toaster-cust">
                    <ToasterMessage isShowToaster={success} success={success}></ToasterMessage>
                </div>
                }
        </div>
        </div></>
    )
}
Dashboard.propTypes = {
    trackWallet: PropTypes.isRequired,
    trackDaoWallet: PropTypes.isRequired,
    clearDaos:PropTypes.isRequired,
  };
const connectDispatchToProps = (dispatch) => {
    return {
        trackWallet: (information) => {
            dispatch(daoCards(information));
        },
        trackDaoWallet: (information,inverstorId) => {
            dispatch(InvestorDaoCards(information, inverstorId));
        },
        clearDaos: () => {
         dispatch(clearDaos());
        },
        dispatch,
    }
}
export default connect(null, connectDispatchToProps)(Dashboard);