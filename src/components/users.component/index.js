import React, { useEffect, useRef, useState } from 'react';
import { CBreadcrumb, CBreadcrumbItem, CLink, } from '@coreui/react';
import { useNavigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/esm/Spinner';
import apiCalls from 'src/api/apiCalls';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

export default function Users() {
    const [loader, setLoader] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [adminUserDetails, setAdminUserDetails] = useState([]);
    const shouldLog = useRef(true);
    const navigate = useNavigate();
    const pageSize = 10;
    const [hasMore, setHasMore] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [totalCardData, setTotalCardData] = useState([]);
    const [search, setSearch] = useState(null);
    const [loadeMessage, setLoaderMessage] = useState('');


    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false;
            getUserDetail(1, 10, null)
        }
    }, []);//eslint-disable-line react-hooks/exhaustive-deps


    const getUserDetail = async (pageNo, pageSize, search) => {
        const skip = pageNo * pageSize - pageSize;
        const take = pageSize;
        setLoader(true);
        let response = await apiCalls.getAllCustomers(take, skip, search)
        if (response.ok) {
            let _pageNo = pageNo + 1;
            setPageNo(_pageNo);
            setSearch(search);
            setLoader(false);
            let MergeGridData = pageNo == 1 ? [...response.data] : [...adminUserDetails, ...response.data]
            setAdminUserDetails(MergeGridData);
            if (MergeGridData.length > 0) {
                setLoaderMessage(' ');
            } else if (MergeGridData.length == 0) {
                setLoaderMessage('No Data Found');
            }
            if (search == null) {
                setTotalCardData(MergeGridData);
            }
        } else {
            setErrorMessage(apiCalls.isErrorDispaly(response.data));
            setLoader(false);
        }
    };

    const fetchMoreData = () => {
        if (adminUserDetails.length < 500) {
            setTimeout(() => {
                getUserDetail(pageNo, pageSize, search);
            }, 500);
        }
        else {
            setHasMore(false)
        }
    };

    const handleSearch = ({ currentTarget: { value } }) => {
        if (value) {
            getUserDetail(1, 10, value)
        }
        else {
            setAdminUserDetails(totalCardData);
        }
    };

    function handlewalletAddress(item) { navigate(`/userprofile/${item.walletAddress}`) };

    return (
        <>
            <CBreadcrumb>
                <CBreadcrumbItem>
                    <CLink href="#" onClick={() => navigate('/home')}>home</CLink>
                </CBreadcrumbItem>
                <CBreadcrumbItem active>Users</CBreadcrumbItem>
            </CBreadcrumb>
            <h3 className='page-title mb-3'>Users</h3>

            {errorMessage && (
                <Alert variant="danger">
                    <div className='d-flex align-items-center'>
                        <span className='icon error-alert'></span>
                        <p className='m1-2' style={{ color: 'red' }}>{errorMessage}</p>
                    </div>
                </Alert>
            )}

            <Form className="d-flex grid-search">
                <Form.Control
                    type="search"
                    placeholder="Search"
                    className="search-style"
                    aria-label="Search"
                    onKeyUp={(e) => handleSearch(e)}
                    style={{ width: 250 }}
                />
                <i className="icon search-icon"></i>
            </Form>
            <div className='d-flex align-items-center filter-style c-pointer'><span className='icon grid-filter'></span><p className='ms-2 mb-0 project-text text-purple'>Filter</p></div>
            <div className='user-content'>
                <Row className='badge-style'>
                    <Col style={{ width: 250 }}><label className='project-text text-lightpurpl'>Wallet Address</label>
                       
                    </Col>
                    <Col style={{ width: 200 }}><label className='project-text text-lightpurpl'>Email</label>
                       
                    </Col>
                    <Col style={{ width: 150 }}><label className='project-text text-lightpurpl'>FirstName</label>
                        
                    </Col>
                    <Col style={{ width: 100 }}><label className='project-text text-lightpurpl'>LastName</label>
                       
                    </Col>
                    <Col style={{ width: 200 }}><label className='project-text text-lightpurpl'>Created At</label>
                      
                    </Col>
                    <Col style={{ width: 150 }}><label className='project-text text-lightpurpl'>KYC Status</label>
                        
                    </Col>
                    <Col className='d-flex align-items-center justify-content-center'><div className=''><span className='icon eye-view c-pointer'></span></div></Col>
                </Row>
                <InfiniteScroll
                    dataLength={adminUserDetails?.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<h4 className="text-center">{loader && <Spinner animation='border' />}</h4>}
                    scrollThreshold="0.8"
                    endMessage={<h4 className="text-center">No More Record</h4>}
                >
                    {adminUserDetails?.map((item, index) =>
                        <Row className='badge-style' key={index}>

                            <Col style={{ width: 250 }}><label className='project-text text-lightpurpl' onClick={() => handlewalletAddress(item)}>{item.walletAddress}</label>
                            </Col>
                            <Col style={{ width: 250 }}><label className='project-text text-lightpurpl'>{item.email}</label>
                            </Col>
                            <Col style={{ width: 250 }}><label className='project-text text-lightpurpl'>{item.firstName}</label>
                            </Col>
                            <Col style={{ width: 250 }}><label className='project-text text-lightpurpl'>{item.lastName}</label>
                            </Col>
                            <Col style={{ width: 250 }}><label className='project-text text-lightpurpl'>{item.createdDate.slice(0, 10)}</label>
                            </Col>
                            <Col style={{ width: 250 }}><label className='project-text text-lightpurpl'>{item.kycStatus ? item.kycStatus : "Pending"}</label>
                            </Col>

                        </Row>
                    )}
                    {loadeMessage && <>
                        {adminUserDetails.length === 0 && <h4 className=" text-danger text-center">No Data Found</h4>}
                    </>}
                </InfiniteScroll>
            </div>
        </>
    )
}