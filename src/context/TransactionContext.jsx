import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  ethContractABI,
  ethContractAddress,
  tokenContractABI,
  tokenContractAddress,
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

const getTokenContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const tokenContract = new ethers.Contract(
    tokenContractAddress,
    tokenContractABI,
    signer
  );

  return tokenContract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccounts] = useState("");
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
  });
  const [tokenTransferForm, setTokenTransferForm] = useState({
    tokenAddressTo: "",
    tokenAmount: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [transactions, setTransactions] = useState({});
  const [isMetamaskInstalled, setMetamaskInstalled] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState(false);

  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenBalance, setTokenBalance] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);

  const [address, setAddress] = useState("");
  const [inputTokenBalance, setInputTokenBalance] = useState(null);

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleTokenChange = (e, name) => {
    setTokenTransferForm((prevState) => ({
      ...prevState,
      [name]: e.target.value,
    }));
  };

  const handleInputTokenSubmit = async () => {
    try {
      getTokenContract();
      const transactionContract = getTokenContract();
      let balance = await transactionContract.balanceOf(address);
      setInputTokenBalance(balance);
    } catch (error) {
      console.log(error.code);
      if (error.argument === "address" && error.code === "INVALID_ARGUMENT") {
        return toast("Please enter valid address");
      }
    }
  };
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

  const sendTransaction = async () => {
    try {
      const { addressTo, amount } = formData;
      getEthereumContract();
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

  const getTokenDetails = async () => {
    try {
      if (ethereum) {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        getTokenContract();
        const tokenContract = getTokenContract();
        let symbol = await tokenContract.symbol();
        let balance = await tokenContract.balanceOf(accounts[0]);
        let totalSupply = await tokenContract.totalSupply();
        setTokenSymbol(symbol);
        setTokenBalance(balance);
        setTotalSupply(totalSupply);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendToken = async () => {
    try {
      const { tokenAddressTo, tokenAmount } = tokenTransferForm;
      getTokenContract();
      const transactionContract = getTokenContract();

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
        goerli: {
          chainId: "0x5",
          version: "5",
        },
      };
      //Check if the network is connected to Goerli network
      if (ethereum) {
        if (
          ethereum.chainId === networks.goerli.chainId ||
          ethereum.networkVersion === networks.goerli.version
        ) {
          setCurrentNetwork(true);
        } else {
          setCurrentNetwork(false);
        }
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
    getTokenDetails();
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
        totalSupply,
        handleAddressChange,
        inputTokenBalance,
        handleInputTokenSubmit,
        // alertMessage
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
