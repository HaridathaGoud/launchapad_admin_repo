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
  const getBgColorForTier = (name) => {
    switch (name) {
      case "Bronze":
        return 'bg-bronze'; 
      case "Silver":
        return 'bg-diamond';
      case "Gold":
        return 'bg-gold';
      case "Platinum":
        return 'bg-platinum';
      case "Diamond":
        return 'bg-diamond';
      case "Blue Diamond":
        return 'bg-blue-diamond';
      default:
        return 'bg-platinum';
    }
  };
  const getCardBgColorForTier = (name) => {
    switch (name) {
      case "Bronze":
        return 'card-blue-daimond'; 
      case "Silver":
        return 'card-daimond';
      case "Gold":
        return 'card-platinum';
      case "Platinum":
        return 'card-platinum';
      case "Diamond":
        return 'card-daimond';
      case "Blue Diamond":
        return 'card-blue-daimond';
      default:
        return 'card-platinum';
    }
  };
  const getTierData = (name, type) => {
    const dataMapping = {
      image: {
        Bronze: '',
        Silver: '',
        Gold: '',
        Platinum: platinum,
        Diamond: diamond,
        'Blue Diamond': blueDiamond,
      },
      participants: {
        Bronze: detailsFromContract?.tier1Participants || 0,
        Silver: detailsFromContract?.tier2Participants || 0,
        Gold: detailsFromContract?.tier3Participants || 0,
        Platinum: detailsFromContract?.tier4Participants || 0,
        Diamond: detailsFromContract?.tier5Participants || 0,
        'Blue Diamond': detailsFromContract?.tier6Participants || 0,
      },
      bgColor: {
        Bronze: 'bg-bronze',
        Silver: 'bg-diamond',
        Gold: 'bg-gold',
        Platinum: 'bg-platinum',
        Diamond: 'bg-diamond',
        'Blue Diamond': 'bg-blue-diamond',
      },
      cardBgColor: {
        Bronze: 'card-blue-diamond',
        Silver: 'card-diamond',
        Gold: 'card-platinum',
        Platinum: 'card-platinum',
        Diamond: 'card-diamond',
        'Blue Diamond': 'card-blue-diamond',
      },
    };
  
    return dataMapping[type][name] || '';
  };

  return ( 
  <div>
    <div>
      <h1 className='page-title mb-5 fs-3 text-center'>{detailsFromContract?.stakersCount || 0} members Are Interested In this Project.</h1>
      <div className='row gap-4 justify-content-center mb-4'>

      {tiersData?.map((item)=>(
        <div className='col-lg-3 p-md-0 col-md-5' key={item?.name}>
          <div className={`${getCardBgColorForTier(item?.name)}`}>
          <div className='d-flex align-items-center gap-2'>
           <Image src={getImageForTier(item?.name)} />
          <div>
          <p className=' status-text mb-0'>Tier Name</p>
           <span className={`${getBgColorForTier(item?.name)}`}>{item?.name}</span>
          </div>
          </div>
          <hr/>
          <div className='d-flex justify-content-between align-items-center mt-4'>
           <div>
           <p className='status-text mb-0'>Members In this Tier</p>
           <p className='status-value text-left'>{getTierParticipants(item?.name)}</p>
           </div>
           <div>
           <p className='status-text mb-0'>Token count</p>
           <p className='status-value text-left'>50</p>
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