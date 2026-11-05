"use client";
import React from 'react';

export default function Footer({ referenceText, configText }: any) {
  return (
    <div style={styles.footer}>
      <div style={styles.reference}>{referenceText}</div>
      <div style={styles.configButton}>{configText}</div>
    </div>
  );
}

const styles: any = {
  footer: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    position: 'fixed' as const,
    bottom: '0',
    left: '0',
    right: '0',
    padding: '5px 10px',
    backgroundColor: '#f0f0f0',
  },
  reference: {
    color: '#444',
  },
  configButton: {
    color: '#444',
  }
};