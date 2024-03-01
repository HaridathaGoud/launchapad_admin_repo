import VotingContract from './voting.json';
import { prepareWriteContract, writeContract } from 'wagmi/actions';
import{ ethers } from 'ethers';
import Contract from './mint.json';
import { useSelector } from 'react-redux';

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
   
 });
 return writeContract(request);
}
async function proposalCastVote(contractAddress,args1, args2) {
 const  request  = await prepareWriteContract({
   address: contractAddress,
   abi: VotingContract.abi,
   functionName: "castVote",
   args: [args1, args2],
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

 return {
   addQuestion,castVote, voteCalculation,parseError,getSafeMintMultipleKOL };
 }
