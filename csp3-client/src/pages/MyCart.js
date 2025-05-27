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

  // Style submit button to look like UA gold button
  const submitBtn = document.querySelector('#submitOrder');
  if (submitBtn) {
      submitBtn.classList.add('btn', 'btn-warning', 'btn-lg', 'fw-bold');
      submitBtn.style.backgroundColor = '#FFD600';
      submitBtn.style.color = '#002147';
  }

  // Show confirmation modal styled as UA modal
  const orderForm = document.querySelector('#orderForm');
  if (orderForm) {
      orderForm.addEventListener('submit', function (e) {
          e.preventDefault();
          showConfirmationModal();
      });
  }

  function showConfirmationModal() {
      const modal = document.createElement('div');
      modal.className = 'modal fade show d-block';
      modal.setAttribute('tabindex', '-1');
      modal.style.background = 'rgba(0,0,0,0.6)';
      modal.innerHTML = `
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content rounded shadow">
                  <div class="modal-header bg-primary text-white">
                      <h5 class="modal-title">Order Submitted</h5>
                  </div>
                  <div class="modal-body text-dark text-center" style="font-family: 'Montserrat', 'Open Sans', sans-serif;">
                      <p>Thank you for your order!<br>Your transaction is being processed.</p>
                  </div>
                  <div class="modal-footer">
                      <button class="btn btn-warning fw-bold" id="closeModalBtn" style="background-color:#FFD600;color:#002147;">Close</button>
                  </div>
              </div>
          </div>
      `;
      document.body.appendChild(modal);

      document.getElementById('closeModalBtn').onclick = function () {
          modal.remove();
      };
  }

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
      <h2
        className="text-center my-4"
        style={{
          fontFamily: "'Montserrat', 'Open Sans', sans-serif",
          color: "#002147",
          fontWeight: "bold",
          letterSpacing: "1px"
        }}
      >
        Your Shopping Cart
      </h2>
      {cart.map(item => (
        <Card
          key={item.productId}
          className="mb-4 shadow-sm"
          style={{
            borderRadius: "20px",
            background: "#e8eefc", // light blue to compliment marian-blue
            fontFamily: "'Montserrat', 'Open Sans', sans-serif",
            border: "1.5px solid #233787", // marian-blue border for accent
            boxShadow: "0 4px 16px rgba(35,55,135,0.10)"
          }}
        >
          <Card.Body className="d-flex align-items-center" style={{ padding: "2.5rem" }}>
            <img
              src={item.img && item.img.trim().length > 0 ? item.img : 'https://via.placeholder.com/100x80?text=No+Image'}
              alt={item.productName}
              style={{
                width: '110px',
                height: '90px',
                objectFit: 'cover',
                marginRight: '40px',
                borderRadius: '20px', // match card border radius
                border: '1.5px solid #233787', // match card border color
                background: "#fff",
                boxShadow: "0 2px 8px rgba(35,55,135,0.08)"
              }}
            />
            <div className="flex-grow-1">
              <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: "#031E7D", marginBottom: 6 }}>{item.productName}</div>
              <div style={{ color: "#031E7D", marginBottom: 10 }}>
                Price: <span style={{ color: "#FBD709", fontWeight: 700 }}>₱{item.price}</span>
              </div>
              <div className="d-flex align-items-center my-2" style={{ gap: "0.75rem" }}>
                <span style={{ color: "#031E7D", marginRight: 10, fontWeight: 500 }}>Quantity:</span>
                <Button
                  variant="light"
                  size="sm"
                  style={{
                    fontWeight: "bold",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    padding: 0,
                    color: "#fff",
                    background: "#233787", // marian-blue
                    border: "2.5px solid #233787", // marian-blue
                    boxShadow: "0 2px 8px rgba(35,55,135,0.06)",
                    transition: "background 0.2s, color 0.2s"
                  }}
                  onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                  disabled={item.quantity <= 1}
                  title="Decrease quantity"
                >-</Button>
                <span style={{
                  minWidth: "40px",
                  textAlign: "center",
                  color: "#031E7D",
                  fontWeight: "bold",
                  fontSize: "1.15rem"
                }}>{item.quantity}</span>
                <Button
                  variant="light"
                  size="sm"
                  style={{
                    fontWeight: "bold",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    padding: 0,
                    color: "#fff",
                    background: "#233787", // marian-blue
                    border: "2.5px solid #233787", // marian-blue
                    boxShadow: "0 2px 8px rgba(35,55,135,0.06)",
                    transition: "background 0.2s, color 0.2s"
                  }}
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  title="Increase quantity"
                >+</Button>
              </div>
              <div style={{ color: "#031E7D", marginTop: 10 }}>
                Subtotal: <span style={{ color: "#CD2029", fontWeight: 700 }}>₱{item.subtotal}</span>
              </div>
            </div>
            <Button
              variant="light"
              style={{
                backgroundColor: "#CD2029", // fire-engine-red
                color: "#fff",              // white text
                fontWeight: "bold",
                border: "none",
                borderRadius: "50%",
                marginLeft: "40px",
                width: "48px",
                height: "48px",
                boxShadow: "0 2px 8px rgba(205,32,41,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                transition: "background 0.2s, color 0.2s"
              }}
              onClick={() => removeFromCart(item.productId)}
              title="Remove from cart"
            >
              <span aria-hidden="true">&times;</span>
            </Button>
          </Card.Body>
        </Card>
      ))}
      <Card className="order-summary rounded p-4 shadow-sm mb-4"
        style={{
          fontFamily: "'Montserrat', 'Open Sans', sans-serif",
          background: "#031E7D", // resolution blue
          marginTop: "2.5rem",
          border: "none"
        }}>
        <Card.Body>
          <h3 className="text-right" style={{ color: "#FBD709", fontWeight: "bold", letterSpacing: "1px" }}>
            Total: ₱{total}
          </h3>
        </Card.Body>
      </Card>
      <div className="d-flex flex-column flex-md-row justify-content-center align-items-center"
        style={{ gap: "1.5rem", marginBottom: "2.5rem" }}>
        <Button
          onClick={checkout}
          className="btn btn-lg fw-bold"
          style={{
            backgroundColor: "#233787", // marian-blue
            color: "#FBD709",           // school-bus-yellow
            border: "none",
            fontFamily: "'Montserrat', 'Open Sans', sans-serif",
            borderRadius: "36px",
            padding: "1rem 3rem",
            boxShadow: "0 4px 16px rgba(35,55,135,0.10)",
            fontSize: "1.25rem",
            marginBottom: 0,
            letterSpacing: "1px",
            transition: "background 0.2s, color 0.2s"
          }}
        >
          Checkout
        </Button>
        <Button
          onClick={clearCart}
          className="btn btn-lg fw-bold"
          style={{
            fontFamily: "'Montserrat', 'Open Sans', sans-serif",
            background: "#CD2029", // fire-engine-red
            color: "#fff",         // white text
            borderRadius: "36px",
            padding: "1rem 3rem",
            fontSize: "1.25rem",
            boxShadow: "0 4px 16px rgba(205,32,41,0.10)",
            letterSpacing: "1px",
            border: "none",
            marginLeft: 0,
            transition: "background 0.2s, color 0.2s"
          }}
        >
          Clear Cart
        </Button>
      </div>
    </Container>
  );
}