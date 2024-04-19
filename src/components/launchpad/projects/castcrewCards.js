import React from "react";
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import profileavathar from '../../../assets/images/default-avatar.jpg';

 const CastcrewCards = (props)=>{
    return(<> 
        {props?.castCrewDataList?.map((item, index) => (
            <Col className="" lg={3} key={item.id}>
              <div className='profile-panel mb-4 card-style home-card p-lg-3 p-2' key={item.id}  >
                <div>
                  <Form.Group >
                    <div className='profile-size castandcre-profile  no-hover mx-auto'onClick={() => props?.handleEdit(index)} >
                      <span className='image-box'>
                        <img className='image-setup'
                          src={item?.image || profileavathar} alt="profile img"
                        />
                      </span>
                    </div>
                    <p className="profile-value mb-0 text-center mt-2">{item?.name}</p>
                    <p className="profile-value mb-1 text-center">{item?.role?.join(', ')}</p>
                    <p className="profile-label text-center ellipsis">{item?.bio}</p>
                  </Form.Group>
                </div>
                <hr />
                <Row className="">
                  <Col md={12}>
                    {item?.facebook &&
                      <div className='d-flex gap-2 mb-2'>
                        <span className='icon facebook shrink-0'></span>
                        <p className="profile-value mb-0">{item?.facebook}</p>
                      </div>}
                    {item?.webisite &&
                      <div className='d-flex gap-2 mb-2'>
                        <span className='icon website shrink-0'></span>
                        <p className="profile-value mb-0">{item?.webisite} </p>
                      </div>}
                    {item?.instagram &&
                      <div className='d-flex gap-2'>
                        <span className='icon instagram shrink-0'></span>
                        <p className="profile-value mb-0">{item?.instagram} </p>
                      </div>}
                  </Col>
                </Row>
              </div>
            </Col>
          ))}
    </>)
}
export default CastcrewCards;