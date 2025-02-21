"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { generatePDFFoods } from "../helpers/pdfHelpers"; // Import the helper

export default function Home() {
  const router = useRouter();
  const [foods, setFoods] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentFoodId, setCurrentFoodId] = useState(null);
  const [newFood, setNewFood] = useState({ name: "", price: "", image: "" });
  const [user, setUser] = useState(null);

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
      fetch("/api/foods")
        .then((res) => res.json())
        .then((data) => setFoods(data))
        .catch((error) => console.error("Error fetching foods:", error));
    }
  }, [user]);

  // Function to generate PDF report
  const handleGeneratePDF = () => {
    generatePDFFoods(foods); // Call the helper to generate the PDF
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFood((prevFood) => ({ ...prevFood, [name]: value }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setNewFood({ name: "", price: "", image: "" });
  };

  const openModal = (food = null) => {
    if (food) {
      setIsEditMode(true);
      setCurrentFoodId(food.id);
      setNewFood({ name: food.name, price: food.price, image: food.image });
    } else {
      setIsEditMode(false);
      setNewFood({ name: "", price: "", image: "" });
    }
    setIsModalOpen(true);
  };

  const handleSaveFood = async (e) => {
    e.preventDefault();
    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode ? `/api/foods/${currentFoodId}` : "/api/foods";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newFood),
    });

    if (response.ok) {
      const updatedFood = await response.json();
      setFoods((prevFoods) =>
        isEditMode
          ? prevFoods.map((food) =>
              food.id === currentFoodId ? updatedFood : food
            )
          : [...prevFoods, updatedFood]
      );
      closeModal();
    } else {
      console.error("Error saving food");
    }
  };

  const handleDeleteFood = async (id) => {
    if (confirm("Are you sure you want to delete this food?")) {
      const response = await fetch(`/api/foods/${id}`, { method: "DELETE" });
      if (response.ok) {
        setFoods((prevFoods) => prevFoods.filter((food) => food.id !== id));
      } else {
        console.error("Error deleting food");
      }
    }
  };

  if (!user) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Food List</h1>
      <div className="flex justify-between mb-4">
        <button
          onClick={() => openModal()}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Add Food
        </button>
        <button
          onClick={handleGeneratePDF}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Generate PDF
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => (
              <tr key={food.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{food.id}</td>
                <td className="px-4 py-2">{food.name}</td>
                <td className="px-4 py-2">{food.price}</td>
                <td className="px-4 py-2">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-16 h-16 rounded-md"
                  />
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => openModal(food)}
                    className="mr-2 bg-yellow-500 text-white px-3 py-1 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteFood(food.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
