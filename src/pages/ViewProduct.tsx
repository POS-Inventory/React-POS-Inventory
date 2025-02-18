/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch } from "../app/store";
import { getMe } from "../features/authSlice";

const ViewProduct: React.FC = () => {
  const [codeProduct, setCodeProduct] = useState("");
  const [nama, setNama] = useState("");
  const [description, setDescription] = useState("");
  const [hargaModal, setHargaModal] = useState("");
  const [hargaJual, setHargaJual] = useState("");
  const [untungBersih, setUntungBersih] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getProductById();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const getProductById = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`http://localhost:5000/product/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setCodeProduct(response.data.codeProduct);
    setNama(response.data.nama);
    setDescription(response.data.description);
    setHargaModal(response.data.hargaModal);
    setHargaJual(response.data.hargaJual);
    setUntungBersih(response.data.untungBersih);
    setStock(response.data.stock);
    setCategory(response.data.category);
    setPreview(response.data.url);
  };

  return (
    <div>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Detail Produk</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="index.html">Beranda</a>
              </li>
              <li className="breadcrumb-item">Semua Produk</li>
              <li className="breadcrumb-item active">Detail Produk</li>
            </ol>
          </nav>
        </div>
        <section className="section">
          <form>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-8">
                    <label
                      className="card-title"
                      style={{ fontWeight: "bolder", color: "black" }}
                    >
                      Kode Produk
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
                            placeholder="Type product code here"
                            readOnly
                            value={codeProduct}
                            onChange={(e) => setCodeProduct(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

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
                            readOnly
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
                      Deskripsi
                    </label>
                    <div
                      style={{
                        alignSelf: "stretch",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        gap: 8,
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          alignSelf: "stretch",
                          flexDirection: "column",
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                          gap: 4,
                          display: "flex",
                        }}
                      >
                        <div
                          style={{
                            alignSelf: "stretch",
                            paddingLeft: 16,
                            paddingTop: 10,
                            borderRadius: 8,
                            border: "1px solid",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            display: "inline-flex",
                          }}
                        >
                          <textarea
                            style={{
                              fontSize: 16,
                              border: "none",
                              outline: "none",
                              resize: "none",
                              height: "120px",
                              width: "100%",
                            }}
                            placeholder="Type description here"
                            readOnly
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <label
                      className="card-title"
                      style={{ fontWeight: "bolder", color: "black" }}
                    >
                      Kategori
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
                            gap: 8,
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
                            readOnly
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <label
                      className="card-title"
                      style={{ fontWeight: "bolder", color: "black" }}
                    >
                      Stok
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
                            readOnly
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
                            readOnly
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
                            readOnly
                            value={hargaJual}
                            onChange={(e) => setHargaJual(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <label
                      className="card-title"
                      style={{ fontWeight: "bolder", color: "black" }}
                    >
                      Untung Bersih
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
                            readOnly
                            value={untungBersih}
                            onChange={(e) => setUntungBersih(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <label
                      className="card-title"
                      style={{ fontWeight: "bolder", color: "black" }}
                    >
                      Preview
                    </label>
                    {preview ? (
                      <figure>
                        <img
                          src={preview}
                          style={{ width: "100%" }}
                          alt="Preview Image"
                        />
                      </figure>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default ViewProduct;
