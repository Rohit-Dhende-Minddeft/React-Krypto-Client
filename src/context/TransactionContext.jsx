import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { tokenContractABI } from "../utils/constants";
import { toast } from "react-toastify";
import { useCallback } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getTokenContract = (tokenAddress) => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const tokenContract = new ethers.Contract(
    tokenAddress, //dynamic address
    tokenContractABI,
    signer
  );

  return tokenContract;
};

export const TransactionProvider = ({ children }) => {
  //Active Account Address
  const [currentAccount, setCurrentAccounts] = useState("");

  //Eth Transfer Form
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
  });

  //Token Transfer Form
  const [tokenTransferForm, setTokenTransferForm] = useState({
    tokenAddressTo: "",
    tokenAmount: "",
  });

  //Loading state
  const [isLoading, setIsLoading] = useState(false);

  //Check Metamask installed or not
  const [isMetamaskInstalled, setMetamaskInstalled] = useState(false);

  //Check active network
  const [currentNetwork, setCurrentNetwork] = useState(false);

  //Token state definitions
  const [tokenAddress, setAddress] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenBalance, setTokenBalance] = useState(null);

  //Eth Balance state
  const [ethBalance, setEthBalance] = useState("");

  //Set Eth transfer form data
  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  //Set Token address
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  //Set Token transfer form data
  const handleTokenChange = (e, name) => {
    setTokenTransferForm((prevState) => ({
      ...prevState,
      [name]: e.target.value,
    }));
  };

  //Check balance of tokens of current account
  const handleInputTokenSubmit = async () => {
    try {
      const tokenContract = getTokenContract(tokenAddress);
      let balance = await tokenContract.balanceOf(currentAccount);
      let decimals = await tokenContract.decimals();
      let symbol = await tokenContract.symbol();
      let convertedBalance = balance * 10 ** -decimals;
      setTokenBalance(convertedBalance);
      setTokenSymbol(symbol);
    } catch (error) {
      console.log(error.code);
      if (
        (error.argument === "address" && error.code === "INVALID_ARGUMENT") ||
        error.code === "CALL_EXCEPTION"
      ) {
        return toast("Please enter valid token address");
      }
    }
  };

  //Connect to wallet
  const connectWallet = async () => {
    try {
      let webModal = new Web3Modal({
        cacheProvider: false,
        providerOptions,
        theme: {
          background: "rgb(39, 49, 56)",
          main: "rgb(199, 199, 199)",
          secondary: "rgb(136, 136, 136)",
          border: "rgba(195, 195, 195, 0.14)",
          hover: "rgb(16, 26, 32)",
        },
      });
      const Web3ModalInstance = await webModal.connect();
      const web3ModalProvider = await ethers.providers.Web3Provider(
        Web3ModalInstance
      );

      if (web3ModalProvider) {
        setWeb3Provider(web3ModalProvider);
      }
    } catch (error) {
      console.log("this is err", error);
      if (error.code === 4001) {
        console.log("User rejected the request");
      }
      return;
    }
  };

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        appName: "Connect Wallet",
        infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
      },
    },
  };

  const [web3Provider, setWeb3Provider] = useState("");
  async function connectTheWallet() {
    try {
      let webModal = new Web3Modal({
        cacheProvider: false,
        providerOptions,
      });
      const Web3ModalInstance = await webModal.connect();
      const web3ModalProvider = await ethers.providers.Web3Provider(
        Web3ModalInstance
      );

      if (web3ModalProvider) {
        setWeb3Provider(web3ModalProvider);
      }
    } catch (error) {
      console.log(error);
    }
  }

  //Send eth
  const sendTransaction = async () => {
    try {
      const { addressTo, amount } = formData;

      const parsedAmount = ethers.utils.parseEther(amount);
      const provider = new ethers.providers.Web3Provider(ethereum);
      let balance = await provider.getBalance(currentAccount);
      let ethBal = ethers.utils.formatEther(balance);

      if (amount < ethBal) {
        const transactionHash = await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: addressTo,
              gas: "0x5208", //21000 GWEI
              value: parsedAmount._hex, //0.0001
            },
          ],
        });
        setIsLoading(true);

        console.log(`Loading-${transactionHash}`);

        const provider = new ethers.providers.Web3Provider(ethereum);
        const txReceipt = await provider.waitForTransaction(transactionHash);

        if (txReceipt.status === 1) {
          console.log(`Success-${transactionHash}`);
          setIsLoading(false);
          getTransactions();
          return toast("Transaction Completed");
        }
      } else {
        return toast("Not enough eths to transfer");
      }
    } catch (error) {
      console.log(error.message);
      if (error.code === 4001) {
        return toast("User denied transaction");
      }
      if (error.message === `Invalid "to" address.`) {
        return toast("Please enter valid address");
      }
    }
  };

  //Get Transaction List
  const [transactionData, setTransactionData] = useState({});

  const getTransactions = useCallback(() => {
    fetch(
      `https://api-testnet.bscscan.com/api?module=account&action=txlist&address=${currentAccount}&startblock=1&endblock=99999999&sort=asc&apikey=61QKQVFRCDPAQUED52PE46CRKTPWB2VEAH`
    )
      .then((res) => res.json())
      .then((json) => {
        let list = json.result;
        let newList = [];

        newList = Array.isArray(list)
          ? list
              .filter((transaction) => transaction.value > 0)
              .map((transaction) => ({
                addressFrom: transaction.from,
                addressTo: transaction.to,
                amount: transaction.value,
                time: transaction.timeStamp,
                transactionHash: transaction.hash,
              }))
          : [];

        setTransactionData(newList.reverse());
      });
  }, [currentAccount]);

  //Send Token
  const sendToken = async () => {
    try {
      const { tokenAddress, tokenAddressTo, tokenAmount } = tokenTransferForm;

      const transactionContract = getTokenContract(tokenAddress);

      let currentBalance = await transactionContract.balanceOf(currentAccount);
      let convertedBalance = parseInt(currentBalance._hex, 16);

      let decimals = await transactionContract.decimals();
      let amount = tokenAmount * 10 ** decimals;

      let tokenTransferHash;
      if (amount < convertedBalance) {
        tokenTransferHash = await transactionContract.transfer(
          tokenAddressTo,
          amount.toString()
        );
        setIsLoading(true);
        console.log(`Loading-${tokenTransferHash.hash}`);
        await tokenTransferHash.wait();
        setIsLoading(false);
        console.log(`Success-${tokenTransferHash.hash}`);

        toast("Transaction completed");
      } else {
        return toast("You dont have sufficient tokens to transfer");
      }
    } catch (error) {
      console.log(error.message);
      if (error.code === 4001) {
        return toast("User denied transaction");
      }
      if (error.argument === "numTokens" && error.code === "INVALID_ARGUMENT") {
        return toast("Please enter valid amount");
      }
      if (
        (error.argument === "address" && error.code === "INVALID_ARGUMENT") ||
        (error.argument === "name" && error.code === "INVALID_ARGUMENT")
      ) {
        return toast("Please enter valid address");
      }
    }
  };

  useEffect(() => {
    const checkNetwork = async () => {
      let networks = {
        bsc: {
          chainId: "0x61",
          version: "97",
        },
      };
      //Check if the network is connected to BSC Testnet network
      if (ethereum) {
        if (
          ethereum.chainId === networks.bsc.chainId ||
          ethereum.networkVersion === networks.bsc.version
        ) {
          setCurrentNetwork(true);
        } else {
          setCurrentNetwork(false);
        }
      }
    };

    const getEthDetails = async (acc) => {
      try {
        const provider = new ethers.providers.Web3Provider(ethereum);

        let balance = await provider.getBalance(acc);
        let ethBal = ethers.utils.formatEther(balance);
        setEthBalance(ethBal);
      } catch (error) {
        console.log(error);
      }
    };
    const checkIfWalletIsConnected = async () => {
      try {
        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length) {
          setCurrentAccounts(accounts[0]);
          checkNetwork();
          getEthDetails(accounts[0]);
          getTransactions();
        } else {
          console.log("No Account Found");
        }
      } catch (error) {
        console.log("No Ethereum Found");
      }
    };

    const checkIfMetamaskInsalled = () => {
      if (!ethereum) {
        return setMetamaskInstalled(false);
      } else {
        return setMetamaskInstalled(true);
      }
    };

    checkIfMetamaskInsalled();
    checkIfWalletIsConnected();
  }, [getTransactions]);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        handleChange,
        handleTokenChange,
        sendTransaction,
        isLoading,
        isMetamaskInstalled,
        currentNetwork,
        sendToken,
        tokenTransferForm,
        tokenSymbol,
        tokenBalance,
        handleAddressChange,
        handleInputTokenSubmit,
        ethBalance,
        transactionData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
