// app/orders/layout.js
import Navbar from "../components/Navbar"; // Adjust the import path if necessary

export default function OrdersLayout({ children }) {
  return (
    <section>
      {/* Render the Navbar here */}
      <Navbar />

      {/* The content of the orders page will be displayed here */}
      {children}
    </section>
  );
}
