import React from 'react';

export default function Footer() {
  return (
    <footer
      style={{
        background: '#233787',
        color: '#FBD709',
        padding: '22px 0 10px 0',
        textAlign: 'center',
        fontWeight: 500,
        fontSize: '1.08rem',
        letterSpacing: '0.5px',
        borderTop: '4px solid #CD2029',
        marginTop: 40
      }}
    >
      <div>
        &copy; {new Date().getFullYear()} The UA Shop &mdash; Made with <span style={{color: '#CD2029', fontWeight: 700}}>❤</span> by <span style={{color: '#fff'}}>IT-3B Students</span>
      </div>
    </footer>
  );
}