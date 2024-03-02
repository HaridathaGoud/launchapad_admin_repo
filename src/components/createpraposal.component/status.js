import React,{ useState } from 'react';
import { useSelector } from 'react-redux';
import CopyToClipboard from 'react-copy-to-clipboard';
import shimmers from '../shimmers/shimmers';
import PlaceHolder from '../shimmers/placeHolder';
import Moment from 'react-moment';
export default function Status() {
    const [copied ,setCopy]=useState(false);
    const proposarDetailas = useSelector((state) => state?.proposal?.proViewData)
    const [selection, setCopySelections]=useState(null);
    const PublishShimmers = shimmers.PublishProposal(3);
    const createdDate = new Date(proposarDetailas?.data?.startDate);
    const currentDate = new Date();
    const handleCopy=(data)=>{
        setCopy(true);
        setTimeout(() => {
            setCopySelections(data)
            setCopy(false);
        }, 1000);
    }
    const beforeStartTime = currentDate < createdDate;

    let iconClassName;
    let textClassName;
    
    if (proposarDetailas?.data?.status === "Pending" || proposarDetailas?.data?.status === "Publishing") {
      iconClassName = "icon pending-icon";
      textClassName = "pending-text";
    } else if (proposarDetailas?.data?.status === "declined") {
      iconClassName = "icon-dao reject-icon";
      textClassName = "close-text";
    } else {
      iconClassName = "icon failed-close";
      textClassName = "close-text";
    }

    return (
        <>
          {proposarDetailas?.loading && <PlaceHolder contenthtml={PublishShimmers}/> ||
        <div className='voting-card status-section status-bg'>
          <div className='px-3 py-3'>
          <h2>Status</h2>
          <p className='d-flex align-items-center'>
    <span className={iconClassName}></span>
    <span className={textClassName}>{proposarDetailas?.data?.status}</span>
  </p>
             <p className='my-3'>
                
             </p>
            
             <p className='my-3'>{(proposarDetailas?.data?.status && !beforeStartTime)  && "End Time"}</p>
            <p>{beforeStartTime && "Start Time"}</p>
             <p className='my-3'>
             <span className='icon-dao time'></span>
                <span className='common-text'> 
                <Moment local  format="DD/MM/YYYY HH:mm ">{beforeStartTime && proposarDetailas?.data.startDate || proposarDetailas?.data?.endDate}</Moment>(UTC)

                    </span>
             </p>
             <span className='common-text address-label'>
                {proposarDetailas?.data?.walletAddress ? proposarDetailas?.data?.walletAddress?.slice(0, 4) + '.......' + proposarDetailas?.data?.walletAddress?.substring(proposarDetailas?.data?.walletAddress?.length - 4, proposarDetailas?.data?.walletAddress?.length) : "--"}
                {proposarDetailas?.data?.walletAddress &&<CopyToClipboard 
                      text={proposarDetailas?.data?.walletAddress} 
                      options={{ format: 'text/plain' }}
						        	onCopy={() => handleCopy(proposarDetailas?.data?.walletAddress)}
              >
							<span className={(copied && selection === proposarDetailas?.data?.walletAddress) ? "icon copied-check ms-2" : "icon copy c-pointer"}></span>
						</CopyToClipboard>}
                </span>
            </div> 
             
        </div>}
                    
        </>
    );
}
