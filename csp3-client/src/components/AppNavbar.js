import React, { useContext } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { NavLink, useHistory } from 'react-router-dom';
import UserContext from '../UserContext';

export default function AppNavBar() {
    const { user } = useContext(UserContext);
    const history = useHistory();

    // Mock profile image or use user's avatar if available
    const profileImage = 'https://media.licdn.com/dms/image/v2/C4E03AQHjtBCSlU3EuQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1517244428798?e=2147483647&v=beta&t=00akjRi15AsSe_QX1rjLC3BVfruByksCyUxbtknicCc';

    // Handle logout
    const handleLogout = () => {
        history.push('/logout');
    };

    return (
        <Navbar
            style={{
                background: '#1e4f91',
                borderBottom: '4px solid #b71c1c',
                minHeight: 64,
                padding: 0
            }}
            expand="lg"
        >
            <Container fluid>
                <Navbar.Brand as={NavLink} to="/" style={{ color: '#FFF', fontWeight: 700, fontSize: 26, display: 'flex', alignItems: 'center', letterSpacing: 0.5, textDecoration: "none" }}>
                    <img
                        src="https://www.ua.edu.ph/wp-content/uploads/2017/07/UA-Logo.png"
                        alt="UA Logo"
                        style={{ width: 38, height: 38, marginRight: 10, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    The UA Shop
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar-nav" />
                <Navbar.Collapse id="main-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link
                            as={NavLink}
                            exact
                            to="/products"
                            activeClassName="active"
                            style={{ fontSize: 20, marginLeft: 8, color: '#FFF' }}
                        >
                            Products
                        </Nav.Link>
                        {user.isAdmin && (
                            <Nav.Link
                                as={NavLink}
                                exact
                                to="/admin"
                                activeClassName="active"
                                style={{ fontSize: 20, marginLeft: 8, color: '#FFF' }}
                            >
                                Admin Panel
                            </Nav.Link>
                        )}
                    </Nav>
                    <Nav className="ms-auto" style={{ alignItems: 'center' }}>
                        {user.id ? (
                            user.isAdmin ? (
                                <NavDropdown
                                    title={
                                        <img
                                            src={profileImage}
                                            alt="Profile"
                                            style={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                border: '2px solid #fff'
                                            }}
                                        />
                                    }
                                    id="nav-profile-dropdown"
                                    align="end"
                                    style={{ marginRight: 10 }}
                                >
                                    <NavDropdown.Item as={NavLink} to="/profile" activeClassName="active">
                                        Profile
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout}>Log Out</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <>
                                    <Nav.Link
                                        as={NavLink}
                                        exact
                                        to="/cart"
                                        activeClassName="active"
                                        style={{ fontSize: 18, marginRight: 8, color: '#FFF' }}
                                    >
                                        Cart
                                    </Nav.Link>
                                    <Nav.Link
                                        as={NavLink}
                                        exact
                                        to="/orders"
                                        activeClassName="active"
                                        style={{ fontSize: 18, marginRight: 8, color: '#FFF' }}
                                    >
                                        Orders
                                    </Nav.Link>
                                    <NavDropdown
                                        title={
                                            <img
                                                src={profileImage}
                                                alt="Profile"
                                                style={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: '50%',
                                                    objectFit: 'cover',
                                                    border: '2px solid #fff'
                                                }}
                                            />
                                        }
                                        id="nav-profile-dropdown"
                                        align="end"
                                        style={{ marginRight: 10 }}
                                    >
                                        <NavDropdown.Item as={NavLink} to="/profile" activeClassName="active">
                                            Profile
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item onClick={handleLogout}>Log Out</NavDropdown.Item>
                                    </NavDropdown>
                                </>
                            )
                        ) : (
                            <>
                                <Nav.Link
                                    as={NavLink}
                                    exact
                                    to="/login"
                                    activeClassName="active"
                                    style={{ fontSize: 18, marginRight: 8, color: '#FFF' }}
                                >
                                    Log In
                                </Nav.Link>
                                <Nav.Link
                                    as={NavLink}
                                    exact
                                    to="/register"
                                    activeClassName="active"
                                    style={{ fontSize: 18, marginRight: 8, color: '#FFF' }}
                                >
                                    Register
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
            {/* Custom active link styling */}
            <style>
                {`
                .nav-link.active, .dropdown-item.active {
                    color: #fff !important;
                    font-weight: bold;
                    border-bottom: 1px solid #990000;
                }
                `}
            </style>
        </Navbar>
    );
}