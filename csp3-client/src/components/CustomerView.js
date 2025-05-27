import React, { useEffect, useState } from 'react';
import Product from '../components/Product';
import ProductSearch from './ProductSearch';

export default function CustomerView() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;

    fetch(`${process.env.REACT_APP_API_URL}/products/active`)
      .then((res) => res.json())
      .then((productsData) => {
        if (isMounted) {
          // Sort so newest is at the leftmost position
          const productsArr = productsData
            .filter(p => p.isActive === true)
            .sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
          setProducts(productsArr);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // MODIFICATION: Use a CSS grid for a strict 5-column, multi-row layout,
  // with fixed card sizes and consistent gaps.
  // Each cell and Product card is now 260px wide and 350px tall.
  return (
    <React.Fragment>
      <ProductSearch />
      <div style={{ fontWeight: 500, fontSize: '2rem', textAlign: 'center', margin: '32px 0 32px 0' }}>
        Our Products
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 250px)", // 5 fixed columns, 260px each
          gap: "32px 26px", // vertical, horizontal gap
          justifyContent: "center",
          margin: "0 auto",
          minHeight: "min(100vh, 1800px)", // ensures enough height for at least 5 rows if enough products
          marginBottom: "48px",
        }}
      >
        {products.map((product, idx) => (
          <Product
            key={product._id}
            data={product}
            index={idx}
            breakPoint={3}
          />
        ))}
      </div>
    </React.Fragment>
  );
}