import React, { useEffect,useRef, useState } from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Created from "./created"
import Owned from "./owned"
import Favorited from "./favorited"
import { useParams } from 'react-router-dom';
import { getMarketPlaceData } from '../../utils/api';
import { useSelector } from 'react-redux';

const Nfts = (props) => {
  const [activeTab, setActiveTab] = useState('Created');
  let { address } = useParams();
  const [creatorscount, setCreatorsCount] = useState(0);
  const [favouritesCount, setFavouritesCount] = useState(0);
  const [ownedCount, setOwnedCount] = useState(0);
  const UserProfile = useSelector(state => state?.profile?.user)
  const walletAddress = address || UserProfile?.walletAddress;
  const shouldLog = useRef(false);

  useEffect(() => {
    if (!shouldLog.current) {
      shouldLog.current = true;
      fetchData();
    }
  }, [activeTab]);

  const handleTabChange = (e) => {
    setActiveTab(e);
  };
  const fetchData = async () => {
    await getCreatedCount(walletAddress);
    await getFavoritedCount(walletAddress);
    await getOwnedCount(walletAddress);
  };

  const getCreatedCount = async (walletAddS) => {
    await getMarketPlaceData(`CreatorsCount/${walletAddS}`)
      .then((response) => {
        setCreatorsCount(response.data);
      })
      .catch(() => {
      });
  };

  const getFavoritedCount = async (walletAddS) => {
    await getMarketPlaceData(`FavoritesCount/${walletAddS}`)
      .then((response) => {
        setFavouritesCount(response.data);
      })
      .catch(() => {
      });
  };

  const getOwnedCount = async (walletAddS) => {
    await getMarketPlaceData(`currentownerscount/${walletAddS}`)
      .then((response) => {
        setOwnedCount(response.data);
      })
      .catch(() => {
      });
  };

    return(
        <div>
      <Tabs defaultActiveKey="Created" activeKey={activeTab} onSelect={handleTabChange}   className="mb-3 mt-3 sub-tabs marketplace-tabs" id="uncontrolled-tab-example">
      <Tab eventKey="Created" title={`Created (${creatorscount == null ? 0 :creatorscount})`} className="sub-override">
      {activeTab === 'Created' && <Created activeTab={activeTab} walletAddress={walletAddress} userDetails={props.userDetailsId} />}
      </Tab>
      <Tab eventKey="Favorited" title={`Favorited (${favouritesCount == null ? 0 : favouritesCount})`} className="sub-override">
      {activeTab === 'Favorited' && <Favorited activeTab={activeTab} walletAddress={walletAddress} userDetails={props.userDetailsId}/>}
      </Tab>
      <Tab eventKey="Owned" title={`Owned (${ownedCount == null ? 0 : ownedCount})`} className="sub-override">
      {activeTab === 'Owned' && <Owned activeTab={activeTab} walletAddress={walletAddress} userDetails={props.userDetailsId}/>}
      </Tab>
    </Tabs></div>
    );

}
export default Nfts