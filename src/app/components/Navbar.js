"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          <a href="/" className="hover:text-gray-200">
            Food Admin
          </a>
        </div>
        <div className="space-x-6 text-white text-lg">
          <a href="/" className="hover:text-gray-200">
            Home
          </a>
          <a href="/orders" className="hover:text-gray-200">
            Orders
          </a>
          <a href="/foods" className="hover:text-gray-200">
            Foods
          </a>
          <a href="/users" className="hover:text-gray-200">
            Users
          </a>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
