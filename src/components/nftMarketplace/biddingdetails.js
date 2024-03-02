import React from "react";
import Moment from 'react-moment';
import nodata from "src/assets/images/no-data.png"
import Image from "react-bootstrap/Image"
const BiddingDetails = (props) => {
  return (
    <>
      <div className='user-content'>

        <table width='100%' className="user-table activity-table">
          <tbody>
            <>
              {props.bidData?.map((item, idx) => (
                <tr className="black-bg" key={idx}>
                  <td scope="row" className="user-value">
                  <label className="user-lbl ps-0">S.No</label>
                    {idx + 1}
                  </td>
                  <td className="user-value">
                  <label className="user-lbl ps-0">Date</label>
                    <Moment format="DD-MM-YYYY " className="">
                      {item.bidDate || '--'}
                    </Moment>
                  </td>
                  <td className="user-value">
                  <label className="user-lbl ps-0">Buyer Address</label>
                    {item.bidderAddress || '--'}</td>
                  <td className="user-value">
                  <label className="user-lbl ps-0">Bidding Amount</label>
                    {item.biddingAmount + ' ' || '--'}
                    {item.crypto ? item.crypto : ''}
                  </td>
                  <td className="user-value">
                  <label className="user-lbl ps-0">Creator Name</label>
                    {item.creatorName || '--'}</td>
                </tr>
              ))}
            </>
          </tbody>
         

        </table>
        {props.bidData?.length == 0 && (
          <>
            <div className="nodata-text db-no-data">
              <Image src={nodata} className="text-center" alt=""></Image>
              <h3 className="text-center nodata">No data found</h3>
            </div>
          </>
        )}
      </div>
    </>
  );

}
export default BiddingDetails

