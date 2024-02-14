import React, { useEffect, useState } from "react"
import apiCalls from "src/api/apiCalls";
import Alert from 'react-bootstrap/Alert';
import Spinner from "react-bootstrap/esm/Spinner";
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import profileo from '../../assets/images/avatars/1.jpg';
import profileo2 from '../../assets/images/avatars/2.jpg';
import profileo3 from '../../assets/images/avatars/3.jpg';
import profileo4 from '../../assets/images/avatars/4.jpg';
import profileo5 from '../../assets/images/avatars/5.jpg';


const UsersDetails = () => {
    const [customerDetails, setCustomerDetails] = useState([])
    const [errorMsg, setErrorMsg] = useState(null);
    const [loader, setLoader] = useState(false);
    const [userFilter, setFilterUser] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        getCustomerAllDetails();
    }, []);
    const pageSize =10;
    const getCustomerAllDetails = async (searchBy) => {
        setLoader(true)
        let pageNo = Math.ceil(customerDetails?.length / pageSize) + 1;
        let res = await apiCalls.getAllCustomers(pageSize,pageNo,searchBy||null)
        if (res.ok) {
            const MergeGridData = [...userFilter, ...res.data]
            setCustomerDetails(MergeGridData)
            setFilterUser(MergeGridData)
            setLoader(false)
            
        } else {
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
   
    
    return (
        <>
           
           
            {errorMsg && (
                <Alert variant="danger">
                    <div className='d-flex align-items-center'>
                        <span className='icon error-alert'></span>
                        <p className='m1-2' style={{ color: 'red' }}>{errorMsg}</p>
                    </div>
                </Alert>
            )}
            <Form className="d-flex grid-search justify-content-between">
            <h3 className='page-title mb-0'>Customers</h3>
            <Dropdown>
                <Dropdown.Toggle  id="dropdown-basic">
                  <span className="icon filter-icon"></span> Filter
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>
            </Form>
                    <center>{loader && <Spinner fallback={loader}></Spinner>}</center> 
                    <div className='user-content'>
                       
                        <table width='100%'className="user-table">
                            <tr>
                                <td style={{width:'80px'}}><img src={profileo} ></img></td>
                                <td>
                                    <p className="user-lbl">Name</p>
                                    <p className="user-value">cristiana</p>
                                </td>
                                <td style={{width:'200px'}}>
                                    <p  className="user-lbl">Mail Id</p><p className="user-value">Mohan5@gmail.com</p>
                                </td>
                               <td style={{width:'180px'}}>
                                 <p className="user-lbl">Wallet Address</p><p className="user-value">#1230145202741</p>
                               </td>
                               <td style={{width:'180px'}}>
                                <p className="user-lbl">Created NFT</p>
                                <p className="user-value">Rich Rhinos</p>
                               </td>
                               <td>
                                <p className="user-lbl">Collection</p>
                                <p className="user-value">Gaming</p>
                               </td>
                               <td>
                               <span className="view-link"onClick={() => navigate('/profileinfo')}><span className="icon view-icon"></span>View</span>
                               </td>
                            </tr>
                            <tr>
                                <td style={{width:'80px'}}><img src={profileo2}></img></td>
                                <td>
                                    <p className="user-lbl">Name</p>
                                    <p className="user-value">Mohan</p>
                                </td>
                                <td style={{width:'200px'}}>
                                    <p  className="user-lbl">Mail Id</p><p className="user-value">Mohan5@gmail.com</p>
                                </td>
                               <td style={{width:'180px'}}>
                                 <p className="user-lbl">Wallet Address</p><p className="user-value">#1230145202741</p>
                               </td>
                               <td style={{width:'180px'}}>
                                <p className="user-lbl">Created NFT</p>
                                <p className="user-value">Rich Rhinos</p>
                               </td>
                               <td>
                                <p className="user-lbl">Collection</p>
                                <p className="user-value">Art</p>
                               </td>
                               <td>
                               <span className="view-link"><span className="icon view-icon"></span>View</span>
                               </td>
                            </tr>
                            <tr>
                                <td style={{width:'80px'}}><img src={profileo3}></img></td>
                                <td>
                                    <p className="user-lbl">Name</p>
                                    <p className="user-value">Riz</p>
                                </td>
                                <td style={{width:'200px'}}>
                                    <p  className="user-lbl">Mail Id</p><p className="user-value">Mohan5@gmail.com</p>
                                </td>
                               <td style={{width:'180px'}}>
                                 <p className="user-lbl">Wallet Address</p><p className="user-value">#1230145202741</p>
                               </td>
                               <td style={{width:'180px'}}>
                                <p className="user-lbl">Created NFT</p>
                                <p className="user-value">Rich Rhinos</p>
                               </td>
                               <td>
                                <p className="user-lbl">Collection</p>
                                <p className="user-value">Collectibles</p>
                               </td>
                               <td>
                               <span className="view-link"><span className="icon view-icon"></span>View</span>
                               </td>
                            </tr>
                            <tr>
                                <td style={{width:'80px'}}><img src={profileo4}></img></td>
                                <td>
                                    <p className="user-lbl">Name</p>
                                    <p className="user-value">changua</p>
                                </td>
                                <td style={{width:'200px'}}>
                                    <p  className="user-lbl">Mail Id</p><p className="user-value">Mohan5@gmail.com</p>
                                </td>
                               <td style={{width:'180px'}}>
                                 <p className="user-lbl">Wallet Address</p><p className="user-value">#1230145202741</p>
                               </td>
                               <td style={{width:'180px'}}>
                                <p className="user-lbl">Created NFT</p>
                                <p className="user-value">Rich Rhinos</p>
                               </td>
                               <td>
                                <p className="user-lbl">Collection</p>
                                <p className="user-value">Domain Name</p>
                               </td>
                               <td>
                               <span className="view-link"><span className="icon view-icon"></span>View</span>
                               </td>
                            </tr>
                            <tr>
                                <td style={{width:'80px'}}><img src={profileo5}></img></td>
                                <td>
                                    <p className="user-lbl">Name</p>
                                    <p className="user-value">Rosy</p>
                                </td>
                                <td style={{width:'200px'}}>
                                    <p  className="user-lbl">Mail Id</p><p className="user-value">Mohan5@gmail.com</p>
                                </td>
                               <td style={{width:'180px'}}>
                                 <p className="user-lbl">Wallet Address</p><p className="user-value">#1230145202741</p>
                               </td>
                               <td style={{width:'180px'}}>
                                <p className="user-lbl">Created NFT</p>
                                <p className="user-value">Rich Rhinos</p>
                               </td>
                               <td>
                                <p className="user-lbl">Collection</p>
                                <p className="user-value">Loaded Lions</p>
                               </td>
                               <td>
                               <span className="view-link"><span className="icon view-icon"></span>View</span>
                               </td>
                            </tr>
                        </table>
                    </div>
        </>
    )
}
export default UsersDetails;