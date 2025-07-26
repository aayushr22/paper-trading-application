import React, { useContext, useState, useEffect } from "react";
import UserContext from "../../context/UserContext";
import { Typography } from "@mui/material";
import Title from "../Template/Title.jsx";
import styles from "./Dashboard.module.css";

const Balance = ({ purchasedStocks }) => {
  const { userData } = useContext(UserContext);
  const [portfolioValue, setPortfolioValue] = useState(0);

  useEffect(() => {
    const totalValue = purchasedStocks.reduce((sum, stock) => {
      return sum + Number(stock.currentPrice) * Number(stock.quantity);
    }, 0);
    setPortfolioValue(Math.round((totalValue + Number.EPSILON) * 100) / 100);
  }, [purchasedStocks]);

  const cash = userData?.user?.balance || 0;
  const total = cash + portfolioValue;

  return (
    <>
      <Title>Account Overview</Title>
      <div className={styles.depositContext}>
        <Typography color="textSecondary" align="center">Cash Available:</Typography>
        <Typography variant="h6" align="center">${cash.toLocaleString()}</Typography>

        <Typography color="textSecondary" align="center">Investments Worth:</Typography>
        <Typography variant="h6" align="center">${portfolioValue.toLocaleString()}</Typography>

        <div className={styles.addMargin}>
          <Typography color="textSecondary" align="center">Net Total:</Typography>
          <Typography
            variant="h4"
            align="center"
            className={total >= 100000 ? styles.positive : styles.negative}
          >
            ${total.toLocaleString()}
          </Typography>
        </div>
      </div>
      <Typography color="textSecondary" align="center">
        {new Date().toLocaleDateString()}
      </Typography>
    </>
  );
};

export default Balance;
