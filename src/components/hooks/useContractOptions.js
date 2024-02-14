import { ethers } from 'ethers';
import Contract  from "../../contract/daoMint.json";

export function useContractOption() {
  async function getAddress() {
    const _eth= window?.ethereum;

    const provider = new ethers.providers.Web3Provider(_eth);
    const accounts = await provider.send('eth_requestAccounts', []);
    return accounts[0];
  }

  async function getBalanceCount(address) {
    const _connector= window?.ethereum;
    const provider = new ethers.providers.Web3Provider(_connector);
    const contract = new ethers.Contract(process.env.REACT_APP_MINTING_CONTRACTOR, Contract.abi, provider);
    const count = await contract.balanceOf(address);
    const hex = count?._hex;
    const hexToDecimal = parseInt(hex, 16);
    return hexToDecimal
   
  }
 

  return {getAddress,
    getBalanceCount };
}
