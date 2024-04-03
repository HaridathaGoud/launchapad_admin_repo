import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TestingPraposalflow from './publishProposalView';
import { Link ,useParams} from 'react-router-dom';
import StartedSteps from './proposalSteps';
export default function ProposalView() {
    const params = useParams()
    return (
        <div className='dao-mt'>
                <div className='d-flex align-items-center sm-m-space title-width-fit'>
                <Link to={`/dao/proposal/${params.id}`}>
                    <span className='icon-dao back mr-2 c-pointer '></span>
                    </Link>
                    <Link to={`/dao/proposal/${params.id}`}><span className='mb-0 ms-2 back-text'>Back</span></Link>
                </div>
                <Row >
                    <Col md={4} className='mt-5'>
                        <StartedSteps formSteps={100} stepsOne={1} stepsTwo={2} stepsThree={3} number={3}/>
                    </Col>
                    <Col md={8} className='mt-5'> 
                   <TestingPraposalflow></TestingPraposalflow>
                    </Col>
                </Row>
            </div>
    );
}
