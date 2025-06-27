// components/InvoiceForm.jsx
"use client";
import React from 'react';

export default function InvoiceForm({ children, title }) {
  return (
    <div style={styles.invoiceDetailsContainer}>
      <div style={styles.invoiceDetailsHeader}>
        {title}
      </div>
      
      <div style={styles.invoiceDetailsContent}>
        {children}
      </div>
    </div>
  );
}

export function FormSection({ title, children }) {
  return (
    <>
      <div style={styles.placeHeader}>{title}</div>
      {children}
    </>
  );
}

const styles = {
  invoiceDetailsContainer: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    border: '1px solid #aaa',
    backgroundColor: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  invoiceDetailsHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
    padding: '10px',
    borderBottom: '1px solid #aaa',
    backgroundColor: '#f5f5f5',
  },
  invoiceDetailsContent: {
    padding: '15px',
  },
  placeHeader: {
    fontWeight: 'bold',
    marginTop: '15px',
    marginBottom: '5px',
  },
};