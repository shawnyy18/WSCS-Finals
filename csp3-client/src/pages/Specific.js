import { useState, useEffect, useContext } from 'react';
import { Card, Container, Button, InputGroup, FormControl, Row, Col } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';

export default function Specific() {
  const { user } = useContext(UserContext);
  const { productId } = useParams();

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);
  const [img, setImg] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        setId(data._id);
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setImg(data.img || '');
      });
  }, [productId]);

  // Fix: Ensure qty is always a Number and remains in sync
  const reduceQty = () => {
    setQty(prevQty => {
      const newQty = Math.max(1, Number(prevQty) - 1);
      if (newQty === 1 && prevQty <= 1) {
        Swal.fire({
          icon: 'warning',
          title: "Quantity can't be lower than 1.",
          confirmButtonColor: '#233787'
        });
      }
      return newQty;
    });
  };

  const handleQtyInput = (value) => {
    let newQty = parseInt(value, 10);
    if (isNaN(newQty) || newQty < 1) {
      Swal.fire({
        icon: 'warning',
        title: "Quantity can't be lower than 1.",
        confirmButtonColor: '#233787'
      });
      newQty = 1;
    }
    setQty(newQty);
  };

  const addToCart = () => {
    const url = `${process.env.REACT_APP_API_URL}/cart/addToCart`;

    // Fix: Always use the latest qty value as a Number
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        productId: id,
        productName: name,
        price: price,
        quantity: Number(qty), // <--- Ensure this is always a number
        subtotal: price * Number(qty),
        img: img
      }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error adding item to cart');
        }
      })
      .then(result => {
        Swal.fire({
          icon: 'success',
          title: 'Item added to cart successfully!',
          text: `Total items in cart: ${result.cart.cartItems.length}`,
          confirmButtonColor: '#233787'
        }).then(() => {
          window.location.href = '/products';
        });
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error adding item to cart',
          text: 'Please try again.',
          confirmButtonColor: '#CD2029'
        });
      });
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#fff' }}>
      <Row className="justify-content-center w-100">
        <Col xs={12} md={8} lg={6} className="d-flex justify-content-center">
          <Card
            className="p-4 border-0 shadow"
            style={{
              background: "#f7f7f7",
              borderRadius: "28px",
              width: "100%",
              maxWidth: "700px", // Increased maxWidth for a bigger card
              marginTop: "40px"
            }}
          >
            <Card.Body className="d-flex flex-column align-items-center">
              <div className="mb-4 d-flex flex-column align-items-center w-100">
                <Card.Img
                  variant="top"
                  src={img && img.length > 0 ? img : "https://via.placeholder.com/300x200?text=No+Image"}
                  style={{
                    width: '200px',
                    height: '170px',
                    objectFit: 'contain',
                    background: '#fff',
                    borderRadius: '12px',
                  }}
                  alt={name}
                  className="mb-3"
                />
                <Card.Title className="mb-1" style={{ fontWeight: 600, color: '#151216', fontSize: "1.35rem" }}>
                  {name}
                </Card.Title>
                <div className="mb-2 text-center" style={{ color: "#444", fontSize: "1.02rem" }}>
                  {description}
                </div>
                <div className="mb-2" style={{ color: "#233787", fontWeight: 500, fontSize: "1.15rem" }}>
                  ₱{price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
              <InputGroup className="mb-4" style={{ maxWidth: "240px" }}>
                <Button
                  variant=""
                  style={{
                    background: "#233787",
                    color: "#fff",
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    borderRadius: "8px 0 0 8px",
                    border: "none",
                    width: "48px"
                  }}
                  onClick={reduceQty}
                  aria-label="Decrease quantity"
                >
                  -
                </Button>
                <FormControl
                  type="number"
                  min="1"
                  value={qty}
                  style={{
                    textAlign: "center",
                    background: "#e4e4e4",
                    border: "none",
                    fontSize: "1.15rem",
                    height: "48px"
                  }}
                  onChange={e => handleQtyInput(e.target.value)}
                  aria-label="Quantity"
                />
                <Button
                  variant=""
                  style={{
                    background: "#233787",
                    color: "#fff",
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    borderRadius: "0 8px 8px 0",
                    border: "none",
                    width: "48px"
                  }}
                  onClick={() => setQty(q => Number(q) + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </Button>
              </InputGroup>
              <div className="w-100 d-flex justify-content-center">
                {user.id !== null ? (
                  user.isAdmin === true ? (
                    <Button
                      variant=""
                      style={{
                        background: '#CD2029',
                        color: '#fff',
                        fontWeight: 600,
                        width: "75%",
                        borderRadius: "24px",
                        padding: "14px 0",
                        fontSize: "1.12rem",
                        border: "none",
                        opacity: 0.85
                      }}
                      disabled
                    >
                      Admin can't Add to Cart
                    </Button>
                  ) : (
                    <Button
                      style={{
                        background: '#233787',
                        color: '#fff',
                        fontWeight: 600,
                        width: "75%",
                        borderRadius: "24px",
                        padding: "14px 0",
                        fontSize: "1.12rem",
                        border: "none"
                      }}
                      onClick={addToCart}
                    >
                      Add To Cart
                    </Button>
                  )
                ) : (
                  <Link
                    className="btn"
                    to={{ pathname: '/login', state: { from: 'cart' } }}
                    style={{
                      background: '#FBD709',
                      color: '#151216',
                      fontWeight: 600,
                      width: "75%",
                      borderRadius: "24px",
                      padding: "14px 0",
                      fontSize: "1.12rem",
                      border: "none",
                      textAlign: "center"
                    }}
                  >
                    Log in to Add to Cart
                  </Link>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}