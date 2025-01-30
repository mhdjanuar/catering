"use client";

import { useState, useEffect } from "react";

// Navbar component
const Navbar = () => (
  <nav className="bg-blue-600 p-4">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="text-white text-2xl font-bold">
        <img
          src="https://i.postimg.cc/FzgxSc3w/e532fa5c50dbddb69a6b15e2d61744b1.jpg" // Replace with your logo
          alt="Logo"
          className="w-12 h-12 inline-block mr-2"
        />
        Welcome to Gaia Catering
      </div>
      <div>
        <a
          href="/"
          className="text-white px-4 py-2 hover:bg-blue-700 rounded-md"
        >
          Home
        </a>
      </div>
    </div>
  </nav>
);

export default function Home() {
  const [foods, setFoods] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [orderDetails, setOrderDetails] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "testttttt",
  });

  useEffect(() => {
    fetch("/api/foods")
      .then((res) => res.json())
      .then((data) => setFoods(data))
      .catch((error) => console.error("Error fetching foods:", error));
  }, []);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    const order = {
      ...orderDetails,
      id: selectedFood.id,
      status: "PENDING",
    };

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(order),
    });

    if (response.ok) {
      const addOrders = await response.json();
      console.log(addOrders);

      setOrderDetails({ name: "", phone: "", address: "" });
      setShowOrderForm(false);
    } else {
      console.error("Error adding food");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOrderClick = (food) => {
    setSelectedFood(food);
    setShowOrderForm(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">
          Welcome to Gaia Catering
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {foods.map((food) => (
            <div
              key={food.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105 duration-300"
            >
              <img
                src={food.image}
                alt={food.name}
                className="w-full h-48 object-cover object-center"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {food.name}
                </h2>
                <p className="text-gray-600 mt-2">Rp. {food.price}</p>
                <div className="mt-4">
                  <button
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                    onClick={() => handleOrderClick(food)}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Place Your Order</h2>
            <form onSubmit={handleOrderSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={orderDetails.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md mt-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={orderDetails.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md mt-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={orderDetails.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md mt-2"
                  required
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowOrderForm(false)}
                  className="text-gray-500 border px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
