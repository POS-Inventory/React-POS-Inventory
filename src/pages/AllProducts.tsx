/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../app/store";
import { getMe } from "../features/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faChevronDown,
  faBorderAll,
} from "@fortawesome/free-solid-svg-icons";

import "../assets/css/style.css";
import album from "../assets/img/album.svg";
import order from "../assets/img/order.svg";

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

const AllProducts = () => {
  const [products, setProduct] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [countPestisida, setCountPestisida] = useState(0);
  const [countPupuk, setCountPupuk] = useState(0);
  const [countBibit, setCountBibit] = useState(0);
  const [countAlatPertanian, setCountAlatPertanian] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [idProduct, setIdProduct] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getProduct();
      getCountPestisida();
      getCountPupuk();
      getCountBibit();
      getCountAlatPertanian();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const toAddProduct = () => {
    navigate("/product/add");
  };

  const handleToEditProduct = async (
    idProduct: string | number
  ): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      await axios.get(`http://localhost:5000/product/${idProduct}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getProduct();
      navigate(`/product/edit/${idProduct}`);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleToProductId = async (idProduct: string | number): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/product/${idProduct}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIdProduct(response.data.idProduct);
      getProduct();
      navigate(`/product/view/${idProduct}`);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const getProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/product", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProduct(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filterProductsByCategory = (category: string) => {
    setSelectedCategory(category);
    if (category) {
      setFilteredProducts(products.filter((product) => product.category === category));
    } else {
      setFilteredProducts(products); // Show all products if no category is selected
    }
  };

  const getCountPestisida = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<Product[]>("http://localhost:5000/product", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const categoryCountPestisida = response.data.filter(
        (product) => product.category === "Pestisida"
      ).length;
      
      setCountPestisida(categoryCountPestisida);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getCountPupuk = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<Product[]>("http://localhost:5000/product", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const categoryCountPupuk = response.data.filter(
        (product) => product.category === "Pupuk"
      ).length;
      
      setCountPupuk(categoryCountPupuk);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getCountBibit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<Product[]>("http://localhost:5000/product", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const categoryCountBibit = response.data.filter(
        (product) => product.category === "Bibit"
      ).length;
      
      setCountBibit(categoryCountBibit);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getCountAlatPertanian = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<Product[]>("http://localhost:5000/product", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const categoryCountAlatPertanian = response.data.filter(
        (product) => product.category === "Alat Pertanian"
      ).length;
      
      setCountAlatPertanian(categoryCountAlatPertanian);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteProduct = async (
    idProduct: string | number
  ): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/product/${idProduct}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getProduct(); 
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div>
      <aside id="sidebar" className="sidebar">
        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            <a className="nav-link collapsed" href="/dashboard">
              <FontAwesomeIcon className="me-2" icon={faBorderAll} />
              <span>DASHBOARD</span>
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link collapsed" href="/products">
              <img className="me-2" src={album} alt="" />
              <span>Semua Produk</span>
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link collapsed" href="/order-list">
              <img className="me-2" src={order} alt="" />
              <span>History Penjualan</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link collapsed" href="/order-list">
              <img className="me-2" src={order} alt="" />
              <span>Laporan</span>
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link collapsed"
              data-bs-target="#forms-nav"
              data-bs-toggle="collapse"
              href="/"
            >
              <span>Kategori</span>
              <FontAwesomeIcon className="ms-auto" icon={faChevronDown} />
            </a>

            <ul
              id="forms-nav"
              className="nav-content collapse"
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <a
                  href="#"
                  className="d-flex justify-content-between align-items-center"
                  onClick={() => filterProductsByCategory('Pestisida')}
                >
                  <span>Pestisida</span>
                  <div
                    className="btn btn-sm"
                    style={{ backgroundColor: "#E7E7E3" }}
                  >
                    {countPestisida}
                  </div>
                </a>
              </li>

              <li>
                <a
                  className="d-flex justify-content-between align-items-center"
                  href="#" onClick={() => filterProductsByCategory('Pupuk')}
                >
                  <span>Pupuk</span>
                  <div
                    className="btn btn-sm"
                    style={{ backgroundColor: "#E7E7E3" }}
                  >
                    {countPupuk}
                  </div>
                </a>
              </li>

              <li>
                <a
                  className="d-flex justify-content-between align-items-center"
                  href="#" onClick={() => filterProductsByCategory('Bibit')}
                >
                  <span>Bibit</span>
                  <div
                    className="btn btn-sm"
                    style={{ backgroundColor: "#E7E7E3" }}
                  >
                    {countBibit}
                  </div>
                </a>
              </li>

              <li>
                <a
                  className="d-flex justify-content-between align-items-center"
                  href="#" onClick={() => filterProductsByCategory('Alat Pertanian')}
                >
                  <span>Alat Pertanian</span>
                  <div
                    className="btn btn-sm"
                    style={{ backgroundColor: "#E7E7E3" }}
                  >
                    {countAlatPertanian}
                  </div>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </aside>

      <main id="main" className="main">
        <div
          className="pagetitle"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1>Semua Produk</h1>
            <nav>
              <ol className="breadcrumb" style={{ margin: 0 }}>
                <li className="breadcrumb-item">
                  <a href="/dashboard">Beranda</a>
                </li>
                <li className="breadcrumb-item active">Semua Produk</li>
              </ol>
            </nav>
          </div>
          <button
            className="btn"
            style={{ backgroundColor: "black", color: "white" }}
            onClick={toAddProduct}
          >
            <FontAwesomeIcon className="me-2" icon={faCirclePlus} />
            <span>Tambah Produk Baru</span>
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "24px",
          }}
        >
          {filteredProducts.map((product) => (
            <div key={product.idProduct} className="card-body card">
              <nav
                className="header-nav"
                style={{ position: "absolute", top: "16px", right: "16px" }}
              >
                <ul className="d-flex align-items-center">
                  <li className="nav-item dropdown pe-3">
                    <button
                      className="nav-link nav-profile d-flex align-items-center pe-0"
                      data-bs-toggle="dropdown"
                    >
                      <span
                        className="d-none d-md-block dropdown-toggle ps-2"
                        style={{ color: "black" }}
                      >
                        ...
                      </span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                      <li>
                        <button
                          onClick={() => handleToProductId(product.idProduct)}
                          className="dropdown-item text-primary"
                        >
                          View
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleToEditProduct(product.idProduct)}
                          className="dropdown-item text-primary"
                        >
                          Edit
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleDeleteProduct(product.idProduct)}
                          className="dropdown-item text-danger"
                        >
                          Hapus
                        </button>
                      </li>
                    </ul>
                  </li>
                </ul>
              </nav>
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
                    {`Rp. ${Number(product.hargaJual).toLocaleString('id-ID')}`}
                  </div>
                </div>
              </div>
              <div
                style={{
                  color: "#232321",
                  fontSize: "16px",
                  fontWeight: "600",
                  wordWrap: "break-word",
                }}
              >
                Summary
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    opacity: "0.8",
                    color: "#232321",
                    fontSize: "14px",
                    fontWeight: "600",
                    wordWrap: "break-word",
                  }}
                >
                  Sisa produk
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "52px",
                      height: "4px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: "52px",
                        height: "4px",
                        left: "0",
                        top: "0",
                        position: "absolute",
                        background: "#E7E7E3",
                        borderRadius: "8px",
                      }}
                    />
                    <div
                      style={{
                        width: "30px",
                        height: "4px",
                        left: "0",
                        top: "0",
                        position: "absolute",
                        background: "#FFA52F",
                        borderRadius: "8px",
                      }}
                    />
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
                    {product.stock}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AllProducts;
