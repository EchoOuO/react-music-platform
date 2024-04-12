import React, { useState, useEffect } from "react";
import FileService from "../services/FileService";
import "../pages/Table.css";
import { AES, enc } from "crypto-js";
import { Button, Form, Table } from "react-bootstrap";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
  });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    let storedUsers = localStorage.getItem("users");

    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      FileService.read("user").then(
        (response) => {
          if (Array.isArray(response.data)) {
            const loadedUsers = response.data.map((user) => ({
              id: user.uid,
              name: user.uname,
              email: user.email,
              password: user.password,
            }));
            setUsers(loadedUsers);
            localStorage.setItem("users", JSON.stringify(loadedUsers));
          } else {
            console.error("Error: response data is not an array");
          }
        },
        (rej) => {
          console.log(rej);
        }
      );
    }
  }, []);

  const handleAddUser = () => {
    setShowForm(true);
    window.scrollTo(0, document.body.scrollHeight);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser(user);
    setShowForm(true);
    window.scrollTo(0, document.body.scrollHeight);
  };

  const handleDeleteUser = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);

    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const handleInputChange = (event) => {
    setNewUser({ ...newUser, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let updatedUsers;
    if (editingUser) {
      updatedUsers = users.map((user) =>
        user.id === editingUser.id ? newUser : user
      );
      setEditingUser(null);
    } else {
      updatedUsers = [...users, newUser];
    }
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setNewUser({ id: "", name: "", email: "", password: "" });
    setShowForm(false);
  };

  console.log(users)

  return (
    <div>
      <h1>Admin Page</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid}>
              <td>{user.uid}</td>
              <td>{user.uname}</td>
              <td>{user.email}</td>
              <td>
                <Button variant="success" onClick={handleAddUser}>
                  Add
                </Button>
                <Button variant="warning" onClick={() => handleEditUser(user)}>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {showForm && (
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>ID</Form.Label>
            <Form.Control
              type="text"
              name="id"
              value={newUser.id}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newUser.name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      )}
    </div>
  );
}

export default AdminPage;