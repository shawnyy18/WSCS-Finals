import React from 'react';
import { useHistory } from 'react-router-dom';

export default function Product(props) {
  const { data } = props;
  const { _id, name, description, price, img } = data;
  const history = useHistory();

  // Helper for image display
  const imageSrc =
    img && img.trim().length > 0
      ? img
      : "https://via.placeholder.com/300x200?text=No+Image";

  // Card click handler
  const handleCardClick = () => {
    history.push(`/products/${_id}`);
  };

  return (
    <div
      style={{
        width: 260,               // Fixed card width
        height: 350,              // Fixed card height
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
        cursor: 'pointer',
      }}
    >
      <div
        className="ua-product-card"
        onClick={handleCardClick}
        tabIndex={0}
        onKeyPress={e => {
          if (e.key === 'Enter') handleCardClick();
        }}
        style={{
          width: "100%",
          height: "100%",
          background: '#f6f6f6', // Card background color
          borderRadius: 14,
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
          padding: 18,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'transform 0.18s, box-shadow 0.18s',
        }}
      >
        <img
          src={imageSrc}
          alt={name}
          style={{
            width: 120,
            height: 120,
            objectFit: 'contain',
            marginBottom: 16,
            borderRadius: 8,
            background: '#f6f6f6', // Compliment the card background for PNG with transparency
          }}
        />
        <div
          style={{
            fontWeight: 700,
            fontSize: '1.12rem',
            marginBottom: 8,
            minHeight: 24,
            textAlign: 'center',
            color: '#23355c',
            letterSpacing: 0.2,
          }}
        >
          {name}
        </div>
        <div
          style={{
            color: '#555',
            fontSize: '0.98rem',
            minHeight: 36,
            marginBottom: 10,
            textAlign: 'center'
          }}
        >
          {description?.slice(0, 70) || ''}
        </div>
        <div
          style={{
            fontWeight: 700,
            fontSize: '1.16rem',
            color: '#19335a',
            marginTop: 'auto'
          }}
        >
          ₱{(+price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
      </div>
      {/* Hover effect styles */}
      <style>
        {`
          .ua-product-card:hover, .ua-product-card:focus {
            transform: translateY(-8px) scale(1.04);
            box-shadow: 0 8px 24px 0 rgba(30,79,145,0.11), 0 1.5px 6px 0 rgba(0,0,0,0.06);
            background: #eaf2fa;
            outline: none;
          }
        `}
      </style>
    </div>
  );
}