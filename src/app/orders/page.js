"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { generatePDF, generatePDFOrdersApprove } from "../helpers/pdfHelpers";

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [approvedOrders, setApprovedOrders] = useState([]); // State untuk pesanan approved
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => setOrders(data))
        .catch((error) => console.error("Error fetching orders:", error));

      // Fetch only approved orders
      fetch("/api/ordersApprove")
        .then((res) => res.json())
        .then((data) => setApprovedOrders(data))
        .catch((error) =>
          console.error("Error fetching approved orders:", error)
        );
    }
  }, [user]);

  const handleStatusChange = (orderId, newStatus) => {
    fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then(() => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        setIsModalOpen(false);
      })
      .catch((error) => console.error("Error updating order status:", error));
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleGeneratePDF = () => {
    generatePDF(orders);
  };

  const handleGenerateApprovedPDF = () => {
    generatePDFOrdersApprove(approvedOrders);
  };

  if (!user) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Orders</h1>

      {/* Tombol Report */}
      <div className="mb-4 flex justify-between">
        <button
          onClick={handleGeneratePDF}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Generate Semua orders
        </button>
        <button
          onClick={handleGenerateApprovedPDF}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Generate Order di terima
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Food Name</th>
              <th className="px-4 py-2">Customer Name</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">Qty</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{order.food_name}</td>
                <td className="px-4 py-2">{order.customer_name}</td>
                <td className="px-4 py-2">{order.phone}</td>
                <td className="px-4 py-2">{order.address}</td>
                <td className="px-4 py-2">{order.qty}</td>
                <td className="px-4 py-2">
                  {order.status === "PENDING" && (
                    <button
                      onClick={() => openModal(order)}
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Accept
                    </button>
                  )}
                  {order.status === "approved" && (
                    <button
                      onClick={() => handleStatusChange(order.id, "PENDING")}
                      className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Approved
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal untuk Konfirmasi Approval */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h2 className="text-xl font-semibold mb-4">Confirm Approval</h2>
            <p>Are you sure you want to approve order #{selectedOrder?.id}?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusChange(selectedOrder.id, "approved")}
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
