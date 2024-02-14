import React,{ useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { Card, Modal } from 'react-bootstrap';
import { Link,useParams } from "react-router-dom";
import Image from "react-bootstrap/Image"
import profileavathar from "../../assets/images/default-avatar.jpg";
import nodata from "src/assets/images/no-data.png"
import apiCalls from 'src/api/apiCalls';
import { Network, Alchemy } from 'alchemy-sdk';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useSelector } from 'react-redux';
const network=process.env.REACT_APP_ENV==="production"?Network.MATIC_MAINNET:Network.MATIC_MUMBAI

const config = {
  apiKey: process.env.REACT_APP_ALCHEMY_APP_KEY, // Replace with your API key
  network: network, // Replace with your network
};
const alchemy = new Alchemy(config);
const MintedNfts = (props) => {
  const [loader, setLoader] = useState(false);
  const params = useParams()
  const [show, setShow] = useState(false);
  const [selectedNft, setSelectedNft] = useState({});
  const [nfts, setNFTS] = useState(null);
  const [selectedNftProperties,setSelectedNftProperties]=useState(null)
  const [errorMessage, setErrorMessage] = useState(null);
  const [copied,setCopied]=useState(false);
  const [selection, setCopySelections]=useState(null);
  const selectedDAO = useSelector((state) => state?.oidc?.defaultData);
  useEffect(() => {
    getWalletNFTS();
  }, [props.activeTab,selectedDAO]);

  const getWalletNFTS = async () => {
   
    let address = params.address;
    let contract=selectedDAO?.mintingContractAddress;
    let options = {
      contractAddresses: [contract],
    };
    setLoader(true)
    let mintedNfts = await alchemy.nft.getNftsForOwner(address,options);
    if(mintedNfts){
      setNFTS(mintedNfts.ownedNfts);
      getNftDetails(mintedNfts.ownedNfts);
      setLoader(false)
    }else{
      setErrorMessage(apiCalls.isErrorDispaly(mintedNfts));
      setLoader(false);
    }
  };

  const getNftDetails = (_nfts) => {
   
    let list = [];
    let data = _nfts.map((item) => {
      return {
        ...item.rawMetadata,
        tokenId: item.tokenId,
        tokenType: item.tokenType,
        tokenAddress: item?.contract?.address,
      };
    });
    for (let item of data) {
      let obj = Object.assign({}, item);
      let filePath = item?.image?.replace('ipfs://', '') || item?.imageUrl?.replace('ipfs://', '');
      obj.image = 'https://ipfs.io/ipfs/' + `${filePath}`;
      list.push(obj);
    }
    setNFTS(list);
  };


  const getNFTImageUrl = (file) => {
   return file?.replace('ipfs://', '');
  };

  const handleModal = (item) => {
   
    setShow(true);
    setSelectedNft(item);
    setSelectedNftProperties(item.attributes)
  };
  const handleModalClose = () => {
    setShow(false);
  };
 const handleCopy = (dataItem) => {
      setCopied(true)
      setCopySelections(dataItem)
      setTimeout(() => setCopied(false), 1000)
	}
  return (
    <>
     {errorMessage && (
        <Alert variant="danger">
          <div className='d-flex align-items-center'>
            <span className='icon error-alert'></span>
            <p className='m1-2' style={{ color: 'red' }}>{errorMessage}</p>
          </div>
        </Alert>
        )}
  <Modal
          show={show}
          className="mycollections-modal"
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
           <Modal.Header className="d-flex justify-content-between">
            <Modal.Title id="example-custom-modal-styling-title">
            NFT Details
            </Modal.Title>
            <span className="icon md close c-pointer" onClick={() => handleModalClose()}></span>
          </Modal.Header>
          <Modal.Body>
            <div className="row mobile-reverse">
              <div>
                
              </div>
              <div className="col-md-7">
                <h2 className="modal-title">
                  {selectedNft?.name}
                </h2>
                <div className="row mb-4">
                  <div className="col-md-4">
                    <p className="modal-text-small">
                      Owned by{' '}
                      <span className="text-purple-color">
                        {props.user?.trim()}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="mb-5">
                  <h3 className="modal-sub-title">Description</h3>
                  <p className="modal-common-text">{selectedNft?.description?selectedNft?.description:'-'}</p>
                </div>
                <div className="modal-details">
                  
                  {selectedNftProperties?.length>0? 
                    <>
                    <h3 className="modal-sub-title">Properties</h3>
                    <div className='row'>
                      {selectedNftProperties?.map((item) => (
                        <div className='col-6 col-lg-3'>
                        <div className="properties-box ">
                          <p className="">{item.trait_Type}</p>
                          <p>{item.value}</p>
                        </div>
                        </div>
                      ))} 
                      </div>
                    </>:""
                  }
                  <h3 className="modal-sub-title">Details</h3>
                  <div className="row first-row">
                    
                    <div className="col-md-4 col-sm-2 properties-align">
                      <label>Token ID</label>
                      <p>{selectedNft?.tokenId}</p>
                    </div>
                    <div className="col-md-4 col-sm-2 properties-align">
                      <label>Token Standard</label>
                      <p>{selectedNft.tokenType}</p>
                    </div>

                    <div className="col-md-4 col-sm-2 properties-align">
                      <label>Chain</label>
                      <p>Polygon</p>
                    </div>
                    <div className="col-md-4 col-sm-2 properties-align">
                      <label>Contract Address</label>
                      <div className='d-flex'> 
                      <p className='text-ellipsis '>
                        {selectedNft?.tokenAddress}
                      </p>
                      <CopyToClipboard 
                      text={selectedNft?.tokenAddress} 
                      options={{ format: 'text/plain' }}
						        	onCopy={() => handleCopy(selectedNft?.tokenAddress)}
              >
							<span className={(copied && selection === selectedNft?.tokenAddress) ? "icon copied-check ms-2" : "icon copy c-pointer"}></span>
						</CopyToClipboard>
            </div>
                    </div>                  
                  </div>
                </div>
              </div>
              <div className="col-md-5">
                <div className="image-bgcard">
                  <div>
                    <Image
                      width={300}
                      height={500}
                      src={selectedNft?.image?.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                      className="modal-img"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      <div className="items-tab">
        
              <div className="row mt-4">
            <div className="col-md-12">
              <div className="row creator-card create-by-row">
                <div className="text-center">{loader && <Spinner></Spinner>}</div>
                {!loader && (
                  <> 
                 
                   {nfts!==0 && nfts?.map((item, idx) => (
                    <div className="col-md-6 col-lg-3 col-xl-3 mt-3" >
                     
                      <Card className="creator-bg created-card" onClick={() =>handleModal(item)}>
                        <Link>

                          <div className="account-card-img">
                          <Image className='creator-img card-img' src={item?.image ? `${getNFTImageUrl(item?.image)}` : profileavathar
                                }></Image>
                          
                          </div>
                        </Link>
                        <div className="creator-like">
                          <span
                            className={`icon md creator-icon`}
                          ></span>
                        </div>
                       
                          <Card.Body className="pb-0 pe-0 ps-0 pt-0">
                            <div className="card-body">
                              <h4 className="card-title mb-0 b-0 text-white">
                                {item?.name}
                              </h4>
                            </div>
                          </Card.Body>
                      </Card>
                    </div> ) )}

                    {nfts?.length == 0 && (
          <>
            <div className="nodata-text db-no-data">
              <Image src={nodata} className="text-center" alt=""></Image>
              <h3 className="text-center nodata">No data found</h3>
            </div>
          </>
        )}
                  </>
                )}

              </div>
            </div>
          </div>
      </div>
    </>
  )
}

export default MintedNfts
