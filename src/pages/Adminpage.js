import React, { useState, useEffect } from "react";
import FileService from "../services/FileService";
import "../pages/Table.css";

function AdminPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    //import user json data
    FileService.read("user").then(
      (response) => {
        if (Array.isArray(response.data)) {
          setUsers(
            response.data.map((user) => ({
              id: user.uid, // adjust the property name here
              name: user.uname, // and here
              email: user.email,
              music: user.music,
            }))
          );
        } else {
          console.error("Error: response data is not an array");
        }
      },
      (rej) => {
        console.log(rej);
      }
    );
  }, []);

  return (
    <div>
      <h1>Admin Page</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Songs</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {Array.isArray(user.music) &&
                  user.music.map((song, index) => (
                    <p key={index}>{song.title}</p>
                  ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;