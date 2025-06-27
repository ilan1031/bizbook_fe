"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PartyDetails from "./PartyDetails";
import apiService from "../../../../services/axiosService";

const DispatchDetails = ({
  deliveryNotes,
  dispatchDoc,
  dispatchedThrough,
  destination,
  carrierName,
  billNumber,
  billDate,
  vehicleNumber,
  onDeliveryNotesChange,
  onDispatchDocChange,
  onDispatchedThroughChange,
  onDestinationChange,
  onCarrierNameChange,
  onBillNumberChange,
  onBillDateChange,
  onVehicleNumberChange,
  onClose,
  onVehicleNumberEnter,
}) => {
  const router = useRouter();
  const [showPartyDetails, setShowPartyDetails] = useState(false);
  const [headerTitle, setHeaderTitle] = useState("Dispatch Details");
  const [contactDetails, setContactDetails] = useState(null);
  const [contactLoading, setContactLoading] = useState(false);
  const organization_id = localStorage.getItem("organization_id");

  // Fetch contact details when PartyDetails popup is opened
  useEffect(() => {
    if (showPartyDetails) {
      fetchContactDetails();
    }
  }, [showPartyDetails]);

  // Function to fetch contact details
  const fetchContactDetails = async () => {
    setContactLoading(true);
    try {
      const contactId = localStorage.getItem("selectedContactId");
      if (!contactId) {
        setContactLoading(false);
        return;
      }

      const response = await apiService({
        method: "GET",
        url: `/api/v1/contact/${contactId}`,
        params: {
          organization_id: organization_id,
        },
        file: false,
      });

      const { data } = response.data;
      setContactDetails(data);
      setContactLoading(false);
    } catch (error) {
      console.error("Failed to fetch contact details:", error);
      setContactLoading(false);
    }
  };

  const handleVehicleNumberKeyDown = (e) => {
    if (e.key === "Enter") {
      const vehicleNumber = e.target.value;
      // Call the parent component's function to handle the Enter key press
      onVehicleNumberEnter(vehicleNumber);
    }
  };

  // Function to close party details popup
  const handleClosePartyDetails = () => {
    setShowPartyDetails(false);
    setHeaderTitle("Dispatch Details");
  };

  const styles = {
    container: {
      position: "absolute",
      top: "30px",
      left: "0",
      right: "240px",
      bottom: "0",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 100,
    },
    content: {
      backgroundColor: "white",
      width: "100%",
      maxWidth: "1000px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      border: "1px solid black",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
    title: {
      fontWeight: "bold",
      fontSize: "16px",
      textAlign: "center",
      padding: "10px 0",
      textDecoration: "underline",
      marginBottom: "10px",
    },
    header: {
      fontWeight: "bold",
      marginBottom: "10px",
      textAlign: "center",
      borderBottom: "1px solid #ccc",
      paddingBottom: "5px",
    },
    row: {
      display: "flex",
      marginBottom: "8px",
      alignItems: "center",
      padding: "0 10px",
    },
    label: {
      width: "180px",
      textAlign: "right",
      paddingRight: "10px",
      fontSize: "14px",
    },
    colon: {
      margin: "0 8px",
    },
    input: {
      padding: "2px 5px",
      border: "1px solid #ccc",
      width: "150px",
      height: "20px",
    },
    dateInput: {
      padding: "2px 5px",
      border: "1px solid #ccc",
      width: "150px",
      height: "20px",
    },
    rightSection: {
      marginLeft: "20px",
      flex: 1,
    },
    rightLabel: {
      width: "150px",
      textAlign: "right",
      paddingRight: "10px",
      fontSize: "14px",
    },
    flexContainer: {
      display: "flex",
      justifyContent: "space-between",
      padding: "10px",
    },
    leftSection: {
      flex: 1,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.title}>Dispatch Details</div>
        <div style={styles.flexContainer}>
          <div style={styles.leftSection}>
            <div style={styles.row}>
              <div style={styles.label}>Delivery Note No(s)</div>
              <span style={styles.colon}>:</span>
              <input
                type="text"
                value={deliveryNotes}
                onChange={(e) => onDeliveryNotesChange(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.row}>
              <div style={styles.label}>Date</div>
              <span style={styles.colon}>:</span>
              <input
                type="date"
                value={billDate}
                onChange={(e) => onBillDateChange(e.target.value)}
                style={styles.dateInput}
              />
            </div>
          </div>
          <div style={styles.rightSection}>
            <div style={styles.row}>
              <div style={styles.rightLabel}>Dispatch Doc. No.</div>
              <span style={styles.colon}>:</span>
              <input
                type="text"
                value={dispatchDoc}
                onChange={(e) => onDispatchDocChange(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.row}>
              <div style={styles.rightLabel}>Dispatched through</div>
              <span style={styles.colon}>:</span>
              <input
                type="text"
                value={dispatchedThrough}
                onChange={(e) => onDispatchedThroughChange(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.row}>
              <div style={styles.rightLabel}>Destination</div>
              <span style={styles.colon}>:</span>
              <input
                type="text"
                value={destination}
                onChange={(e) => onDestinationChange(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.row}>
              <div style={styles.rightLabel}>Carrier Name/Agent</div>
              <span style={styles.colon}>:</span>
              <input
                type="text"
                value={carrierName}
                onChange={(e) => onCarrierNameChange(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.row}>
              <div style={styles.rightLabel}>Bill of Lading/LR-RR No.</div>
              <span style={styles.colon}>:</span>
              <input
                type="text"
                value={billNumber}
                onChange={(e) => onBillNumberChange(e.target.value)}
                style={styles.input}
              />
              <span style={styles.colon}>Date:</span>
              <input
                type="date"
                value={billDate}
                onChange={(e) => onBillDateChange(e.target.value)}
                style={styles.dateInput}
              />
            </div>
            <div style={styles.row}>
              <div style={styles.rightLabel}>Vehicle No.</div>
              <span style={styles.colon}>:</span>
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => onVehicleNumberChange(e.target.value)}
                onKeyDown={handleVehicleNumberKeyDown}
                style={styles.input}
              />
            </div>
          </div>
        </div>
      </div>

      {/* PartyDetails Popup */}
      {showPartyDetails && (
        <div
          style={{
            position: "absolute",
            top: "60px",
            left: "0",
            right: "240px",
            bottom: "0",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
          }}
        >
          <PartyDetails
            contactDetails={contactDetails}
            loading={contactLoading}
          />
        </div>
      )}
    </div>
  );
};

export default DispatchDetails;
