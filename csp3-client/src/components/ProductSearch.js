import React, { useState } from 'react';
import Product from './Product';

const ProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSearchByName = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/searchByName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: searchQuery })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error');
      }
      const data = await response.json();
      setSearchResults(data);
      setError(null);
    } catch (error) {
      setError('An error occurred while searching for products. Please try again.');
    }
  };

  const handleSearchByPrice = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/searchByPrice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          minPrice: minPrice === '' ? 0 : parseInt(minPrice, 10),
          maxPrice: maxPrice === '' ? 100000 : parseInt(maxPrice, 10)
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error');
      }
      const data = await response.json();
      setSearchResults(data.products);
      setError(null);
    } catch (error) {
      setError('An error occurred while searching for products. Please try again.');
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSearchResults(null);
    setError(null);
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', marginTop: 32, marginBottom: 48 }}>
      <h1 style={{ textAlign: 'center', fontWeight: 500, letterSpacing: 1, fontSize: 38, marginBottom: 36 }}>
        Product Search
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', marginBottom: 22 }}>
        <input
          type="text"
          placeholder="Product Name"
          value={searchQuery}
          onChange={event => setSearchQuery(event.target.value)}
          style={{
            width: 400,
            maxWidth: '90%',
            border: 'none',
            outline: 'none',
            background: '#f3f3f3',
            borderRadius: 18,
            height: 38,
            padding: '0 24px',
            fontSize: 18,
            marginBottom: 0
          }}
        />
        <input
          type="number"
          placeholder="Maximum Price"
          value={maxPrice}
          onChange={event => setMaxPrice(event.target.value)}
          style={{
            width: 400,
            maxWidth: '90%',
            border: 'none',
            outline: 'none',
            background: '#f3f3f3',
            borderRadius: 18,
            height: 38,
            padding: '0 24px',
            fontSize: 18,
            marginBottom: 0
          }}
        />
        <input
          type="number"
          placeholder="Minimum Price"
          value={minPrice}
          onChange={event => setMinPrice(event.target.value)}
          style={{
            width: 400,
            maxWidth: '90%',
            border: 'none',
            outline: 'none',
            background: '#f3f3f3',
            borderRadius: 18,
            height: 38,
            padding: '0 24px',
            fontSize: 18,
            marginBottom: 0
          }}
        />
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button
            style={{
              background: '#3082e6',
              color: 'white',
              border: 'none',
              borderRadius: 18,
              padding: '8px 22px',
              fontSize: 16,
              fontWeight: 500,
              cursor: 'pointer'
            }}
            onClick={handleSearchByName}
          >
            Search by Name
          </button>
          <button
            style={{
              background: '#4e9de6',
              color: 'white',
              border: 'none',
              borderRadius: 18,
              padding: '8px 22px',
              fontSize: 16,
              fontWeight: 500,
              cursor: 'pointer'
            }}
            onClick={handleSearchByPrice}
          >
            Search by Price
          </button>
          <button
            style={{
              background: '#f24d4d',
              color: 'white',
              border: 'none',
              borderRadius: 18,
              padding: '8px 22px',
              fontSize: 16,
              fontWeight: 500,
              cursor: 'pointer'
            }}
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </div>
      {error && <p style={{ color: '#c00', textAlign: 'center', marginTop: 10 }}>{error}</p>}
      {searchResults !== null && (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ textAlign: 'center', fontWeight: 500, letterSpacing: 1, fontSize: 28, marginBottom: 32 }}>Search Results</h3>
          {searchResults.length === 0 ? (
            <div
              style={{
                background: '#f6f6f6',
                borderRadius: 10,
                padding: 30,
                textAlign: 'center',
                fontWeight: 500,
                fontSize: 22,
                margin: '0 auto',
                maxWidth: 370
              }}
            >
              No matching products found
            </div>
          ) : (
            // MODIFIED: Grid layout for 5 columns to match main product grid
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 250px)', // 5 fixed columns, 260px each
              gap: '32px 28px',
              justifyContent: 'center'
            }}>
              {searchResults.map((product, idx) => (
                <Product data={product} key={product._id} breakPoint={3} index={idx} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;