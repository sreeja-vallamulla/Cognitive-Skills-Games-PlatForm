import {
  Alert,
  Button,
  Card,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useCallback, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import firebase from "../firebase/firebase-config";
import { UserStore } from "../Store/user.store";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [user, setUser] = useState<unknown | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const updateUserDetails = UserStore((store) => store.updateUserDetails);
  const navigation = useNavigate();
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

  useEffect(() => {
    const auth = getAuth(firebase);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setUser(user);
      else setUser(null);
    });
    return () => unsubscribe();
  }, []);

  const SignInWithGoogle = useCallback(async () => {
    const auth = getAuth(firebase);
    const provider = new GoogleAuthProvider();
    try {
      const { user }: any = await signInWithPopup(auth, provider);
      setUser(user);
      updateUserDetails({
        name: user.displayName ?? "",
        email: user.email ?? "",
        photoURL: user.photoURL ?? "",
        refreshToken: user.refreshToken,
        uid: user.uid,
      });
      localStorage.setItem("token", user?.accessToken);
      navigation("/game");
    } catch (error) {
      console.log(error);
    }
  }, [navigation, updateUserDetails]);

  const handleSignUp = useCallback(
    async (e: any) => {
      e.preventDefault();
      const auth = getAuth();
      try {
        const { user }: any = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        navigation("/game");
        setUser(user);
        localStorage.setItem("token", user?.accessToken);
      } catch (error) {
        console.log(error);
      }
    },
    [email, navigation, password]
  );

  const handleLogin = useCallback(
    async (e: any) => {
      e.preventDefault();
      const auth = getAuth();
      try {
        const { user }: any = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        navigation("/game");
        setUser(user);
        localStorage.setItem("token", user?.accessToken);
      } catch (error) {
        console.log(error);
        setShowSnackbar(true);
      }
    },
    [email, navigation, password]
  );

  return (
    <>
      <Snackbar
        open={showSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={2000}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Please Signup
        </Alert>
      </Snackbar>
      <Stack
        sx={{
          height: "100vh",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack
          component={Card}
          elevation={4}
          spacing={2}
          alignItems="center"
          sx={{
            width: "100%",
            maxWidth: 400,
            padding: 4,
          }}
        >
          <Typography variant="h4">{isLogin ? "Login" : "SignUp"}</Typography>
          <IconButton onClick={SignInWithGoogle}>
            <GoogleIcon />
          </IconButton>
          <Stack
            component="form"
            width={"100%"}
            spacing={2}
            onSubmit={isLogin ? handleLogin : handleSignUp}
          >
            <TextField
              label="Email"
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" type="submit">
              {isLogin ? "Login" : "Signup"}
            </Button>
            <Stack alignItems="flex-end">
              <Button
                variant="text"
                onClick={() => setIsLogin((prev) => !prev)}
              >
                {!isLogin ? "Login" : "signup"}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
