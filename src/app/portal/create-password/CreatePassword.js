"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CircularProgress,
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
import apiService, { savePortalSession } from "../portalApi";
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
  // What the invitation link can still be used for (see GET /client/invite-status):
  // pending | registered | expired | revoked | invalid; null while checking.
  const [invite, setInvite] = useState(null);
  const route = useRouter();
  const { showMessage } = useSnackbar();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password must not exceed 64 characters")
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
      email: "",
      password: "",
      confirmPassword: "",
      role: "client",
      clientId: "",
      clientPersonId: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await apiService({
          method: "POST",
          url: "/api/v1/client/register",
          data: { token, password: values?.password },
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
        // Someone else (or an earlier visit) already set the password.
        if (error?.code === "ALREADY_REGISTERED") {
          route.replace(`/portal/${error.organization_id}/login?notice=registered`);
          return;
        }
        showMessage(error?.message, "error");
      }
    },
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let result = { state: "invalid" };
      try {
        const res = await apiService({
          method: "GET",
          url: "/api/v1/client/invite-status",
          params: { token },
        });
        result = res.data?.data || result;
      } catch {
        result = { state: "invalid" };
      }
      if (cancelled) return;
      // Already set up: this link is now just the way to the sign-in page.
      if (result.state === "registered" && result.organization_id) {
        route.replace(`/portal/${result.organization_id}/login?notice=registered`);
        return;
      }
      if (result.email) formik.setFieldValue("email", result.email);
      setInvite(result);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

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
            {invite?.org_name}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {invite?.state === "pending" && (
            <>
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
            </>
          )}
          {!invite ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <CircularProgress size={24} />
            </Box>
          ) : invite.state === "pending" ? (
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
                {invite.state === "expired" ? "Invitation expired" : "Invitation not available"}
              </Typography>
              <Box sx={{ my: 4, fontSize: "14px" }}>
                {invite.state === "expired"
                  ? "This invitation has expired."
                  : invite.state === "revoked"
                    ? "This invitation is no longer active."
                    : "This invitation link isn't valid."}
                <br />
                Please ask {invite.org_name || "the business"} to send you a new invitation.
              </Box>
              {invite.organization_id && (
                <Button variant="outlined" onClick={() => route.push(`/portal/${invite.organization_id}/login`)}>
                  Go to sign in
                </Button>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
export default CreatePassword;
