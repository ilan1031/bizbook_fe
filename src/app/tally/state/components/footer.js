"use client";
import React from 'react';

export default function Footer({ referenceText, configText }) {
  return (
    <div style={styles.footer}>
      <div style={styles.reference}>{referenceText}</div>
      <div style={styles.configButton}>{configText}</div>
    </div>
  );
}

const styles = {
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'fixed',
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