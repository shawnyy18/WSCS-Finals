import React, { useState, useEffect } from 'react';
import { Container, Card, Accordion, Jumbotron } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';

export default function Orders() {

  const [ordersList, setOrdersList] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/orders/my-orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const { orders } = data;

        const myOrders = orders.map((item, index) => (
          <Card
            key={item._id}
            className="mb-4 shadow-sm"
            style={{
              borderRadius: "20px",
              background: "#e8eefc", // light blue to compliment marian-blue
              fontFamily: "'Montserrat', 'Open Sans', sans-serif",
              border: "1.5px solid #233787", // marian-blue border for accent
              boxShadow: "0 4px 16px rgba(35,55,135,0.10)"
            }}
          >
            <Accordion.Toggle
              as={Card.Header}
              eventKey={index + 1}
              style={{
                background: "#233787",
                color: "#FBD709",
                fontWeight: "bold",
                fontFamily: "'Montserrat', 'Open Sans', sans-serif",
                borderRadius: "20px 20px 0 0",
                cursor: "pointer",
                fontSize: "1.1rem",
                letterSpacing: "1px"
              }}
            >
              Order #{index + 1} - Purchased on: {moment(item.purchasedOn).format("MM-DD-YYYY")} (Click for Details)
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={index + 1}>
              <Card.Body style={{ background: "#fff", borderRadius: "0 0 20px 20px" }}>
                <h6 style={{ color: "#233787", fontWeight: "bold" }}>Items:</h6>
                <ul style={{ listStyle: "none", paddingLeft: 0, marginBottom: 0 }}>
                  {item.productsOrdered.map((subitem) => (
                    <li key={subitem.productId || subitem._id} className="order-item d-flex align-items-center mb-3">
                      <img
                        src={subitem.img && subitem.img.trim().length > 0 ? subitem.img : 'https://via.placeholder.com/100x80?text=No+Image'}
                        alt={subitem.productName}
                        style={{
                          width: '110px',
                          height: '90px',
                          objectFit: 'cover',
                          marginRight: '40px',
                          borderRadius: '20px',
                          border: '1.5px solid #233787',
                          background: "#fff",
                          boxShadow: "0 2px 8px rgba(35,55,135,0.08)"
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: "#031E7D" }}>{subitem.productName}</div>
                        <div style={{ color: "#031E7D" }}>
                          Quantity: <span style={{ color: "#CD2029", fontWeight: 600 }}>{subitem.quantity}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <h6 style={{ color: "#233787", fontWeight: "bold", marginTop: "1.5rem" }}>
                  Total: <span style={{ color: "#CD2029", fontWeight: 700, fontSize: "1.2rem" }}>₱{item.totalPrice}</span>
                </h6>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        ));

        setOrdersList(myOrders);
      });
  }, []);

  return (
    ordersList.length === 0 ?
      <Jumbotron>
        <h3 className="text-center">
          No orders placed yet! <Link to="/products">Start shopping.</Link>
        </h3>
      </Jumbotron>
      :
      <Container>
        <h2
          className="text-center my-4"
          style={{
            fontFamily: "'Montserrat', 'Open Sans', sans-serif",
            color: "#233787",
            fontWeight: "bold",
            letterSpacing: "1px"
          }}
        >
          Order History
        </h2>
        <Accordion>
          {ordersList}
        </Accordion>
      </Container>
  );
}