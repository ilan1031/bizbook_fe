// pages/EInvoiceDetails.jsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../ship/components/e-invoice';
import FormInput from '../../ship/components/invoicedetails';
import InvoiceForm, { FormSection } from '../../ship/components/invoiceform';

export default function EInvoiceDetails() {
  const router = useRouter();
  const [billToPlace, setBillToPlace] = useState('');
  const [shipToPlace, setShipToPlace] = useState('');
  const [ackNo, setAckNo] = useState('');
  const [ackDate, setAckDate] = useState('');
  const [irn, setIrn] = useState('');

  const handleShipToPlaceChange = (e) => {
    setShipToPlace(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Navigate to the "voucher" page when Enter is pressed
      router.push('/voucher');
    }
  };

  return (
    <Layout title="e-Invoice Details" description="e-Invoice details">
      <InvoiceForm title="e-Invoice Details">
        <div style={styles.detailRow}>
          <FormInput 
            label="Ack No."
            value={ackNo}
            onChange={(e) => setAckNo(e.target.value)}
          />
          <FormInput 
            label="Ack Date"
            value={ackDate}
            onChange={(e) => setAckDate(e.target.value)}
          />
        </div>
        
        <FormInput 
          label="IRN"
          value={irn}
          onChange={(e) => setIrn(e.target.value)}
          wide={true}
        />
        
        <FormSection title="Place of Party">
          <FormInput 
            label="Bill to place"
            value={billToPlace}
            onChange={(e) => setBillToPlace(e.target.value)}
            highlighted={true}
          />
          
          <FormInput 
            label="Ship to place"
            value={shipToPlace}
            onChange={handleShipToPlaceChange}
            onKeyDown={handleKeyDown}
          />
        </FormSection>
      </InvoiceForm>
    </Layout>
  );
}

const styles = {
  detailRow: {
    display: 'flex',
    margin: '5px 0',
    alignItems: 'center',
  },
};