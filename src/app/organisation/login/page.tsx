// "use client";
// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Container,
//   Grid,
//   IconButton,
//   Divider,
//   Link,
//   Paper,
//   AppBar,
//   Toolbar,
//   Avatar,
//   Drawer,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
// } from "@mui/material";
// import Head from "next/head";
// import { useRouter } from "next/navigation"; // Import useRouter for navigation
// // Import icons
// import AppleIcon from "@mui/icons-material/Apple";
// import GoogleIcon from "@mui/icons-material/Google";
// import FacebookIcon from "@mui/icons-material/Facebook";
// import LinkedInIcon from "@mui/icons-material/LinkedIn";
// import TwitterIcon from "@mui/icons-material/Twitter";
// import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// import HomeIcon from "@mui/icons-material/Home";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import SettingsIcon from "@mui/icons-material/Settings";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// export default function ZohoApp(_props?: any) {
//   const [email, setEmail] = useState<any>("");
//   const [password, setPassword] = useState<any>("");
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [emailError, setEmailError] = useState<any>("");
//   const [passwordError, setPasswordError] = useState<any>("");

//   const router = useRouter(); // Initialize useRouter

//   const validateEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email) || /^\d{10}$/.test(email); // Validate email or 10-digit mobile number
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     let isValid = true;

//     // Email validation
//     if (!email) {
//       setEmailError("Please enter your email address or mobile number");
//       isValid = false;
//     } else if (!validateEmail(email)) {
//       setEmailError("Please enter a valid email address or mobile number");
//       isValid = false;
//     } else {
//       setEmailError("");
//     }

//     // Password validation
//     if (!password?.trim()) {
//       setPasswordError("Please enter your password");
//       isValid = false;
//     } else if (password.length < 8) {
//       setPasswordError("Password must be at least 8 characters long");
//       isValid = false;
//     } else {
//       setPasswordError("");
//     }

//     if (isValid) {
//       // Redirect to /home on successful login
//       router.push("/home");
//     }
//   };

//   // Handle Sign Up Now click
//   const handleSignUp = () => {
//     // Redirect to /organisation
//     router.push("/organisation");
//   };

//   return (
//     <>
//       <Head>
//         <title>Biz Books - Login</title>
//         <meta name="description" content="Biz Books login page" />
//       </Head>
//       <Box
//         sx={{
//           minHeight: "100vh",
//           display: "flex" as const,
//           alignItems: "center" as const,
//           justifyContent: "center" as const,
//           bgcolor: "#f5f5f5",
//         }}
//       >
//         <Container maxWidth="md">
//           <Paper
//             elevation={0}
//             sx={{
//               display: "flex" as const,
//               borderRadius: "8px",
//               overflow: "hidden" as const,
//             }}
//           >
//             <Grid container>
//               <Grid item xs={12} md={7} sx={{ p: 4 }}>
//                 <Box sx={{ mb: 4, display: "flex" as const, alignItems: "center" as const }}>
//                   <Box sx={{ mb: 1 }}>
//                     {/* Replace with your actual logo */}
//                     <Box
//                       sx={{
//                         display: "flex" as const,
//                         alignItems: "center" as const,
//                         gap: 0,
//                         mb: 3,
//                       }}
//                     >
//                     </Box>
//                     <Typography
//                       variant="caption"
//                       sx={{ display: "block" as const, mt: 0.5, letterSpacing: 2 }}
//                     >
//                       Biz Books
//                     </Typography>
//                   </Box>
//                 </Box>
//                 <Typography
//                   variant="h4"
//                   component="h1"
//                   sx={{ fontWeight: "bold" as const, mb: 0.5 }}
//                 >
//                   Sign in
//                 </Typography>
//                 <Typography
//                   variant="body1"
//                   sx={{ mb: 3, color: "text.secondary" }}
//                 >
//                   to access Books
//                 </Typography>
//                 <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
//                   <TextField
//                     fullWidth
//                     placeholder="Email address or mobile number"
//                     variant="outlined"
//                     value={email}
//                     onChange={(e) => setEmail((e.target as any).value)}
//                     error={!!emailError}
//                     helperText={emailError}
//                     sx={{
//                       mb: 2,
//                       "& .MuiOutlinedInput-root": {
//                         "&.Mui-focused fieldset": {
//                           borderColor: "#1976d2",
//                         },
//                       },
//                     }}
//                   />
//                   <TextField
//                     fullWidth
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Password"
//                     variant="outlined"
//                     value={password}
//                     onChange={(e) => setPassword((e.target as any).value)}
//                     error={!!passwordError}
//                     helperText={passwordError}
//                     sx={{ mb: 2 }}
//                   />
//                   <Button
//                     type="submit"
//                     fullWidth
//                     variant="contained"
//                     sx={{
//                       mt: 1,
//                       py: 1.5,
//                       bgcolor: "#0091ff",
//                       "&:hover": {
//                         bgcolor: "#0077e6",
//                       },
//                     }}
//                   >
//                     Login
//                   </Button>
//                 </Box>
//                 <Box sx={{ mb: 3 }}>
//                   <Typography variant="body2" sx={{ mb: 2 }}>
//                     Sign in using
//                   </Typography>
//                   <Box sx={{ display: "flex" as const, gap: 1 }}>
//                     <IconButton
//                       sx={{
//                         bgcolor: "#000",
//                         color: "#fff",
//                         "&:hover": { bgcolor: "#333" },
//                       }}
//                     >
//                       <AppleIcon />
//                     </IconButton>
//                     <IconButton
//                       sx={{
//                         bgcolor: "#f2f2f2",
//                         color: "#757575",
//                         "&:hover": { bgcolor: "#e0e0e0" },
//                       }}
//                     >
//                       <GoogleIcon />
//                     </IconButton>
//                     <IconButton
//                       sx={{
//                         bgcolor: "#7b66ff",
//                         color: "#fff",
//                         "&:hover": { bgcolor: "#6a56e8" },
//                       }}
//                     >
//                       <Typography variant="body2" sx={{ fontWeight: "bold" as const }}>
//                         Y!
//                       </Typography>
//                     </IconButton>
//                     <IconButton
//                       sx={{
//                         bgcolor: "#1877f2",
//                         color: "#fff",
//                         "&:hover": { bgcolor: "#0e66d0" },
//                       }}
//                     >
//                       <FacebookIcon />
//                     </IconButton>
//                     <IconButton
//                       sx={{
//                         bgcolor: "#0a66c2",
//                         color: "#fff",
//                         "&:hover": { bgcolor: "#0855a1" },
//                       }}
//                     >
//                       <LinkedInIcon />
//                     </IconButton>
//                     <IconButton
//                       sx={{
//                         bgcolor: "#1da1f2",
//                         color: "#fff",
//                         "&:hover": { bgcolor: "#0c90e0" },
//                       }}
//                     >
//                       <TwitterIcon />
//                     </IconButton>
//                     <IconButton
//                       sx={{
//                         bgcolor: "#107c41",
//                         color: "#fff",
//                         "&:hover": { bgcolor: "#0c6535" },
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           width: 20,
//                           height: 20,
//                           bgcolor: "#107c41",
//                           display: "flex" as const,
//                           alignItems: "center" as const,
//                           justifyContent: "center" as const,
//                         }}
//                       >
//                         <Typography
//                           variant="body2"
//                           sx={{ fontWeight: "bold" as const, color: "#fff" }}
//                         >
//                           M
//                         </Typography>
//                       </Box>
//                     </IconButton>
//                     <IconButton
//                       sx={{
//                         bgcolor: "#f2f2f2",
//                         color: "#757575",
//                         "&:hover": { bgcolor: "#e0e0e0" },
//                       }}
//                     >
//                       <MoreHorizIcon />
//                     </IconButton>
//                   </Box>
//                 </Box>
//                 <Box sx={{ mt: 2 }}>
//                   <Typography variant="body2" sx={{ color: "text.secondary" }}>
//                     Don't have a Bizbooks account?{" "}
//                     <Link
//                       href="#"
//                       underline="hover"
//                       sx={{ color: "#0091ff" }}
//                       onClick={(e) => {
//                         e.preventDefault();
//                         handleSignUp();
//                       }}
//                     >
//                       Sign up now
//                     </Link>
//                   </Typography>
//                 </Box>
//               </Grid>
//               <Grid
//                 item
//                 xs={12}
//                 md={5}
//                 sx={{
//                   bgcolor: "#fff",
//                   p: 4,
//                   display: "flex" as const,
//                   flexDirection: "column" as const,
//                   justifyContent: "center" as const,
//                   position: "relative" as const,
//                 }}
//               >
//                 <Box
//                   sx={{
//                     display: "flex" as const,
//                     flexDirection: "column" as const,
//                     alignItems: "center" as const,
//                     justifyContent: "center" as const,
//                     height: "100%",
//                   }}
//                 >
//                   <Box sx={{ mb: 4, maxWidth: "80%", textAlign: "center" as const }}>
//                     <Box
//                       sx={{ mb: 2, display: "flex" as const, justifyContent: "center" as const }}
//                     >
//                       {/* Replace with actual illustration */}
//                       <Box
//                         sx={{ position: "relative" as const, width: 200, height: 200 }}
//                       >
//                         <Box
//                           sx={{
//                             position: "absolute" as const,
//                             width: 150,
//                             height: 220,
//                             bgcolor: "#5b7fec",
//                             borderRadius: 4,
//                             right: 0,
//                             bottom: 0,
//                           }}
//                         ></Box>
//                         <Box
//                           sx={{
//                             position: "absolute" as const,
//                             width: 120,
//                             height: 180,
//                             left: 0,
//                             top: 0,
//                             display: "flex" as const,
//                             flexDirection: "column" as const,
//                             justifyContent: "center" as const,
//                             p: 2,
//                           }}
//                         >
//                           <Box
//                             sx={{
//                               width: 40,
//                               height: 40,
//                               bgcolor: "#f2f2f2",
//                               borderRadius: "50%",
//                               mb: 1,
//                               display: "flex" as const,
//                               alignItems: "center" as const,
//                               justifyContent: "center" as const,
//                             }}
//                           >
//                             <TwitterIcon
//                               sx={{ color: "#1da1f2", fontSize: 20 }}
//                             />
//                           </Box>
//                           <Box
//                             sx={{
//                               width: 40,
//                               height: 40,
//                               bgcolor: "#f2f2f2",
//                               borderRadius: "50%",
//                               mb: 1,
//                               display: "flex" as const,
//                               alignItems: "center" as const,
//                               justifyContent: "center" as const,
//                             }}
//                           >
//                             <FacebookIcon
//                               sx={{ color: "#1877f2", fontSize: 20 }}
//                             />
//                           </Box>
//                           <Box
//                             sx={{
//                               width: 40,
//                               height: 40,
//                               bgcolor: "#f2f2f2",
//                               borderRadius: "50%",
//                               display: "flex" as const,
//                               alignItems: "center" as const,
//                               justifyContent: "center" as const,
//                             }}
//                           >
//                             <GoogleIcon
//                               sx={{ color: "#db4437", fontSize: 20 }}
//                             />
//                           </Box>
//                         </Box>
//                       </Box>
//                     </Box>
//                     <Typography
//                       variant="h6"
//                       component="h2"
//                       sx={{ fontWeight: "bold" as const, mb: 1 }}
//                     >
//                       MFA for all accounts
//                     </Typography>
//                     <Typography variant="body2" sx={{ mb: 1 }}>
//                       Secure online accounts with OneAuth 2FA. Back up OTP
//                       secrets and never lose access to your accounts.
//                     </Typography>
//                     <Link
//                       href="#"
//                       underline="hover"
//                       sx={{ color: "#0091ff", fontWeight: "medium" as const }}
//                     >
//                       Learn more
//                     </Link>
//                   </Box>
//                 </Box>
//                 <Box
//                   sx={{
//                     position: "absolute" as const,
//                     bottom: 0,
//                     left: 0,
//                     right: 0,
//                     display: "flex" as const,
//                     justifyContent: "center" as const,
//                     p: 2,
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       width: "30px",
//                       height: "4px",
//                       bgcolor: "#0091ff",
//                       borderRadius: "2px",
//                     }}
//                   />
//                 </Box>
//               </Grid>
//             </Grid>
//           </Paper>
//         </Container>
//       </Box>
//     </>
//   );
// }
"use client";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  IconButton,
  Divider,
  Link,
  Paper,
  AppBar,
  Toolbar,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
// Import icons
import AppleIcon from "@mui/icons-material/Apple";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import * as Yup from "yup"; // Import Yup
import apiService, { SIGN_OUT_REASONS, signOutReason } from "../../../services/axiosService";
import { useSnackbar } from "../../../components/SnackbarProvider";

export default function ZohoApp(_props?: any) {
  const { showMessage } = useSnackbar();
  const [formData, setFormData] = useState<any>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter(); // Initialize useRouter

  // Define Yup Validation Schema
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .required("Please enter your email address or mobile number")
      .test(
        "valid-email-or-mobile",
        "Please enter a valid email address or mobile number",
        (value) => {
          const v = String(value || "").trim();
          if (!v) return true; // "required" reports empty input
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const mobileRegex = /^\d{10}$/;
          return emailRegex.test(v) || mobileRegex.test(v.replace(/[\s-]/g, ""));
        }
      ),
    password: Yup.string()
      .required("Please enter your password")
      .min(8, "Password must be at least 8 characters long"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const [notice, setNotice] = useState<any>(null); // { severity, text }
  const [otpStep, setOtpStep] = useState<any>(null); // { session, channel, sentTo }
  const [otpCode, setOtpCode] = useState<any>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  // False until the page's JavaScript runs (the form can't submit without it).
  const [hydrated, setHydrated] = useState<boolean>(false);

  // Explain why the user was signed out (set by the API client).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
    // The reason is in the URL, or was kept when the app ended the session itself.
    const reason = new URLSearchParams(window.location.search).get("reason") || signOutReason();
    // The URL is only known in the browser, so this runs after the first render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (reason && SIGN_OUT_REASONS[reason]) setNotice({ severity: "warning", text: SIGN_OUT_REASONS[reason] });
    try {
      sessionStorage.removeItem("signedOutReason");
    } catch {
      // Nothing stored.
    }
  }, []);

  const finishLogin = (data) => {
    localStorage.setItem("user_name", data.user?.comp_name || data.user?.email || "");
    localStorage.setItem("token", data.token);
    if (data.ORG_ID) localStorage.setItem("organization_id", data.ORG_ID);
    else localStorage.removeItem("organization_id");
    showMessage(data.message || "Signed in", "success");
    // First sign-in: the user still has to create their company.
    router.push(data.needs_org_setup ? "/organisation/organisationsetuppage" : "/home");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice(null);
    try {
      await validationSchema.validate(formData, { abortEarly: false });
    } catch (validationErrors) {
      const newErrors: any = {};
      // Keep the first message per field ("required" before "valid").
      (validationErrors.inner || []).forEach((error) => {
        if (!newErrors[error.path]) newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return;
    }
    setSubmitting(true);
    try {
      const response = await apiService({
        method: "POST",
        url: "/api/v1/user/user-login",
        data: { ...formData, email: String(formData.email || "").trim() },
      });
      if (response.data?.otp_required) {
        setOtpStep({
          session: response.data.otp_session,
          channel: response.data.channel,
          sentTo: response.data.sent_to || response.data.mobile_hint,
          message: response.data.message,
        });
        setOtpCode("");
      } else {
        finishLogin(response.data);
      }
    } catch (error) {
      setNotice({
        severity: error?.code === "ACCOUNT_PENDING" ? "info" : "error",
        text: error?.message || "Couldn't sign in. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await apiService({
        method: "POST",
        url: "/api/v1/user/verify-login-otp",
        data: { otp_session: otpStep.session, otp: otpCode },
      });
      finishLogin(response.data);
    } catch (error) {
      if (["OTP_EXPIRED", "OTP_INVALID", "IP_LIMIT_REACHED"].includes(error?.code)) {
        setOtpStep(null);
      }
      setNotice({ severity: "error", text: error?.message || "That code didn't work." });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Sign Up Now click
  const handleSignUp = () => {
    // Redirect to /organisation
    router.push("/organisation");
  };

  return (
    <>
      <Head>
        <title>Biz Books - Login</title>
        <meta name="description" content="Biz Books login page" />
      </Head>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex" as const,
          alignItems: "center" as const,
          justifyContent: "center" as const,
          bgcolor: "#f5f5f5",
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              display: "flex" as const,
              borderRadius: "8px",
              overflow: "hidden" as const,
            }}
          >
            <Grid container>
              <Grid item xs={12} md={7} sx={{ p: 4 }}>
                <Box sx={{ mb: 4, display: "flex" as const, alignItems: "center" as const }}>
                  <Box sx={{ mb: 1 }}>
                    {/* Replace with your actual logo */}
                    <Box
                      sx={{
                        display: "flex" as const,
                        alignItems: "center" as const,
                        gap: 0,
                        mb: 3,
                      }}
                    ></Box>
                    <Typography
                      variant="caption"
                      sx={{ display: "block" as const, mt: 0.5, letterSpacing: 2 }}
                    >
                      Biz Books
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{ fontWeight: "bold" as const, mb: 0.5 }}
                >
                  Sign in
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mb: 3, color: "text.secondary" }}
                >
                  to access Books
                </Typography>
                {notice && (
                  <Alert severity={notice.severity} sx={{ mb: 2 }}>
                    {notice.text}
                  </Alert>
                )}
                {otpStep ? (
                  <Box component="form" method="post" action="/organisation/login" onSubmit={handleVerifyOtp} sx={{ mb: 3 }}>
                    <Typography sx={{ mb: 2, fontSize: "14px", color: "text.secondary" }}>
                      {otpStep.channel === "admin"
                        ? otpStep.message || "Enter the sign-in code your administrator gave you."
                        : (
                          <>
                            Enter the 6-digit code we sent{" "}
                            {otpStep.channel === "email" ? "by email " : ""}
                            to {otpStep.sentTo || "you"}. It expires in 5 minutes.
                          </>
                        )}
                    </Typography>
                    <TextField
                      fullWidth
                      autoFocus
                      placeholder="6-digit code"
                      value={otpCode}
                      onChange={(e) => setOtpCode((e.target as any).value.replace(/\D/g, "").slice(0, 6))}
                      inputProps={{ inputMode: "numeric", autoComplete: "one-time-code" }}
                      sx={{ mb: 2 }}
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={submitting || otpCode.length !== 6}
                      sx={{ py: 1.5, bgcolor: "#0091ff", "&:hover": { bgcolor: "#0077e6" } }}
                    >
                      {submitting ? "Verifying…" : "Verify and sign in"}
                    </Button>
                    <Button
                      fullWidth
                      onClick={() => {
                        setOtpStep(null);
                        setOtpCode("");
                        setNotice(null);
                      }}
                      sx={{ mt: 1, textTransform: "none" as const }}
                    >
                      Back to sign in
                    </Button>
                  </Box>
                ) : (
                // POST, never GET: credentials must not reach the address bar. Until
                // the page has hydrated the button stays disabled, so a native submit
                // can't happen before handleSubmit is attached.
                <Box component="form" method="post" action="/organisation/login" onSubmit={handleSubmit} sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    placeholder="Email address or mobile number"
                    variant="outlined"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!(errors.email as any)}
                    helperText={(errors.email as any)}
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#1976d2",
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    variant="outlined"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!(errors.password as any)}
                    helperText={(errors.password as any)}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={submitting || !hydrated}
                    sx={{
                      mt: 1,
                      py: 1.5,
                      bgcolor: "#0091ff",
                      "&:hover": {
                        bgcolor: "#0077e6",
                      },
                    }}
                  >
                    {submitting ? "Signing in…" : "Login"}
                  </Button>
                </Box>
                )}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Don&apos;t have a Bizbooks account?{" "}
                    <Link
                      href="#"
                      underline="hover"
                      sx={{ color: "#0091ff" }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSignUp();
                      }}
                    >
                      Sign up now
                    </Link>
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                md={5}
                sx={{
                  bgcolor: "#fff",
                  p: 4,
                  display: "flex" as const,
                  flexDirection: "column" as const,
                  justifyContent: "center" as const,
                  position: "relative" as const,
                }}
              >
                <Box
                  sx={{
                    display: "flex" as const,
                    flexDirection: "column" as const,
                    alignItems: "center" as const,
                    justifyContent: "center" as const,
                    height: "100%",
                  }}
                >
                  <Box sx={{ mb: 4, maxWidth: "80%", textAlign: "center" as const }}>
                    <Box
                      sx={{ mb: 2, display: "flex" as const, justifyContent: "center" as const }}
                    >
                      {/* Replace with actual illustration */}
                      <Box
                        sx={{ position: "relative" as const, width: 200, height: 200 }}
                      >
                        <Box
                          sx={{
                            position: "absolute" as const,
                            width: 150,
                            height: 220,
                            bgcolor: "#5b7fec",
                            borderRadius: 4,
                            right: 0,
                            bottom: 0,
                          }}
                        ></Box>
                        <Box
                          sx={{
                            position: "absolute" as const,
                            width: 120,
                            height: 180,
                            left: 0,
                            top: 0,
                            display: "flex" as const,
                            flexDirection: "column" as const,
                            justifyContent: "center" as const,
                            p: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: "#f2f2f2",
                              borderRadius: "50%",
                              mb: 1,
                              display: "flex" as const,
                              alignItems: "center" as const,
                              justifyContent: "center" as const,
                            }}
                          >
                            <TwitterIcon
                              sx={{ color: "#1da1f2", fontSize: 20 }}
                            />
                          </Box>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: "#f2f2f2",
                              borderRadius: "50%",
                              mb: 1,
                              display: "flex" as const,
                              alignItems: "center" as const,
                              justifyContent: "center" as const,
                            }}
                          >
                            <FacebookIcon
                              sx={{ color: "#1877f2", fontSize: 20 }}
                            />
                          </Box>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: "#f2f2f2",
                              borderRadius: "50%",
                              display: "flex" as const,
                              alignItems: "center" as const,
                              justifyContent: "center" as const,
                            }}
                          >
                            <GoogleIcon
                              sx={{ color: "#db4437", fontSize: 20 }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{ fontWeight: "bold" as const, mb: 1 }}
                    >
                      MFA for all accounts
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Secure online accounts with OneAuth 2FA. Back up OTP
                      secrets and never lose access to your accounts.
                    </Typography>
                    <Link
                      href="#"
                      underline="hover"
                      sx={{ color: "#0091ff", fontWeight: "medium" as const }}
                    >
                      Learn more
                    </Link>
                  </Box>
                </Box>
                <Box
                  sx={{
                    position: "absolute" as const,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: "flex" as const,
                    justifyContent: "center" as const,
                    p: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: "30px",
                      height: "4px",
                      bgcolor: "#0091ff",
                      borderRadius: "2px",
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
