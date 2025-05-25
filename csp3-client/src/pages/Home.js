import React from 'react';
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

    const products = [
        // Assuming you have some product data here
    ];

    return(
        <React.Fragment>
            <Banner data={pageData}/>
            <Container fluid>
                <h2 className="text-center mb-4">Featured Products</h2>
                <Highlights/>
                <Row>
                    {products.map(product => (
                        <Product key={product._id} data={product} breakPoint={4} />
                    ))}
                </Row>
            </Container>
        </React.Fragment>
    );
    
}
