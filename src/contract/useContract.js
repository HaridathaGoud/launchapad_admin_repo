import VotingContract from './voting.json';
import { prepareWriteContract, writeContract,readContract } from 'wagmi/actions';
import{ ethers } from 'ethers';
import Contract from './mint.json';
import { useSelector } from 'react-redux';
import reward from './rewards.json'
import staking from "./staking.json";
import project from "./project.json";
import daoMintedCount from './daoMintedCount.json';
export function useContract() {
 const selectedDAO = useSelector((state) => state?.oidc?.defaultData);
 async function addQuestion(contractAddress,questionHash, oprionHash, startTime, endTime) {
   return proposalAddQuestion(contractAddress,questionHash,oprionHash,startTime,endTime);
}
async function castVote(contractAddress,questionHash, oprionHash) {
 return proposalCastVote(contractAddress,questionHash,oprionHash);
}
async function voteCalculation(contractAddress,questionHash) {

 return proposalCalculation(contractAddress,questionHash);
}
function parseError(message) {
 let _message = message?.details || message?.cause?.reason || message?.message || message.fault;
 return _message;
}
async function proposalAddQuestion(contractAddress,args1, args2, args3, args4) {
 const { request } = await prepareWriteContract({
   address: contractAddress,
   abi: VotingContract.abi,
   functionName: "addQuestion",
   args: [args1, args2, args3,args4],
   gasLimit: 900000,
   gasPrice: 300000,
   
 });
 return writeContract(request);
}
async function proposalCastVote(contractAddress,args1, args2) {
 const  request  = await prepareWriteContract({
   address: contractAddress,
   abi: VotingContract.abi,
   functionName: "castVote",
   args: [args1, args2],
   gasLimit: 2700000,
   gasPrice: 900000,
 });
 return writeContract(request);
}
async function proposalCalculation(contractAddress,args1) {
 const  request  = await prepareWriteContract({
   address: contractAddress,
   abi: VotingContract.abi,
   functionName: "calculateQuestionResult",
   args: [args1],
 });
 return writeContract(request);
}

 async function getAddress() {
   const _eth= window?.ethereum;

   const provider = new ethers.providers.Web3Provider(_eth);
   const accounts = await provider.send('eth_requestAccounts', []);
   return accounts[0];
 }


 async function getSafeMintMultipleKOL(uri, coinDetails, nftPrice,kolAddress) {
   if (window.ethereum) {
     const provider = new ethers.providers.Web3Provider(window?.ethereum);
      const address = await getAddress();
     const contract = new ethers.Contract(selectedDAO?.mintingContractAddress, Contract.abi, provider.getSigner(address));
     if (coinDetails == 'Matic') {
       return contract.safeMintMultipleKOL(kolAddress, uri, {
         value: ethers.utils.parseUnits(nftPrice.toString(), 18),
         gasLimit: 900000,
         gasPrice: 300000,
       });
     } 
   } else {
     alert('Please Install the Metamask to your browser');
   }
 }
 async function readRewardBalance(contract) {
  const address = await getAddress();
  const _result = await readContract({
    address: contract,
    abi: reward.abi,
    functionName: "balanceOf",
    args: [address],
  });
  return _result;
}
async function getOwner(contract) {
  const _result = await readContract({
    address: contract,
    abi: reward.abi,
    functionName: "owner",
    args: [],
  });
  return _result;
}
async function mintedCountt(contract) {
  const _result = await readContract({
    address: contract,
    abi: daoMintedCount.abi,
    functionName: "mintedCount",
    args: [],
  });
  return _result;
}

async function totalstakescount(address) {
  const _result = await readContract({
    address:address,
    abi: staking.abi,
    functionName: "getTotalParticipants",
  });
  return Number(_result);
}
async function pooldetails(address,tierId, poolLevel) {
  const _result = await readContract({
    address:address,
    abi: staking.abi,
    functionName: "getParticipantsByTierId",
    args: [tierId, poolLevel],
  });
  return Number(_result);
}
async function roundoneallocation(address) {
  const _result = await readContract({
    address: address,
    abi: project.abi,
    functionName: "isAllocationEnd",
    args:[]
  });
  return Number(_result);
}
async function roundtwoallocation(address) {
  const _result = await readContract({
    address: address,
    abi: project.abi,
    functionName: "isFCFSAllocationEnd",
    args:[]
  });
  return Number(_result);
}
 return {
   addQuestion,
   castVote, 
   voteCalculation,
   parseError,
   getSafeMintMultipleKOL,
   readRewardBalance,
   getOwner,
   mintedCountt,
   totalstakescount,
   pooldetails ,
   roundoneallocation,
   roundtwoallocation
  };
 }
