import React from 'react';
import { Image,  } from 'react-bootstrap';
import platinum from '../../../assets/images/platinum.svg'
import daimond from '../../../assets/images/daimond.svg'
import bluedaimond from '../../../assets/images/blue-daimond.svg'
import PropTypes from 'prop-types'
import { connect } from "react-redux";

const TiersData = ({tiersData,detailsFromContract}) => {
  const getImageForTier = (name) => {
    switch (name) {
      case 
      "Bronze":
        return ' '; 
      case "Silver":
        return ' ';
      case "Gold":
        return ' ';
      case "Platinum":
        return platinum;
      case "Diamond":
        return daimond;
      case "Blue Diamond":
        return bluedaimond;
      default:
        return daimond;
    }
  };
  const getTierParticipants = (tierName) => {
    switch (tierName) {
      case "Bronze":
        return detailsFromContract?.tier1Participants || 0;
      case "Silver":
        return detailsFromContract?.tier2Participants || 0;
      case "Gold":
        return detailsFromContract?.tier3Participants || 0;
        case "Platinum":
        return detailsFromContract?.tier4Participants || 0;
      case "Diamond":
        return detailsFromContract?.tier5Participants || 0;
      case "Blue Diamond":
        return detailsFromContract?.tier6Participants || 0;
      default:
        return 0;
    }
  };
  // console.log('detailsFromContract=>',detailsFromContract);

  return ( 
  <div>
    <div>
      <h1 className='page-title mb-5 fs-3 text-center'>{detailsFromContract?.stakersCount || 0} members Are Interested In this Project.</h1>
      <div className='row gap-4 justify-content-center mb-4'>

      {tiersData?.map((item)=>(
        <div className='col-lg-3 p-md-0 col-md-5' key={item?.name}>
          <div className='card-platinum '>
          <div className='d-flex align-items-center gap-2'>
           <Image src={getImageForTier(item?.name)} />
          <div>
          <p className=' status-text mb-0'>Tier Name</p>
           <span className='bg-platinum '>{item?.name}</span>
          </div>
          </div>
          <hr/>
          <div className='d-flex justify-content-between align-items-center mt-4'>
           <div>
           <p className='status-text mb-0'>Members In this Tier</p>
           <p className='status-value'>{getTierParticipants(item?.name)}</p>
           </div>
           <div>
           <p className='status-text mb-0'>Token count</p>
           <p className='status-value'>50</p>
           </div>
          </div>
          </div>
        </div>
      ))}
      </div>

    </div>
  </div>
  )
}
TiersData.propTypes = {
  tiersData: PropTypes.any,
  detailsFromContract: PropTypes.any,
}

export default connect(null, null)(TiersData);