/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../app/store";
import { getMe } from "../features/authSlice";

const AddDiskon = () => {
  const [namaDiskon, setNamaDiskon] = useState("");
  const [persentaseDiskon, setPersentaseDiskon] = useState("");
  const [tanggalBerakhir, setTanggalBerakhir] = useState("");

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

  const saveDiskon = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("namaDiskon", namaDiskon);
    formData.append("persentaseDiskon", persentaseDiskon);
    formData.append("tanggalBerakhir", tanggalBerakhir);

    const jsonData: Record<string, any> = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/diskon",
        jsonData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response dari Server:", response);
      navigate("/diskon");
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
          <h1>Tambah Diskon</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/dashboard">Beranda</a>
              </li>
              <li className="breadcrumb-item">
                <a href="/diskon">Semua Diskon</a>
              </li>
              <li className="breadcrumb-item active">Tambah Diskon Baru</li>
            </ol>
          </nav>
        </div>
        <section className="section">
          <form onSubmit={saveDiskon}>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-12">
                    <label
                      className="card-title"
                      style={{ fontWeight: "bolder", color: "black" }}
                    >
                      Nama Diskon
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
                            placeholder="Type name of discount here"
                            value={namaDiskon}
                            onChange={(e) => setNamaDiskon(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <label
                      className="card-title"
                      style={{ fontWeight: "bolder", color: "black" }}
                    >
                      Jumlah Diskon %
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
                            type="number"
                            style={{
                              fontSize: 16,
                              border: "none",
                              outline: "none",
                              width: "100%",
                            }}
                            placeholder="1258"
                            value={persentaseDiskon}
                            onChange={(e) =>
                              setPersentaseDiskon(e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <label
                      className="card-title"
                      style={{ fontWeight: "bolder", color: "black" }}
                    >
                      Tanggal Berakhir
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
                            type="date"
                            style={{
                              fontSize: 16,
                              border: "none",
                              outline: "none",
                              width: "11%",
                            }}
                            placeholder="Tanggal"
                            value={tanggalBerakhir}
                            onChange={(e) => setTanggalBerakhir(e.target.value)}
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

export default AddDiskon;
