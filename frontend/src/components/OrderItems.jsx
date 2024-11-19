import "../styles/Product.css";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ACCESS_TOKEN, GOOGLE_ACCESS_TOKEN } from "../token";

export default function Product() {  
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jwtToken = localStorage.getItem(ACCESS_TOKEN);
                const googleToken = localStorage.getItem(GOOGLE_ACCESS_TOKEN);
                const authToken = googleToken || jwtToken;
                
                if (!authToken) {
                    throw new Error('Authentication required');
                }

                // First fetch orders
                const ordersResponse = await axios.get('http://127.0.0.1:8000/api/order_list/', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                setOrders(ordersResponse.data);

                // Then fetch product details for each order item
                const productIds = [...new Set(ordersResponse.data.map(item => item.product))];
                const productDetails = {};

                await Promise.all(productIds.map(async (productId) => {
                    const productResponse = await axios.get(`http://127.0.0.1:8000/api/product_details/${productId}/`, {
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    productDetails[productId] = productResponse.data;
                }));

                setProducts(productDetails);
                setLoading(false);

            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="loading">Loading Orders...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    const handleCheckout = async () => {
        const jwtToken = localStorage.getItem(ACCESS_TOKEN);
        const googleToken = localStorage.getItem(GOOGLE_ACCESS_TOKEN);
        const authToken = googleToken || jwtToken;

        if (!phoneNumber.trim()) {
            alert('Please enter a valid phone number');
            return;
        }

        try {
            // Create message content from orders
            const orderDetails = orders.map(item => {
                const product = products[item.product] || {};
                return `${product.name} - Quantity: ${item.amount}`;
            }).join('\n');

            const message = `Your order details:\n${orderDetails}\n\nThank you for your purchase!`;

            // Send SMS
            await axios.post(
                'http://127.0.0.1:8000/api/send_sms/',  // Create this endpoint in your Django backend
                {
                    phone_number: phoneNumber,
                    message: message
                },
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            alert('Order confirmed! SMS sent to your phone.');
            setIsCheckoutModalOpen(false);
            setPhoneNumber('');
            // Optionally clear the cart or redirect to a confirmation page
        } catch (error) {
            alert('Error processing checkout: ' + error.message);
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Order Items</h1>

            {/* Checkout Button */}
            <div className="checkout-section">
                <button 
                    className="checkout-button"
                    onClick={() => setIsCheckoutModalOpen(true)}
                    disabled={orders.length === 0}
                >
                    Proceed to Checkout
                </button>
            </div>

            {/* Checkout Modal */}
            {isCheckoutModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Checkout</h2>
                        <div className="order-summary">
                            <h3>Order Summary</h3>
                            {orders.map(item => {
                                const product = products[item.product] || {};
                                return (
                                    <div key={item.id} className="order-item-summary">
                                        <span>{product.name}</span>
                                        <span>Quantity: {item.amount}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="form-group">
                            <label>Phone Number: (+254... activate promotional message)</label>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Enter your phone number"
                                required
                            />
                        </div>
                        <div className="modal-buttons">
                            <button 
                                className="confirm-button"
                                onClick={handleCheckout}
                            >
                                Confirm Order
                            </button>
                            <button 
                                className="cancel-button"
                                onClick={() => {
                                    setIsCheckoutModalOpen(false);
                                    setPhoneNumber('');
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="products-grid">
                {orders.map((item) => {
                    const productDetails = products[item.product] || {};
                    return (
                        <div className="product-container" key={item.id}>
                            <div className="image-section">
                                <img 
                                    src={productDetails.image}
                                    alt={productDetails.name}
                                    className="product-image"
                                />
                            </div>
                            <div className="details-section">
                                <h3 className="product-title">{productDetails.name}</h3>
                                <p className="product-description">{productDetails.description}</p>
                                <div className="order-details">
                                    <p>Amount: {item.amount}</p>
                                    <p>Created: {new Date(item.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="review-container">
                                    <div className="specs-list">
                                        {productDetails.specs?.map((spec, index) => (
                                            <span key={index} className="spec-item">
                                                {spec} {index !== productDetails.specs.length - 1 && '•'}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="features-list">
                                        {productDetails.features?.map((feature, index) => (
                                            <span key={index} className="feature-item">
                                                {feature} {index !== productDetails.features.length - 1 && '•'}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="price-section">
                                <div className="button-container">
                                    <button 
                                        className="wishlist-button" 
                                        type="button"
                                        onClick={() => handleDeleteProduct(item.id)}
                                    >
                                        Delete Order Item
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function handleDeleteProduct(orderItemId) {
    const jwtToken = localStorage.getItem(ACCESS_TOKEN);
    const googleToken = localStorage.getItem(GOOGLE_ACCESS_TOKEN);
    const authToken = googleToken || jwtToken;
    
    axios.delete(`http://127.0.0.1:8000/api/delete_order_item/${orderItemId}/`, {
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        alert('Order item deleted successfully!');
        // Reload the page or update the state to reflect the deletion
        window.location.reload();
    })
    .catch(error => {
        alert('Error deleting order item: ' + error.message);
    });
}