select * from users;

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
('PANNM SHIRT', 'เป็นเสื้อยืด collection เเรกของ PANNM ที่มาพร้อมกับความเรียบง่ายใส่ได้ทุกสถานที่เเละ มีเนื้อผ้าที่มีคว่มใส่สบายเเละยืดหยุ่น คุณภาพดีทำจากผ้า cotton 100%', 2000, 1, "t-shirt"); 