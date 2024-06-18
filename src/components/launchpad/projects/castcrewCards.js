import React,{useState} from "react";
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import profileavathar from '../../../assets/images/default-avatar.jpg';
import PropTypes from 'prop-types'

 const CastcrewCards = (props)=>{
  const [expandedBios, setExpandedBios] = useState({});

  const toggleBio = (id) => {
    setExpandedBios(prevState => ({ ...prevState,[id]: !prevState[id] }));
};
    return(<> 
        {props?.castCrewDataList?.map((item, index) => (
            <Col className="" lg={3} key={item?.id}>
              <div className='profile-panel mb-4 card-style home-card p-lg-3 p-2' key={item?.id}  >
                <div>
                  <Form.Group >
                    <div className='profile-size castandcre-profile  mx-auto'onClick={() => props?.handleEdit(index)} >
                      <span className='image-box'>
                        <img className='image-setup'
                          src={item?.image || profileavathar} alt="profile img"
                        />
                      </span>
                    </div>
                    <p className="profile-value mb-0 text-center mt-2">{item?.name}</p>
                    <p className="profile-value mb-1 text-center">{item?.role?.join(', ')}</p>
                    {item?.bio && 
                  <p className="profile-label text-center ellipsis">
                    {expandedBios[item?.id] || item?.bio?.length <= 150 ? item?.bio : item?.bio?.slice(0, 150) + '...'}
                    {item?.bio?.length > 150 && (
                      <span className="see-more" onClick={() => toggleBio(item?.id)}>
                        {expandedBios[item?.id] ? '...See Less' : 'See More'}
                      </span>
                    )}
                  </p>}
                  </Form.Group>
                </div>
                <hr />
                <Row className="">
                  <Col md={12}>
                      <div className='d-flex gap-2 mb-2'>
                        <span className='icon website shrink-0'></span>
                        <p className="profile-value mb-0" title={item?.webisite}>{item?.webisite || "--"} </p>
                      </div>
                      <div className='d-flex gap-2 mb-2'>
                        <span className='icon instagram shrink-0'></span>
                        <p className="profile-value mb-0" title={item?.instagram}>{item?.instagram || "--"} </p>
                      </div>
                      <div className='d-flex gap-2 mb-2'>
                        <span className='icon facebook shrink-0'></span>
                        <p className="profile-value mb-0" title={item?.facebook}>{item?.facebook || "--"}</p>
                      </div>
                  </Col>
                </Row>
              </div>
            </Col>
          ))}
    </>)
}
CastcrewCards.propTypes = {
  castCrewDataList: PropTypes.any,
  handleEdit: PropTypes.any,
}
export default CastcrewCards;