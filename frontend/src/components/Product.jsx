import "../styles/Product.css";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ACCESS_TOKEN, GOOGLE_ACCESS_TOKEN } from "../token";

export default function Product() {  
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
        specs: '',
        features: '',
    });

    const fetchProducts = async (search = '') => {
        try {
            setIsSearching(true);
            const jwtToken = localStorage.getItem(ACCESS_TOKEN);
            const googleToken = localStorage.getItem(GOOGLE_ACCESS_TOKEN);
            const authToken = googleToken || jwtToken;
            
            if (!authToken) {
                throw new Error('Authentication required');
            }

            // Add search parameter to URL if search term exists
            const searchParam = search ? `?search=${encodeURIComponent(search)}` : '';
            const response = await axios.get(`http://127.0.0.1:8000/api/products_list/${searchParam}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            setProducts(response.data);
            setLoading(false);
            setIsSearching(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
            setIsSearching(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Debounce search function
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm !== '') {
                fetchProducts(searchTerm);
            } else {
                fetchProducts();
            }
        }, 500); // Wait 500ms after last keystroke before searching

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);
    
    function handleAddtocart(productId) {
        const jwtToken = localStorage.getItem(ACCESS_TOKEN);
        const googleToken = localStorage.getItem(GOOGLE_ACCESS_TOKEN);
        const authToken = googleToken || jwtToken;
        
        axios.post(
            `http://127.0.0.1:8000/api/add_to_product_to_cart/${productId}/`,
            { amount: 1 },  // Just send the amount
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            }
        )
        .then(response => {
            alert('Product added successfully!');
            // Optionally refresh the page or update the cart display
            // window.location.reload();
        })
        .catch(error => {
            const errorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            alert('Error adding product: ' + errorMessage);
        });
    }

function handleDeleteProduct(productId) {
    // Get both tokens
    const jwtToken = localStorage.getItem(ACCESS_TOKEN);
    const googleToken = localStorage.getItem(GOOGLE_ACCESS_TOKEN);

    // Determine which token to use
    const authToken = googleToken || jwtToken;
    
    
    axios.delete(`http://127.0.0.1:8000/api/delete_product/${productId}/`, {
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        alert('Product deleted successfully!');
    })
    .catch(error => {
        alert('Error deleting product: ' + error.message);
    });
}

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        const jwtToken = localStorage.getItem(ACCESS_TOKEN);
        const googleToken = localStorage.getItem(GOOGLE_ACCESS_TOKEN);
        const authToken = googleToken || jwtToken;

        try {
            // Convert specs and features from comma-separated string to array
            const productData = {
                ...newProduct,
                specs: newProduct.specs.split(',').map(spec => spec.trim()),
                features: newProduct.features.split(',').map(feature => feature.trim()),
            };

            await axios.post(
                'http://127.0.0.1:8000/api/crreate_product/',
                productData,
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Reset form and close modal
            setNewProduct({
                name: '',
                description: '',
                price: '',
             
            });
            setIsModalOpen(false);
            
            // Refresh products list
            fetchProducts();
            
            alert('Product created successfully!');
        } catch (error) {
            alert('Error creating product: ' + error.message);
        }
    };

    if (loading) {
        return <div className="loading">Loading products...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="page-container">
             <div className="header-section">
                <h1 className="page-title">Products</h1>
                <div className="header-controls">
                    <div className="search-container">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {isSearching && <div className="search-spinner">Searching...</div>}
                    </div>
                    <button 
                        className="add-product-button"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add New Product
                    </button>
                </div>
            </div>

            {products.length === 0 && (
                <div className="no-results">
                    {searchTerm ? "No products found matching your search" : "No products available"}
                </div>
            )}

            {/* Create Product Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Create New Product</h2>
                        <form onSubmit={handleCreateProduct}>
                            <div className="form-group">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description:</label>
                                <textarea
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                                    required
                                />
                            </div>
                         
                          
                          
                            <div className="modal-buttons">
                                <button type="submit" className="create-button">
                                    Create Product
                                </button>
                                <button 
                                    type="button" 
                                    className="cancel-button"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/*  products grid */}
            <div className="products-grid">
                {products.map((item) => (
                    <div className="product-container" key={item.id}>
                        <div className="image-section">
                            <img 
                                src={item.image}
                                alt={item.name}
                                className="product-image"
                            />
                        </div>
                        <div className="details-section">
                            <h3 className="product-title">{item.name}</h3>
                            <div className="review-container">
                            <p className="product">{item.description}</p>
                               
                                <div className="features-list">
                                    {item.features && item.features.map((feature, index) => (
                                        <span key={index} className="feature-item">
                                            {feature} {index !== item.features.length - 1 && '•'}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="price-section">
                            <div className="button-container">
                                <button 
                                    className="buy-button" 
                                    type="button"
                                    onClick={() => handleAddtocart(item.id)}
                                >
                                    Add to cart
                                </button>
                                <button 
                                    className="wishlist-button" 
                                    type="button"
                                    onClick={() => handleDeleteProduct(item.id)}
                                >
                                    Delete Product
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}