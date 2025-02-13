import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import Swal from "sweetalert2";
import "./App.css";

const ticketPrices = {
  ekonomi: 15000,
  bisnis: 80000,
  eksekutif: 110000,
};

const DISCOUNT_CODE = "SMK BISA"; // Kode diskon
const DISCOUNT_PERCENTAGE = 0.1; // Diskon 10%

function App() {
  const [kelas, setKelas] = useState("");
  const [stasiunAsal, setStasiunAsal] = useState("");
  const [stasiunTujuan, setStasiunTujuan] = useState("");
  const [tanggalBerangkat, setTanggalBerangkat] = useState("");
  const [jumlahPenumpang, setJumlahPenumpang] = useState(0);
  const [uangBayar, setUangBayar] = useState(0);
  const [kodeDiskon, setKodeDiskon] = useState("");
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem("orders");
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders)); // Simpan pesanan ke localStorage setiap kali orders berubah
  }, [orders]);

  const handleCalculate = (event) => {
    event.preventDefault();
    if (kelas && jumlahPenumpang > 0 && uangBayar >= 0) {
      const hargaTiket = ticketPrices[kelas];
      const total = hargaTiket * jumlahPenumpang;
      const diskonValue =
        kodeDiskon === DISCOUNT_CODE ? total * DISCOUNT_PERCENTAGE : 0;
      const totalAfterDiscount = total - diskonValue;
      const kembali = uangBayar - totalAfterDiscount;

      if (kembali < 0) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Jumlah uang bayar tidak cukup!",
        });
        return;
      }

      const newOrder = {
        id: orders.length + 1, // Buat ID otomatis
        stasiunAsal,
        stasiunTujuan,
        tanggalBerangkat,
        kelas,
        jumlahPenumpang,
        totalBayar: totalAfterDiscount,
        diskon: diskonValue,
        uangBayar,
        uangKembali: kembali,
      };

      setOrders((prevOrders) => [...prevOrders, newOrder]); // Tambahkan pesanan baru ke daftar

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Perhitungan tiket berhasil dilakukan!",
        showConfirmButton: true,
      }).then(() => {
        // Reset form setelah perhitungan
        setKelas("");
        setStasiunAsal("");
        setStasiunTujuan("");
        setTanggalBerangkat("");
        setJumlahPenumpang(0);
        setUangBayar(0);
        setKodeDiskon("");

        navigate("/summary", { state: newOrder }); // Navigasi ke halaman summary setelah submit
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Harap masukkan semua data yang diperlukan!",
      });
    }
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <header className="navbar">
                <div className="navbar-container">
                  <h1 className="navbar-title" style={{ color: "white" }}>
                    Sistem Tiket Kereta Api
                  </h1>
                  <nav>
                    <ul className="navbar-links">
                      <li>
                        <a href="#home">Home</a>
                      </li>
                      <li>
                        <a href="#about">About</a>
                      </li>
                      <li>
                        <a href="#contact">Contact</a>
                      </li>
                      <li>
                        <FaUser style={{ color: "White", fontSize: "20px" }} />
                      </li>
                    </ul>
                  </nav>
                </div>
              </header>

              <div className="container">
                <h2 style={{ textAlign: "center" }}>Sistem Tiket Kereta Api</h2>
                <form className="ticket-form" onSubmit={handleCalculate}>
                  <div className="form-group">
                    <label>Stasiun Asal:</label>
                    <input
                      type="text"
                      value={stasiunAsal}
                      onChange={(e) => setStasiunAsal(e.target.value)}
                      placeholder="Masukkan stasiun asal"
                      aria-label="Stasiun Asal"
                    />
                  </div>
                  <div className="form-group">
                    <label>Stasiun Tujuan:</label>
                    <input
                      type="text"
                      value={stasiunTujuan}
                      onChange={(e) => setStasiunTujuan(e.target.value)}
                      placeholder="Masukkan stasiun tujuan"
                      aria-label="Stasiun Tujuan"
                    />
                  </div>
                  <div className="form-group">
                    <label>Tanggal Keberangkatan:</label>
                    <input
                      type="date"
                      value={tanggalBerangkat}
                      onChange={(e) => setTanggalBerangkat(e.target.value)}
                      aria-label="Tanggal Keberangkatan"
                    />
                  </div>
                  <div className="form-group">
                    <label>Kelas:</label>
                    <select
                      value={kelas}
                      onChange={(e) => setKelas(e.target.value)}
                    >
                      <option value="">Pilih Kelas</option>
                      <option value="ekonomi">Ekonomi - Rp.15.000</option>
                      <option value="bisnis">Bisnis - Rp.80.000</option>
                      <option value="eksekutif">Eksekutif - Rp.110.000</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Jumlah Penumpang:</label>
                    <input
                      type="number"
                      value={jumlahPenumpang}
                      onChange={(e) =>
                        setJumlahPenumpang(Number(e.target.value))
                      }
                      placeholder="Masukkan jumlah penumpang"
                      aria-label="Jumlah Penumpang"
                    />
                  </div>
                  <div className="form-group">
                    <label>Uang Bayar:</label>
                    <input
                      type="number"
                      value={uangBayar}
                      onChange={(e) => setUangBayar(Number(e.target.value))}
                      placeholder="Masukkan jumlah uang bayar"
                      aria-label="Uang Bayar"
                    />
                    <label>Kode Diskon (opsional):</label>
                    <input
                      type="text"
                      value={kodeDiskon}
                      onChange={(e) => setKodeDiskon(e.target.value)}
                      placeholder="Masukkan kode diskon jika ada"
                      aria-label="Kode Diskon"
                    />
                  </div>
                  <button type="submit">Hitung</button>
                </form>

                {/* Tampilkan tabel pesanan jika ada */}
                {orders.length > 0 && (
                  <div className="orders-table">
                    <h3>Daftar Pesanan Sebelumnya</h3>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Stasiun Asal</th>
                          <th>Stasiun Tujuan</th>
                          <th>Tanggal Keberangkatan</th>
                          <th>Kelas</th>
                          <th>Jumlah Penumpang</th>
                          <th>Total Bayar</th>
                          <th>Diskon</th>
                          <th>Uang Bayar</th>
                          <th>Uang Kembali</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.stasiunAsal}</td>
                            <td>{order.stasiunTujuan}</td>
                            <td>{order.tanggalBerangkat}</td>
                            <td>{order.kelas}</td>
                            <td>{order.jumlahPenumpang}</td>
                            <td>Rp. {order.totalBayar.toLocaleString()}</td>
                            <td>Rp. {order.diskon.toLocaleString()}</td>
                            <td>Rp. {order.uangBayar.toLocaleString()}</td>
                            <td>Rp. {order.uangKembali.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
