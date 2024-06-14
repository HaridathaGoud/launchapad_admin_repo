import React from 'react';
import { Image,  } from 'react-bootstrap';
import platinum from '../../../assets/images/platinum.svg'
import daimond from '../../../assets/images/daimond.svg'
import bluedaimond from '../../../assets/images/blue-daimond.svg'
import PropTypes from 'prop-types'
import { connect } from "react-redux";

const TiersData = ({tiersData,detailsFromContract,projectData}) => {
  const poolWeights = {
    Bronze: { 1: 1, 2: 1, 3: 1 },
    Silver: { 1: 2, 2: 2, 3: 2 },
    Gold: { 1: 3, 2: 3, 3: 4 },
    Platinum: { 1: 6, 2: 6, 3: 7 },
    Diamond: { 1: 8, 2: 9, 3: 10 },
    'Blue Diamond': { 1: 11, 2: 11, 3: 13 },
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
    };
    return dataMapping[type][name] || '';
  };
  const aggregateParticipants = (tierId) => {
    return detailsFromContract?.poolInfo?.filter(pool => pool.tierId === tierId)?.reduce((sum, pool) => sum + pool.participants, 0);
  };
  const Allocation = (tierName, tierId) => {
    const totalSupply = projectData?.projectsViewModel?.totalNumberOfTokens || 0;
    const tierPools = detailsFromContract?.poolInfo?.filter(pool => pool.tierId === tierId);
    const totalWeight = tierPools?.reduce((sum, pool) => sum + poolWeights[tierName][pool.poolLevel] * pool.participants, 0);
    const totalParticipants = aggregateParticipants(tierId);
    if (totalParticipants === 0) return 0;
    const allocatedAmount = Math.floor(((totalSupply * totalWeight / 100) / totalParticipants)/totalParticipants);
    return allocatedAmount;
  };
  return ( 
  <div className='allocation-page'>
    <div>
      <h1 className='page-title mb-5 fs-3 text-center'>{detailsFromContract?.stakersCount || 0} Members Are Interested In This Project.</h1>
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
          <div className='d-flex justify-content-between align-items-center mt-4 gap-4'>
           <div>
           <p className='status-text mb-0'>Members In this Tier</p>
           <p className='status-value text-left'>{getTierData(item?.name, 'participants') || 0}</p>
           </div>
           <div>
           <p className='status-text mb-0'>Approximate Allocation</p>
           <p className='status-value text-left'> {Allocation(item?.name, item?.recorder)||0} </p>
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
  projectData:PropTypes.any,
}

export default connect(null, null)(TiersData);