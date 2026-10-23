"use client";
import React, { useState, useEffect } from "react";
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
  Paper,
} from "@mui/material";
import apiService, { portalGet, savePortalSession, clearPortalSession, portalLoginPath, decodeJwt } from "../../portalApi";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams, useRouter } from "next/navigation";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);
  const [OrganisationDetails, setOrganisationDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const org_id = params.orgId;

  const handleClickShowPassword = () => setShowPassword(!showPassword);


  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),

    password: Yup.string().when([], {
    is: () => isEmailConfirmed,
    then: (schema) =>
      schema.required("Password is required"),
    otherwise: (schema) =>
      schema.notRequired(),
  }),

  });

  useEffect(() => {
    const fetchOrg = async () => {
      setLoading(true);
      try {
        console.log(org_id, "org_id");
        const response = await apiService({
          method: "GET",
          url: `/api/v1/organization/${org_id}`,
        });
        console.log(org_id, "org_id");
        console.log("the Response for org in sign in page", response);
        setOrganisationDetails(response.data.data);
        // Runs after mount, by which time formik exists.
        // eslint-disable-next-line react-hooks/immutability
        formik.setFieldValue(
          "organization_id",
          response.data.data.organization_id
        );
        setLoading(false);
      } catch (error) {
        console.log(error, "Error in getting org id for sign in page");
      }
    };
    fetchOrg();
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      organization_id: "",
      role: "client",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);

      try {
        const response = await apiService({
          method: "POST",
          url: !isEmailConfirmed
            ? "/api/v1/verifyEmail"
            : "/api/v1/client/login",
          data: values,
        });

        console.log("Checking the Email", response);

        const statusCode = response.statusCode;

        if (!isEmailConfirmed) {
          if (statusCode === 200) {
            setIsEmailConfirmed(true);
          } else if (statusCode === 201) {
            console.log("Got false info");
            setIsEmailConfirmed(false);
            formik.setFieldError("email", "User not Found");
          } else if (statusCode === 202) {
            setIsEmailConfirmed(false);
            formik.setFieldError(
              "email",
              "User is associate with another organization."
            );
          }
        }
        if (isEmailConfirmed) {

          
          savePortalSession({
            token: response.data.token,
            orgId: response.data.org_id || org_id,
            clientId: response.data.data.client_id,
            clientPersonId: response.data.data.client_person_id,
          });
          router.push("/portal/home");
          

        }
      } catch (error) {
        console.log("Error in Verifying Email", error);
        if(error.message === "Invalid credentials"){
          
          formik.setFieldError("password", "Invalid Password");
          
        }
      }
    },
  });

  // Emails a reset link to the address typed in the email field.
  const [resetMsg, setResetMsg] = useState("");
  const sendReset = async () => {
    const email = formik.values.email?.trim();
    if (!email) {
      formik.setFieldTouched("email", true);
      setResetMsg("Enter your email address first.");
      return;
    }
    try {
      const r = await apiService({
        method: "POST",
        url: "/api/v1/client/forgot-password",
        data: { email, organization_id: org_id },
      });
      setResetMsg(r.data?.message || "Check your email for a reset link.");
    } catch (e) {
      setResetMsg(e?.message || "Couldn't send the reset link.");
    }
  };

  return (
    <>
      {loading ? (
        <></>
      ) : (
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
                variant="h5"
                component="div"
                align="center"
                sx={{
                  fontWeight: 600,
                  color: "#2c384a",
                  fontSize: "16px",
                  mb: 1,
                }}
              >
                {OrganisationDetails.org_name}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="h6"
                component="div"
                align="center"
                sx={{
                  fontWeight: 500,
                  fontSize: "18px",
                  mb: 1,
                }}
              >
                Sign in
              </Typography>

              <Typography
                variant="body2"
                align="center"
                color="text.secondary"
                sx={{ mb: 3, fontSize: "14px", fontWeight: "400" }}
              >
                View and manage your transactions with{" "}
                {OrganisationDetails.org_name}
              </Typography>

              <Box sx={{ minHeight: "400px" }}>
                {!isEmailConfirmed && (
                  <>
                    <TextField
                      fullWidth
                      id="email"
                      name="email"
                      label="Email Address"
                      type="text"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.email && Boolean(formik.errors.email)
                      }
                      sx={{
                        mb: 3,
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // subtle bottom shadow
                        borderRadius: "7px",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            border: "none", // removes default border
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "black", // label color
                        },
                        borderTop: "none",
                      }}
                    />
                    {formik.touched.email && Boolean(formik.errors.email) && (
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
                        {formik.errors.email}
                      </Typography>
                    )}
                  </>
                )}

                {isEmailConfirmed && (
                  <Box
                    sx={{ display: "inline-flex", alignItems: "center", mb: 3 }}
                  >
                    <Box
                      sx={{
                        px: 1.5,
                        py: 1,
                        borderRadius: "7px",
                        color: "black",
                        fontSize: "16px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100%", // control max width
                      }}
                    >
                      {formik.values.email}
                    </Box>
                    <Box
                      component="span"
                      onClick={() => {
                        setIsEmailConfirmed(!isEmailConfirmed);
                        formik.setFieldValue("password", "");
                      }}
                      sx={{
                        fontSize: "16px",
                        fontWeight: 400,
                        color: "#309FF4",
                        cursor: "pointer",
                        ml: 1,
                      }}
                    >
                      Change
                    </Box>
                  </Box>
                )}

                {isEmailConfirmed && (
                  <>
                    <TextField
                      fullWidth
                      id="password"
                      name="password"
                      label="Enter your password"
                      type={showPassword ? "text" : "password"}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={(e) => {
                        formik.handleBlur(e);
                      }}
                      error={
                        formik.touched.password &&
                        Boolean(formik.errors.password)
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
                              {showPassword ? (
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
                        },
                        "& .MuiInputLabel-root": {
                          color: "black", // label color
                        },
                        borderTop: "none",
                      }}
                    />
                    {formik.touched.password &&
                      Boolean(formik.errors.password) && (
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
                  </>
                )}

                <Button
                  onClick={formik.handleSubmit}
                  fullWidth
                  variant="contained"
                  sx={{
                    py: 1.5,
                    mt: 1,
                    mb: 6,
                    fontWeight: "600",
                    fontSize: "14px",
                    bgcolor: "#2196f3",
                    "&:hover": {
                      bgcolor: "#1976d2",
                    },
                  }}
                >
                  {isEmailConfirmed ? "Sign in" : "Next"}
                </Button>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography
                  component="button"
                  type="button"
                  onClick={sendReset}
                  sx={{ color: "#408DFB", fontSize: "14px", fontWeight: "400", background: "none", border: 0, cursor: "pointer" }}
                >
                  Forgot password?
                </Typography>
                {resetMsg && (
                  <Typography sx={{ fontSize: "13px", color: "text.secondary", textAlign: "center" }}>{resetMsg}</Typography>
                )}
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <Typography sx={{ fontSize: "14px", fontWeight: "400", textAlign: "center" }}>
                    Don&apos;t have an account? Ask {OrganisationDetails?.org_name || "the business"} to send you a portal
                    invitation.
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </>
  );
};

export default Login;
