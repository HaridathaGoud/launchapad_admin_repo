import React from 'react';
import { Placeholder, Row, Col } from 'react-bootstrap';

const LaunchpadShimmer = () => {
  return (
    <>
      <Placeholder as="p" animation="glow" className='text-center pt-5'>
        <Placeholder style={{ width: '25%' }} /><br/>
        <Placeholder xs={4} /><br/>
        <Placeholder xs={4} /><br/>
        <Placeholder xs={5} />
      </Placeholder>

      <Row className='card-row mt-3 justify-content-center'>
        <Col xl={2}>
          <Placeholder as="p" animation="glow">
            <Placeholder xs={12} className='status-card' />
          </Placeholder>
        </Col>
        <Col xl={2}>
          <Placeholder as="p" animation="glow">
            <Placeholder xs={12} className='status-card' />
          </Placeholder>
        </Col>
        <Col xl={2}>
          <Placeholder as="p" animation="glow">
            <Placeholder xs={12} className='status-card' />
          </Placeholder>
        </Col>
      </Row>
    </>
  );
};

export default LaunchpadShimmer;
