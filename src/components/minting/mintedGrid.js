import React, {useEffect } from "react";
import List from "../grid.component";
import { Link } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import moment from 'moment';
import Moment from "react-moment";

const MintingGrid =(props)=>{
const gridRef = React.createRef();
const data = useSelector(state => state.oidc?.defaultData?.id);
  useEffect(()=>{
	gridRef.current.refreshGrid();
	window.scroll(0,0)
  },[props?.oidc?.defaultData?.id])//eslint-disable-line react-hooks/exhaustive-deps
	
const gridColumns = [
		{
			field: "createdDate",
			title: "Date",
			filter: true,
			filterType: "date",
			width: 140,
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
			width: 400,
			customCell: (props) => (
				<td className='copy-width'>
					<div className="d-flex justify-content-between" >
						<span className="gridLink batch-filename d-flex justify-content-between">
							<Link to={`/minting/customers/profileinfo/${props?.dataItem?.walletAddress}/${props?.dataItem?.id}`}>{props?.dataItem?.walletAddress}</Link>
						</span>
					</div>
				</td>
			),
		},
		{
			field: "firstName",
			title: "Name",
			filter: true,
			width: 200,
			customCell: (props) => (
				<td>
					<div>
						<span className="gridLink c-pointer batch-filename">
						<Link to={`/minting/customers/profileinfo/${props?.dataItem?.walletAddress}/${props?.dataItem?.id}`}>{props?.dataItem?.firstName}</Link>
						</span>
					</div>
				</td>
			),
		},
		{
			field: "email",
			title: "Email",
			filter: true,
			width: 180,
		},
		{
			field: "mintingCount",
			title: "Minting Count",
			width: 210,
			dataType: "number",
			filterType: "numeric"
		},
		{
			field: "kycStatus",
			title: "KYC Status",
			filter: true,
			width: 200,
		},
	];

		return (
			<>
            <div className='minnt'>
            <div className=''>
            <h5 className="sub-title mb-3 mt-5">Minted Nft Members</h5>
				<div className='profile-section'>
					<List
					   additionalParams={data.split('/')}
					   url={process.env.REACT_APP_API_GRID +"/api/v1" + `/Admin/customermembershipsk`}
						ref={gridRef}
						columns={gridColumns}
						pSize={10}
						className="custom-grid"
					/>
				</div>
                </div>
                </div>
			</>
		);
	
}
const connectStateToProps = ({walletAddress,oidc }) => {
	return { address: walletAddress,trackAuditLogData: oidc.trackAuditLogData,customerId:oidc?.adminDetails?.id,oidc:oidc  }
  }
export default connect(connectStateToProps)(MintingGrid);

