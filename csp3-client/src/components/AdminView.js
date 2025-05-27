import React, { useEffect, useState, useContext } from 'react';
import { Form, Table, Button, Modal, Accordion, Card, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';

// Color branding
const COLORS = {
  marianBlue: "#233787",
  fireEngineRed: "#CD2029",
  schoolBusYellow: "#FBD709",
  white: "#FFFFFF",
  night: "#151216"
};

export default function AdminView() {
  const { user } = useContext(UserContext);

  const [products, setProducts] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [img, setImg] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [ordersList, setOrdersList] = useState([]);

  const openAdd = () => setShowAdd(true);
  const closeAdd = () => setShowAdd(false);

  const openEdit = (productId) => {
    setId(productId);

    fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setImg(data.img || "");
      });

    setShowEdit(true);
  };

  const closeEdit = () => {
    setName("");
    setDescription("");
    setPrice(0);
    setImg("");
    setShowEdit(false);
  };

  const addProduct = (e) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/products`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        description: description,
        price: price,
        img: img
      })
    })
      .then(res => res.json())
      .then(data => {
        if (
          data.success === true ||
          data.message === "Product created successfully" ||
          data._id // if backend returns the new product object
        ) {
          Swal.fire({
            icon: "success",
            title: "Product successfully added.",
            showConfirmButton: false,
            timer: 1500,
            position: "center" // Center the alert for better visibility
          });
          setName("");
          setDescription("");
          setPrice(0);
          setImg("");
          closeAdd();
        } else {
          Swal.fire({
            icon: "error",
            title: "Something went wrong.",
            showConfirmButton: false,
            timer: 1500,
            position: "center"
          });
          closeAdd();
        }
      });
  };

  const editProduct = (e, productId) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        description: description,
        price: price,
        img: img
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'Product updated successfully') {
          Swal.fire({
            position: "center", // Changed from "top-end" to "center"
            icon: "success",
            title: "Product successfully updated.",
            showConfirmButton: false,
            timer: 1500,
          });
          setName("");
          setDescription("");
          setPrice(0);
          setImg("");
          closeEdit();
        } else {
          Swal.fire({
            position: "center", // Keep error alert centered as well for consistency
            icon: "error",
            title: "Something went wrong.",
            showConfirmButton: false,
            timer: 1500,
          });
          closeEdit();
        }
      });
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/orders/all-orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        let ordersArray = [];
        if (data && data.orders && Array.isArray(data.orders) && data.orders.length > 0) {
          ordersArray = data.orders;
        } else if (data && data.order) {
          ordersArray = [data.order];
        }
        const allOrders = ordersArray.map((order, index) => (
          <Card key={order._id} style={{ borderRadius: "18px", marginBottom: "18px", border: `2px solid ${COLORS.marianBlue}` }}>
            <Accordion.Toggle
              as={Card.Header}
              eventKey={index + 1}
              style={{
                background: COLORS.marianBlue,
                color: COLORS.schoolBusYellow,
                fontWeight: "bold",
                borderRadius: "18px 18px 0 0",
                cursor: "pointer",
                fontSize: "1.1rem",
                letterSpacing: "1px"
              }}
            >
              Orders for user <span style={{ color: COLORS.fireEngineRed }}>{order.userId}</span>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={index + 1}>
              <Card.Body style={{ background: COLORS.white, borderRadius: "0 0 18px 18px" }}>
                {order.productsOrdered.length > 0 ? (
                  order.productsOrdered.map((product) => (
                    <div key={product._id} className="d-flex align-items-center mb-3">
                      <Image
                        src={product.img && product.img.trim().length > 0 ? product.img : "https://via.placeholder.com/80x80?text=No+Image"}
                        alt={product.productName}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          marginRight: '18px',
                          borderRadius: '12px',
                          border: `1.5px solid ${COLORS.marianBlue}`,
                          background: COLORS.white,
                          boxShadow: "0 2px 8px rgba(35,55,135,0.08)"
                        }}
                      />
                      <div>
                        <h6 style={{ color: COLORS.marianBlue, fontWeight: 600 }}>{product.productName}</h6>
                        <div style={{ color: COLORS.night }}>
                          Quantity: <span style={{ color: COLORS.fireEngineRed, fontWeight: 600 }}>{product.quantity}</span>
                        </div>
                        <div style={{ color: COLORS.night }}>
                          Price: <span style={{ color: COLORS.schoolBusYellow, fontWeight: 600 }}>₱{product.price}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <span>No orders for this user yet.</span>
                )}
                <h6 style={{ color: COLORS.marianBlue, fontWeight: "bold", marginTop: "1.5rem" }}>
                  Total: <span style={{ color: COLORS.fireEngineRed, fontWeight: 700, fontSize: "1.2rem" }}>₱{order.totalPrice}</span>
                </h6>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        ));
        setOrdersList(allOrders);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  }, []);

  const toggler = () => setToggle(!toggle);

  useEffect(() => {
    const activateProduct = (productId) => {
      fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/activate`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.message === 'Product activated successfully') {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Product successfully activated.",
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Something went wrong.",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
    };

    const archiveProduct = (productId) => {
      fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/archive`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.message === 'Product archived successfully') {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Product successfully archived",
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Something went wrong.",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
    };

    fetch(`${process.env.REACT_APP_API_URL}/products/all`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        const productsArr = data.map(productData => (
          <tr key={productData._id} style={{ background: COLORS.white }}>
            <td>
              <div className="d-flex align-items-center">
                <Image
                  src={productData.img && productData.img.trim().length > 0 ? productData.img : "https://via.placeholder.com/60x60?text=No+Image"}
                  alt={productData.name}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    marginRight: '12px',
                    borderRadius: '8px',
                    border: `1.5px solid ${COLORS.marianBlue}`,
                    background: COLORS.white,
                  }}
                />
                <Link to={`/products/${productData._id}`} style={{ color: COLORS.marianBlue, fontWeight: 600 }}>
                  {productData.name}
                </Link>
              </div>
            </td>
            <td style={{ color: COLORS.night }}>{productData.description}</td>
            <td style={{ color: COLORS.schoolBusYellow, fontWeight: 600 }}>₱{productData.price}</td>
            <td>
              {productData.isActive ?
                <span style={{ color: "green", fontWeight: 600 }}>Available</span>
                :
                <span style={{ color: COLORS.fireEngineRed, fontWeight: 600 }}>Unavailable</span>
              }
            </td>
            <td>
              <Button
                variant="primary"
                size="sm"
                style={{
                  background: COLORS.marianBlue,
                  border: "none",
                  fontWeight: 600,
                  marginRight: "6px"
                }}
                onClick={() => openEdit(productData._id)}
              >
                Update
              </Button>
              {productData.isActive ?
                <Button
                  variant="danger"
                  size="sm"
                  style={{
                    background: COLORS.fireEngineRed,
                    border: "none",
                    fontWeight: 600,
                    marginRight: "6px"
                  }}
                  onClick={() => archiveProduct(productData._id)}
                >
                  Disable
                </Button>
                :
                <Button
                  variant="success"
                  size="sm"
                  style={{
                    background: COLORS.schoolBusYellow,
                    color: COLORS.night,
                    border: "none",
                    fontWeight: 600
                  }}
                  onClick={() => activateProduct(productData._id)}
                >
                  Enable
                </Button>
              }
              <Button
                variant="danger"
                size="sm"
                style={{ marginLeft: "8px" }}
                onClick={() => handleDelete(productData._id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ));
        setProducts(productsArr);
      });
  }, [products]);

  // Add this function for deleting a product
  const handleDelete = (productId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(res => res.json())
        .then(data => {
          if (data.message === "Product deleted successfully") {
            Swal.fire('Deleted!', 'The product has been deleted.', 'success');
            setProducts(prev =>
              prev.filter(
                p =>
                  (p.key !== productId && p.props?.children?.props?._id !== productId) // for <tr key={productData._id}>
              )
            );
          } else {
            Swal.fire('Failed!', 'Unable to delete product.', 'error');
          }
        });
      }
    });
  };

  return (
    <React.Fragment>
      <div className="text-center my-4">
        <h2 style={{ color: COLORS.marianBlue, fontWeight: 700 }}>Admin Dashboard</h2>
        <div className="d-flex justify-content-center mb-3">
          <Button
            className="mr-2"
            style={{
              background: COLORS.schoolBusYellow,
              color: COLORS.night,
              fontWeight: 700,
              border: "none",
              borderRadius: "18px",
              marginRight: "10px"
            }}
            onClick={openAdd}
          >
            Add New Product
          </Button>
          {toggle === false ?
            <Button
              style={{
                background: COLORS.marianBlue,
                color: COLORS.white,
                fontWeight: 700,
                border: "none",
                borderRadius: "18px"
              }}
              onClick={() => toggler()}>
              Show User Orders
            </Button>
            :
            <Button
              style={{
                background: COLORS.fireEngineRed,
                color: COLORS.white,
                fontWeight: 700,
                border: "none",
                borderRadius: "18px"
              }}
              onClick={() => toggler()}>
              Show Product Details
            </Button>
          }
        </div>
      </div>
      {toggle === false ?
        <Table striped bordered hover responsive style={{ borderRadius: "18px", overflow: "hidden", border: `2px solid ${COLORS.marianBlue}` }}>
          <thead style={{ background: COLORS.marianBlue, color: COLORS.schoolBusYellow }}>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products}
          </tbody>
        </Table>
        :
        <Accordion>
          {ordersList}
        </Accordion>
      }

      {/* Add Product Modal */}
      <Modal show={showAdd} onHide={closeAdd}>
        <Form onSubmit={e => addProduct(e)}>
          <Modal.Header closeButton style={{ background: COLORS.marianBlue, color: COLORS.schoolBusYellow }}>
            <Modal.Title>Add New Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="productName">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="productDescription">
              <Form.Label>Description:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="productPrice">
              <Form.Label>Price:</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="productImg">
              <Form.Label>Image URL:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL"
                value={img}
                onChange={e => setImg(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeAdd} style={{ borderRadius: "12px" }}>
              Close
            </Button>
            <Button
              style={{
                background: COLORS.schoolBusYellow,
                color: COLORS.night,
                fontWeight: 700,
                border: "none",
                borderRadius: "12px"
              }}
              type="submit"
            >
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal show={showEdit} onHide={closeEdit}>
        <Form onSubmit={e => editProduct(e, id)}>
          <Modal.Header closeButton style={{ background: COLORS.marianBlue, color: COLORS.schoolBusYellow }}>
            <Modal.Title>Edit Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="productName">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="productDescription">
              <Form.Label>Description:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="productPrice">
              <Form.Label>Price:</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter product price"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="productImg">
              <Form.Label>Image URL:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL"
                value={img}
                onChange={e => setImg(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeEdit} style={{ borderRadius: "12px" }}>
              Close
            </Button>
            <Button
              style={{
                background: COLORS.schoolBusYellow,
                color: COLORS.night,
                fontWeight: 700,
                border: "none",
                borderRadius: "12px"
              }}
              type="submit"
            >
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </React.Fragment>
  );
}
