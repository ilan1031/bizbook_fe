"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
  MenuItem,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  Google as GoogleIcon,
  LinkedIn as LinkedInIcon,
  Password as PasswordIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import TwitterIcon from "@mui/icons-material/Twitter";
import { useRouter } from "next/navigation";
import * as Yup from "yup"; // Import Yup
import apiService from "../../services/axiosService";
import { useSnackbar } from "../../components/SnackbarProvider";
import { useFormik } from "formik";

export default function ZohoSignupPage() {
  const { showMessage } = useSnackbar();
  const [errors, setErrors] = useState({});
  const router = useRouter();

  // Define Yup Validation Schema
  const validationSchema = Yup.object().shape({
    companyName: Yup.string()
      .required("Company Name is required.")
      .min(3, "Company Name must be at least 3 characters."),
    email: Yup.string()
      .required("Email is required.")
      .email("Please enter a valid email address."),
    phoneNumber: Yup.string()
      .required("Phone Number is required.")
      .matches(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number."),
    password: Yup.string()
      .required("Password is required.")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number."
      ),
    agreeToTerms: Yup.boolean().oneOf(
      [true],
      "You must agree to the terms and conditions."
    ),
  });

  const handleSignUp = () => {
    router.push("/organisation/login");
  }

  const formik = useFormik({
    initialValues: {
      companyName: "",
      email: "",
      phoneNumber: "",
      password: "",
      state_code: "641035",
      phone: "9875685495",
      country: "India",
      state: "Tamil Nadu",
      agreeToTerms: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await apiService({
          method: "POST",
          url: "/api/v1/user/user-register",
          data: values,
        });
        if (response.statusCode == 200) {
          localStorage.setItem("user_name", response.data.data.company_name);
          localStorage.setItem("token", response.data.token);
          showMessage(response.data.message, "success");
          router.push("/organisation/organisationsetuppage?register=true");
          resetForm();
        }
      } catch (validationErrors) {
        const newErrors = {};
        if (validationErrors.inner) {
          validationErrors.inner.forEach((error) => {
            newErrors[error.path] = error.message;
          });
        }
        setErrors(newErrors);
      }
    },
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, height: "92.2vh", pb: 6 }}>
      <Box sx={{ height: "100%", display: "flex", width: "100%" }}>
        {/* Left blue panel */}

        <Box sx={{ height: "145%", width: "100%" }}>
          <Box
            sx={{
              backgroundColor: "#0077dd",
              color: "white",
              boxShadow: 5,
              p: 4,
              mb: 4,
              width: "90%",
              maxWidth: 800,
              borderRadius: 2,
              height: "90%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h4" component="h1" fontWeight="bold" mb={3}>
              Trusted by <br />
              businesses and CAs
            </Typography>
            <Box
              sx={{
                backgroundColor: "rgba(0, 60, 120, 0.4)",
                p: 3,
                borderRadius: 2,
                height: 300,
                my: 12,
                mb: 4,
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Typography variant="body1" mb={3}>
                <br />
                Running a business requires smart accounts management. Bizbooks
                simplifies everything from invoicing to inventory in one
                platform.
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  component="img"
                  src="/api/placeholder/60/60"
                  alt="Profile"
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    mr: 2,
                  }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Naveedh V.V
                  </Typography>
                  <Typography variant="body2">
                    CO-FOUNDER, MAKE YOUR OWN FUTURE
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  display: "flex",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    bgcolor: "white",
                    borderRadius: "50%",
                  }}
                ></Box>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    bgcolor: "grey.400",
                    borderRadius: "50%",
                    mt: 0.3,
                  }}
                ></Box>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    bgcolor: "grey.400",
                    borderRadius: "50%",
                    mt: 0.3,
                  }}
                ></Box>
              </Box>
            </Box>
            <Box sx={{ mt: "auto" }}>
              <Typography
                variant="body2"
                textAlign="center"
                mb={2}
                sx={{ borderTop: "1px solid rgba(255,255,255,0.2)", pt: 2 }}
              >
                RATED BY THE BEST
              </Typography>
              <Grid container spacing={1} justifyContent="center">
                <Grid item xs={3}>
                  <Box
                    sx={{
                      bgcolor: "white",
                      borderRadius: 1,
                      p: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 20,
                        width: "100%",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="orange"
                        fontWeight="bold"
                      >
                        Capterra
                      </Typography>
                    </Box>
                    <Box
                      component="div"
                      sx={{ display: "flex", color: "orange" }}
                    >
                      {"★★★★★"}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      4.4/5
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box
                    sx={{
                      bgcolor: "white",
                      borderRadius: 1,
                      p: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "error.main",
                        color: "white",
                        width: 20,
                        height: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                      }}
                    >
                      G
                    </Box>
                    <Box
                      component="div"
                      sx={{ display: "flex", color: "orange" }}
                    >
                      {"★★★★★"}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      4.5/5
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box
                    sx={{
                      bgcolor: "white",
                      borderRadius: 1,
                      p: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "#5384ed",
                        color: "white",
                        width: 20,
                        height: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                      }}
                    >
                      P
                    </Box>
                    <Box
                      component="div"
                      sx={{ display: "flex", color: "orange" }}
                    >
                      {"★★★★★"}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      4.7/5
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box
                    sx={{
                      bgcolor: "white",
                      borderRadius: 1,
                      p: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "#0077dd",
                        color: "white",
                        width: 20,
                        height: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                      }}
                    >
                      A
                    </Box>
                    <Box
                      component="div"
                      sx={{ display: "flex", color: "orange" }}
                    >
                      {"★★★★★"}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      4.6/5
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>

        {/* Right signup form with scrolling container */}

        <Box sx={{ height: "100vh", width: "100%" }}>
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: 3,
              p: 4,
              ml: 5,
              pl: 6,
              maxWidth: 500,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0, mb: 3 }}>
              <Box
                component="img"
                src="books-logo.jpg"
                alt="Bizbooks"
                sx={{ height: 30 }}
              />
              <Typography variant="h6" sx={{ ml: "-11px" }}>
                izbooks
              </Typography>
            </Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              mb={3}
              textAlign="center"
            >
              Let&apos;s get started.
            </Typography>
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              sx={{ width: "100%" }}
            >
              <TextField
                fullWidth
                margin="normal"
                placeholder="Company Name"
                name="companyName"
                value={formik.values.companyName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.companyName &&
                  Boolean(formik.errors.companyName)
                }
                helperText={
                  formik.touched.companyName && formik.errors.companyName
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                margin="normal"
                placeholder="Email address"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                margin="normal"
                placeholder="Mobile Number"
                name="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                error={
                  formik.touched.phoneNumber &&
                  Boolean(formik.errors.phoneNumber)
                }
                helperText={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <PhoneIcon sx={{ color: "text.secondary", mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          +91
                        </Typography>
                      </Box>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                margin="normal"
                type="password"
                placeholder="Password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PasswordIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    select
                    fullWidth
                    name="country"
                    value={formik.values.country}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.country && Boolean(formik.errors.country)
                    }
                    helperText={formik.touched.country && formik.errors.country}
                    sx={{ "& .MuiSelect-select": { pl: 3 } }}
                  >
                    <MenuItem value="India">India</MenuItem>
                    <MenuItem value="US">United States</MenuItem>
                    <MenuItem value="UK">United Kingdom</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    select
                    fullWidth
                    name="state"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    error={formik.touched.state && Boolean(formik.errors.state)}
                    helperText={formik.touched.state && formik.errors.state}
                    sx={{ "& .MuiSelect-select": { pl: 3 } }}
                  >
                    <MenuItem value="Tamil Nadu">Tamil Nadu</MenuItem>
                    <MenuItem value="Karnataka">Karnataka</MenuItem>
                    <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Your data will be in INDIA data center.
              </Typography>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      name="agreeToTerms"
                      checked={formik.values.agreeToTerms}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I agree to the{" "}
                      <Link href="#" underline="none">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="#" underline="none">
                        Privacy Policy
                      </Link>
                      .
                    </Typography>
                  }
                  sx={{ mb: 2 }}
                />
                {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: "400",
                      color: "#D32F2F",
                      mt: "-20px",
                      mb: "20px",
                      pl: "20px",
                    }}
                  >
                    {formik.errors.agreeToTerms}
                  </Typography>
                )}
              </div>
              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                sx={{
                  bgcolor: "#f9b700",
                  color: "black",
                  "&:hover": { bgcolor: "#eaa700" },
                  textTransform: "none",
                  fontWeight: "bold",
                  mb: 1,
                }}
              >
                Create my account
              </Button>
              <Box sx={{ mt: 2 }}>
                <Divider />
              </Box>
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Grid container spacing={1} justifyContent="center">
                  <Grid item>
                    <Button
                      variant="outlined"
                      sx={{ minWidth: 0, p: 1, borderRadius: 1 }}
                    >
                      <GoogleIcon color="error" />
                    </Button>
                  </Grid>

                  <Grid item>
                    <Button
                      variant="outlined"
                      sx={{ minWidth: 0, p: 1, borderRadius: 1 }}
                    >
                      <LinkedInIcon color="primary" />
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      sx={{ minWidth: 0, p: 1, borderRadius: 1 }}
                    >
                      <TwitterIcon sx={{ color: "#1DA1F2" }} />
                    </Button>
                  </Grid>
                </Grid>
                <Typography variant="body2" mt={3}>
                  Already have an account?{" "}
                  <Link
                    href="#"
                    underline="hover"
                    sx={{
                      color: "#0091ff",
                      fontWeight: "550",
                      fontSize: "17px",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSignUp();
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
