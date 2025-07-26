import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import styles from "./App.module.css";
import { Login, Register, NotFound, PageTemplate } from "./components";
import UserContext from "./context/UserContext";
import Axios from "axios";
import config from "./config/Config";

// Create a theme with the toolbar mixin that your PageTemplate needs
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  mixins: {
    toolbar: {
      minHeight: 56,
      '@media (min-width:0px) and (orientation: landscape)': {
        minHeight: 48,
      },
      '@media (min-width:600px)': {
        minHeight: 64,
      },
    },
  },
});

function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token == null) {
        localStorage.setItem("auth-token", "");
        token = "";
        setUserData({ token: undefined, user: undefined });
        return;
      }

      const headers = {
        "x-auth-token": token,
      };

      const tokenIsValid = await Axios.post(
        config.base_url + "/api/auth/validate",
        null,
        {
          headers,
        }
      );

      if (tokenIsValid.data) {
        const userRes = await Axios.get(config.base_url + "/api/auth/user", {
          headers,
        });
        setUserData({
          token,
          user: userRes.data,
        });
      } else {
        setUserData({ token: undefined, user: undefined });
      }
    };

    checkLoggedIn();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <UserContext.Provider value={{ userData, setUserData }}>
          <div className={styles.container}>
            <Routes>
              {userData.user ? (
                <Route path="/" element={<PageTemplate />} />
              ) : (
                <Route path="/" element={<Register />} />
              )}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<NotFound />} />
            </Routes>
          </div>
        </UserContext.Provider>
      </Router>
    </ThemeProvider>
  );
}

export default App;