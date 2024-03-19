import React, { useEffect,useRef, useState } from "react"
import apiCalls from "src/api/apiCalls";
import Alert from 'react-bootstrap/Alert';
import Spinner from "react-bootstrap/esm/Spinner";
import dashicon from '../../assets/images/minter.svg'
import sale from '../../assets/images/sale.svg'
import auction from '../../assets/images/auction.svg'
import { connect, useSelector } from 'react-redux';
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
function MarketplaceDashboard() {
    const [adminCustomerDetails, setAdminCustomerDetails] = useState({})
    const [errorMsg, setErrorMsg] = useState(null);
    const [loader, setLoader] = useState(false);
    const adminDetails = useSelector(state => state.oidc?.adminDetails)


    const shouldLog = useRef(true);
    useEffect(() => {
         if (shouldLog.current) {
        shouldLog.current = false;
        SuperAdminDetails();}
    }, []);

    const SuperAdminDetails = async () => {
        setLoader(true)
        let res = await apiCalls.getAdminDashboarData(adminDetails.id)
        if (res.ok) {
            setAdminCustomerDetails(res.data)
            setLoader(false)
        }
        else {
            setErrorMsg(isErrorDispaly(res))
            setLoader(false)
        }
    }
    const isErrorDispaly = (objValue) => {
        if (objValue.data && typeof objValue.data === "string") {
            return objValue.data;
        } else if (
            objValue.originalError &&
            typeof objValue.originalError.message === "string"
        ) {
            return objValue.originalError.message;
        } else {
            return "Something went wrong please try again!";
        }
    }
    return <>
    <div className="bg-dashboard">
    <div className="text-center pt-5">
    <h3 className="page-title fs-3"> Welcome to <br/> Marketplace Dashboard</h3>
     <p className="db-content">The Marketplace dashboard provides users with a comprehensive <br/>
          overview of various projects, tasks, and activities within an organization.</p>
    </div>
    
        {errorMsg && (
            <Alert variant="danger">
                <div className='d-flex align-items-center'>
                    <span className='icon error-alert'></span>
                    <p className='m1-2' style={{ color: 'red' }}>{errorMsg}</p>
                </div>
            </Alert>
        )}
        <div className="dashboard-page mt-3">
           
            <div className="text-center">{loader && <Spinner fallback={loader}></Spinner>}</div>
            {!loader && adminCustomerDetails && <div className="row justify-content-center">
                <div className="col-md-6 col-lg-2">
                    <div className="dash-card bg-user">
                        <div className=" mb-3">
                            <span className=" ">
                                <img src={dashicon}></img>
                            </span>
                        </div>
                        <div className="">
                            <p className="card-lbl">Minters</p>
                            <p className="card-value">{adminCustomerDetails?.minters ? adminCustomerDetails?.minters : 0}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6  col-lg-2">
                    <div className="dash-card bg-staker">
                        <div className="mb-3">
                            <span className=" ">
                                <img src={sale}></img>
                            </span>
                        </div>
                        <div className="">
                            <p className="card-lbl">On Sale</p>
                            <p className="card-value">{adminCustomerDetails?.totalSaleNFTs ? adminCustomerDetails?.totalSaleNFTs : 0}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6  col-lg-2">
                    <div className="dash-card bg-investor">
                        <div className="mb-3">
                            <span className=" ">
                                <img src={auction}></img>
                            </span>
                        </div>
                        <div className="">
                            <p className="card-lbl">On Auction</p>
                            <p className="card-value">{adminCustomerDetails?.totalAuctionNFTs ? adminCustomerDetails?.totalAuctionNFTs : 0}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-4">
                    <div className="dash-card collect-card">
                        <div>
                            <p className="nft-title">NFTs Collection</p>
                            <p className="card-value nft-white">{adminCustomerDetails?.totalCollections ? adminCustomerDetails?.totalCollections : 0}</p>
                        </div>
                    </div>
                </div>

            </div>}
        </div>
        </div>

    </>
}

const connectStateToProps = ({ walletAddress, oidc }) => {
    return { address: walletAddress, trackAuditLogData: oidc.trackAuditLogData, customerId: oidc?.adminDetails?.id }
}
export default connect(connectStateToProps)(MarketplaceDashboard);