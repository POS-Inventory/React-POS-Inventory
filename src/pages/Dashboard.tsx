import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../app/store";
import { getMe } from "../features/authSlice";
import bag from "../assets/img/bag.svg";
import moment from "moment";

interface Order {
  idOrder: string;
  codeOrder: string;
  createdAt: string;
  cart: {
    total: number;
  };
}

interface Product {
  idProduct: string;
  codeProduct: string;
  nama: string;
  category: string;
  stock: number;
}

interface Barang {
  idBarang: string;
  nama: string;
  stock: number;
}

const Dashboard = () => {
  const [orders, setOrder] = useState<Order[]>([]);
  const [products, setProduct] = useState<Product[]>([]);
  const [barangs, setBarang] = useState<Barang[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("berhasil");
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    getOrder();
    getProduct();
    getBarang();
  }, []);

  const getOrder = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await axios.get<Order[]>("http://localhost:5000/order", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const sortedData: Order[] = response.data.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      const totalPaymentAmount = sortedData.reduce((total, order) => {
        return total + order.cart.total;
      }, 0);

      setTotalPayment(totalPaymentAmount);
      setOrder(sortedData);
      setTotalOrders(sortedData.length);

      console.log(sortedData);
    } catch (error: any) {
      console.error("Error fetching data:", error);
    }
  };

  const getProduct = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await axios.get<Product[]>(
        "http://localhost:5000/product",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const filteredProducts = response.data.filter(
        (product) => product.stock === 20
      );
      setProduct(filteredProducts);
      console.log(filteredProducts);
    } catch (error: any) {
      console.error("Error fetching data:", error);
    }
  };

  const getBarang = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await axios.get<Barang[]>(
        "http://localhost:5000/barang",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const filteredBarangs = response.data.filter(
        (product) => product.stock <= 20000
      );
      setBarang(filteredBarangs);
      console.log(filteredBarangs);
    } catch (error: any) {
      console.error("Error fetching data:", error);
    }
  };

  // Fungsi untuk memformat angka sebagai mata uang IDR
  const formatCurrency = (number: string | number) => {
    // Konversi string ke number
    const num = typeof number === "string" ? parseFloat(number) : number;

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (dateString: string): string => {
    return moment(dateString).format("DD/MM/YYYY"); // Menggunakan format DD/MM/YYYY
  };

  return (
    <div>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Dashboard</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/dashboard">Home</a>
              </li>
              <li className="breadcrumb-item active">Dashboard</li>
            </ol>
          </nav>
        </div>

        <section className="section dashboard">
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div className="card info-card">
                  <div className="card-body">
                    <h5 className="card-title" style={{ fontWeight: "bold" }}>
                      Total Pesanan
                    </h5>

                    <div className="d-flex align-items-center">
                      <div
                        className="card-icon d-flex align-items-center justify-content-center"
                        style={{
                          backgroundColor: "#003f62",
                          borderRadius: "10px",
                        }}
                      >
                        {/* <FontAwesomeIcon icon={faShip} /> */}
                        <img
                          src={bag}
                          alt=""
                          style={{ width: "30px", height: "30px" }}
                        />
                      </div>
                      <div className="ps-3">
                        <h6>{formatCurrency(totalPayment)}</h6>
                        <h6 style={{ fontSize: "1.4em" }}>{totalOrders}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5
                    className="card-title"
                    style={{ fontWeight: "bolder", color: "black" }}
                  >
                    Penjualan Terakhir
                  </h5>

                  <table id="table-id" className="table datatable printable">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Order ID</th>
                        <th>Tanggal</th>
                        <th>Harga</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order, index) => (
                        <tr key={order.idOrder}>
                          <td>{index + 1}</td>
                          <td>{order.codeOrder}</td>
                          <td>{formatDate(order.createdAt)}</td>
                          <td>{formatCurrency(order.cart.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="pagetitle">
          <h1>Peringatan Stock Sedikit</h1>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5
                    className="card-title"
                    style={{ fontWeight: "bolder", color: "black" }}
                  >
                    Produk
                  </h5>

                  <table id="table-id" className="table datatable printable">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Nama Produk</th>
                        <th>Kategori</th>
                        <th>Sisa Stok</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center">
                            Stock masih banyak
                          </td>
                        </tr>
                      ) : (
                        products.map((product, index) => (
                          <tr key={product.idProduct}>
                            <td>{index + 1}</td>
                            <td>{product.nama}</td>
                            <td>{product.category}</td>
                            <td>{product.stock}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  <h5
                    className="card-title"
                    style={{ fontWeight: "bolder", color: "black" }}
                  >
                    Produk /Kg
                  </h5>

                  <table id="table-id" className="table datatable printable">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Nama Produk</th>
                        <th>Sisa Stok</th>
                      </tr>
                    </thead>
                    <tbody>
                      {barangs.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="text-center">
                            Stock masih banyak
                          </td>
                        </tr>
                      ) : (
                        barangs.map((barang, index) => (
                          <tr key={barang.idBarang}>
                            <td>{index + 1}</td>
                            <td>{barang.nama}</td>
                            <td>{barang.stock}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
