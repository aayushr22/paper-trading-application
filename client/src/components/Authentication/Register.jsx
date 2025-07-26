import React, { useState } from "react";
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
import Axios from "axios";
import config from "../../config/Config";
import styles from "./Auth.module.css";

const RegisterUser = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [userError, setUserError] = useState("");
  const [pass, setPass] = useState("");
  const [passError, setPassError] = useState("");

  const handleUserChange = (e) => {
    const input = e.target.value;
    setUser(input);

    if (input.length < 4 || input.length > 15) {
      setUserError("Username must contain 4–15 characters.");
    } else {
      setUserError("");
    }
  };

  const handlePassChange = (e) => {
    const input = e.target.value;
    setPass(input);

    if (input.length < 6 || input.length > 20) {
      setPassError("Password must be between 6 and 20 characters.");
    } else {
      setPassError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userError && !passError) {
      const formData = { username: user, password: pass };
      const endpoint = `${config.base_url}/api/auth/register`;

      try {
        const res = await Axios.post(endpoint, formData);

        if (res.data.status === "fail") {
          const { type, message } = res.data;
          if (!type) {
            setUserError(message);
            setPassError(message);
          } else if (type === "username") {
            setUserError(message);
          } else if (type === "password") {
            setPassError(message);
          }
        } else {
          navigate("/login");
        }
      } catch (err) {
        setUserError("Something went wrong. Please try again.");
        setPassError("");
      }
    }
  };

  return (
    <div className={styles.background}>
      <CssBaseline />
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Box width="70vh" boxShadow={2}>
          <Card className={styles.paper}>
            <CardContent>
              <Typography component="h1" variant="h5" align="center">
                Create Account
              </Typography>
              <form onSubmit={handleSubmit} className={styles.form}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Choose Username"
                  value={user}
                  onChange={handleUserChange}
                  error={Boolean(userError)}
                  helperText={userError}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Create Password"
                  type="password"
                  value={pass}
                  onChange={handlePassChange}
                  error={Boolean(passError)}
                  helperText={passError}
                />
                <Box display="flex" justifyContent="center" mt={2}>
                  <Button type="submit" variant="contained" color="primary">
                    Sign Up
                  </Button>
                </Box>
              </form>
              <Grid container justifyContent="center" style={{ marginTop: "1rem" }}>
                <Grid item>
                  <Link href="/login" variant="body2">
                    Already registered? Log in here
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

export default RegisterUser;
