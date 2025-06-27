// components/FormInput.jsx
"use client";
import React from 'react';

export default function FormInput({ label, value, onChange, onKeyDown, wide = false, highlighted = false }) {
  return (
    <div style={styles.detailRow}>
      <div style={styles.detailLabel}>{label}</div>
      <div style={styles.detailColon}>:</div>
      <div style={wide ? styles.detailValueWide : styles.detailValue}>
        <input 
          type="text" 
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          style={{
            ...styles.input, 
            backgroundColor: highlighted ? '#ffeeb0' : undefined
          }}
        />
      </div>
    </div>
  );
}

const styles = {
  detailRow: {
    display: 'flex',
    margin: '5px 0',
    alignItems: 'center',
  },
  detailLabel: {
    width: '100px',
    textAlign: 'left',
  },
  detailColon: {
    width: '10px',
    textAlign: 'center',
  },
  detailValue: {
    width: '180px',
    marginRight: '20px',
  },
  detailValueWide: {
    flex: '1',
  },
  input: {
    width: '100%',
    padding: '2px 5px',
    border: '1px solid #aaa',
    outline: 'none',
  },
};