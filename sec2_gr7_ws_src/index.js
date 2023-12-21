const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require("cors")
const http = require("http")
require("dotenv").config()
const bodyParser = require('body-parser');

const db = require('./db')
const app = express()
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static('public'));


const server = http.createServer(app);

db.connect((err) => {
    if (err) {
        process.exit(1);
    } else {
        server.listen(PORT, () => {
            console.log(`Server is listening on port localhost:${PORT}`);
        });
    }
});

app.get('/api', (req, res) => {
    res.send("BACKEND RUNNING")
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/homepage.html');
});

app.get('/:pagename', (req, res) => {
    const { pagename } = req.params;
    res.sendFile(`${__dirname}/public/${pagename}.html`, (err) => {
        if (err) {
            res.status(404).send('File not found');
        }
    });
});
// ------------------------------------------------------------------------------------------
// Login
app.post('/api/login/', (req, res) => {
    const { username, password } = req.body;
    const Datetime = new Date();

    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide username and password' });
    }

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = results[0];

        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        db.query(
            'INSERT INTO login_history (user_id, login_time) VALUES (?, ?)',
            [user.user_id,Datetime])

        const userDetails = {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            ranks: user.ranks,
            telephone: user.telephone,
            firstname: user.firstname,
            lastname: user.lastname
        };

        res.status(200).json({ message: 'Login successful', user: userDetails });
    });
});

// Find users from keyword
app.get('/api/users/search/:keyword?', (req, res) => {
    const { keyword } = req.params;
    console.log(keyword)
    // If no keyword is provided, retrieve all users
    if (!keyword) {
        db.query('SELECT * FROM users', (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Internal server error' });
            }

            res.status(200).json({ users: results });
        });
    } else {
        // If a keyword is provided, perform a search based on the keyword
        db.query('SELECT * FROM users WHERE username LIKE ?', [`%${keyword}%`], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Internal server error' });
            }

            res.status(200).json({ users: results });
        });
    }
});

// Create user
app.post('/api/users', (req, res) => {
    const { username, password, email, ranks, telephone, firstname, lastname } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Please provide username, password, and email' });
    }

    db.query(
        'INSERT INTO users (username, password, email, ranks, telephone, firstname, lastname) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [username, password, email, ranks || 'User', telephone || null, firstname || null, lastname || null],
        (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to create user' });
            }

            res.status(201).json({ message: 'User created successfully' });
        }
    );
});

// Delete user
app.delete('/api/users/:username', (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ message: 'Please provide a username' });
    }

    db.query('DELETE FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to delete user' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    });
});

// Update product
app.put('/api/products/:productId', (req, res) => {
    const { productId } = req.params;
    const { product_name, description, price, color_id, type_product } = req.body;

    db.query(
        'UPDATE products SET product_name = ?, description = ?, price = ?, color_id = ?, type_product = ? WHERE product_id = ?',
        [product_name, description, price, color_id, type_product, productId],
        (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to update product' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.status(200).json({ message: 'Product updated successfully' });
        }
    );
});

// Update user
app.put('/api/users/:userId', (req, res) => {
    const { userId } = req.params;
    const { username, password, email, ranks, telephone, firstname, lastname } = req.body;

    db.query(
        'UPDATE users SET username = ?, password = ?, email = ?, ranks = ?, telephone = ?, firstname = ?, lastname = ? WHERE user_id = ?',
        [username, password, email, ranks, telephone, firstname, lastname, userId],
        (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to update user' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ message: 'User updated successfully' });
        }
    );
});

// Delete product
app.delete('/api/products/:productId', (req, res) => {
    const { productId } = req.params;

    db.query('DELETE FROM products WHERE product_id = ?', [productId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to delete product' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    });
});

// Find product by ID
app.get('/api/products/:productId?', (req, res) => {
    const { productId } = req.params;

    if (!productId) {
        db.query('select *, colors.color_name color from products join colors on products.color_id = colors.color_id;', (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Internal server error' });
            }

            res.status(200).json({ products: results });
        });
    } else {
        db.query('select *, colors.color_name color from products join colors on products.color_id = colors.color_id WHERE product_id = ?', [productId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.status(200).json({ product: results[0] });
        });
    }
});

app.post('/api/shirts', (req, res) => {
    const { product_name, description, price, color_id } = req.body;
    db.query(
      'INSERT INTO products (product_name, description, price, color_id, type_product) VALUES (?, ?, ?, ?, ?)',
      [product_name, description, price, color_id, 't-shirt'],
      (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to create shirt' });
        }
  
        res.status(201).json({ message: 'Shirt created successfully' });
      }
    );
  });
  
  app.get('/api/filter', (req, res) => {
    const { name, min, max, colorid, type } = req.query;

    // Build the SQL query dynamically based on the provided parameters
    let query = 'SELECT * FROM products WHERE 1 = 1';
    const params = [];

    if (name) {
        query += ' AND product_name LIKE ?';
        params.push(`%${name}%`);
    }

    if (min) {
        query += ' AND price >= ?';
        params.push(parseFloat(min));
    }

    if (max) {
        query += ' AND price <= ?';
        params.push(parseFloat(max));
    }

    if (colorid) {
        query += ' AND color_id = ?';
        params.push(parseInt(colorid));
    }

    if (type) {
        query += ' AND type_product = ?';
        params.push(type);
    }

    db.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No products found with the provided filters' });
        }

        res.status(200).json({ products: results });
    });
});


module.exports = app