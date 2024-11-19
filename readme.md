# Screening Test 
### Please complete this task without using ChatGPT or any other AI model to do the test. This will ensure a genuine assessment of your skills and capabilities. 

1. Create a simple Python service (Django or FastAPI Frameworks) 
2. Design a simple customers and orders database. 
3. Add a REST or GraphQL API to input / upload customers and orders:
    - Customers have simple details e.g., name and code. 
    - Orders have simple details e.g., item, amount, and time. 
4. Implement authentication and authorization via OpenID Connect 
5. When an order is added, send the customer an SMS alerting them (you can use the Africa’s Talking SMS gateway and sandbox) 
6. Implement data structures to: 
- efficiently manage and retrieve customers and orders. 
- Implement a search functionality to find orders within a given date range. - Optimize the process of sending SMS alerts. 
7. Write unit tests (with coverage checking) and set up CI + automated CD. You can deploy to any PAAS/FAAS/IAAS of your choice 
8. Write a README for the project and host it on your GitHub



1. Create a simple python service(FastApi) 

Step `1`    : Install fastapi

```python
pip install fastapi

```




2. Design a simple customers and orders database. 

```
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE orders (
    id BIGINT PRIMARY KEY,
    user_id BIGINT REFERENCES users(id)
);

CREATE TABLE order_items (
    id BIGINT PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id),
    product_id BIGINT REFERENCES products(id),
    amount DECIMAL(10,2),
    created_at TIMESTAMP
);

CREATE TABLE products (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT
);
```