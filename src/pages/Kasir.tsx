/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../app/store";
import { getMe } from "../features/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch
} from "@fortawesome/free-solid-svg-icons";

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

const Kasir = () => {
  const [products, setProduct] = useState<Product[]>([]);

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
                  <a href="index.html">Beranda</a>
                </li>
                <li className="breadcrumb-item active">Kasir</li>
              </ol>
            </nav>
          </div>

          {/* Field untuk Input Code Barang */}
          <div className="position-relative" style={{ width: "400px", marginLeft: "100px" }}>
            <div className="input-group shadow-sm">
              <input
                type="text"
                className="form-control border-0 ps-4 pe-5 rounded-3"
                placeholder="Search code product or any order..."
                style={{ 
                  height: "48px",
                  fontSize: "14px",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)"
                }}
              />
              <span 
                className="position-absolute"
                style={{
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 4,
                  color: "#6C757D"
                }}
              >
                <FontAwesomeIcon icon={faSearch} />
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "24px",
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
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <img
                  style={{ width: "84px", height: "84px", borderRadius: "8px" }}
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
                    {product.hargaJual}
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
                <button className="btn btn-outline-success w-100 py-2 mt-auto">
                  Tambahkan
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Kasir;
