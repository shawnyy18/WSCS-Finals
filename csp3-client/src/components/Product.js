import React from 'react';
import { Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Product(props) {
  const { breakPoint, data } = props;

  // Use img from data
  const { _id, name, description, price, img } = data;

  return (
    <Col xs={12} md={breakPoint} className="mt-4">
      <Card className="card1">
        {/* Show product image or a placeholder if missing */}
        <Card.Img
          variant="top"
          src={img && img.trim().length > 0 ? img : "https://via.placeholder.com/300x200?text=No+Image"}
          style={{ objectFit: 'cover', height: '200px' }}
          alt={name}
        />
        <Card.Body>
          <Card.Title className="text-center card2">
            <Link to={`/products/${_id}`}>{name}</Link>
          </Card.Title>
          <Card.Text className="card3">{description}</Card.Text>
          <h5 className="text-warning">₱{price}</h5>
        </Card.Body>
        <Card.Footer>
          <Link className="btn btn-primary btn-block" to={`/products/${_id}`}>
            Details
          </Link>
        </Card.Footer>
      </Card>
    </Col>
  );
}
