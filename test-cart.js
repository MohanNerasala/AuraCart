async function testCart() {
  try {
    const baseUrl = 'http://localhost:8080/api';
    
    // Register
    console.log('Registering...');
    let token;
    let res = await fetch(baseUrl + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: 'test5@example.com', password: 'password123' })
    });
    let data = await res.json();
    if (!res.ok) {
        console.log('Register failed, trying login...');
        res = await fetch(baseUrl + '/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test5@example.com', password: 'password123' })
        });
        data = await res.json();
    }
    token = data.token;
    console.log('Token:', token);
    
    // Get products
    console.log('Fetching products...');
    res = await fetch(baseUrl + '/products');
    data = await res.json();
    const product = data.content[0];
    console.log('Using Product ID:', product.id);
    
    // Add to cart
    console.log('Adding to cart...');
    res = await fetch(baseUrl + '/cart/items', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId: product.id, quantity: 1 })
    });
    
    if (!res.ok) {
        console.log('Error adding to cart:', res.status, await res.text());
        return;
    }
    data = await res.json();
    console.log('Cart Items returned:', JSON.stringify(data.items, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testCart();
