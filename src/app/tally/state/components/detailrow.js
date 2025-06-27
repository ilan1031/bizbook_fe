"use client";
import React from 'react';

export default function DetailRow({ label, children }) {
  return (
    <div style={styles.detailRow}>
      <div style={styles.detailLabel}>{label}</div>
      <div style={styles.detailValue}>
        : {children}
      </div>
    </div>
  );
}

const styles = {
  detailRow: {
    display: 'flex',
    margin: '5px 0',
    position: 'relative',
  },
  detailLabel: {
    width: '120px',
    textAlign: 'right',
    paddingRight: '10px',
    fontWeight: 'normal',
  },
  detailValue: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  }
};