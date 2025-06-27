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

// export default function ZohoApp() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [emailError, setEmailError] = useState("");
//   const [passwordError, setPasswordError] = useState("");

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
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           bgcolor: "#f5f5f5",
//         }}
//       >
//         <Container maxWidth="md">
//           <Paper
//             elevation={0}
//             sx={{
//               display: "flex",
//               borderRadius: "8px",
//               overflow: "hidden",
//             }}
//           >
//             <Grid container>
//               <Grid item xs={12} md={7} sx={{ p: 4 }}>
//                 <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
//                   <Box sx={{ mb: 1 }}>
//                     {/* Replace with your actual logo */}
//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 0,
//                         mb: 3,
//                       }}
//                     >
//                     </Box>
//                     <Typography
//                       variant="caption"
//                       sx={{ display: "block", mt: 0.5, letterSpacing: 2 }}
//                     >
//                       Biz Books
//                     </Typography>
//                   </Box>
//                 </Box>
//                 <Typography
//                   variant="h4"
//                   component="h1"
//                   sx={{ fontWeight: "bold", mb: 0.5 }}
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
//                     onChange={(e) => setEmail(e.target.value)}
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
//                     onChange={(e) => setPassword(e.target.value)}
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
//                   <Box sx={{ display: "flex", gap: 1 }}>
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
//                       <Typography variant="body2" sx={{ fontWeight: "bold" }}>
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
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         <Typography
//                           variant="body2"
//                           sx={{ fontWeight: "bold", color: "#fff" }}
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
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "center",
//                   position: "relative",
//                 }}
//               >
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     height: "100%",
//                   }}
//                 >
//                   <Box sx={{ mb: 4, maxWidth: "80%", textAlign: "center" }}>
//                     <Box
//                       sx={{ mb: 2, display: "flex", justifyContent: "center" }}
//                     >
//                       {/* Replace with actual illustration */}
//                       <Box
//                         sx={{ position: "relative", width: 200, height: 200 }}
//                       >
//                         <Box
//                           sx={{
//                             position: "absolute",
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
//                             position: "absolute",
//                             width: 120,
//                             height: 180,
//                             left: 0,
//                             top: 0,
//                             display: "flex",
//                             flexDirection: "column",
//                             justifyContent: "center",
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
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
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
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
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
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
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
//                       sx={{ fontWeight: "bold", mb: 1 }}
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
//                       sx={{ color: "#0091ff", fontWeight: "medium" }}
//                     >
//                       Learn more
//                     </Link>
//                   </Box>
//                 </Box>
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     bottom: 0,
//                     left: 0,
//                     right: 0,
//                     display: "flex",
//                     justifyContent: "center",
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
import React, { useState } from "react";
import {
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
import apiService from "../../../services/axiosService";
import { useSnackbar } from "../../../components/SnackbarProvider";

export default function ZohoApp() {
  const { showMessage } = useSnackbar();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter(); // Initialize useRouter

  // Define Yup Validation Schema
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Please enter your email address or mobile number")
      .test(
        "valid-email-or-mobile",
        "Please enter a valid email address or mobile number",
        (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const mobileRegex = /^\d{10}$/;
          return emailRegex.test(value) || mobileRegex.test(value);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate form data using Yup
      await validationSchema.validate(formData, { abortEarly: false });
      const response = await apiService({
        method: "POST",
        url: "/api/v1/user/user-login",
        data: formData,
      });
      if (response.statusCode == 200) {
        // sessionStorage.setItem("user_name", response.data.data.company_name);
        localStorage.setItem("user_name", response.data.user.comp_name);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("organization_id", response.data.ORG_ID);
        showMessage(response.data.message, "success");
        router.push("/home");
      }
      // If validation passes, redirect to /home
    } catch (validationErrors) {
      // Handle validation errors
      const newErrors = {};
      if (validationErrors.inner) {
        validationErrors.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
      }
      setErrors(newErrors);
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f5f5",
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <Grid container>
              <Grid item xs={12} md={7} sx={{ p: 4 }}>
                <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
                  <Box sx={{ mb: 1 }}>
                    {/* Replace with your actual logo */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0,
                        mb: 3,
                      }}
                    ></Box>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mt: 0.5, letterSpacing: 2 }}
                    >
                      Biz Books
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{ fontWeight: "bold", mb: 0.5 }}
                >
                  Sign in
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mb: 3, color: "text.secondary" }}
                >
                  to access Books
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    placeholder="Email address or mobile number"
                    variant="outlined"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
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
                    error={!!errors.password}
                    helperText={errors.password}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 1,
                      py: 1.5,
                      bgcolor: "#0091ff",
                      "&:hover": {
                        bgcolor: "#0077e6",
                      },
                    }}
                  >
                    Login
                  </Button>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Sign in using
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      sx={{
                        bgcolor: "#f2f2f2",
                        color: "#757575",
                        "&:hover": { bgcolor: "#e0e0e0" },
                      }}
                    >
                      <GoogleIcon />
                    </IconButton>

                    <IconButton
                      sx={{
                        bgcolor: "#0a66c2",
                        color: "#fff",
                        "&:hover": { bgcolor: "#0855a1" },
                      }}
                    >
                      <LinkedInIcon />
                    </IconButton>
                    <IconButton
                      sx={{
                        bgcolor: "#1da1f2",
                        color: "#fff",
                        "&:hover": { bgcolor: "#0c90e0" },
                      }}
                    >
                      <TwitterIcon />
                    </IconButton>
                    <IconButton
                      sx={{
                        bgcolor: "#107c41",
                        color: "#fff",
                        "&:hover": { bgcolor: "#0c6535" },
                      }}
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          bgcolor: "#107c41",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "bold", color: "#fff" }}
                        >
                          M
                        </Typography>
                      </Box>
                    </IconButton>
                    <IconButton
                      sx={{
                        bgcolor: "#f2f2f2",
                        color: "#757575",
                        "&:hover": { bgcolor: "#e0e0e0" },
                      }}
                    >
                      <MoreHorizIcon />
                    </IconButton>
                  </Box>
                </Box>
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
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <Box sx={{ mb: 4, maxWidth: "80%", textAlign: "center" }}>
                    <Box
                      sx={{ mb: 2, display: "flex", justifyContent: "center" }}
                    >
                      {/* Replace with actual illustration */}
                      <Box
                        sx={{ position: "relative", width: 200, height: 200 }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
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
                            position: "absolute",
                            width: 120,
                            height: 180,
                            left: 0,
                            top: 0,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
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
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
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
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
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
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
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
                      sx={{ fontWeight: "bold", mb: 1 }}
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
                      sx={{ color: "#0091ff", fontWeight: "medium" }}
                    >
                      Learn more
                    </Link>
                  </Box>
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
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
