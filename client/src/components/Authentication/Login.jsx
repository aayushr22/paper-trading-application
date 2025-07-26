import React, { useState, useContext } from "react";
import {
  Box,
  Typography,
  TextField,
  CssBaseline,
  Button,
  Card,
  CardContent,
  Grid,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Axios from "axios";
import config from "../../config/Config";

import styles from "./Auth.module.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [usernameErr, setUsernameErr] = useState("");
  const [password, setPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const credentials = { username, password };
      const response = await Axios.post(`${config.base_url}/api/auth/login`, credentials);

      if (response.data.status === "fail") {
        setUsernameErr(response.data.message);
        setPasswordErr(response.data.message);
      } else {
        setUserData(response.data);
        localStorage.setItem("auth-token", response.data.token);
        navigate("/");
      }
    } catch (err) {
      setUsernameErr("Login failed. Please try again.");
      setPasswordErr("Login failed. Please try again.");
    }
  };

  return (
    <div className={styles.background}>
      <CssBaseline />
      <Grid container direction="column" alignItems="center" justifyContent="center" style={{ minHeight: "100vh" }}>
        <Box width="70vh" boxShadow={2}>
          <Card className={styles.paper}>
            <CardContent>
              <Typography component="h1" variant="h5" align="center">
                Sign In
              </Typography>
              <form onSubmit={handleSubmit} className={styles.form}>
                <TextField
                  fullWidth
                  required
                  label="Username"
                  variant="outlined"
                  margin="normal"
                  value={username}
                  onChange={handleUsernameChange}
                  error={!!usernameErr}
                  helperText={usernameErr}
                />
                <TextField
                  fullWidth
                  required
                  type="password"
                  label="Password"
                  variant="outlined"
                  margin="normal"
                  value={password}
                  onChange={handlePasswordChange}
                  error={!!passwordErr}
                  helperText={passwordErr}
                />
                <Box display="flex" justifyContent="center" mt={2}>
                  <Button type="submit" variant="contained" color="primary">
                    Sign In
                  </Button>
                </Box>
              </form>
              <Grid container justifyContent="center" style={{ marginTop: "1rem" }}>
                <Grid item>
                  <Link href="/register" variant="body2">
                    Don't have an account? Register
                  </Link>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </div>
  );
};

export default LoginForm;
