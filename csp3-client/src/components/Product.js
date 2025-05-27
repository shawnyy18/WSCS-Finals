import React from 'react';
import { Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

export default function Product(props) {
  const { data } = props;
  const { _id, name, description, price, img } = data;
  const history = useHistory();

  const imageSrc =
    img && img.trim().length > 0
      ? img
      : "https://via.placeholder.com/300x200?text=No+Image";

  const handleCardClick = () => {
    history.push(`/products/${_id}`);
  };

  // 5 columns per row, visually balanced, similar to your Home page reference
  const colProps = {
    xs: 12,
    sm: 6,
    md: 2,
    lg: 2,
    xl: 2,
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 28,
      flex: "0 0 19%",
      maxWidth: "19%",
      margin: "0 0.5%"
    }
  };

  return (
    <Col {...colProps}>
      <div
        className="ua-product-card"
        onClick={handleCardClick}
        tabIndex={0}
        onKeyPress={e => {
          if (e.key === 'Enter') handleCardClick();
        }}
        style={{
          width: 210,
          background: '#f6f6f6',
          borderRadius: 10,
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
          padding: 18,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'transform 0.18s, box-shadow 0.18s',
          cursor: 'pointer'
        }}
      >
        <img
          src={imageSrc}
          alt={name}
          style={{
            width: 110,
            height: 110,
            objectFit: 'contain',
            marginBottom: 16,
            borderRadius: 6,
            background: '#f6f6f6'
          }}
        />
        <div
          style={{
            fontWeight: 600,
            fontSize: '1.08rem',
            marginBottom: 8,
            minHeight: 24,
            textAlign: 'center',
            width: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
          title={name}
        >
          {name}
        </div>
        <div
          style={{
            color: '#444',
            fontSize: '0.93rem',
            minHeight: 36,
            marginBottom: 10,
            textAlign: 'center',
            width: '100%',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
          title={description}
        >
          {description || ''}
        </div>
        <div
          style={{
            fontWeight: 600,
            fontSize: '1.13rem',
            color: '#222',
            marginTop: 'auto'
          }}
        >
          ₱{(+price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
      </div>
      <style>
        {`
          .ua-product-card:hover, .ua-product-card:focus {
            transform: translateY(-8px) scale(1.03);
            box-shadow: 0 8px 24px 0 rgba(30,79,145,0.11), 0 1.5px 6px 0 rgba(0,0,0,0.06);
            background: #f0f4fa;
            outline: none;
          }
        `}
      </style>
    </Col>
  );
}
