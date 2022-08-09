import React, { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortedAddress";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./css/Transaction.scss";

const TransactionCard = ({ addressTo, amount, addressFrom, time, transactionHash }) => {
  let date = new Date(parseInt(time));

  const goToTransactionHistory = () => {
    window.open(`https://testnet.bscscan.com/tx/${transactionHash}`, "_blank");
  };
  return (
    <div className="transaction-card" onClick={goToTransactionHistory}>
      <span>Address From: {shortenAddress(addressFrom)}</span>
      <span>Address To: {shortenAddress(addressTo)}</span>
      <span>Amount: {(amount * 10 ** -18).toString()}</span>
      <span>Timestamp: {date.toLocaleString()}</span>
    </div>
  );
};
const Transactions = () => {
  const { currentAccount, transactionData } = useContext(TransactionContext);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      partialVisibilityGutter: 40, // this is needed to tell the amount of px that should be visible.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      partialVisibilityGutter: 30, // this is needed to tell the amount of px that should be visible.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      partialVisibilityGutter: 30, // this is needed to tell the amount of px that should be visible.
    },
  };

  return (
    <div className="transaction-parent" id="transactions">
      <div className="transaction-heading">
        {currentAccount ? (
          <div>Latest Ether Transactions</div>
        ) : (
          <div>Please connect wallet to see latest transactions</div>
        )}
      </div>

      {transactionData?.length && transactionData?.length !== 0 ? (
        <Carousel responsive={responsive}>
          {transactionData.slice(0, 10).map((data, index) => {
            return <TransactionCard key={index} {...data} />;
          })}
        </Carousel>
      ) : (
        <div className="no-transactions">
          {transactionData?.length === 0 && <>No Transactions</>}
        </div>
      )}
    </div>
  );
};

export default Transactions;
