create database PANNM;
use PANNM;

-- Users table with user information
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
	ranks ENUM('Admin', 'User') DEFAULT 'User',
    telephone VARCHAR(20),
    firstname VARCHAR(50),
    lastname VARCHAR(50)
);

-- Login History
CREATE TABLE login_history (
    login_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Color
CREATE TABLE colors (
    color_id INT AUTO_INCREMENT PRIMARY KEY,
    color_name VARCHAR(50) NOT NULL
);

-- Product table with product information
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    color_id INT,
    type_product VARCHAR(100) NULL, 
    image text null,
    FOREIGN KEY (color_id) REFERENCES colors(color_id)
);

-- Inserting sample data for users
INSERT INTO users (username, password, email, ranks, telephone, firstname, lastname) VALUES
('admin_user', 'admin123', 'admin@example.com', 'Admin', '123456789', 'Admin', 'User');

select * from colors;
-- Inserting sample data into the colors table
INSERT INTO colors (color_name) VALUES
('Red'),
('Blue'),
('Black');

select products.*, colors.color_name color from products join colors on products.color_id = colors.color_id;
-- Inserting sample data into the products table
INSERT INTO products (product_name, description, price, color_id, type_product) VALUES
('PANNMSHIRT', 'เป็นเสื้อยืด collection เเรกของ PANNM ที่มาพร้อมกับความเรียบง่ายใส่ได้ทุกสถานที่เเละ มีเนื้อผ้าที่มีคว่มใส่สบายเเละยืดหยุ่น คุณภาพดีทำจากผ้า cotton 100%', 2000, 1, "t-shirt"); 

USE PANNM;
select * from products where product_name="PANNMSHIRT";
update products
set price = 5000.00
where product_id = 2;