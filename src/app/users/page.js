"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { generatePDFUsers } from "../helpers/pdfHelpers"; // Helper untuk generate PDF

export default function Users() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      fetch("/api/users")
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch((error) => console.error("Error fetching users:", error));
    }
  }, [user]);

  const handleStatusChange = (userId, newStatus) => {
    fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then((updatedUser) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, status: newStatus } : user
          )
        );
        setIsModalOpen(false);
      })
      .catch((error) => console.error("Error updating user status:", error));
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleGeneratePDF = () => {
    generatePDFUsers(users);
  };

  if (!user) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">User List</h1>

      <div className="mb-4 flex justify-between">
        <button
          onClick={handleGeneratePDF}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Generate PDF Report
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">User ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">
                  {user.status === "inactive" && (
                    <button
                      onClick={() => openModal(user)}
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Activate
                    </button>
                  )}
                  {user.status === "active" && (
                    <button
                      onClick={() => handleStatusChange(user.id, "inactive")}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h2 className="text-xl font-semibold mb-4">Confirm Activation</h2>
            <p>Are you sure you want to activate user {selectedUser?.name}?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusChange(selectedUser.id, "active")}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
