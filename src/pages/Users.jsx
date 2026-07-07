import { useRef, useState } from "react";
import { users } from "../data/Users";

export default function Users({ currentUser }) {
  const formRef = useRef(null);

  const [userList, setUserList] = useState(() => {
    const savedUsers = localStorage.getItem("systemUsers");

    if (savedUsers) {
      return JSON.parse(savedUsers);
    }

    return users;
  });

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [editUserId, setEditUserId] = useState(null);

  const isEditing = editUserId !== null;

  const filteredUsers = userList.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase()),
  );

  function saveUsers(updatedUsers) {
    setUserList(updatedUsers);
    localStorage.setItem("systemUsers", JSON.stringify(updatedUsers));
  }

  function handleInputChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function resetForm() {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
    });

    setEditUserId(null);
    setError("");
  }

  function validateForm() {
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      setError("Please fill in all fields.");
      return false;
    }

    const emailExists = userList.some(
      (user) =>
        user.id !== editUserId &&
        user.email.trim().toLowerCase() === formData.email.trim().toLowerCase(),
    );

    if (emailExists) {
      setError("This email already exists.");
      return false;
    }

    return true;
  }

  function handleAddUser(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newUser = {
      id: Date.now(),
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password.trim(),
      role: formData.role,
    };

    const updatedUsers = [...userList, newUser];

    saveUsers(updatedUsers);
    resetForm();
  }

  function handleEditUser(selectedUser) {
    if (currentUser.id === selectedUser.id) {
      setError("You cannot edit your own account.");
      return;
    }

    setEditUserId(selectedUser.id);

    setFormData({
      name: selectedUser.name,
      email: selectedUser.email,
      password: selectedUser.password,
      role: selectedUser.role,
    });

    setError("");

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  function handleUpdateUser(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const updatedUsers = userList.map((user) => {
      if (user.id === editUserId) {
        return {
          ...user,
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password.trim(),
          role: formData.role,
        };
      }

      return user;
    });

    saveUsers(updatedUsers);
    resetForm();
  }

  function handleDeleteUser(userId) {
    if (currentUser.id === userId) {
      setError("You cannot delete your own account.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmDelete) {
      return;
    }

    const updatedUsers = userList.filter((user) => user.id !== userId);

    saveUsers(updatedUsers);

    if (editUserId === userId) {
      resetForm();
    }

    setError("");
  }

  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h1>Users Management</h1>
          <p>Add, edit, delete, and view system users.</p>
        </div>

        <span className="total-badge">Total Users: {userList.length}</span>
      </div>

      <form
        ref={formRef}
        className="add-user-form"
        onSubmit={isEditing ? handleUpdateUser : handleAddUser}
      >
        <h2>{isEditing ? "Edit User" : "Add New User"}</h2>

        {error && <p className="form-error">{error}</p>}

        <div className="form-grid">
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleInputChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleInputChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="add-user-button">
            {isEditing ? "Update User" : "Add User"}
          </button>

          {isEditing && (
            <button
              type="button"
              className="cancel-edit-button"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <input
        className="search-input"
        type="text"
        placeholder="Search by name, email, or role..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredUsers.length > 0 ? (
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>{user.role}</span>
                </td>

                <td>
                  <div className="table-actions">
                    <button
                      className="edit-user-button"
                      onClick={() => handleEditUser(user)}
                      disabled={currentUser.id === user.id}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-user-button"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={currentUser.id === user.id}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No user found.</p>
      )}
    </div>
  );
}
