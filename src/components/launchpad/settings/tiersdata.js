import React from 'react';
import { Image,  } from 'react-bootstrap';
import platinum from '../../../assets/images/platinum.svg'
import daimond from '../../../assets/images/daimond.svg'
import bluedaimond from '../../../assets/images/blue-daimond.svg'
import PropTypes from 'prop-types'
import { connect } from "react-redux";

const TiersData = ({tiersData,detailsFromContract,projectData}) => {
  const poolWeights = {
    Bronze: 1,
    Silver: 1,
    Gold: 2,
    Platinum: 2,
    Diamond: 3,
    'Blue Diamond': 4
  };
    const getTierData = (name, type) => {
    const dataMapping = {
      image: {
        Bronze: bluedaimond,
        Silver: daimond,
        Gold: platinum,
        Platinum: platinum,
        Diamond: daimond,
        'Blue Diamond': bluedaimond,
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
        Gold:    'bg-gold',
        Platinum: 'bg-platinum',
        Diamond:  'bg-diamond',
        'Blue Diamond': 'bg-blue-diamond',
      },
      cardBgColor: {
        Bronze: 'card-blue-daimond',
        Silver: 'card-daimond',
        Gold: 'card-platinum',
        Platinum: 'card-platinum',
        Diamond: 'card-daimond',
        'Blue Diamond': 'card-blue-daimond',
      },
      approximateAllocate: {
        Bronze: Allocation('Bronze') || 0,
        Silver: Allocation('Silver') || 0,
        Gold: Allocation('Gold') || 0,
        Platinum: Allocation('Platinum') || 0,
        Diamond: Allocation('Diamond') || 0,
        'Blue Diamond': Allocation('Blue Diamond') || 0,
      }
    };
    return dataMapping[type][name] || '';
  };
  const Allocation = (name) => {
    const totalSupply = projectData?.projectsViewModel?.totalNumberOfTokens || 0;
    const poolWeight = poolWeights[name] || 0;
    const participants = detailsFromContract?.[`tier${Object.keys(poolWeights).indexOf(name) + 1}Participants`] || 0;
    if (participants === 0) return 0;
    const allocatedAmount = Math.floor(totalSupply * poolWeight / 100 / participants);
    return allocatedAmount;
  };
  return ( 
  <div>
    <div>
      <h1 className='page-title mb-5 fs-3 text-center'>{detailsFromContract?.stakersCount || 0} members Are Interested In this Project.</h1>
      <div className='row gap-4 justify-content-center mb-4'>

      {tiersData?.map((item)=>(
        <div className='col-lg-3 p-md-0 col-md-5' key={item?.name}>
          <div className={`${getTierData(item?.name, 'cardBgColor')}`}>
          <div className='d-flex align-items-center gap-2'>
           <Image src={getTierData(item?.name, 'image')} />
          <div>
          <p className=' status-text mb-0'>Tier Name</p>
           <span className={`${getTierData(item?.name, 'bgColor')}`}>{item?.name}</span>
          </div>
          </div>
          <hr/>
          <div className='d-flex justify-content-between align-items-center mt-4'>
           <div>
           <p className='status-text mb-0'>Members In this Tier</p>
           <p className='status-value text-left'>{getTierData(item?.name, 'participants') || 0}</p>
           </div>
           <div>
           <p className='status-text mb-0'>Approximate Allocation</p>
           <p className='status-value text-left'>{getTierData(item?.name, 'approximateAllocate') || 0} </p>
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