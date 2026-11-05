// 1. First, let's create the modal component (CreateAccountModal.js)
"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Button,
  Box,
  styled,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as Yup from "yup";
import { useFormik } from "formik";
import apiService from "../services/axiosService";
import config from "../services/config";
import { useSnackbar } from "./SnackbarProvider";
import { AccountForm } from "./AccountForm";

const CreateAccountModal = ({ open, onClose, onSuccess, accountId }: any) => {
  const [accountTypes, setAccountTypes] = useState<any>([]);
  const [selectedAccountTypeInfo, setSelectedAccountTypeInfo] = useState<any>({
    account_type_formatted: "Select an Account Type",
    description: "here show that Description",
    examples: [] as any[],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [accountData, setAccountData] = useState<any>(null);

  const orgId = localStorage.getItem("organization_id");
  const { showMessage } = useSnackbar();

  const getCoaTypes = async () => {
    setLoading(true);
    try {
      const params = {
        url: `/api/v1/COA/get-coa-types?org_id=${orgId}`,
        method: "GET",
        customBaseUrl: config.PO_Base_url,
      };
      const response = await apiService(params);
      if (response.statusCode === 200) {
        setAccountTypes(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching account types", err);
      showMessage("Failed to load account types", "error");
    } finally {
      setLoading(false);
    }
  };

  const getIndividualAccount = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        url: `/api/v1/COA/coa-details?org_id=${orgId}&COA_ID=${accountId}`,
        method: "GET",
        customBaseUrl: config.PO_Base_url,
      };

      const response = await apiService(params);
      if (response.statusCode === 200) {
        const data = response.data.data.chart_of_accounts;
        setAccountData(data);

        if (data.account_type_formatted && accountTypes.length > 0) {
          const selected = accountTypes.find(
            (type) => type.account_formatted_type === data.account_type_formatted
          );
          if (selected) {
            setSelectedAccountTypeInfo({
              account_type_formatted: selected.account_type_formatted || "Account Type",
              description: selected.description || "No description available",
              examples: selected.examples || [],
            });
          }
        }
      }
    } catch (error) {
      console.error("Error fetching account details:", error);
      showMessage("Failed to load account details", "error");
    } finally {
      setLoading(false);
    }
  }, [accountId, orgId, accountTypes, showMessage]);

  useEffect(() => {
    if (accountId && accountTypes.length > 0) {
      getIndividualAccount();
    }
  }, [accountId, accountTypes, getIndividualAccount]);

  const handleClose = () => {
    setSelectedAccountTypeInfo({
      account_type_formatted: "Select an Account Type",
      description: "here show that Description",
      examples: [] as any[],
    });
    setAccountData(null);
    setIsEdit(false);
    onClose();
  };

  useEffect(() => {
    if (open) {
      setIsEdit(!!accountId);
      getCoaTypes();
    }
  }, [open, accountId]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          width: "900px",
          maxWidth: "900px",
          height: "auto",
          borderRadius: "0px 8px",
          mt: 0,
          alignSelf: "flex-start" as const,
        },
      }}
      sx={{
        alignItems: "flex-start" as const,
      }}
    >
      <DialogTitle
        sx={{
          display: "flex" as const,
          justifyContent: "space-between" as const,
          alignItems: "center" as const,
          fontSize: "17px",
          fontWeight: 500,
          borderBottom: "1px solid #eeeeee",
        }}
      >
        {isEdit ? "Edit Account" : "Create Account"}
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {loading && accountId && !accountData ? (
          <Box
            sx={{
              display: "flex" as const,
              justifyContent: "center" as const,
              alignItems: "center" as const,
              minHeight: "300px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <AccountForm
            accountTypes={accountTypes}
            selectedAccountTypeInfo={selectedAccountTypeInfo}
            setSelectedAccountTypeInfo={setSelectedAccountTypeInfo}
            accountData={accountData}
            isEdit={isEdit}
            onSuccess={onSuccess}
            onClose={onClose}
            accountId={accountId}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateAccountModal;
