import React, { Component } from "react";
import List from "../grid.component";
import { Link } from "react-router-dom";
import { CBreadcrumb, CBreadcrumbItem, } from '@coreui/react'
import Form from 'react-bootstrap/Form';
import moment from 'moment';
import Moment from "react-moment";
class LaunchpadCustomers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gridUrl: process.env.REACT_APP_API_END_POINT_KYCINFO + "/api/v1" + "/Projects/AllCustomersData",
            searchObj: {
                searchBy: null,
                isKYC: false
            },
            value: '',
        };
        this.gridRef = React.createRef();
    }



    gridColumns = [
        {
            field: "createdDate",
            title: "Date",
            filter: true,
            sortable: true,
            width: 140,
            filterType: "date",
            customCell: (props) => (
                <td>
                    <div>
                        <Moment format='DD/MM/YYYY'>{moment(new Date(props.dataItem.createdDate), 'DD/MM/YYYY')}</Moment>
                    </div>
                </td>
            )
        },
        {
            field: "walletAddress",
            title: "Wallet Address",
            filter: true,
            sortable: true,
            width: 450,
            customCell: (props) => (
                <td className='copy-width'>
                    <div className="d-flex justify-content-between" >
                        <span className="gridLink batch-filename d-flex justify-content-between">
                            <Link to={`/launchpad/customers/profileInfo/ProfileInfo/${props?.dataItem?.walletAddress}`}>{props?.dataItem?.walletAddress}</Link>
                        </span>

                    </div>
                </td>
            ),
        },
        {
            field: "firstName",
            title: "Name",
            filter: true,
            sortable: true,
            width: 200,
            customCell: (props) => (
                <td>
                    <div>
                        <span className="gridLink c-pointer batch-filename"><Link to={`/launchpad/customers/profileInfo/ProfileInfo/${props?.dataItem?.walletAddress}`}>{props?.dataItem?.firstName}</Link></span>
                    </div>
                </td>
            ),
        },
        {
            field: "email",
            title: "Email",
            filter: true,
            sortable: true,
            width: 210,
        },
        {
            field: "phoneNumber",
            title: "Phone Number",
            filter: true,
            sortable: true,
            width: 210,
        },
        {
            field: "country",
            title: "Country",
            filter: true,
            sortable: true,
            width: 150,
        },
        {
            field: "kycStatus",
            title: "KYC Status",
            filter: true,
            sortable: true,
            width: 140,
        },
    ];
    handleBlur = (e) => {
        let value = e.target.value.trim();
        e.target.value = value;
      };
    handleChange = (e) => {
        if (e.target.value == "") {
            let { searchObj } = this.state;
            searchObj.searchBy = null;
            this.gridRef?.current?.refreshGrid();
        } else {
            let value = e.target.value
            let { searchObj } = this.state;
            if (value == "") {
                searchObj.searchBy = null;
            } else {
                let data = value.trim();
                searchObj.searchBy = data;
            }
            this.setState({ ...this.state, searchObj });
            e.preventDefault();
        }
    };

    handleSearch = (data) => {
        let { searchObj } = this.state;
        if (data == "") {
            searchObj.searchBy = null;
        } else {
            searchObj.searchBy = data;
            this.setState({ ...this.state, searchObj }, () => {
                this.gridRef.current.refreshGrid();
            });
        }
    };
    handleEnterSearch = (e) => {
        let data = e.target.value.trim();
        if (e.key == 'Enter') {
            if (data == "") {
                e.target.value = data;
                e.preventDefault();
            } else {
                let { searchObj } = this.state;
                searchObj.searchBy = data;
                this.setState({ ...this.state, searchObj }, () => {
                    this.gridRef.current.refreshGrid();
                });
                e.target.value = data;
                e.preventDefault();
            }
        }
    }

    handleKYCCustomer = (e) => {
        let { searchObj } = this.state;
        searchObj.isKYC = e.target.checked;
        this.setState({ ...this.state, searchObj }, () => {
            this.gridRef.current.refreshGrid();
        });
    }

    render() {
        const { searchObj, gridUrl } = this.state;
        return (
            <>
            <h3 className='page-title mb-3'>Customers</h3>
                <CBreadcrumb>
                    <CBreadcrumbItem>
                        {/* <CLink >
                            <Link to={{ pathname: '/launchpad/dashboard' }}>Launchpad</Link>
                        </CLink> */}
                        Launchpad
                    </CBreadcrumbItem>
                    <CBreadcrumbItem>Customers</CBreadcrumbItem>
                </CBreadcrumb>

                <div className='custom-flex pb-4 pt-2 justify-content-between'>
                    <Form className="d-flex grid-search">
                        <Form.Control
                            name='searchBy'
                            type="text"
                            autoComplete="off"
                            className="search-style mb-3 my-lg-0"
                            aria-label="Search"
                            onChange={(e) => this.handleChange(e)}
                            onKeyDown={(e) => this.handleEnterSearch(e)}
                            onBlur={(e) => this.handleBlur(e)}
                            maxLength={250}
                            placeholder="Search By Name, Email and Wallet Address"
                        />
                        <i className="icon search-icon" onClick={()=>this.handleSearch(this.state.searchObj.searchBy)}></i>
                    </Form>
                    <Form className="d-flex grid-search mobile-block" >


                        <label className='check-input-style  c-pointer d-flex align-items-center'>
                            <input className=""
                                name='isCheck'
                                type="checkbox"
                                onClick={(e) => this.handleKYCCustomer(e)}
                            />
                            <span></span>
                        </label>{" "}<p className="ms-1 me-2 mb-0">Include All KYC Statuses</p>
                    </Form>
                </div>
                <div className=''>
                    <div className=''>
                        <div className=''>
                            <List
                                additionalParams={searchObj}
                                url={gridUrl}
                                ref={this.gridRef}
                                columns={this.gridColumns}
                                pSize={10}
                                className="custom-grid customer-list"
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
export default LaunchpadCustomers;