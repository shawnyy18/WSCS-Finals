import React, { useState, useEffect } from 'react';
import { Container, Jumbotron, Button, Card, Row, Col } from 'react-bootstrap';
import { Link, Redirect, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function MyCart() {
  const history = useHistory();

  const [total, setTotal] = useState(0);
  const [cart, setCart] = useState([]);
  const [willRedirect, setWillRedirect] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    fetch(`${process.env.REACT_APP_API_URL}/cart/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then((jsonData) => {
        const cartItems = jsonData.cartItems || [];
        setCart(cartItems);
      })
      .catch((error) => {
        console.error('Error fetching cart:', error);
      });
  };

  const updateQuantity = (productId, newQuantity) => {
    fetch(`${process.env.REACT_APP_API_URL}/cart/updateQuantity`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        productId,
        newQuantity,
      })
    })
      .then((res) => res.json())
      .then(() => fetchCart())
      .catch((error) => console.error('Error updating quantity:', error));
  };

  const removeFromCart = (productId) => {
    fetch(`${process.env.REACT_APP_API_URL}/cart/${productId}/removeFromCart`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((response) => response.json())
      .then(() => fetchCart())
      .catch((error) => console.error('Error removing item from cart:', error));
  };

  const checkout = () => {
    fetch(`${process.env.REACT_APP_API_URL}/orders/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your order has been placed",
            showConfirmButton: false,
            timer: 1500,
          });
          history.push('/orders');
        }
      })
      .catch((error) => console.error('Error during checkout:', error));
  };

  const clearCart = () => {
    fetch(`${process.env.REACT_APP_API_URL}/cart/clearCart`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.cart) {
          setCart(data.cart.cartItems);
          setTotal(data.cart.totalPrice);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your cart has been cleared',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((error) => console.error('Error clearing cart:', error));
  };

  useEffect(() => {
    let tempTotal = 0;
    cart.forEach((item) => {
      tempTotal += item.subtotal;
    });
    setTotal(tempTotal);
  }, [cart]);

  if (willRedirect) {
    return <Redirect to="/orders" />;
  }

  if (cart.length <= 0) {
    return (
      <Jumbotron>
        <h3 className="text-center">
          Your cart is empty! <Link to="/products">Start shopping.</Link>
        </h3>
      </Jumbotron>
    );
  }

  return (
    <Container>
      <h2 className="text-center my-4">Your Shopping Cart</h2>
      <Row>
        {cart.map(item => (
          <Col xs={12} md={6} lg={4} key={item.productId} className="mb-4">
            <Card className="h-100">
              <Link to={`/products/${item.productId}`}>
                <Card.Img
                  variant="top"
                  src={item.img && item.img.trim().length > 0 ? item.img : "https://via.placeholder.com/300x200?text=No+Image"}
                  style={{ objectFit: 'cover', height: '200px' }}
                  alt={item.productName}
                />
              </Link>
              <Card.Body>
                <Card.Title>
                  <Link to={`/products/${item.productId}`}>{item.productName}</Link>
                </Card.Title>
                <Card.Text>Price: ₱{item.price}</Card.Text>
                <Card.Text>Quantity: {item.quantity}</Card.Text>
                <Card.Text>Subtotal: ₱{item.subtotal}</Card.Text>
                <Button variant="danger" onClick={() => removeFromCart(item.productId)}>
                  Remove
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <h3 className="text-right">Total: ₱{total}</h3>
      <Button variant="success" block onClick={checkout}>
        Checkout
      </Button>
      <Button variant="danger" block onClick={clearCart}>
        Clear Cart
      </Button>
    </Container>
  );
}
