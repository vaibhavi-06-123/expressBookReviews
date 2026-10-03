const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "Username already exists"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(201).json({
    message: "User registered successfully"
  });
});


// Internal route used by Axios to retrieve books
public_users.get('/data/books', (req, res) => {
  res.json(books);
});


// Get all books using Axios and async/await
public_users.get('/', async (req, res) => {

  try {

    const response = await axios.get('http://localhost:5000/data/books');

    res.json(response.data);

  } catch (error) {

    res.status(500).json({
      message: "Unable to retrieve books"
    });

  }

});


// Get book details based on ISBN using Axios
public_users.get('/isbn/:isbn', async (req, res) => {

  try {

    const response = await axios.get('http://localhost:5000/data/books');

    const isbn = req.params.isbn;
    const book = response.data[isbn];

    if (book) {

      res.json(book);

    } else {

      res.status(404).json({
        message: "Book not found"
      });

    }

  } catch (error) {

    res.status(500).json({
      message: "Unable to retrieve book"
    });

  }

});


// Get books based on author using Axios
public_users.get('/author/:author', async (req, res) => {

  try {

    const response = await axios.get('http://localhost:5000/data/books');

    const author = req.params.author;

    const result = Object.values(response.data).filter(book =>
      book.author.toLowerCase() === author.toLowerCase()
    );

    res.json(result);

  } catch (error) {

    res.status(500).json({
      message: "Unable to retrieve books"
    });

  }

});


// Get books based on title using Axios
public_users.get('/title/:title', async (req, res) => {

  try {

    const response = await axios.get('http://localhost:5000/data/books');

    const title = req.params.title;

    const result = Object.values(response.data).filter(book =>
      book.title.toLowerCase() === title.toLowerCase()
    );

    res.json(result);

  } catch (error) {

    res.status(500).json({
      message: "Unable to retrieve books"
    });

  }

});


// Get book review
public_users.get('/review/:isbn', (req, res) => {

  const isbn = req.params.isbn;

  if (books[isbn]) {

    res.json(books[isbn].reviews);

  } else {

    res.status(404).json({
      message: "Book not found"
    });

  }

});


module.exports.general = public_users;