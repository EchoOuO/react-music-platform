import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("/data/users.json")
      .then((response) => {
        const data = response.data;
        setUsers(
          data.map(({ uid, uname, email }) => ({ id: uid, name: uname, email }))
        );
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const handleAddUser = (newUser) => {
    setUsers([...users, newUser]);
  };

  const handleRemoveUser = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
  };
  return (
    <div>
      <h1>Admin Page</h1>

      <h2>Users</h2>
      <table className="table">
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
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleRemoveUser(user.id)}
                >
                  Remove User
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary" onClick={handleAddUser}>
        Add User
      </button>
    </div>
  );
}

export default AdminPage;
