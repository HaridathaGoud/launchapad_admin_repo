import React from 'react';
import Row from 'react-bootstrap/Row';
const Home = () => {
  return (
    <>
    
      <div>
        <div className=''>
          <div className='d-flex justify-content-between'>
            <h2 className='section-title'>My Projects</h2>
          </div><Row className='mt-4 mb-4'>
   
              <div className='Row d-flex justify-content-center'>

                <div className="project-card col-md-12 col-lg-3" >
                  <div className='nodata-image'></div>
                  <div className="value-section">
                    <div className="card-footer text-center nodata-title">
                      No projects available

                    </div>
                  </div>
                </div>
              </div>
            
          </Row>

          
        </div>
      </div>
    </>);
}
export default Home;