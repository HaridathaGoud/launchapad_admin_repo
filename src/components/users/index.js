import React, {useEffect , useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spinner,Modal, FloatingLabel } from 'react-bootstrap';
import apiCalls from 'src/api/apiCalls';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';

const UserInfo = () => {
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loader, setLoader] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [totalCardData, setTotalCardData] = useState([]);
  const [search, setSearch] = useState(null);
  const [loadeMessage, setLoaderMessage] = useState('');
  const pageSize = 10;



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
  const handleEdit = () => {
    setShow(true);

  }
  return (
    <div className=''>
      <div className='container'>
        <div className='d-flex align-items-baseline justify-content-between'>
          <h5 className="sub-title mb-2">Users</h5>
        </div>
        <div className='custom-flex pb-4 pt-2 justify-content-between'>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="search-style"
              aria-label="Search"
              onKeyUp={(e) => handleSearch(e)}
            />
          </Form>
          <div className='text-end my-3'><span onClick={handleEdit} className='icon add-icon'></span>
          </div>
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
                    <th >
                      First Name 
                    </th>
                    <th>
                     Last Name
                    </th>

                    <th>
                      User Name
                    </th>
                    <th>
                      Email
                    </th>
                    <th>
                      DOB
                    </th>
                    <th>
                     Phone No
                    </th>
                    <th>
                     Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {customerDetails?.map((items, index) => (<>
                    <tr key={index}>
                      <td>
                        <span>
                          Shazad
                        </span>
                      </td>
                      <td>
                        <span>Reddy</span>
                      </td>
                      <td>Mohammad</td>
                      <td>mohammad@yopmail.com</td>
                      <td>2/3/2023</td>
                      <td>+91 9387483623</td>
                      <td>Active</td>
                    </tr>
                  </>))}
                </tbody>
                {loadeMessage && <>
                  {customerDetails.length === 0 &&<tr><td colSpan="6"><h4 className="text-center text-white nodata-style">No data available</h4></td></tr> }
                </>}
              </Table>
            </div>
          </InfiniteScroll>
        </div>
        <Modal className="settings-modal profile-modal"
          show={show}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Form >
            <Modal.Header className="d-flex justify-content-between px-lg-4">
              <Modal.Title id="example-custom-modal-styling-title">
                Add User
              </Modal.Title>
              <span className="icon close" onClick={() => setShow(false)}></span>
            </Modal.Header>
            <Modal.Body>
              <Row className="custom-flex align-items-center mb-4 p-lg-3">

                <Col xl={6}>
                  <FloatingLabel
                    controlId="floatingInput"
                    label="User Name*"
                    className="mb-1 input-style mt-2"
                  >
                    <Form.Control name='contractAddress' type="text"
                      autoComplete="off" placeholder="User Name*" required />
                    <Form.Control.Feedback type="invalid">Please provide a valid UsertName .</Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
                <Col xl={6}>
                  <FloatingLabel
                    controlId="floatingInput"
                    label="First Name*"
                    className="mb-1 input-style mt-2"
                  >
                    <Form.Control name='First Name*' type="text"
                      autoComplete="off" placeholder="First Name*" required />
                    <Form.Control.Feedback type="invalid">Please provide a valid First Name.</Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
                <Col xl={6}>
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Last Name*"
                    className="mb-1 input-style mt-2"
                  >
                    <Form.Control name='Last Name*' type="text"
                      autoComplete="off" placeholder="Last Name*" required />
                    <Form.Control.Feedback type="invalid">Please provide a valid Last Name.</Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
                <Col xl={6}>
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Email*"
                    className="mb-1 input-style mt-2"
                  >
                    <Form.Control name='Email*' type="text"
                      autoComplete="off" placeholder="Email*" required />
                    <Form.Control.Feedback type="invalid">Please provide a valid Email.</Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
                <Col xl={6}>
                  <FloatingLabel controlId="floatingInput" className="mb-3 input-style" >
                    <InputGroup className="mb-3 input-style no-wrap mobile-noinput">

                      <Form.Control
                        required
                        as="select"
                        type="select"
                        name="country"
                        className="code-width"
                        aria-label="Default select example"
                      >

                        <option>+91</option>
                        <option>57275</option>
                        <option>57275</option>
                        <option>57275</option>
                        <option>57275</option>
                      </Form.Control>
                      <label className="floatingInput-number">Phone Number*</label>
                      <Form.Control
                        type="text" className="form-number"
                        name={'Gold'}
                        required
                      />

                    </InputGroup>
                  </FloatingLabel>
                </Col>
                <Col xl={6}>
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Date Of Birth*"
                    className="mb-1 input-style mt-2"
                  >
                    <Form.Control name='Date Of Birth*' type="date"
                      autoComplete="off" placeholder="Date Of Birth*" required />
                    <Form.Control.Feedback type="invalid">Please provide a valid Date.</Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
              </Row>

            </Modal.Body>
            <Modal.Footer className='p-lg-4'>
              <div className="text-end"><Button className="transparent-btn" onClick={() => setShow(false)}>Cancel</Button>
                <Button className="filled-btn ms-lg-3 ms-2" type="submit">
                  Save</Button></div>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
export default UserInfo;