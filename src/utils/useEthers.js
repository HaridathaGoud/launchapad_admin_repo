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

    return { isConnectd, getAddress, disConnect,getRewardBalance ,getOwnerAddress}
}
