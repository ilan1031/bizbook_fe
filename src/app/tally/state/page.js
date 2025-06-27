"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import apiService from "../../../services/axiosService";
import PartyDetails from "./components/partydetails";

export default function Home() {
  const [contactDetails, setContactDetails] = useState({
    company_name: "",
    billing_address: null,
    place_of_contact: "",
    gst_no: "",
    contact_type: "",
  });
  const [loading, setLoading] = useState(false);
  const organization_id = localStorage.getItem("organization_id");

  // Fetch contact details when the page loads
  useEffect(() => {
    const fetchContactDetails = async () => {
      const contactId = localStorage.getItem("selectedContactId");
      if (!contactId) return;

      setLoading(true);
      try {
        const response = await apiService({
          method: "GET",
          url: `/api/v1/contact/${contactId}`,
          params: {
            organization_id: organization_id,
          },
          file: false,
        });

        const { data } = response.data;
        console.log("Contact details:", data);

        // Update state with contact details
        setContactDetails({
          company_name: data.company_name || "",
          billing_address: data.billing_address || null,
          place_of_contact: data.place_of_contact || "",
          gst_no: data.gst_no || "",
          contact_type: data.contact_type || "",
        });

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch contact details:", error);
        setLoading(false);
      }
    };

    fetchContactDetails();
  }, []);

  return (
    <div style={styles.container}>
      <Head>
        <title>Party Details - National Enterprises</title>
        <meta name="description" content="State selection component" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={styles.topBar}>
        <div style={styles.leftHeader}>Party Details</div>
        <div style={styles.rightHeader}>National Enterprises</div>
      </div>

      <div style={styles.pageContainer}>
        <div style={styles.mainContent}>
          <PartyDetails contactDetails={contactDetails} loading={loading} />
        </div>

        <div style={styles.sidebar}>{/* Sidebar content goes here */}</div>
      </div>

      <div style={styles.footer}>
        <div style={styles.reference}></div>
        <div style={styles.configButton}>F12: Configure</div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f0f0f0",
    minHeight: "100vh",
    position: "relative",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#8ecae6",
    color: "white",
    padding: "4px 10px",
  },
  leftHeader: {
    fontWeight: "bold",
  },
  rightHeader: {
    fontWeight: "bold",
  },
  pageContainer: {
    display: "flex",
    minHeight: "calc(100vh - 70px)",
  },
  mainContent: {
    flex: "1",
    padding: "20px",
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#8ecae6", // Dark blue sidebar
    borderLeft: " #8ecae6",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    position: "fixed",
    bottom: "0",
    left: "0",
    right: "0",
    padding: "5px 10px",
    backgroundColor: "#f0f0f0",
  },
  reference: {
    color: "#444",
  },
  configButton: {
    color: "#444",
  },
};
