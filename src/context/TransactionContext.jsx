import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccounts] = useState("");
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [transactions, setTransactions] = useState({});
  const [isMetamaskInstalled, setMetamaskInstalled] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState(false);

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
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
            message: transactions.message,
            keyword: transactions.keyword,
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
      const { addressTo, amount, keyword, message } = formData;
      getEthereumContract();
      const transactionContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);

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
        parsedAmount,
        message,
        keyword
      );
      setIsLoading(true);
      console.log(`Loading-${transactionHash.hash}`);
      await transactionHash.wait();
      setIsLoading(false);
      console.log(`Success-${transactionHash.hash}`);

      const transactionCount = await transactionContract.getTransactionCount();
      setTransactionCount(transactionCount.toNumber());
      window.location.reload();
    } catch (error) {
      console.error(error);
      if (error.code === 4001) {
        console.log("User rejected the request");
      }
      throw new Error("No Ethereum object.");
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
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        handleChange,
        sendTransaction,
        transactions,
        isLoading,
        transactionCount,
        isMetamaskInstalled,
        currentNetwork,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
