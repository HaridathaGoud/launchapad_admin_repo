import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { daoCards } from '../proposalReducer/proposalReducer';
import { connect,useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { Placeholder } from 'react-bootstrap';

const  Dashboard =(props)=> {
    const [daoCardDetails,setDaoCardsDetails] = useState([]);
    const loading =useSelector((state) => state?.proposal?.daoCards?.isLoading)
    const router = useNavigate();

    useEffect(()=>{
        props?.trackWallet((callback)=>{
            setDaoCardsDetails(callback);
        })
    },[])

    const goToProposalList = (item)=>{
        router(`/dao/proposal/${item?.daoId}`);
    }
    return (
        <><div><div className='dao-mt'>
            <h5 className='mb-1 back-text'>DAO’s</h5>
            <Row>
            
                 {daoCardDetails?.map((item)=>(
                <Col lg={3} md={6} xs={12} className='mt-md-3'>
                {!loading?<Card className='dashboard-card mt-md-0 mt-3 sm-m-0 c-pointer' onClick={()=>goToProposalList(item)}>
                    <Card.Img variant="top" src={item?.logo} />
                    <Card.Body>                        
                        <Card.Text className='mb-1'>
                           Name: {item.name}
                        </Card.Text>
                       <Card.Text className='card-description'>
                        members: {item?.members.toLocaleString()}
                        </Card.Text>
                    </Card.Body>
                </Card>:(
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
    return {
          trackWallet: (callback) => {
            dispatch(daoCards(callback));
        },
        dispatch,
      }
    }
 export default connect(null, connectDispatchToProps)(Dashboard);