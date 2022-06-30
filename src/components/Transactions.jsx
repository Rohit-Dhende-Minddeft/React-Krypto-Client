import React, { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortedAddress";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./css/Transaction.scss";

const TransactionCard = ({
  addressTo,
  amount,
  addressFrom,
  message,
  timestamp,
}) => {
  return (
    <a
      href={`https://rinkeby.etherscan.io/address/${addressFrom}`}
      target="_blank"
      rel="noreferrer"
    >
      <div className="transaction-card">
        <span>Address From: {shortenAddress(addressFrom)}</span>
        <span>Address To: {shortenAddress(addressTo)}</span>
        <span>Amount: {amount}</span>
        <span>Timestamp: {timestamp}</span>
        <span>Message: {message}</span>
      </div>
    </a>
  );
};
const Transactions = () => {
  const { currentAccount, transactions } = useContext(TransactionContext);
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
    <div className="transaction-parent" id="transaction">
      <div className="transaction-heading">
        {currentAccount ? (
          <div>Latest Transactions</div>
        ) : (
          <div>Please connect wallet to see latest transactions</div>
        )}
      </div>

      {transactions?.length && transactions?.length !== 0 ? (
        <Carousel responsive={responsive}>
          {transactions.reverse().map((data, index) => {
            return <TransactionCard key={index} {...data} />;
          })}
        </Carousel>
      ) : (
        <div className="no-transactions">
          {transactions?.length && transactions?.length !== 0 && (
            <>No Transactions</>
          )}
        </div>
      )}
    </div>
  );
};

export default Transactions;
