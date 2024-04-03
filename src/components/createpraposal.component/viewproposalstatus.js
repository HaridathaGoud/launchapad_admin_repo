import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TestingPraposalflow from './publishProposalView';
import { Link,useParams } from 'react-router-dom';
import Status from './status';
import Voters from '../voting.component/votersgrid';


export default function ProposalViewstatus() {
    const params = useParams()
    return (

            <div className='dao-mt'>
            <div className='d-flex align-items-center title-width-fit'>
                <Link to={`/dao/proposal/${params?.daoId}`}>
                    <span className='icon-dao back mr-2 c-pointer'></span>
                    </Link>
                    <Link to={`/dao/proposal/${params?.daoId}`}><span className='mb-0 ms-2 back-text'>Back</span>                    
                    </Link>
                </div>
                <Row className=''>
                    <Col md={4}  className='mt-5'>
                        <Status></Status>
                    </Col>
                    <Col md={8}  className='mt-5'> 
                   <TestingPraposalflow></TestingPraposalflow>
                   <Voters></Voters>
                    </Col>
                   
                </Row>
            </div>
    );
}
