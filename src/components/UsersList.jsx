import React, { useState, useEffect, useRef } from "react";
import UserCard from "./UserCard";
import EditUserForm from "./EditUserForm";
import axios from "axios";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });
    const timeoutRef = useRef(null);
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users?page=${page}`
      );
      setUsers(response.data.data);
      setTotalPages(response.data.total_pages);
      setLoading(false);
    } catch (err) {
      setError("Failed to load users. Please try again.", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page]);

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      showNotification("User deleted successfully", "success");
    } catch (err) {
      showNotification("Failed to delete user", err);
    }
  };

  const handleUpdate = async (updatedUser) => {
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setEditingUser(null);
    showNotification("User updated successfully", "success");
  };

  const showNotification = (message, type) => {
      setNotification({ message, type });
      if (timeoutRef.current)
      {
          
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
      }
      
      
    timeoutRef.current = setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 3000);
  };

  const filteredUsers = users.filter((user) =>
    `${user.first_name} ${user.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Users Management</h1>

      {notification.message && (
        <div
          className={`p-4 mb-4 rounded text-center w-1/2 mx-auto ${
            notification.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="mb-4 text-center">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="shadow appearance-none border rounded w-full md:w-1/3 py-2 px-3 text-gray-700"
        />
      </div>

      {loading ? (
        <div className="flex justify-center">
          <p>Loading users...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={() => handleEdit(user)}
                onDelete={() => handleDelete(user.id)}
              />
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p>No users found matching your search criteria.</p>
            </div>
          )}

          <div className="flex justify-center mt-8">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l disabled:opacity-50"
            >
              Previous
            </button>
            <div className="bg-white py-2 px-4">
              Page {page} of {totalPages}
            </div>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <EditUserForm
              user={editingUser}
              onUpdate={handleUpdate}
              onCancel={() => setEditingUser(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
