// components/InvoiceForm.jsx
"use client";
import React from 'react';

export default function InvoiceForm({ children, title }: any) {
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

export function FormSection({ title, children }: any) {
  return (
    <>
      <div style={styles.placeHeader}>{title}</div>
      {children}
    </>
  );
}

const styles: any = {
  invoiceDetailsContainer: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    border: '1px solid #aaa',
    backgroundColor: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  invoiceDetailsHeader: {
    textAlign: 'center' as const,
    fontWeight: 'bold' as const,
    padding: '10px',
    borderBottom: '1px solid #aaa',
    backgroundColor: '#f5f5f5',
  },
  invoiceDetailsContent: {
    padding: '15px',
  },
  placeHeader: {
    fontWeight: 'bold' as const,
    marginTop: '15px',
    marginBottom: '5px',
  },
};