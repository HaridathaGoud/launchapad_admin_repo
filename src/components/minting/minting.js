import React, { useEffect, useState } from "react";
import List from "../grid.component";
import moment from 'moment';
import Moment from "react-moment";
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import { useNavigate } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import Button from 'react-bootstrap/Button';
import CopyToClipboard from "react-copy-to-clipboard";

const Mintingsidemenu = (props) => {
  const navigate = useNavigate();
  const gridRef = React.createRef();
  const [selection,setCopySelections]=useState(null);
  const [copied,setCopied]=useState(false);
  const userInfo = useSelector(state => state.oidc?.profile?.profile)
  useEffect(()=>{
    gridRef.current.refreshGrid();
  },[props?.daoData])
  
  const goToMintingPage = () => {   
      navigate(`/minting/mintgeneral`)    
  }

  const  handleCopy = (dataItem) => {
    setCopySelections(dataItem);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000)
  }
  const gridColumns = [
    {
      field: "date",
      title: "Date",
      filter: true,
      filterType: "date",
      width: 100,
      customCell: (props) => (
        <td>
          <div>
            <Moment format='DD/MM/YYYY'>{moment(new Date(props.dataItem.date), 'DD/MM/YYYY')}</Moment>

          </div>
        </td>
      )
    },
    {
      field: "walletAddress",
      title: "Wallet Address",
      filter: true,
      width: 200,
      customCell: (props) => (
        <td className='copy-width'>
          <div className="d-flex justify-content-between text-white" >
            <span className="d-flex justify-content-between">
              {props?.dataItem?.walletAddress}
            </span>
              <CopyToClipboard text={props?.dataItem?.walletAddress} options={{ format: 'text/plain' }}
              onCopy={() => handleCopy(props?.dataItem)}>            
          <span className={(copied && selection?.walletAddress === props?.dataItem?.walletAddress) ? "icon copied-check" : "icon copy c-pointer"}></span>
             </CopyToClipboard>
             </div>
        </td>
      ),
    },
    {
      field: "nftCount",
      title: "NFT Count",
      filter: true,
      width: 100,
      dataType: "number",
      filterType: "numeric",
    },
  ];




  return (
    <>
      <CBreadcrumb>
        <CBreadcrumbItem>
          Minting
        </CBreadcrumbItem>
        <CBreadcrumbItem active>Minting</CBreadcrumbItem>
      </CBreadcrumb>
      <div className='minnt'>

        <div className=''>
          <div className="text-end">
            {userInfo.role=="Admin" &&
            <Button className="filled-btn ms-lg-3 mb-4 c-pointer" onClick={goToMintingPage}>
              Mint Now</Button>}
          </div>
          <div className='profile-section'>
            <List
              url={process.env.REACT_APP_API_GRID + "/api/v1" + `/Admin/koldataK/${props?.daoData}`}
              ref={gridRef}
              columns={gridColumns}
              pSize={10}
              className="custom-grid mint-grid"
            />
          </div>
        </div>
      </div>
    </>
  );
}
const connectStateToProps = ({oidc }) => {
	return {daoData:oidc.defaultData?.id}
  }
export default connect(connectStateToProps)(Mintingsidemenu);

