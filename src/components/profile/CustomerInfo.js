import React, { useEffect, useState, useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spinner } from 'react-bootstrap';
import apiCalls from 'src/api/apiCalls';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';

const CustomerInfo = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loader, setLoader] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [totalCardData, setTotalCardData] = useState([]);
  const [search, setSearch] = useState(null);
  const [loadeMessage, setLoaderMessage] = useState('');
  const pageSize = 10;
  const shouldLog = useRef(true);

  useEffect(() => {
    if (shouldLog.current) {
      shouldLog.current = false;
      getAllCustomer(1, 10, null);
    }
  }, []);//eslint-disable-line react-hooks/exhaustive-deps

  const getAllCustomer = async (pageNo, pageSize, search) => {
    const skip = pageNo * pageSize - pageSize;
    const take = pageSize;
    setLoader(true);
    let response = await apiCalls.getAllcustomers(take, skip, search)
    if (response.ok) {
      let _pageNo = pageNo + 1;
      setPageNo(_pageNo);
      setSearch(search);
      setLoader(false);
      let MergeGridData = pageNo === 1 ? [...response.data] : [...customerDetails, ...response.data];
      setCustomerDetails(MergeGridData);
      if (MergeGridData.length > 0) {
        setLoaderMessage(' ');
      } else if (MergeGridData.length === 0) {
        setLoaderMessage('No data available');
      }
      if (search == null) {
        setTotalCardData(MergeGridData);
      }
    }
    else {
      setErrorMessage(apiCalls.isErrorDispaly(response));
      setLoader(false);
    }
  }

  const fetchMoreData = () => {
    if (customerDetails.length < 500) {
      setTimeout(() => {
        getAllCustomer(pageNo, pageSize, search);
      }, 500);
    }
    else {
      setHasMore(false)
    }
  };

  const handleSearch = ({ currentTarget: { value } }) => {
    if (value) {
      getAllCustomer(1, 10, value)
    }
    else {
      setCustomerDetails(totalCardData);
    }
  };

  return (
    <div className=''>
      <div className='container'>
        <h5 className="sub-title mb-3 mt-3 mt-md-0">Customers </h5>
        <div className='custom-flex pb-4 pt-2'>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="search-style"
              aria-label="Search"
              onKeyUp={(e) => handleSearch(e)}
            />
          </Form>
        </div>
        {errorMessage && (
          <Alert variant="danger">
            <div className='d-flex align-items-center'>
              <span className='icon error-alert'></span>
              <p className='m1-2' style={{ color: 'red' }}>{errorMessage}</p>
            </div>
          </Alert>
        )}
        <div className='profile-section'>
          <InfiniteScroll
            dataLength={customerDetails?.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4 className="text-center">{loader && <Spinner animation='border' />}</h4>}
            scrollThreshold="0.8"
            endMessage={<h4 className="text-center">No More Record</h4>}
          >
            <div className="customer-info customer-table">
              <Table>
                <thead>
                  <tr>
                    <th>
                      Wallet Address
                       
                    </th>
                    <th>
                      Name
                    
                    </th>

                    <th>
                      Email
                    
                    </th>
                    <th>
                      Phone Number
                   
                    </th>
                    <th>
                      Country
                    
                    </th>
                    <th>
                      KYC Status
                     
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {customerDetails?.map((items, index) => (<>
                    <tr key={index}>
                      <td>
                        <span onClick={() => navigate(`/ProfileInfo/${items.walletAddress}`)}>
                          {' '}
                          {items.walletAddress?.slice(0, 4) + '....' + items.walletAddress?.substring(items.walletAddress.length - 4)}
                        </span>
                      </td>
                      <td>
                        <span onClick={() => navigate(`/ProfileInfo/${items.walletAddress}`)}>{items.firstName ? items.firstName : "--"}                        </span>
                      </td>
                      <td>{items.email ? items.email : "--"}</td>
                      <td>{items.phoneNo ? items.phoneNo : "--"}</td>
                      <td>{items.country ? items.country : "--"}</td>
                      <td>{items.kycStatus ? items.kycStatus === "completed" && "Yes" : "No"}</td>
                    </tr>
                  </>))}
                </tbody>
                {loadeMessage && <>
                  {customerDetails.length === 0 &&<tr><td colSpan="6"> <h4 className="text-center nodata-style">No data available</h4></td></tr>}
                </>}
              </Table>
            </div>
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
}
export default CustomerInfo;