import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

export default function Home() {
    const pageData = {
        title: "The UA Shop",
        content: "Products for everyone, everywhere",
        destination: "/products",
        label: "Browse Products"
    };

    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/products/active`)
            .then(res => res.json())
            .then(data => {
                const sorted = data.sort((a, b) => new Date(a.createdOn) - new Date(b.createdOn));
                setFeaturedProducts(sorted.slice(0, 5)); // Show 5 featured products
            });
    }, []);

    // Helper: get product image url
    const getImageUrl = (img) => {
        if (!img) return '/placeholder-product.png';
        // If img is a full url, use as-is. If it's a relative path, prepend your backend url.
        if (img.startsWith('http')) return img;
        // Otherwise, assume it's a path from your server's public/uploads or similar
        return `${process.env.REACT_APP_API_URL}/${img.replace(/^\/+/, '')}`;
    };

    return (
        <React.Fragment>
            {/* Banner */}
            <div
                style={{
                    width: '100%',
                    height: '340px',
                    background: `url('https://upload.wikimedia.org/wikipedia/commons/6/66/Pampangajf3325a_04.JPG') center/cover no-repeat`,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '-50px'
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%,-50%)',
                        textAlign: 'center',
                        width: '100%',
                        color: 'white',
                        textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
                        fontWeight: 'bold',
                        letterSpacing: '1px'
                    }}
                >
                    <div style={{ fontSize: '3.2rem', fontWeight: 900, lineHeight: 1, letterSpacing: '2px' }}>
                        THE FIRST
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 700, marginTop: '0.2em', lineHeight: 1.05 }}>
                        ARCHDIOCESAN CATHOLIC<br/>UNIVERSITY IN ASIA
                    </div>
                </div>
            </div>

            {/* Main Section */}
            <Container fluid style={{ background: 'white', minHeight: '100vh', paddingBottom: '64px' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', background: 'white', marginTop: '50px', borderRadius: 20, padding: '40px 0 0 0' }}>
                    {/* Title & Subtitle */}
                    <div style={{ fontWeight: 700, fontSize: '2.2rem', marginBottom: 6, letterSpacing: 0.5 }}>
                        {pageData.title}
                    </div>
                    <div style={{ fontStyle: 'italic', color: '#555', marginBottom: 16, fontSize: '1.14rem' }}>
                        {pageData.content}
                    </div>
                    {/* Browse Button */}
                    <Button
                        href={pageData.destination}
                        style={{
                            background: '#3082e6',
                            border: 'none',
                            fontWeight: 600,
                            fontSize: 20,
                            padding: '12px 36px',
                            borderRadius: 24,
                            marginBottom: 36
                        }}
                    >
                        {pageData.label}
                    </Button>
                </div>

                {/* Featured Products */}
                <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center', marginTop: 16 }}>
                    <div style={{ fontWeight: 600, fontSize: '2rem', marginBottom: 32 }}>
                        Featured Products
                    </div>

                    <Row
                        className="justify-content-center"
                        style={{
                          gap: '0',
                          display: 'flex',
                          flexWrap: 'wrap'
                        }}
                    >
                        {featuredProducts.map((product, idx) => (
                            <Col
                                key={product._id}
                                xs={12}
                                sm={6}
                                md={2}
                                lg={2}
                                xl={2}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    marginBottom: 28,
                                    flex: "0 0 19%",
                                    maxWidth: "19%",
                                    margin: "0 0.5%"
                                }}
                            >
                                <div
                                    className="ua-product-card"
                                    tabIndex={0}
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
                                    onClick={() => window.location.href = `/products/${product._id}`}
                                    onKeyPress={e => {
                                        if (e.key === 'Enter') window.location.href = `/products/${product._id}`;
                                    }}
                                >
                                    <img
                                        src={getImageUrl(product.img)}
                                        alt={product.name}
                                        style={{ width: 110, height: 110, objectFit: 'contain', marginBottom: 16, borderRadius: 6, background: '#f6f6f6' }}
                                    />
                                    <div style={{ fontWeight: 600, fontSize: '1.08rem', marginBottom: 8, minHeight: 24, textAlign: 'center' }}>
                                        {product.name}
                                    </div>
                                    <div style={{ color: '#444', fontSize: '0.93rem', minHeight: 36, marginBottom: 10, textAlign: 'center' }}>
                                        {product.description?.slice(0, 70) || ''}
                                    </div>
                                    <div style={{ fontWeight: 600, fontSize: '1.13rem', color: '#222', marginTop: 'auto' }}>
                                        ₱{(+product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                    {/* Hover effect styles */}
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

                    {/* Carousel pagination mock */}
                    <div style={{ margin: '30px 0 0 0', display: 'flex', justifyContent: 'center', gap: 12 }}>
                        <div style={{ width: 32, height: 4, background: '#222', borderRadius: 3, opacity: 0.9 }} />
                        <div style={{ width: 20, height: 4, background: '#222', borderRadius: 3, opacity: 0.18 }} />
                        <div style={{ width: 20, height: 4, background: '#222', borderRadius: 3, opacity: 0.18 }} />
                        <div style={{ width: 20, height: 4, background: '#222', borderRadius: 3, opacity: 0.18 }} />
                    </div>
                </div>
            </Container>
        </React.Fragment>
    );
}