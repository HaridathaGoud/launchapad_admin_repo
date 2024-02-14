import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import bgshadow from '../../../src/assets/images/greenbg.svg';
import Image from 'react-bootstrap/Image';
import { useParams, useNavigate, Link } from "react-router-dom";
import { connect, useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { useContract } from '../../contract/useContract';
import Alert from 'react-bootstrap/Alert';
import MintContract from '../../contract/mint.json';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { getMetaDataDetails, getMemberTypes, getMemberPrice, walletAddressChecking, setCustomerWalletAddress } from 'src/reducers/authReducer';
import apiCalls from 'src/api/apiCalls';
import { useConnectWallet } from '../../hooks/useConnectWallet';
import ToasterMessage from "src/utils/toasterMessages";
import store from 'src/store';

const polygonUrl = process.env.REACT_APP_ENV === "production" ? process.env.REACT_APP_CHAIN_MAIN_POLYGON_SCAN_URL : process.env.REACT_APP_CHAIN_MUMBAI_POLYGON_SCAN_URL

const MintGeneral = (props) => {
    const type = 'General'
    const [nftPrice, setNftPrice] = useState(0);
    const [count, setCount] = useState(1);
    const [isMinting, setMinting] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [loader, setLoader] = useState(false);
    const [validLoader, setValidLoader] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [getMemberShipPriceDetails, setGetMemberShipPriceDetails] = useState("Matic");
    const [selectedData, setSelectedData] = useState({});
    const [luDataSet, setLuData] = useState(null);
    const memberType = useSelector((state) => state.oidc.memberType);
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const { getSafeMintMultipleKOL, parseError } = useContract();
    const [success, setSuccess] = useState(null);
    const projectId = process.env.REACT_APP_PROJECTID;
    const projectSecret = process.env.REACT_APP_PROJECTSECRET;
    const authorization = 'Basic ' + btoa(projectId + ':' + projectSecret);
    const [metaDataUri, setMetaDataUri] = useState([]);
    const [coinDetails, setCoinDetails] = useState('Matic');
    const [kycChecking, setKycCheching] = useState(null)
    const params = useParams();
    const navigate = useNavigate();
    const { isConnected } = useAccount();
    const { connectWallet } = useConnectWallet();
    const [maxMintedNfts, setMaxMintedNfts] = useState(null);
    const [maxNftCount, setMaxNftCount] = useState(null);
    const [memberShipImage, setMemberShipImage] = useState(null)
    const [kolData, setKolData] = useState(null)
    const [note, setNote] = useState(null)
    const [walletCustomerId, setWalletCustomerId] = useState({})
    const [errorWalletAddress, setErrorWallet] = useState(null);
    const [isValidChange, setIsValidChange] = useState(true)
    const [isMintChange, setIsMintChange] = useState(false)
    const [txHash, setTxHash] = useState(null)
    const [referralPrice, setReferralPrice] = useState()
    const contractAddress = props?.contractAddress

    useEffect(() => {
        setIsMintChange(false);
        setIsValidChange(true);
        setKycCheching(null);
        setErrorMsg(null);
        setNote(null);
        setCount(1)
        let daoId = props?.daoData;
        store.dispatch(setCustomerWalletAddress({ key: 'getWalletAddressChecking', data: null }));
        props.trackMemberType(daoId, (memType) => {
            setGetMemberShipPriceDetails(memType?.data[0]?.prices[0].crypto)
            getMemberShipTypes(memType);
            setMaxMintedNfts(memType?.data[0]?.maxMintedNfts)
            setMaxNftCount(memType?.data[0]?.maxNftCount)
            setKolData(memType?.data[0]?.period)
            setMemberShipImage(memType?.data[0]?.imageUrl)
        });
    }, [props?.daoData, props?.contractAddress])
    const ipfs = ipfsHttpClient({
        url: process.env.REACT_APP_IPFSURL,
        headers: {
            authorization,
        },
    });


    const handleInputChange = (e) => {
        setKycCheching(e.target.value);
        setIsValidChange(true);
        setIsMintChange(false);
        setNote(null);
        setErrorMsg(false);
    }

    async function getBalanceCount() {

        try {
            const _connector = window?.ethereum;
            const _provider = new ethers.providers.Web3Provider(_connector);
            const _contract = new ethers.Contract(contractAddress, MintContract.abi, _provider);
            const _count = await _contract.balanceOf(kycChecking);
            const _hex = _count?._hex;
            const hexToDecimal = parseInt(_hex, 16);
            return hexToDecimal

        } catch (error) {
        }
    }


    const handleCounterIncrement = () => {
        let quantity = count + 1;
        if (quantity <= maxNftCount) {
            setErrorMsg(null);
            setNftPrice(0);
            setCount(quantity);
        } else {
            setNote(`Only a maximum of ${maxNftCount} NFTs are allowed to be minted per transaction.`)
        }
    };

    const handleCounterDecrement = () => {
        setNote(null);
        if (count != 1) {
            setErrorMsg(null);
            setNftPrice(0);
            setCount(count - 1);
        }
    };


    const validCustomer = () => {
        isValidLoader(true)
        const walletAddressValidations = /^0x[a-fA-F0-9]{40}$/gm; //walletaddress checking
        const htmlTagRegex = /<[^>]*>/g; // Matches any HTML tag
        const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g; // Matches emojis
        if (htmlTagRegex.test(kycChecking) || emojiRegex.test(kycChecking)) {
            setErrorWallet(true);
            isValidLoader(false);
        } else if (kycChecking) {
            if (walletAddressValidations.test(kycChecking)) {
                handleMintWithBalanceOf()
            } else {
                setErrorMsg("Please enter valid wallet address")
                isValidLoader(false)
            }

        } else {
            setErrorMsg("Please enter wallet address")
            isValidLoader(false);
        }
    }
    const handleMintWithBalanceOf = () => {
        setNote(null);
        setErrorMsg(null)
        setErrorWallet(null)
        isValidLoader(true);
        if (kycChecking) {
            props.trackWallet(kycChecking || params.id, (walletData) => {
                setWalletCustomerId(walletData)
                setNote(null);
                getBalanceCount();
                if (walletData?.isKyc) {
                    isValidLoader(false);
                    setIsValidChange(false);
                    setIsMintChange(true);
                } else if (!walletData?.isKyc) {
                    setErrorMsg("Kyc is not completed for this wallet address");
                    isValidLoader(false);
                } else {
                    setErrorMsg(isErrorDispaly(walletData));
                    isValidLoader(false);
                }

            })

        }
    }

    const handleMinting = async () => {
        const mintedNftCount = await getBalanceCount();
        function proceed() {
            setErrorMsg(null);
            enableDisableLoader(true);
            if (count <= maxNftCount) {
                let checkCount = mintedNftCount + count;
                if (checkCount <= maxMintedNfts) {
                    props.trackauditlogs(props?.daoData, count, (data) => {
                        getMetaDataList(data, walletCustomerId);
                    });
                } else if (checkCount > mintedNftCount) {
                    if (mintedNftCount == maxMintedNfts) {
                        setNote("The maximum number of NFTs has already been minted.")
                        setLoader(false);
                    } else {
                        setNote(`The given address already has  ${mintedNftCount} NFTs.You can't mint more NFTs for the given address`)
                        setLoader(false);
                    }
                }
            } else {
                setNote(`Only a maximum of ${maxNftCount} NFTs are allowed to be minted per transaction.`)
                enableDisableLoader(false);
            }
        }
        setNote(null);
        setMetaDataUri([]);
        setErrorMsg(null);
        setErrorWallet(null)
        enableDisableLoader(true);

        if (isConnected) {
            proceed();
        }
        else {
            try {
                await connectWallet();
                enableDisableLoader(false);
                proceed();
            } catch (error) {
                setErrorMsg(parseError(error));
                enableDisableLoader(false);
            }

        }
    };

    const getMetaDataList = (data, walletData) => {
        if (data[0]?.name) {
            ipfsDataUpload(data, walletData);
        } else {
            setErrorMsg(isErrorDispaly(data));
            enableDisableLoader(false);
        }

    };

    const ipfsDataUpload = async (data, walletData) => {
        let metaDataDetails = data;
        let metadataIpfs;
        let fileNames = [];
        for (let item of metaDataDetails) {
            const base64String = item?.image;
            const binaryString = atob(base64String);
            let buffer = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                buffer[i] = binaryString.charCodeAt(i);
            }
            const result = await ipfs.add(buffer);
            if (!result) {
                setErrorMsg(isErrorDispaly(result));
            }
            item.image = `ipfs://${result?.path}`;
            let nftMetadata = JSON.stringify(item);
            const jsonBlob = new Blob([nftMetadata], { type: 'application/json' });
            metadataIpfs = await ipfs.add(jsonBlob);
            metaDataUri.push(metadataIpfs.path);

            fileNames.push({
                fileName: item.serialNo,
                ImageCid: result?.path,
                Description: item.description,
                NftName: item.name,
                cid: metadataIpfs.path,
                coin: coinDetails,
                price: Number(referralPrice).toFixed(8)
            });

        }
        ipfsMetadata(metaDataUri, fileNames, walletData);
    };

    const ipfsMetadata = async (uri, fileNames, walletData) => {
        let kolAddress = kycChecking;
        setTxHash(null)
        try {
            const response = await getSafeMintMultipleKOL(uri, coinDetails, nftPrice, kolAddress);
            transactionHash(response, fileNames, walletData);
        } catch (error) {
            setMetaDataUri([])
            setErrorMsg(parseError(error));
            enableDisableLoader(false);
        }
    };

    const isValidLoader = (val) => {
        setValidLoader(val)
        setIsValid(val)
    }
    const enableDisableLoader = (val) => {
        setLoader(val);
        setMinting(val);
    };

    const transactionHash = async (response, transactionObj, walletData) => {
        let obj = {
            transactionHash: response.hash,
            files: transactionObj,
            customerId: walletData?.customerId,
            daoId: props?.daoData
        }
        await apiCalls.updateTransaction(obj);
        const _connector = window?.ethereum;
        const provider = new ethers.providers.Web3Provider(_connector);
        try {
            setTxHash(response.hash)
            const txResponse = await provider.waitForTransaction(response.hash);
            if (txResponse && txResponse.status === 0) {
                setErrorMsg('Transaction failed please try again');
                setMinting(false)
                enableDisableLoader(false);
            } else {
                setSuccess('NFT has minted successfully');
                setTimeout(() => {
                    navigate("/minting/mintnow")
                }, 2000);

            }
        } catch (error) {
            setErrorMsg(isErrorDispaly(error));
            enableDisableLoader(false)
        }
        setMinting(false)
        enableDisableLoader(false);
    };
    const getMemberShipTypes = async (getMemberTypes) => {
        setNftPrice(0);
        setLuData(getMemberTypes?.data[0].prices);
        if (type === 'General') {
            setSelectedData(getMemberTypes?.data[0]);
            setLuData(getMemberTypes?.data[0]?.prices);
            getMemberShipPrice(getMemberTypes?.data[0]?.prices[0]?.crypto, getMemberTypes?.data[0]?.id, count);
        }
    };

    const handleCryptoChange = (crypto) => {
        setNote(null);
        let selectedId = selectedData?.id;
        setCoinDetails(crypto?.crypto);
        getMemberShipPrice(crypto?.crypto, selectedId, count);
        props.trackMemberPrice(crypto?.crypto, selectedId);
        setCount(1);
    };
    const getMemberShipPrice = async (crypto, selectedId, counts) => {
        let response = await apiCalls.memberPrice(crypto, selectedId, counts)
        if (response) {
            setNftPrice(0);
            setSelectedCrypto(response.data);
            setGetMemberShipPriceDetails(response.data.crypto);
        } else {
            setErrorMsg(isErrorDispaly(response));
        }
    };

    const isErrorDispaly = (objValue) => {
        if (objValue.data && typeof objValue.data === "string" || objValue.title || objValue.reason) {
            return objValue.data || objValue.title || objValue.reason;
        } else if (
            objValue.originalError &&
            typeof objValue.originalError.message === "string"
        ) {
            return objValue.originalError.message;
        } else {
            return "Something went wrong please try again!";
        }
    };


    return (<>
        {memberType?.isLoading ? <div className='d-flex justify-content-center'> <Spinner /> </div> : <div className="d-flex justify-content-center">

            <div className="row page-content align-center-dashboard">
                <div className="col-md-6 col-xs-12">
                    <div className="detailview-btns">
                    </div>
                    {errorMsg && (
                        <Alert variant="danger" className="cust-alert-design">
                            <div className='d-flex align-items-center justify-content-between'>
                                <p className='mb-0 errorbreak-all'>
                                    <span className='icon error-alert c-pointer'></span>
                                    {errorMsg}
                                </p>
                                {txHash &&
                                    <div className='text-blue'>
                                        <Link className='text-end hyper-text' to={`${polygonUrl}${txHash}`} >
                                            Click here </Link>
                                        <span className='mr-25 mb-0 text-error'>to see details</span></div>}
                            </div>
                        </Alert>
                    )}
                    {memberType?.error && (
                        <Alert variant="danger" className="cust-alert-design">
                            <div className='d-flex align-items-center'>
                                <span className='icon error-alert'></span>
                                <p className='m1-2' style={{ color: 'red' }}>{memberType?.error}</p>
                            </div>
                        </Alert>
                    )}
                    <div className="detailview-content mb-5">
                        <h2 className="detailview-title">{selectedData?.heading}</h2>
                        <p className="regular-text mb-4">{selectedData?.description}</p>


                        <p className="price-label mb-0">Quantity</p>
                        <div className="position-relative">
                            <div className="">
                                <div>
                                    <InputGroup className="mb-3 mint-group toggle-menu ">
                                        <Dropdown defaultValue={(getMemberShipPriceDetails ? getMemberShipPriceDetails : selectedCrypto?.crypto)} >
                                            <Dropdown.Toggle variant="secondary" id="dropdown-basic" disabled={true}>
                                                {!selectedCrypto ? selectedData?.prices?.crypto : selectedCrypto?.crypto}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {luDataSet?.map((item) => (
                                                    <Dropdown.Item
                                                        active={item.crypto === coinDetails}
                                                        value={item.crypto} onClick={() => handleCryptoChange(item)}>
                                                        {item.crypto}
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        <Form.Control className='mint-input'
                                            disabled
                                            readOnly
                                            placeholder="0.00"
                                            value={getMemberShipPriceDetails && `${nftPrice}${' '}${getMemberShipPriceDetails}`}
                                        />
                                    </InputGroup>
                                </div>
                                <div className="change-value d-flex">
                                    <Button className="icon sm subicon" onClick={handleCounterDecrement}></Button>
                                    <p>{count}</p>
                                    <Button className="icon sm addicon" onClick={handleCounterIncrement}></Button>
                                </div>
                            </div>
                        </div>
                        <div className='row mb-3'>
                            <div className='d-flex align-item-center justify-content-between mt-3'>
                                <p className="price-label mb-0">Wallet Address</p>
                                {isMintChange && (<p className="price-label mb-0">{walletCustomerId?.name ? walletCustomerId?.name : ""}</p>)}
                            </div>
                            <div className="col-lg-12 mb-2 position-relative wallet-input">
                                <Form.Control
                                    type="text"
                                    size="lg"
                                    placeholder="wallet address"
                                    className='mint-input mobile-input'
                                    onChange={(e) => handleInputChange(e)}
                                    isInvalid={!!errorWalletAddress}
                                />
                                <Form.Control.Feedback type="invalid">{"Invalid wallet address"}</Form.Control.Feedback>
                                {isMintChange && (<span className={`${walletCustomerId?.isKyc ? "icon success ms-1" : ""}`}></span>)}
                            </div>
                            {note != null && <p className='mint-error-msg'>{` ${note}`}</p>}
                            {kolData != "KOL" && (
                                <div>
                                    <p className='text-danger'>[The KOL period is over. You cannot mint without the KOL period.]</p>
                                </div>
                            )}
                        </div>
                        <div className='text-end'>
                            {isValidChange && (
                                <Button onClick={validCustomer} disabled={kolData != "KOL"}
                                >
                                    <span>{isValid && validLoader && <Spinner size="sm" />}  </span>Validate</Button>
                            )}
                            {isMintChange && (
                                <Button onClick={handleMinting}
                                    disabled={isMinting && loader}
                                >
                                    <span>{isMinting && loader && <Spinner size="sm" />}  </span>
                                    Mint Now</Button>)}
                        </div>
                    </div>
                    {success &&
                        <><div className="text-center toster-placement">
                        </div>
                        </>}
                </div>
                <div className="col-md-5 col-xs-12 col-lg-5 col-xl-5">
                    <div>
                        <div className="image-outerbg">
                            <Image src={memberShipImage} className="selected-img" alt="" />
                            <Image className="bg-shadow" src={bgshadow} alt="" />
                        </div>
                    </div>
                </div>

                <ToasterMessage isShowToaster={success} success={success}></ToasterMessage>
            </div>
        </div>}
    </>)
}

const connectStateToProps = ({ oidc }) => {
    return { daoData: oidc.defaultData?.id, contractAddress: oidc.defaultData?.mintingContractAddress }
}
const connectDispatchToProps = (dispatch) => {
    return {
        trackauditlogs: (daoId, count, callback) => {
            dispatch(getMetaDataDetails(daoId, count, callback));
        },
        trackMemberType: (daoId, callback) => {
            dispatch(getMemberTypes(daoId, callback));
        },
        trackMemberPrice: (crypto, id, count) => {
            dispatch(getMemberPrice(crypto, id, count));
        },
        trackWallet: (walletAddress, callback) => {
            dispatch(walletAddressChecking(walletAddress, callback));
        },
        dispatch,
    };
};

export default connect(connectStateToProps, connectDispatchToProps)(MintGeneral);
