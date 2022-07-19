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
      getEthereumContract();
      const transactionContract = getEthereumContract();
      let balance = await transactionContract.balanceOf(address);
      setInputTokenBalance(balance.toNumber());
    } catch (error) {
      console.log(error);
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

  const getTokenDetails = async () => {
    try {
      if (ethereum) {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        getEthereumContract();
        const transactionContract = getEthereumContract();
        let symbol = await transactionContract.symbol();
        let balance = await transactionContract.balanceOf(accounts[0]);
        let totalSupply = await transactionContract.totalSupply();
        setTokenSymbol(symbol);
        setTokenBalance(balance.toNumber());
        setTotalSupply(totalSupply.toNumber());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendToken = async () => {
    try {
      const { tokenAddressTo, tokenAmount } = tokenTransferForm;
      getEthereumContract();
      const transactionContract = getEthereumContract();

      let tokenTransferHash = await transactionContract.transfer(
        tokenAddressTo,
        tokenAmount
      );
      setIsLoading(true);
      console.log(`Loading-${tokenTransferHash.hash}`);
      await tokenTransferHash.wait();
      setIsLoading(false);
      console.log(`Success-${tokenTransferHash.hash}`);
      setTokenTransferForm({});
    } catch (error) {
      console.log(error);
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
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
