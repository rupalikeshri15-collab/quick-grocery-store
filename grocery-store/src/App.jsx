import React, { useState } from 'react';

const PRODUCTS = [
  { id: 1, name: 'Fresh Apple (1kg)', price: 120, image: '🍎' },
  { id: 2, name: 'Organic Milk (1L)', price: 60, image: '🥛' },
  { id: 3, name: 'Whole Wheat Bread', price: 40, image: '🍞' },
  { id: 4, name: 'Basmati Rice (1kg)', price: 90, image: '🍚' },
];

function App() {
  const [cart, setCart] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const addToCart = (product) => {
    setOrderPlaced(false);
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    fetch('http://127.0.0.1:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        total: totalPrice,
        items: cart,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert('🎉 ' + data.message);
        setCart([]);
        setOrderPlaced(true);
      })
      .catch((error) => {
        console.error('Error placing order:', error);
        alert('❌ Order place karne mein kuch error aaya!');
      });
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '900px', margin: '0 auto', color: '#fff' }}>
      <header style={{ borderBottom: '2px solid #555', paddingBottom: '15px', marginBottom: '20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', margin: '0 0 10px 0' }}>🛒 QuickGrocery Store</h1>
        <div style={{ fontSize: '16px' }}>
          <strong>Cart Items:</strong> {cart.reduce((sum, item) => sum + item.quantity, 0)} &nbsp;|&nbsp; <strong>Total:</strong> ₹{totalPrice}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {PRODUCTS.map((product) => (
          <div key={product.id} style={{ border: '1px solid #444', borderRadius: '8px', padding: '15px', textAlign: 'center', backgroundColor: '#222' }}>
            <div style={{ fontSize: '50px', marginBottom: '10px' }}>{product.image}</div>
            <h3 style={{ margin: '10px 0', color: '#fff' }}>{product.name}</h3>
            <p style={{ color: '#aaa', fontWeight: 'bold' }}>₹{product.price}</p>
            <button 
              onClick={() => addToCart(product)}
              style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div style={{ marginTop: '30px', border: '1px solid #444', backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px' }}>
          <h2>Your Cart</h2>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {cart.map((item) => (
              <li key={item.id} style={{ marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.image} {item.name} × {item.quantity}</span>
                <strong>₹{item.price * item.quantity}</strong>
              </li>
            ))}
          </ul>
          <h3>Total Amount: ₹{totalPrice}</h3>
          <button 
            onClick={handlePlaceOrder}
            style={{ backgroundColor: '_008CBA', backgroundColor: '#008CBA', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginTop: '10px', fontSize: '16px', fontWeight: 'bold' }}
          >
            Place Order
          </button>
        </div>
      )}

      {orderPlaced && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#2e7d32', color: 'white', borderRadius: '5px', textAlign: 'center' }}>
          <h3>✅ Order placed successfully and saved to MySQL Database! 🎉</h3>
        </div>
      )}
    </div>
  );
}

export default App;