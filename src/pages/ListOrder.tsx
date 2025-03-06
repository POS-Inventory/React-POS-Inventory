/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../app/store";
import { getMe } from "../features/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

import "../assets/css/style.css";

interface Order {
  idOrder: string;
  codeOrder: string;
  cart: {
    total: number;
  };
  createdAt: string;
}

const ListOrder = () => {
  const [orders, setOrder] = useState<Order[]>([]);
  const [currentPageOrder, setCurrentPageOrder] = useState<number>(1);
  const orderPerPage = 10;

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getOrder();
    } else {
      navigate("/");
    }
  }, [navigate]);

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
      setOrder(sortedData);
    } catch (error: any) {
      console.error("Error fetching data:", error);
    }
  };

  const handleToOrderId = async (
    idOrder: string | number
  ): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/order/${idOrder}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.idOrder);
      getOrder();
      navigate(`/order/${idOrder}`);
    } catch (error) {
      console.error("Error deleting Order:", error);
    }
  };

  const indexOfLastOrder = currentPageOrder * orderPerPage;
  const indexOfFirstOrder = indexOfLastOrder - orderPerPage;
  const currentOrder = orders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPagesOrder = Math.ceil(orders.length / orderPerPage);

  const paginateOrder = (pageNumber: number) => {
    setCurrentPageOrder(pageNumber);
  };

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
        <div
          className="pagetitle"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1>Semua Order</h1>
            <nav>
              <ol className="breadcrumb" style={{ margin: 0 }}>
                <li className="breadcrumb-item">
                  <a href="/dashboard">Beranda</a>
                </li>
                <li className="breadcrumb-item active">Semua Order</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* tabel barang dalam kg */}
        <table id="table-id" className="table datatable printable">
          <thead>
            <tr>
              <th>No</th>
              <th>ID Order</th>
              <th>Tanggal</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentOrder.map((order, index) => (
              <tr key={order.idOrder}>
                <td>{index + 1}</td>
                <td>{order.codeOrder}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>{formatCurrency(order.cart.total)}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-success btn-sm"
                    onClick={() => handleToOrderId(order.idOrder)}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Order KG Navigation */}
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className={`page-item ${currentPageOrder === 1 && "disabled"}`}>
              <button
                className="page-link"
                onClick={() => currentPageOrder > 1 && paginateOrder(currentPageOrder - 1)}
              >
                Previous
              </button>
            </li>
            {Array.from({ length: totalPagesOrder }, (_, index) => (
              <li
                key={index + 1}
                className={`page-item ${
                  currentPageOrder === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => paginateOrder(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPageOrder === totalPagesOrder && "disabled"
              }`}
            >
              <button
                className="page-link"
                onClick={() =>
                  currentPageOrder < totalPagesOrder && paginateOrder(currentPageOrder + 1)
                }
              >
                Next
              </button>
            </li>
          </ul>
        </nav>

      </main>
    </div>
  );
};

export default ListOrder;
