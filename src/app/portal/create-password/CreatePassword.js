"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import apiService, { portalGet, savePortalSession, clearPortalSession, portalLoginPath, decodeJwt } from "../portalApi";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import ErrorImage from "../error-img.png";
import Image from "next/image";
import { useSnackbar } from "../../../components/SnackbarProvider";

const CreatePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [decodeData, setDecodeData] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const route = useRouter();
  const { showMessage } = useSnackbar();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .max(15, "Password must not exceed 15 characters")
      .notOneOf(["Manoj"], "Password cannot be same as your username")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: decodeData?.email,
      password: "",
      confirmPassword: "",
      role: "client",
      clientId: decodeData?.clientId,
      clientPersonId: decodeData?.clientPersonId,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = {
          email: values?.email,
          password: values?.password,
          role: "client",
          clientId: values?.clientId,
          clientPersonId: values?.clientPersonId,
        };
        const response = await apiService({
          method: "POST",
          url: `/api/v1/client/register `,
          data: formData,
        });
        const data = response.data;
        if (data?.status) {
          savePortalSession({
            token: data?.token,
            orgId: data?.org_id,
            clientId: data?.data?.client_id,
            clientPersonId: data?.data?.client_person_id,
          });
          route.push("/portal/home");
        } else {
          showMessage(data?.message, "error");
        }
      } catch (error) {
        showMessage(error?.message, "error");
        console.log("Error in Customer Portal Login", error);
      }
    },
  });

  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decoded = decodeJwt(token);
      formik.setFieldValue("email", decoded.email);
      formik.setFieldValue("clientId", decoded.clientId);
      formik.setFieldValue("clientPersonId", decoded.clientPersonId);
      setDecodeData(decoded);
      const currentTime = Date.now() / 1000; // in seconds
      return decoded.exp < currentTime;
    } catch (e) {
      console.error("Invalid token:", e);
      return true;
    }
  };

  useEffect(() => {
    // Reads the invitation token once the page is in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsExpired(isTokenExpired(token));
  }, []);

  const isPasswordValid = {
    length: formik.values.password.length >= 8,
    notUsername: formik.values.password !== "Manoj",
    maxLength: formik.values.password.length <= 250,
    specialChar: /[^A-Za-z0-9]/.test(formik.values.password),
    number: /[0-9]/.test(formik.values.password),
    bothCases:
      /[A-Z]/.test(formik.values.password) &&
      /[a-z]/.test(formik.values.password),
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        bgcolor: "#f5f5f5",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 450,
          borderRadius: 2,
          boxShadow: 2,
          m: 4,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="subtitle1"
            component="div"
            align="center"
            sx={{
              fontWeight: 600,
              color: "#000",
              mb: 1,
            }}
          >
            {decodeData?.org_name}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography
            variant="body1"
            component="div"
            align="center"
            sx={{
              fontWeight: 600,
              mb: 1,
            }}
          >
            Create Password
          </Typography>

          <Typography
            variant="body2"
            align="center"
            sx={{ mb: 3, fontWeight: 600, fontSize: "14px" }}
          >
            Enter a password that you wish to use for this service
          </Typography>
          {!isExpired ? (
            <form onSubmit={formik.handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  disabled
                  id="email"
                  name="email"
                  value={formik.values.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: "black" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 3,
                    bgcolor: "#f9f9ff",
                    color: "black",
                    borderRadius: "7px",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        border: "none",
                        color: "black",
                        borderRadius: "7px",
                      },
                    },
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "black", // specifically targets disabled text
                    },
                  }}
                />

                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  onFocus={() => setIsPasswordFocused(true)}
                  onChange={formik.handleChange}
                  onBlur={(e) => {
                    formik.handleBlur(e); // Let Formik handle its blur
                    setIsPasswordFocused(false); // Then set focus state to false
                  }}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={(event) => event.preventDefault()}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 3,
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // subtle bottom shadow
                    borderRadius: "7px",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        border: "none", // removes default border
                      },
                      "& input::-ms-reveal, & input::-ms-clear": {
                        display: "none",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "black", // label color
                    },
                    borderTop: "none",
                  }}
                />
                {formik.touched.password && Boolean(formik.errors.password) && (
                  <Typography
                    sx={{
                      fontWeight: "400",
                      fontSize: "12px",
                      color: "#D32F2F",
                      mt: -2.5,
                      mb: 2.5,
                      ml: 1.7,
                    }}
                  >
                    {formik.errors.password}
                  </Typography>
                )}

                {isPasswordFocused && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 3,
                      border: "1px solid #e0e0e0",
                      borderRadius: "7px",
                    }}
                  >
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Password must contain:
                    </Typography>
                    <List dense disablePadding>
                      <ListItem dense disableGutters>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <FiberManualRecordIcon
                            sx={{
                              fontSize: 8,
                              color: isPasswordValid.length
                                ? "success.main"
                                : "error.main",
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary="At least 8 characters"
                          primaryTypographyProps={{
                            variant: "body2",
                            color: isPasswordValid.length
                              ? "text.primary"
                              : "error.main",
                          }}
                        />
                      </ListItem>
                      <ListItem dense disableGutters>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <FiberManualRecordIcon
                            sx={{
                              fontSize: 8,
                              color: isPasswordValid.notUsername
                                ? "success.main"
                                : "error.main",
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary="Password cannot be same as your username"
                          primaryTypographyProps={{
                            variant: "body2",
                            color: isPasswordValid.notUsername
                              ? "text.primary"
                              : "error.main",
                          }}
                        />
                      </ListItem>
                      <ListItem dense disableGutters>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <FiberManualRecordIcon
                            sx={{
                              fontSize: 8,
                              color: isPasswordValid.maxLength
                                ? "success.main"
                                : "error.main",
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary="No more than 15 characters"
                          primaryTypographyProps={{
                            variant: "body2",
                            color: isPasswordValid.maxLength
                              ? "text.primary"
                              : "error.main",
                          }}
                        />
                      </ListItem>
                      <ListItem dense disableGutters>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <FiberManualRecordIcon
                            sx={{
                              fontSize: 8,
                              color: isPasswordValid.specialChar
                                ? "success.main"
                                : "error.main",
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary="At least 1 special character"
                          primaryTypographyProps={{
                            variant: "body2",
                            color: isPasswordValid.specialChar
                              ? "text.primary"
                              : "error.main",
                          }}
                        />
                      </ListItem>
                      <ListItem dense disableGutters>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <FiberManualRecordIcon
                            sx={{
                              fontSize: 8,
                              color: isPasswordValid.number
                                ? "success.main"
                                : "error.main",
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary="At least 1 number"
                          primaryTypographyProps={{
                            variant: "body2",
                            color: isPasswordValid.number
                              ? "text.primary"
                              : "error.main",
                          }}
                        />
                      </ListItem>
                      <ListItem dense disableGutters>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <FiberManualRecordIcon
                            sx={{
                              fontSize: 8,
                              color: isPasswordValid.bothCases
                                ? "success.main"
                                : "error.main",
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary="Both upper and lowercase letters"
                          primaryTypographyProps={{
                            variant: "body2",
                            color: isPasswordValid.bothCases
                              ? "text.primary"
                              : "error.main",
                          }}
                        />
                      </ListItem>
                    </List>
                  </Paper>
                )}

                <TextField
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Re-enter to confirm password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 3,
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // subtle bottom shadow
                    borderRadius: "7px",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        border: "none", // removes default border
                      },
                      "& input::-ms-reveal, & input::-ms-clear": {
                        display: "none",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "black", // label color
                    },
                    borderTop: "none",
                  }}
                />
                {formik.touched.confirmPassword &&
                  Boolean(formik.errors.confirmPassword) && (
                    <Typography
                      sx={{
                        fontWeight: "400",
                        fontSize: "12px",
                        color: "#D32F2F",
                        mt: -2.5,
                        mb: 2.5,
                        ml: 1.7,
                      }}
                    >
                      {formik.errors.confirmPassword}
                    </Typography>
                  )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    py: 1.5,
                    mt: 1,
                    mb: 6,
                    fontWeight: "600",
                    bgcolor: "#2196f3",
                    "&:hover": {
                      bgcolor: "#1976d2",
                    },
                  }}
                >
                  CONFIRM
                </Button>
              </Box>
            </form>
          ) : (
            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Image src={ErrorImage} alt="error-image" priority />
              <Typography variant="h6" fontSize="600">
                Invalid Invitation
              </Typography>
              <Box sx={{ my: 6, fontSize: "14px" }}>
                This invitation is either invalid or has expired.
                <br /> Please contact divya.s.ihub for clarification.
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
export default CreatePassword;
