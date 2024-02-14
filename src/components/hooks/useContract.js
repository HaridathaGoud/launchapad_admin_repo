export default function useContractMethods() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage({
    message: 'Please verify your identity with metamask',
  });
  const decimals = process.env.NEXT_PUBLIC_DECIMALS;
  const decimalPoints = process.env.NEXT_PUBLIC_POINST;
  function _provider() {
    const _connector = window?.ethereum;
    const provider = new ethers.providers.Web3Provider(_connector);
    return provider;
  }
  function _stakingContract() {
    const stakingContract = new ethers.Contract(stacking.contractAdress, stacking.abi, _provider().getSigner());
    return stakingContract;
  }
  function _tokenContract() {
    const tokenContract = new ethers.Contract(token.contractAdress, token.abi, _provider().getSigner());
    return tokenContract;
  }
  function _claimableContract() {
    const claimableContract = new ethers.Contract(project.contractAddress, project.abi, _provider().getSigner());
    return claimableContract;
  }
  async function approve(callback, amount) {
    const _allowence = ethers.BigNumber.from((amount * decimals).toLocaleString('fullwide', { useGrouping: false }));
    _tokenContract()
      .approve(stacking.contractAdress, _allowence)
      .then(function (res) {
        _provider()
          .waitForTransaction(res.hash)
          .then(() => {
            callback({ ok: true, response: res });
          });
      })
      .catch((error) => {
        callback({ ok: false, error });
      });
  }

  async function stack(callback, amount) {
    const _amt = ethers.utils.parseUnits(amount, decimalPoints);
    let _pool = 1;
    const {
      signature: { v, r, s },
      nonce,
    } = await getSign(_amt, 1);
    _stakingContract()
      .stake(_amt, _pool, [v, r, s, nonce])
      .then(function (res) {
        _provider()
          .waitForTransaction(res.hash)
          .then(() => {
            callback({ ok: true, response: res });
          });
      })
      .catch((error) => {
        callback({ ok: false, error });
      });
  }
  async function withDrawTokens(callback) {
    const {
      signature: { v, r, s },
      nonce,
    } = await getSign(1);
    _stakingContract()
      .withdraw([v, r, s, nonce])
      .then(function (res) {
        _provider()
          .waitForTransaction(res.hash)
          .then(() => {
            callback({ ok: true, response: res });
          });
      })
      .catch((error) => {
        callback({ ok: false, error });
      });
  }

  async function unStack(callback, amount) {
    const _amount = ethers.utils.parseUnits(amount, decimalPoints);
    const {
      signature: { v, r, s },
      nonce,
    } = await getSign(_amount, 1);
    _stakingContract()
      .unStake(_amount, [v, r, s, nonce])
      .then(function (res) {
        _provider()
          .waitForTransaction(res.hash)
          .then(() => {
            callback({ ok: true, response: res });
          });
      })
      .catch((error) => {
        callback({ ok: false, error });
      });
  }
  function readAllowence(callback) {
    _tokenContract()
      .allowance(address, address)
      .then(function (res) {
        callback(res.toString());
      });
  }
  async function verifySign() {
    return await signMessageAsync();
  }
  function getStakedAmount() {
    return _stakingContract().getStakedAmount(address);
  }
  function getRewards() {
    return _stakingContract().getRewards(address);
  }

  function isStaker() {
    return _stakingContract().isStaker(address);
  }
  function getUserStakeDetails() {
    return _stakingContract().getDetails(address);
  }
  function getTotalStakers() {
    return _stakingContract().getTotalParticipants();
  }
  function getTotalStaked() {
    return _stakingContract().getTotalStaked();
  }
  async function getSign(amount, poolID = 1) {
    let tierID = 0;
    if (amount >= 1000 * 10 ** decimalPoints && amount < 3000 * 10 ** decimalPoints) {
      tierID = 1;
    } else if (amount >= 3000 * 10 ** decimalPoints && amount < 6000 * 10 ** decimalPoints) {
      tierID = 2;
    } else if (amount >= 6000 * 10 ** decimalPoints && amount < 12000 * 10 ** decimalPoints) {
      tierID = 3;
    } else if (amount >= 12000 * 10 ** decimalPoints && amount < 25000 * 10 ** decimalPoints) {
      tierID = 4;
    } else if (amount >= 25000 * 10 ** decimalPoints && amount < 60000 * 10 ** decimalPoints) {
      tierID = 5;
    } else if (amount >= 60000 * 10 ** decimalPoints) {
      tierID = 6;
    }
    const nonce = Math.floor(new Date().getTime() / 1000);
    const hash = ethers.utils.solidityKeccak256(
      ['address', 'address', 'uint256', 'uint256', 'uint256', 'uint256'],
      [stacking.contractAdress, address, amount, tierID, poolID, nonce],
    );
    const private_key = process.env.NEXT_PUBLIC_OWNER_PRIVATE_KEY;
    const msgHash = ethers.utils.arrayify(hash);
    const wallet = new ethers.Wallet(private_key, _provider());
    const signHash = await wallet.signMessage(msgHash);
    const signature = ethers.utils.splitSignature(signHash);
    return { signature, nonce };
  }
  async function stackRewards(callback) {
    const {
      signature: { v, r, s },
      nonce,
    } = await getSign(0, 0);
    _stakingContract()
      .stake(ethers.BigNumber.from(0), ethers.BigNumber.from(1), [v, r, s, nonce])
      .then(function (res) {
        _provider()
          .waitForTransaction(res.hash)
          .then((response) => {
            callback({ ok: true, response: res });
          });
      })
      .catch((error) => {
        callback({ ok: false, error });
      });
  }
  function buyTokens(amount) {
    return _claimableContract().buyToken(amount);
  }
  function claimTokens() {
    return _claimableContract().claimToken();
  }
  function getParticipants() {
    return _stakingContract().getTierIdFromUser(address);
  }
  function fcfsStarttime() {
    return _claimableContract().FCFSStartTime();
  }
  function getAllocations() {
    return _claimableContract().getAllocation();
  }
  return {
    approve,
    stack,
    getRewards,
    withDrawTokens,
    unStack,
    readAllowence,
    verifySign,
    getStakedAmount,
    getUserStakeDetails,
    getTotalStakers,
    getTotalStaked,
    stackRewards,
    buyTokens,
    claimTokens,
    getParticipants,
    fcfsStarttime,
    getAllocations,
    isStaker,
  };
}
