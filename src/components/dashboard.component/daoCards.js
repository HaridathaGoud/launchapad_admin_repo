import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { daoCards, InvestorDaoCards } from '../proposalReducer/proposalReducer';
import { connect, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { Placeholder, Spinner } from 'react-bootstrap';
import profileavathar from '../../assets/images/default-avatar.jpg';
import votingFactory from '../../contract/votingFactory.json';
import { ethers } from 'ethers';
import apiCalls from 'src/api/apiCalls';

const Dashboard = (props) => {
    const [daoCardDetails, setDaoCardsDetails] = useState([]);
    const loading = useSelector((state) => state?.proposal?.daoCards?.isLoading)
    const isAdmin = useSelector(state => state.oidc?.adminDetails);
    const [deployContractLoader,setDeployLoader]=useState(false);
    const [errorMsg,setErrorMsg]=useState(null);
    const router = useNavigate();
    useEffect(() => {
        if (isAdmin?.isInvestor === true) {
            props?.trackDaoWallet((callback) => {
                setDaoCardsDetails(callback);
            })
        } else {
            props?.trackWallet((callback) => {
                setDaoCardsDetails(callback);
            })
        }

    }, [])
    const goToProposalList = (item) => {
        router(`/dao/proposal/${item?.daoId}`);
    }
    const deployDAO=async(daoDetails)=>{
        setDeployLoader(true)        
        const _provider = new ethers.providers.Web3Provider(window?.ethereum);
        let accounts = await _provider.send("eth_requestAccounts", []);
        const _contract = new ethers.Contract(votingFactory?.contractAddress, votingFactory.abi, _provider?.getSigner());
        const contractRes = await _contract.deployVotingContract(daoDetails.projectToken,ethers.utils.parseEther((daoDetails?.votingBalance||1000).toString()),ethers.utils.parseEther((daoDetails?.proposalCreationBalance||5000).toString()));
        contractRes.wait().then(async (receipt) => {
            const address = receipt.logs[0].address;
            const updateProject = {
              daoId: daoDetails?.daoId,
              contractAddress: address,
              status: "Deployed"
            }
           try{
          let res=  await apiCalls.updateContractAddressStatus(updateProject);
            setDeployLoader(false);
           } catch (error) {
            setErrorMsg(error);
            setDeployLoader(false);
          }
        })
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
            <Row>
            
                {daoCardDetails?.map((item) => (
                    <Col lg={3} md={6} xs={12} className='mt-md-3'>
                        {!loading ? <Card className='dashboard-card mt-md-0 mt-3 sm-m-0 c-pointer h-full' onClick={() => goToProposalList(item)}>
                            <Card.Img variant="top" src={item?.logo || profileavathar} />
                            <Card.Body>
                                <Card.Text className='mb-1'>
                                    Name: {item.name}
                                </Card.Text>
                                <Card.Text className='card-description'>
                                    members: {item?.members?.toLocaleString()}
                                </Card.Text>
                                {item?.status?.toLowerCase() == "approved" && <Button onClick={()=>deployDAO(item)}>{deployContractLoader && <Spinner/>}Deploy</Button>}
                            </Card.Body>
                        </Card> : (
                            <div><Placeholder as={Card.Title} animation="glow">
                                <Placeholder xs={12} className='cardimg-placeholder' />
                            </Placeholder>
                                <Card.Body>
                                    <Placeholder as={Card.Title} animation="glow">
                                        <Placeholder xs={6} />
                                    </Placeholder>
                                    <Placeholder as={Card.Text} animation="glow">
                                        <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                                        <Placeholder xs={6} />
                                    </Placeholder>
                                </Card.Body>
                            </div>)}
                    </Col>))}

            </Row>
        </div>
        </div></>
    )
}
const connectDispatchToProps = (dispatch) => {
    const isAdmin = useSelector(state => state.oidc?.adminDetails);
    const inverstorId = isAdmin?.id;
    return {
        trackWallet: (callback) => {
            dispatch(daoCards(callback));
        },
        trackDaoWallet: (callback) => {
            dispatch(InvestorDaoCards(callback, inverstorId));
        },
        dispatch,
    }
}
export default connect(null, connectDispatchToProps)(Dashboard);