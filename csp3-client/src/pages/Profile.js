import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import UserContext from '../UserContext';
import { Redirect, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import ResetPassword from '../components/ResetPassword';

export default function Profile() {
  const { user } = useContext(UserContext);
  const [details, setDetails] = useState({});
  const history = useHistory();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setDetails(data);
        } else if (data.error === 'User not found') {
          Swal.fire({
            title: 'User not found',
            icon: 'error',
            text: 'Something went wrong. Please contact us for assistance.',
          });
          history.push('/profile');
        } else {
          Swal.fire({
            title: 'Something went wrong',
            icon: 'error',
            text: 'Something went wrong. Please contact us for assistance.',
          });
          history.push('/profile');
        }
      });
  }, [history]);

  return (
    <>
      {user.id === null ? (
        <Redirect to="/profile" />
      ) : (
        <Row className="justify-content-center" style={{ background: "#233787", minHeight: "100vh" }}>
          <Col xs={12} md={8} lg={6} className="d-flex align-items-center justify-content-center">
            <Card
              className="w-100 shadow-lg"
              style={{
                borderRadius: "24px",
                background: "#FFFFFF",
                border: "2px solid #FBD709",
                marginTop: "60px",
                marginBottom: "60px"
              }}
            >
              <Card.Body>
                <h1 className="text-center mb-4" style={{ color: "#233787", fontWeight: 700 }}>Profile</h1>
                <h3 className="text-center mb-3" style={{ color: "#CD2029", fontWeight: 600 }}>
                  {`${details.firstName || ''} ${details.lastName || ''}`}
                </h3>
                <hr style={{ borderTop: "2px solid #FBD709" }} />
                <h5 className="mt-4 mb-3" style={{ color: "#233787" }}>Contacts</h5>
                <ul className="list-unstyled mb-4">
                  <li style={{ color: "#151216" }}>
                    <strong>Email:</strong> {details.email}
                  </li>
                  <li style={{ color: "#151216" }}>
                    <strong>Mobile No:</strong> {details.mobileNo}
                  </li>
                </ul>
                <div className="d-flex justify-content-center">
                  <ResetPassword />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
}
