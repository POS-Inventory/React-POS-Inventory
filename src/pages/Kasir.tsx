/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, KeyboardEvent } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../app/store";
import { getMe } from "../features/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import "../assets/css/style.css";

interface Product {
  idProduct: string;
  codeProduct: string;
  nama: string;
  description: string;
  hargaModal: string;
  hargaJual: string;
  untungBersih: string;
  stock: number;
  category: string;
  url: string;
}

interface CartItem extends Product {
  quantity: number;
}

const Kasir = () => {
  const [products, setProduct] = useState<Product[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentAmount, setPaymentAmount] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getProduct();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const getProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/product", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const searchCode = searchInput.trim();
      const foundProduct = products.find(
        (product) => product.codeProduct === searchCode
      );

      if (foundProduct) {
        addToCart(foundProduct);
        setSearchInput(""); // Clear input after adding to cart
      } else {
        alert("Produk tidak ditemukan!");
      }
    }
  };

  const addToCart = (product: Product) => {
    // Check if product already exists in cart
    const existingItemIndex = cartItems.findIndex(
      (item) => item.idProduct === product.idProduct
    );

    if (existingItemIndex >= 0) {
      // If product exists, increase quantity
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += 1;
      setCartItems(updatedCart);
    } else {
      // If product doesn't exist, add it with quantity 1
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const totalPrice = cartItems.reduce((total, item) => {
    return total + Number(item.hargaJual) * item.quantity;
  }, 0);

  const calculateChange = () => {
    const payment = parseFloat(paymentAmount) || 0;
    const change = payment - totalPrice;
    return change >= 0 ? change : 0;
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPaymentAmount(value);
  };

  return (
    <div>
      <main id="main" className="main">
        <div
          className="pagetitle"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <div>
            <h1>Kasir</h1>
            <nav>
              <ol className="breadcrumb" style={{ margin: 0 }}>
                <li className="breadcrumb-item">
                  <a href="/dashboard">Beranda</a>
                </li>
                <li className="breadcrumb-item active">Kasir</li>
              </ol>
            </nav>
          </div>

          {/* Field untuk Input Code Barang */}
          <div
            className="position-relative"
            style={{ width: "400px", marginLeft: "100px" }}
          >
            <div className="input-group shadow-sm">
              <input
                type="text"
                className="form-control border-0 ps-4 pe-5 rounded-3"
                placeholder="Search code product or any order..."
                style={{
                  height: "48px",
                  fontSize: "14px",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                }}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearch}
              />
              <span
                className="position-absolute"
                style={{
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 4,
                  color: "#6C757D",
                }}
              >
                <FontAwesomeIcon icon={faSearch} />
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4" style={{ display: "flex", gap: "24px" }}>
          {/* Product Grid Section - 70% width */}
          <div style={{ width: "70%" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "20px",
              }}
            >
              {products.map((product) => (
                <div
                  key={product.idProduct}
                  className="card-body card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <img
                      style={{
                        width: "84px",
                        height: "84px",
                        borderRadius: "8px",
                      }}
                      src={product.url}
                      alt=""
                    />
                    <div
                      style={{
                        flex: "1",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <div
                        className="mt-3"
                        style={{
                          color: "#232321",
                          fontSize: "16px",
                          fontWeight: "600",
                          wordWrap: "break-word",
                        }}
                      >
                        {product.category}
                      </div>
                      <div
                        style={{
                          opacity: "0.6",
                          color: "black",
                          fontSize: "14px",
                          fontWeight: "600",
                          wordWrap: "break-word",
                        }}
                      >
                        {product.nama}
                      </div>

                      <div
                        style={{
                          color: "#232321",
                          fontSize: "14px",
                          fontWeight: "600",
                          wordWrap: "break-word",
                        }}
                      >
                        {`Rp. ${Number(product.hargaJual).toLocaleString(
                          "id-ID"
                        )}`}
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: 1, marginBottom: "10px" }}>
                    <div
                      style={{
                        color: "#232321",
                        fontSize: "16px",
                        fontWeight: "600",
                        wordWrap: "break-word",
                      }}
                    >
                      Deskripsi
                    </div>
                    <div
                      style={{
                        opacity: "0.6",
                        color: "#232321",
                        fontSize: "14px",
                        fontWeight: "400",
                        wordWrap: "break-word",
                      }}
                    >
                      {product.description}
                    </div>
                  </div>
                  <div>
                    <button
                      className="btn btn-outline-success w-100 py-2 mt-auto"
                      onClick={() => addToCart(product)}
                    >
                      Tambahkan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Section - 30% width */}
          <div className="col-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Transaksi</h5>

                {/* Transaction Items */}
                <div
                  className="transaction-items overflow-auto"
                  style={{ maxHeight: "400px" }}
                >
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-light rounded mb-3 p-3 border-bottom"
                    >
                      <div className="d-flex">
                        <div
                          className="me-3"
                          style={{ width: "60px", height: "60px" }}
                        >
                          <img
                            src={item.url}
                            alt={item.nama}
                            className="img-fluid rounded w-100 h-100 object-fit-cover"
                          />
                        </div>

                        <div className="flex-grow-1">
                          <div className="fw-semibold fs-6">{item.nama}</div>
                          <div className="d-flex justify-content-between align-items-center mt-2">
                            <div>
                              <div className="fw-semibold">
                                {`Rp.${Number(item.hargaJual).toLocaleString(
                                  "id-ID"
                                )}`}
                              </div>
                            </div>
                            <div className="d-flex align-items-center">
                              <div className="me-3 fw-medium">QUANTITY</div>
                              <div className="fw-bold fs-5">
                                {item.quantity}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Section */}
                {cartItems.length > 0 && (
                  <div className="mt-4">
                    <div className="d-flex justify-content-between py-3 border-top border-bottom border-2 mb-4">
                      <div className="fw-bold fs-5">Total</div>
                      <div className="fw-bold fs-5">
                        {`Rp.${totalPrice.toLocaleString("id-ID")}`}
                      </div>
                    </div>

                    {/* Payment Input Section */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Uang yang Dibayarkan
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">Rp.</span>
                        <input
                          type="text"
                          className="form-control py-3"
                          value={paymentAmount}
                          onChange={handlePaymentChange}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Change Section */}
                    <div className="mb-4">
                      <div className="d-flex justify-content-between py-3 border-top border-bottom">
                        <div className="fw-bold">Kembalian</div>
                        <div className="fw-bold">
                          {`Rp.${calculateChange().toLocaleString("id-ID")}`}
                        </div>
                      </div>
                    </div>

                    <button className="btn btn-primary w-100 py-3 fw-semibold">
                      Bayar dan Cetak Struk
                    </button>
                  </div>
                )}

                {cartItems.length === 0 && (
                  <div
                    className="d-flex flex-column align-items-center justify-content-center text-center"
                    style={{ height: "300px" }}
                  >
                    <div className="text-muted fs-5 mb-2">
                      Keranjang masih kosong
                    </div>
                    <div className="text-secondary fs-6">
                      Tambahkan produk dengan mengklik tombol "Tambahkan" atau
                      "Scan Kode Produk"
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Kasir;
