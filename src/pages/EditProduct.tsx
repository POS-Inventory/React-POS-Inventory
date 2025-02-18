/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch } from "../app/store";
import { getMe } from "../features/authSlice";

const EditProduct = () => {
  const [codeProduct, setCodeProduct] = useState("");
  const [nama, setNama] = useState("");
  const [description, setDescription] = useState("");
  const [hargaModal, setHargaModal] = useState("");
  const [hargaJual, setHargaJual] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
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
    setStock(response.data.stock);
    setCategory(response.data.category);
    setPreview(response.data.url);
  };

  const updateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("codeProduct", codeProduct);
    formData.append("nama", nama);
    formData.append("description", description);
    formData.append("hargaModal", hargaModal);
    formData.append("hargaJual", hargaJual);
    formData.append("stock", stock);
    formData.append("category", category);
    if (file) {
      formData.append("file", file);
    }

    Array.from(formData.entries()).forEach(([key, value]) => {
      console.log(key, value);
    });

    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `http://localhost:5000/product/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      navigate("/products");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data); // Log detailed error response
      } else {
        console.log(error);
      }
    }
  };

  const loadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file); // Correct the typing here
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Tambah Produk</h1>
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
          <form onSubmit={updateProduct}>
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
                            required
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
                            required
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
                            required
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
                          <select
                            name="course"
                            id="course"
                            style={{
                              fontSize: 16,
                              border: "none",
                              outline: "none",
                              width: "100%",
                            }}
                            required
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                          >
                            <option value="Pupuk">Pupuk</option>
                            <option value="Pestisida">Pestisida</option>
                            <option value="Bibit">Bibit</option>
                            <option value="Alat Pertanian">
                              Alat Pertanian
                            </option>
                          </select>
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
                            required
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
                            required
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
                            required
                            value={hargaJual}
                            onChange={(e) => setHargaJual(e.target.value)}
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
                      Upload Image
                    </label>
                    <div className="control">
                      <div className="file">
                        <input type="file" onChange={loadImage} />
                      </div>
                    </div>
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
              <div className="card-footer">
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </div>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default EditProduct;
