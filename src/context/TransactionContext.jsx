import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  ethContractABI,
  ethContractAddress,
  tokenContractABI,
} from "../utils/constants";
import { toast } from "react-toastify";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const ethContract = new ethers.Contract(
    ethContractAddress,
    ethContractABI,
    signer
  );

  return ethContract;
};

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

  //Eth transaction count
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );

  //Eth transactions
  const [transactions, setTransactions] = useState({});

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

  //Get all eth transactions
  const getAllTransactions = async () => {
    try {
      const transactionContract = getEthereumContract();

      const availableTransactions =
        await transactionContract.getAllTransactions();

      const structuredTransaction = availableTransactions.map(
        (transactions) => {
          return {
            addressFrom: transactions.receiver,
            addressTo: transactions.sender,
            amount: parseInt(transactions.amount._hex) / 10 ** 18,
            timestamp: new Date(
              transactions.timestamp.toNumber() * 1000
            ).toLocaleString(),
          };
        }
      );
      setTransactions(structuredTransaction);
    } catch (error) {
      console.log(error);
    }
  };

  //Connect to wallet
  const connectWallet = async () => {
    try {
      const accounts = await ethereum?.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccounts(accounts[0]);
      window.location.reload();
    } catch (error) {
      if (error.code === 4001) {
        console.log("User rejected the request");
      }
      throw new Error("No Ethereum object.");
    }
  };

  //Send eth
  const sendTransaction = async () => {
    try {
      const { addressTo, amount } = formData;

      const transactionContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);
      const provider = new ethers.providers.Web3Provider(ethereum);
      let balance = await provider.getBalance(currentAccount);
      let ethBal = ethers.utils.formatEther(balance);

      if (amount < ethBal) {
        await ethereum.request({
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
        const transactionHash = await transactionContract.addToBlockChain(
          addressTo,
          parsedAmount
        );
        setIsLoading(true);
        console.log(`Loading-${transactionHash.hash}`);
        await transactionHash.wait();
        setIsLoading(false);
        console.log(`Success-${transactionHash.hash}`);

        const transactionCount =
          await transactionContract.getTransactionCount();
        setTransactionCount(transactionCount.toNumber());

        return toast("Transaction Completed");
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
      console.log(error);
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
          getAllTransactions();
          checkIfTransactionsExist();
          checkNetwork();
          getEthDetails(accounts[0]);
        } else {
          console.log("No Account Found");
        }
      } catch (error) {
        console.log("No Ethereum Found");
      }
    };

    const checkIfTransactionsExist = async () => {
      try {
        const transactionContract = getEthereumContract();
        const transactionCount =
          await transactionContract.getTransactionCount();
        window.localStorage.setItem("transactionCount", transactionCount);
      } catch (error) {
        console.error(error);
        throw new Error("No Ethereum object.");
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
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        handleChange,
        handleTokenChange,
        sendTransaction,
        transactions,
        isLoading,
        transactionCount,
        isMetamaskInstalled,
        currentNetwork,
        sendToken,
        tokenTransferForm,
        tokenSymbol,
        tokenBalance,
        handleAddressChange,
        handleInputTokenSubmit,
        ethBalance,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
