import React, { useState, useEffect, useContext } from "react";
import UserContext from "../../context/UserContext";
import { TextField, Container, Grid, Box, Card, Autocomplete } from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { makeStyles } from "@mui/styles";
import LineChart from "../Template/LineChart";
import BarChart from "./BarChart";
import Copyright from "../Template/Copyright";
import styles from "./Search.module.css";
import Axios from "axios";
import InfoCard from "./InfoCard";
import PriceCard from "./PriceCard";
import PurchaseCard from "./PurchaseCard";
import PurchaseModal from "./PurchaseModal";
import config from "../../config/Config";

const filter = createFilterOptions();

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    marginBottom: "40px",
  },
}));

const LineChartCard = ({ pastDataPeriod, stockInfo, duration }) => {
  return (
    <Grid
      item
      xs={12}
      sm={7}
      component={Card}
      className={styles.card}
      style={{ minHeight: "350px" }}
    >
      <LineChart
        pastDataPeriod={pastDataPeriod}
        stockInfo={stockInfo}
        duration={duration}
      />
    </Grid>
  );
};

const BarChartCard = ({ sixMonthAverages, stockInfo }) => {
  return (
    <Grid item xs={12} sm component={Card} className={styles.card}>
      <BarChart sixMonthAverages={sixMonthAverages} stockInfo={stockInfo} />
    </Grid>
  );
};

const StockCard = ({ setPurchasedStocks, purchasedStocks, currentStock }) => {
  const { userData } = useContext(UserContext);
  const [selected, setSelected] = useState(false);
  const [stockInfo, setStockInfo] = useState(undefined);
  const [sixMonthAverages, setSixMonthAverages] = useState(undefined);
  const [pastDay, setPastDay] = useState(undefined);
  const [pastMonth, setPastMonth] = useState(undefined);
  const [pastTwoYears, setPastTwoYears] = useState(undefined);

  useEffect(() => {
    const getInfo = async () => {
      const url = config.base_url + `/api/data/prices/${currentStock.ticker}`;
      const response = await Axios.get(url);
      if (response.data.status === "success") {
        setStockInfo(response.data.data);
      }
    };

    getInfo();

    const getData = async () => {
      const url = config.base_url + `/api/data/prices/${currentStock.ticker}/full`;
      const response = await Axios.get(url);
      if (response.data.status === "success") {
        setSixMonthAverages(response.data.sixMonthAverages);
        setPastDay(response.data.pastDay);
        setPastMonth(response.data.pastMonth);
        setPastTwoYears(response.data.pastTwoYears);
      }
    };

    getData();
  }, [currentStock.ticker]);

  return (
    <div className={styles.root}>
      {stockInfo && pastDay && (
        <InfoCard stockInfo={stockInfo} price={pastDay.adjClose} />
      )}
      {sixMonthAverages && pastDay && pastMonth && pastTwoYears && (
        <div>
          <Grid container spacing={3}>
            <LineChartCard
              pastDataPeriod={pastTwoYears}
              stockInfo={stockInfo}
              duration={"2 years"}
            />
            <BarChartCard
              sixMonthAverages={sixMonthAverages}
              stockInfo={stockInfo}
            />
          </Grid>
          <PriceCard pastDay={pastDay} />
          <Grid container spacing={3}>
            <PurchaseCard
              setSelected={setSelected}
              balance={userData.user.balance}
            />
            <LineChartCard
              pastDataPeriod={pastMonth}
              stockInfo={stockInfo}
              duration={"month"}
            />
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
          {selected && (
            <PurchaseModal
              stockInfo={stockInfo}
              pastDay={pastDay}
              setSelected={setSelected}
              setPurchasedStocks={setPurchasedStocks}
              purchasedStocks={purchasedStocks}
            />
          )}
        </div>
      )}
    </div>
  );
};

const Search = ({ setPurchasedStocks, purchasedStocks }) => {
  const classes = useStyles();
  const [value, setValue] = useState(null);
  const [currentStock, setCurrentStock] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch stocks on component mount
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const url = config.base_url + "/api/stock/search";
        const response = await Axios.get(url);
        
        if (response.data.status === "success") {
          // Map the stock data to the format needed for Autocomplete
          const formattedStocks = response.data.stocks.map(stock => ({
            name: stock.name,
            ticker: stock.ticker,
            description: stock.description,
            exchangeCode: stock.exchangeCode,
            startDate: stock.startDate,
            endDate: stock.endDate,
          }));
          setStocks(formattedStocks);
        }
      } catch (error) {
        console.error("Error fetching stocks:", error);
        // Fallback to hardcoded stocks if API fails
        setStocks(fallbackStocks);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  const onSearchChange = (event, newValue) => {
    setValue(newValue);
    if (newValue) {
      setCurrentStock(newValue);
    } else {
      setCurrentStock(null);
    }
  };

  return (
    <Container className={classes.addMargin}>
      <Autocomplete
        value={value}
        onChange={onSearchChange}
        filterOptions={(options, params) => {
          let filtered = filter(options, params);
          if (currentStock) {
            filtered = filtered.slice(0, 4);
          }
          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        id="stock-search-bar"
        options={stocks}
        loading={loading}
        getOptionLabel={(option) => {
          return option.name;
        }}
        renderOption={(props, option) => (
          <li {...props}>
            <div>
              <div style={{ fontWeight: 600 }}>{option.name}</div>
              <div style={{ fontSize: '0.875rem', color: '#666' }}>
                {option.ticker}
              </div>
            </div>
          </li>
        )}
        className={styles.searchBox}
        style={{
          maxWidth: "700px",
          margin: "30px auto",
          marginBottom: "60px",
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search for a stock"
            variant="outlined"
            placeholder="Search by company name or ticker symbol..."
          />
        )}
      />
      {currentStock && (
        <StockCard
          setPurchasedStocks={setPurchasedStocks}
          purchasedStocks={purchasedStocks}
          currentStock={currentStock}
        />
      )}
      <br />
      <br />
      <br />
    </Container>
  );
};

// Fallback stocks in case API is unavailable
const fallbackStocks = [
  { name: "Apple Inc", ticker: "AAPL" },
  { name: "Amazoncom Inc", ticker: "AMZN" },
  { name: "Alphabet Inc (Class C)", ticker: "GOOG" },
  { name: "Microsoft Corp", ticker: "MSFT" },
  { name: "Walmart Inc", ticker: "WMT" },
  { name: "Intel Corp", ticker: "INTC" },
  { name: "American Express Company", ticker: "AXP" },
  { name: "The Boeing Company", ticker: "BA" },
  { name: "Cisco Systems Inc", ticker: "CSCO" },
  { name: "Goldman Sachs Group Inc", ticker: "GS" },
  { name: "Johnson Johnson", ticker: "JNJ" },
  { name: "The CocaCola Company", ticker: "KO" },
  { name: "McDonalds Corp", ticker: "MCD" },
  { name: "Nike Inc", ticker: "NKE" },
  { name: "Procter & Gamble Company", ticker: "PG" },
  { name: "Verizon Communications Inc", ticker: "VZ" },
  { name: "Salesforce.Com Inc", ticker: "CRM" },
  { name: "Visa Inc", ticker: "V" },
  { name: "UnitedHealth Group Inc", ticker: "UNH" },
  { name: "International Business Machines Corp", ticker: "IBM" },
  { name: "Chevron Corp", ticker: "CVX" },
];

export default Search;