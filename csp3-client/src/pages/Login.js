import React, { useState, useContext } from 'react';
import { Form, Button, Card, Row, Col, Container } from 'react-bootstrap';
import { Link, Redirect, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function LoginForm(props) {
    const history = useHistory();
    const { user, setUser } = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [willRedirect, setWillRedirect] = useState(false);

    const authenticate = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {
            if (typeof data.access !== 'undefined') {
                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);
                Swal.fire({
                    title: 'Login Successfully',
                    icon: 'success'
                });
            } else {
                Swal.fire({
                    title: 'User not found',
                    icon: 'error',
                    text: 'Authentication failed. Please check your login details and try again.',
                });
            }
        })
    }

    const retrieveUserDetails = (token) => {
        fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            setUser({ id: data._id, isAdmin: data.isAdmin });
            if (data.isAdmin === true) {
                setWillRedirect(true);
            } else {
                if (props.location.state && props.location.state.from === 'cart') {
                    history.goBack();
                } else {
                    setWillRedirect(true);
                }
            }
        })
    }

    // Inline style for background
    const loginPageStyle = {
        background: "url('https://ua-gmetrix.vercel.app/static/media/ua-cover.645a7faad3339b3f3f06.jpg') no-repeat center center fixed",
        backgroundSize: "cover",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    };

    // Custom styles for card and button
    const cardStyle = {
        maxWidth: "500px",
        borderRadius: "15px",
        overflow: "hidden"
    };

    const buttonStyle = {
        backgroundColor: "#ffc107",
        borderColor: "#ffc107",
        color: "#000"
    };

    const buttonHoverStyle = {
        backgroundColor: "#e0a800",
        borderColor: "#e0a800",
        color: "#000"
    };

    return (
        <Container
            fluid
            style={{
                ...loginPageStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh"
            }}
        >
            {willRedirect === true ?
                user.isAdmin === true ?
                    <Redirect to='/products' />
                :
                    <Redirect to='/' />
            :
                <Row className="justify-content-center align-items-center w-100" style={{ minHeight: "100vh" }}>
                    <Col xs={12} md={8} lg={6} xl={4} className="d-flex justify-content-center">
                        <Card className="shadow-lg" style={cardStyle}>
                            <Card.Body>
                                <h2 className="text-center text-primary mb-4">Log In</h2>
                                <Form onSubmit={e => authenticate(e)}>
                                    <Form.Group controlId="userEmail" className="mb-3">
                                        <Form.Label>Email:</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="password" className="mb-3">
                                        <Form.Label>Password:</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Button
                                        variant="warning"
                                        type="submit"
                                        className="w-100"
                                        style={buttonStyle}
                                        onMouseOver={e => Object.assign(e.target.style, buttonHoverStyle)}
                                        onMouseOut={e => Object.assign(e.target.style, buttonStyle)}
                                    >
                                        Submit
                                    </Button>
                                </Form>
                            </Card.Body>
                            <Card.Footer className="text-center">
                                <p className="mb-0">
                                    Don't have an account yet? <Link to="/register" className="text-primary">Click here</Link> to register.
                                </p>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            }
        </Container>
    );
}