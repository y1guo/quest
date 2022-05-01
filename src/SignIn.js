import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Copyright from "./components/Copyright";

const auth = getAuth();

export default function SignIn() {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleSubmitPassword = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    signInWithEmailAndPassword(auth, data.get("email"), data.get("password"));
  };
  // const [openSignUp, setOpenSignUp] = React.useState(false);

  const handleSubmitGoogle = () => {
    signInWithPopup(auth, new GoogleAuthProvider());
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmitPassword}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="show"
                  color="primary"
                  onChange={() => setShowPassword(!showPassword)}
                />
              }
              label="Show password"
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              {/* <Link
                href="#"
                variant="body2"
                onClick={() => setOpenSignUp(true)}
              >
                {"Don't have an account? Sign Up"}
              </Link>
              <Popover
                open={openSignUp}
                anchorReference="anchorPosition"
                anchorPosition={{
                  top: window.innerHeight / 2,
                  left: window.innerWidth / 2,
                }}
                transformOrigin={{
                  vertical: "center",
                  horizontal: "center",
                }}
                onClose={() => {
                  setOpenSignUp(false);
                }}
              >
                <SignUp />
              </Popover> */}
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmitGoogle}
          >
            Sign In With Google
          </Button>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
