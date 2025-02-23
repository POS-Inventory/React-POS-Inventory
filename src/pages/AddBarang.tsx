/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../app/store";
import { getMe } from "../features/authSlice";

const AddBarang = () => {
  const [nama, setNama] = useState("");
  const [hargaModal, setHargaModal] = useState("");
  const [hargaJual, setHargaJual] = useState("");
  const [stock, setStock] = useState("");

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

  const saveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("hargaModal", hargaModal);
    formData.append("hargaJual", hargaJual);
    formData.append("stock", stock);

    const jsonData: Record<string, any> = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/barang",
        jsonData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response dari Server:", response);
      navigate("/products");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data); // Log detailed error response
      } else {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Tambah Produk dalam per KG</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/dashboard">Beranda</a>
              </li>
              <li className="breadcrumb-item">Semua Produk</li>
              <li className="breadcrumb-item active">Tambah Produk Baru</li>
            </ol>
          </nav>
        </div>
        <section className="section">
          <form onSubmit={saveProduct}>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-12">
                    <label
                      className="card-title"
                      style={{ fontWeight: "bolder", color: "black" }}
                    >
                      Nama Produk
                    </label>
                    <div
                      style={{
                        height: 48,
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          height: 48,
                          flexDirection: "column",
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                          display: "flex",
                        }}
                      >
                        <div
                          style={{
                            alignSelf: "stretch",
                            height: 48,
                            paddingLeft: 16,
                            borderRadius: 8,
                            border: "1px solid",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            display: "inline-flex",
                          }}
                        >
                          <input
                            type="text"
                            style={{
                              fontSize: 16,
                              border: "none",
                              outline: "none",
                              width: "100%",
                            }}
                            placeholder="Type name here"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <label
                      className="card-title"
                      style={{ fontWeight: "bolder", color: "black" }}
                    >
                      Stok (gram)
                    </label>
                    <div
                      style={{
                        height: 48,
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          alignSelf: "stretch",
                          height: 48,
                          flexDirection: "column",
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                          display: "flex",
                        }}
                      >
                        <div
                          style={{
                            alignSelf: "stretch",
                            height: 48,
                            paddingLeft: 16,
                            borderRadius: 8,
                            border: "1px solid",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            display: "inline-flex",
                          }}
                        >
                          <input
                            type="text"
                            style={{
                              fontSize: 16,
                              border: "none",
                              outline: "none",
                              width: "100%",
                            }}
                            placeholder="1258"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <label
                      className="card-title"
                      style={{ fontWeight: "bolder", color: "black" }}
                    >
                      Harga Modal
                    </label>
                    <div
                      style={{
                        height: 48,
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          alignSelf: "stretch",
                          height: 48,
                          flexDirection: "column",
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                          display: "flex",
                        }}
                      >
                        <div
                          style={{
                            alignSelf: "stretch",
                            height: 48,
                            paddingLeft: 16,
                            borderRadius: 8,
                            border: "1px solid",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            display: "inline-flex",
                          }}
                        >
                          <input
                            type="text"
                            style={{
                              fontSize: 16,
                              border: "none",
                              outline: "none",
                              width: "100%",
                            }}
                            placeholder="1258"
                            value={hargaModal}
                            onChange={(e) => setHargaModal(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <label
                      className="card-title"
                      style={{ fontWeight: "bolder", color: "black" }}
                    >
                      Harga Jual
                    </label>
                    <div
                      style={{
                        height: 48,
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          alignSelf: "stretch",
                          height: 48,
                          flexDirection: "column",
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                          display: "flex",
                        }}
                      >
                        <div
                          style={{
                            alignSelf: "stretch",
                            height: 48,
                            paddingLeft: 16,
                            borderRadius: 8,
                            border: "1px solid",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            display: "inline-flex",
                          }}
                        >
                          <input
                            type="text"
                            style={{
                              fontSize: 16,
                              border: "none",
                              outline: "none",
                              width: "100%",
                            }}
                            placeholder="1258"
                            value={hargaJual}
                            onChange={(e) => setHargaJual(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AddBarang;
