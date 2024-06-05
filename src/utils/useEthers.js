import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserInfo } from "src/reducers/profileReducer";
import { setWalletAddress } from "src/reducers/walletReducer";
import store from "src/store";

export default function useEthers() {
    const dispatch = useDispatch();
    const address = useSelector(state => state.walletAddress?.walletAddress);
    const navigate = useNavigate();
    function isConnectd() {
        return address !== null;
    }
    async function getAddress() {
        const provider = new ethers.providers.Web3Provider(window?.ethereum);

        if (provider) {
            provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            let userAddress = await signer.getAddress();
             dispatch(setWalletAddress(userAddress))
            return userAddress;
        }else{
            return "";
        }

    }
    function disConnect() {
        store.dispatch(setWalletAddress(null));
        store.dispatch(setUserInfo(null))
        navigate("/home")
    }
     const getRewardBalance = async (
        readRewardBalance,
        address
      ) => {
        const response = await readRewardBalance(address);
        if (response) {
          let _amt = response.toString();
          if (_amt) {
            return { amount:parseFloat(ethers.utils.formatEther(_amt)), balanceError: null };
          }
        }
        return { balanceError: response, amount: null };
      };
      const getOwnerAddress = async (getOwner, address) => {
        const response = await getOwner(address);
        if (response) {
          return { ownerAddress: response, error: null };
        }
        return { error: response, amount: null };
      };
      const getmintedCount = async (mintedCountt, address) => {
        const response = await mintedCountt(address);
        if (response) {
          return { mintedCount: response, mintedCountError: null };
        }
        return { mintedCountError: response, mintedCount: null };
      };
      const getTotalStakers = async (totalstakescount, address) => {
        const response = await totalstakescount(address);
        if (response) {
          return { stakersCount: response, stakersCountError: null };
        }
        return { stakersCountError: response, stakersCount: null };
      };
      const getPoolDeatails = async (pooldetails, address,tierId, poolLevel) => {
        const response = await pooldetails(address,tierId, poolLevel);
        if (response) {
          return { poolInfo: response, poolInfoError: null };
        }
        return { poolInfoError: response, poolInfo: null };
      };

      const isRound1AllocationEnd = async (roundoneallocation, address) => {
        const response = await roundoneallocation(address);
        if (response) {
          return { isallocationEnd: response, isallocationEndError: null };
        }
        return { isallocationEndError: response, isallocationEnd: false };
      };
      const isRound2AllocationEnd = async (roundtwoallocation, address) => {
        const response = await roundtwoallocation(address);
        if (response) {
          return { isround2allocationEnd: response, round2allocationEndError: null };
        }
        return { round2allocationEndError: response, isround2allocationEnd: false };
      };

    return { isConnectd, 
      getAddress, 
      disConnect,
      getRewardBalance ,
      getOwnerAddress,
      getmintedCount,
      getTotalStakers,
      getPoolDeatails,
      isRound1AllocationEnd,
      isRound2AllocationEnd
    }
}
