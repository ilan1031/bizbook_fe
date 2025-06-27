"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import DetailRow from "../../state/components/detailrow";
import Dropdown from "../../state/components/dropdown";

const PartyDetails = ({ contactDetails, loading }) => {
  const router = useRouter();
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isSupplyOpen, setIsSupplyOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("Karnataka");
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [selectedSupply, setSelectedSupply] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const stateDropdownRef = useRef(null);
  const countryDropdownRef = useRef(null);
  const supplyDropdownRef = useRef(null);

  // Initialize selected state and supply from contact details
  useEffect(() => {
    if (contactDetails && contactDetails.place_of_contact) {
      setSelectedState(contactDetails.place_of_contact);
      setSelectedSupply(contactDetails.place_of_contact);
    } else {
      setSelectedSupply("Select State");
    }
  }, [contactDetails]);

  const indianStates = [
    "Not Applicable",
    "Andaman & Nicobar Islands",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chandigarh",
    "Chhattisgarh",
    "Dadra & Nagar Haveli and Daman & Diu",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu & Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Ladakh",
    "Lakshadweep",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Other Territory",
    "Puducherry",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttarakhand",
    "Uttar Pradesh",
    "West Bengal",
  ];

  const countries = [
    "India",
    "Afghanistan",
    "Australia",
    "Bangladesh",
    "Bhutan",
    "China",
    "Japan",
    "Malaysia",
    "Nepal",
    "Singapore",
    "Sri Lanka",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
  ];

  const filteredStates = searchTerm
    ? indianStates.filter((state) =>
        state.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : indianStates;

  const filteredCountries = searchTerm
    ? countries.filter((country) =>
        country.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : countries;

  const toggleStateDropdown = () => {
    setIsStateOpen(!isStateOpen);
    setIsCountryOpen(false);
    setIsSupplyOpen(false);
    if (!isStateOpen) {
      setSearchTerm("");
    }
  };

  const toggleCountryDropdown = () => {
    setIsCountryOpen(!isCountryOpen);
    setIsStateOpen(false);
    setIsSupplyOpen(false);
    if (!isCountryOpen) {
      setSearchTerm("");
    }
  };

  const toggleSupplyDropdown = () => {
    setIsSupplyOpen(!isSupplyOpen);
    setIsStateOpen(false);
    setIsCountryOpen(false);
    if (!isSupplyOpen) {
      setSearchTerm("");
    }
  };

  const selectState = (state) => {
    setSelectedState(state);
    setIsStateOpen(false);
  };

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setIsCountryOpen(false);
  };

  const selectSupply = (state) => {
    setSelectedSupply(state);
    setIsSupplyOpen(false);

    // Store the selected state in localStorage for the voucher page
    localStorage.setItem("selectedPartyName", state);

    // Navigate to the voucher page
    router.push("/tally/voucher");
  };

  const handleClickOutside = (event) => {
    if (
      stateDropdownRef.current &&
      !stateDropdownRef.current.contains(event.target)
    ) {
      setIsStateOpen(false);
    }
    if (
      countryDropdownRef.current &&
      !countryDropdownRef.current.contains(event.target)
    ) {
      setIsCountryOpen(false);
    }
    if (
      supplyDropdownRef.current &&
      !supplyDropdownRef.current.contains(event.target)
    ) {
      setIsSupplyOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div style={styles.partyDetailsContainer}>
      <div style={styles.partyDetailsHeader}>Party Details</div>

      <div style={styles.partyDetailsContent}>
        <DetailRow label="Buyer (Bill to)">
          {loading
            ? "Loading..."
            : contactDetails.company_name || "Ganeshji Industries"}
        </DetailRow>

        <DetailRow label="Mailing Name">
          {loading
            ? "Loading..."
            : contactDetails.company_name || "Ganeshji Industries"}
        </DetailRow>

        <DetailRow label="Address">
          <div>
            {loading ? (
              "Loading..."
            ) : contactDetails.billing_address ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                {[
                  contactDetails.billing_address.attention,
                  contactDetails.billing_address.address,
                  contactDetails.billing_address.street2,
                  contactDetails.billing_address.city,
                  [
                    contactDetails.billing_address.state,
                    contactDetails.billing_address.zip,
                  ]
                    .filter(Boolean)
                    .join(" "),
                  contactDetails.billing_address.country,
                  contactDetails.billing_address.phone
                    ? `Phone ${contactDetails.billing_address.phone}`
                    : null,
                  contactDetails.billing_address.fax
                    ? `Fax Number ${contactDetails.billing_address.fax}`
                    : null,
                ]
                  .filter(Boolean)
                  .map((line, index) => (
                    <div
                      key={index}
                      style={{
                        fontWeight: index === 0 ? "bold" : "normal",
                        lineHeight: "1.5",
                      }}
                    >
                      {line}
                    </div>
                  ))}
              </div>
            ) : (
              "No. 28, Hongasandra\nHosur Main Road\nBangalore"
            )}
          </div>
        </DetailRow>

        <DetailRow label="State">
          <div ref={stateDropdownRef}>
            <Dropdown
              isOpen={isStateOpen}
              toggle={toggleStateDropdown}
              selected={selectedState}
              onSelect={selectState}
              options={filteredStates}
              title="List of States"
              buttonText="New State"
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </DetailRow>

        <DetailRow label="Country">
          <div ref={countryDropdownRef}>
            <Dropdown
              isOpen={isCountryOpen}
              toggle={toggleCountryDropdown}
              selected={selectedCountry}
              onSelect={selectCountry}
              options={filteredCountries}
              title="List of Countries"
              buttonText="New Country"
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </DetailRow>

        <DetailRow label="GSTIN/UIN">
          {loading
            ? "Loading..."
            : contactDetails.gst_no ||
              contactDetails.contact_type ||
              "29AIFPD2613R1Z0"}
        </DetailRow>

        <DetailRow label="Place of Supply">
          <div ref={supplyDropdownRef}>
            <Dropdown
              isOpen={isSupplyOpen}
              toggle={toggleSupplyDropdown}
              selected={selectedSupply}
              onSelect={selectSupply}
              options={filteredStates}
              title="List of States"
              buttonText="New State"
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </DetailRow>
      </div>
    </div>
  );
};

const styles = {
  partyDetailsContainer: {
    width: "100%",
    maxWidth: "700px",
    margin: "0 auto",
    border: "1px solid #aaa",
    backgroundColor: "white",
  },
  partyDetailsHeader: {
    textAlign: "center",
    fontWeight: "bold",
    padding: "10px",
    borderBottom: "1px solid #aaa",
  },
  partyDetailsContent: {
    padding: "15px",
  },
};

export default PartyDetails;
