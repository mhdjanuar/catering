import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDF = (orders) => {
  const doc = new jsPDF();

  // Header: Kop Surat (Letterhead)
  doc.setFillColor(0, 122, 255); // Warna biru
  doc.rect(0, 0, 210, 30, "F"); // Background biru
  doc.setTextColor(255, 255, 255); // Warna teks putih untuk header
  doc.setFontSize(16);
  doc.setFont("times", "bold");
  doc.text("Catering", 105, 10, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text(
    "Jl. Gedong Gg, RT 03 RW 02\nKec Kramat Jati Kota Jakarta Timur",
    105,
    15,
    { align: "center" }
  );

  // Garis pemisah
  doc.setDrawColor(0, 122, 255); // Garis biru
  doc.line(14, 35, 195, 35);

  // Judul laporan
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont("times", "bold");
  doc.text("Laporan Order Catering", 105, 45, { align: "center" });

  // Table Data
  autoTable(doc, {
    startY: 55, // Posisi mulai tabel setelah judul
    head: [
      [
        "Order ID",
        "Food Name",
        "Customer Name",
        "Phone",
        "Address",
        "Qty",
        "Status",
      ],
    ],
    body: orders.map((order) => [
      order.id,
      order.food_name,
      order.customer_name,
      order.phone,
      order.address,
      order.qty,
      order.status,
    ]),
    styles: { font: "times", fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [0, 122, 255], textColor: [255, 255, 255] }, // Header table biru putih
    alternateRowStyles: { fillColor: [230, 245, 255] }, // Warna selang-seling biru muda
  });

  // Footer: Tanda Tangan
  const footerY = doc.lastAutoTable.finalY + 20;
  doc.setFont("times", "normal");
  doc.text("Jakarta, 14 Januari 2025", 140, footerY);
  doc.text("Pemilik", 150, footerY + 10);
  doc.text("_______________________", 140, footerY + 20);
  doc.text("Rizky Saputra", 140, footerY + 30);

  // Save PDF
  doc.save("laporan_order_catering.pdf");
};
