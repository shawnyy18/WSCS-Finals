import React, { useState, useEffect } from 'react';
import Banner from '../components/Banner';
import Highlights from '../components/Highlights';
import { Container, Row } from 'react-bootstrap';
import Product from '../components/Product';

export default function Home(){
    const pageData = {
        title: "The UA Shop",
        content: "Products for everyone, everywhere",
        destination: "/products",
        label: "Browse Products"
    };

    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        // Fetch all active products
        fetch(`${process.env.REACT_APP_API_URL}/products/active`)
            .then(res => res.json())
            .then(data => {
                // Sort by createdOn (oldest first), then take first 4
                const sorted = data.sort((a, b) => new Date(a.createdOn) - new Date(b.createdOn));
                setFeaturedProducts(sorted.slice(0, 4));
            });
    }, []);

    return(
        <React.Fragment>
            <Banner data={pageData}/>
            <Container fluid>
                <h2 className="text-center mb-4">Featured Products</h2>
                <Highlights/>
                <Row className="justify-content-center">
                    {featuredProducts.map(product => (
                        <Product key={product._id} data={product} breakPoint={3} />
                    ))}
                </Row>
            </Container>
        </React.Fragment>
    );
}
