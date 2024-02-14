import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers';
import MintContract from "../../contract/mint.json";
import dashicon from '../../assets/images/minter.svg'
import sale from '../../assets/images/sale.svg'
import auction from '../../assets/images/auction.svg'
import Spinner from 'react-bootstrap/esm/Spinner';
import { CBreadcrumb, CBreadcrumbItem,CRow } from '@coreui/react'
import MintingGrid from '../minting/mintedGrid'
import Alert from 'react-bootstrap/Alert';
import { connect, useSelector } from "react-redux";
import ErrorPage from "../../../src/views/pages/unauthorizederror/unauthorizederror"
const MintingDashboard = (props) => {
  const [loader, setLoader] = useState(false);
  const [nftMintCount, setNftMintCount] = useState(null);
  const [nftCount, setNftCount] = useState(null);
  const [remainingCount, setRemainingCount] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null);
  const contractAddress = props?.oidc?.defaultData?.mintingContractAddress
  const daoLuData = useSelector(state => state?.oidc?.periodsData?.data);
  const adminDetails = useSelector(state => state.oidc?.adminDetails)
  useEffect(() => {
    redirection()
    getCount();
    setNftCount(Number(process.env.REACT_APP_COUNT).toLocaleString())
    window.scroll(0,0)
  }, [props?.oidc?.defaultData?.mintingContractAddress,props?.oidc?.defaultData?.id]);//eslint-disable-line react-hooks/exhaustive-deps

  const redirection = () => {
    if (daoLuData== null) {
      return <ErrorPage />
    }
  }

  async function getCount() {
    setLoader(true);
    const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_ALCHEMY_PROVIDER);
    const contract = new ethers.Contract(contractAddress, MintContract.abi, provider);
    const count = await contract?.mintedCount();
    const hex = count?._hex;
    const hexToDecimal = parseInt(hex, 16);
    if (hexToDecimal >= 0) {
      setLoader(false)
      const totalNftCount = Number(process.env.REACT_APP_COUNT.replace(/,/g, ''));
      const mintedCount = hexToDecimal;
      const result = totalNftCount - mintedCount;
      const formattedResult = result.toLocaleString();
      setNftMintCount(hexToDecimal);
      setRemainingCount(formattedResult)
      setErrorMessage("")
    } else {
      setLoader(false)
      setNftMintCount("-");
      setRemainingCount("-");
    }
  }

  return (
    <>
    {adminDetails?.isInvestor && !adminDetails?.isAdmin ? <ErrorPage /> : <>
      <CBreadcrumb>
        <CBreadcrumbItem>
          Minting
        </CBreadcrumbItem>
        <CBreadcrumbItem active>Dashboard</CBreadcrumbItem>
      </CBreadcrumb>
      {errorMessage && (
        <Alert variant="danger">
          <div className='d-flex align-items-center'>
            <span className='icon error-alert'></span>
            <p className='m1-2' style={{ color: 'red' }}>{errorMessage}</p>
          </div>
        </Alert>
      )}
      <div className="text-center">{loader && <Spinner></Spinner>}</div>
      {!loader && (<>  <CRow className='db-cardsection minting-dash justify-content-center'>
        {!errorMessage && <> <div className="col-md-6 col-lg-2">
          <div className="dash-card">
            <div className="text-center my-4">
              <span className="bg-icon">
                <img src={dashicon}></img>
              </span>
            </div>
            <div className="text-center">
              <p className="card-lbl">Nft Count</p>
              <p className="card-value">{nftCount}</p>
            </div>
          </div>
        </div>
          <div className="col-md-6 col-lg-2">
            <div className="dash-card" >
              <div className="text-center my-4">
                <span className="bg-icon">
                  <img src={sale}></img>
                </span>
              </div>
              <div className="text-center">
                <p className="card-lbl">Minted Nfts</p>
                <p className="card-value">{nftMintCount}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-2">
            <div className="dash-card" >
              <div className="text-center my-4">
                <span className="bg-icon">
                  <img src={auction}></img>
                </span>
              </div>
              <div className="text-center">
                <p className="card-lbl">Remaining Nfts</p>
                <p className="card-value">{remainingCount}</p>
              </div>
            </div>
          </div></>}
      </CRow></>)}
      {props?.oidc?.defaultData?.id && <MintingGrid />}
      </>}
    </>
  )
}
const connectStateToProps = ({ oidc }) => {
  return { oidc: oidc };
}

export default connect(connectStateToProps)(MintingDashboard)
