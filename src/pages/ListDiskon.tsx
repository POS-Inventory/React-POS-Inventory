/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../app/store";
import { getMe } from "../features/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import "../assets/css/style.css";

interface Diskon {
  idDiskon: string;
  namaDiskon: string;
  persentaseDiskon: string;
  tanggalBerakhir: string;
  status: boolean;
  createdAt: string;
}

const ListDiskon = () => {
  const [diskon, setDiskon] = useState<Diskon[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getDiskon();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const toAddDiskon = () => {
    navigate("/diskon/add");
  };

  const getDiskon = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/diskon", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDiskon(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteDiskon = async (
    idDiskon: string | number
  ): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/diskon/${idDiskon}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getDiskon();
    } catch (error) {
      console.error("Error deleting Diskon:", error);
    }
  };

  const formatPersentase = (persentase: string): string => {
    return `${parseFloat(persentase).toFixed(1)}%`; // Mengonversi ke angka dan menambahkan simbol %
  };

  const formatDate = (dateString: string): string => {
    return moment(dateString).format("DD/MM/YYYY"); // Menggunakan format DD/MM/YYYY
  };

  const statusClass = (status: boolean): string => {
    return status ? "bg-success text-white" : "bg-danger text-white"; // Success untuk Active, Danger untuk Inactive
  };

  return (
    <div>
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
            <h1>Semua Diskon</h1>
            <nav>
              <ol className="breadcrumb" style={{ margin: 0 }}>
                <li className="breadcrumb-item">
                  <a href="/dashboard">Beranda</a>
                </li>
                <li className="breadcrumb-item active">Semua Diskon</li>
              </ol>
            </nav>
          </div>
          <button
            className="btn"
            style={{ backgroundColor: "black", color: "white" }}
            onClick={toAddDiskon}
          >
            <FontAwesomeIcon className="me-2" icon={faCirclePlus} />
            <span>Tambah Diskon Baru</span>
          </button>
        </div>

        {/* tabel barang dalam kg */}
        <table id="table-id" className="table datatable printable">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Diskon</th>
              <th>Persentase</th>
              <th>Tanggal Mulai</th>
              <th>Tanggal Berakhir</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {diskon.map((diskon, index) => (
              <tr key={diskon.idDiskon}>
                <td>{index + 1}</td>
                <td>{diskon.namaDiskon}</td>
                <td>{formatPersentase(diskon.persentaseDiskon)}</td>
                <td>{formatDate(diskon.createdAt)}</td>
                <td>{formatDate(diskon.tanggalBerakhir)}</td>
                <td>
                  <div
                    className={`p-1 rounded ${statusClass(diskon.status)}`}
                  >
                    {diskon.status ? "Active" : "Inactive"}
                  </div>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteDiskon(diskon.idDiskon)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default ListDiskon;
