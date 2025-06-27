"use client";
import React from 'react';

export default function Header({ title, companyName }) {
  return (
    <div style={styles.topBar}>
      <div style={styles.leftHeader}>{title}</div>
      <div style={styles.rightHeader}>{companyName}</div>
    </div>
  );
}

const styles = {
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#8ecae6',
    color: 'white',
    padding: '4px 10px',
  },
  leftHeader: {
    fontWeight: 'bold',
  },
  rightHeader: {
    fontWeight: 'bold',
  }
};