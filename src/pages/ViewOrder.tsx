/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch } from "../app/store";
import { getMe } from "../features/authSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faPrint } from "@fortawesome/free-solid-svg-icons";

import "../styles/ViewOrder.css";

interface Product {
  codeProduct?: string;
  id?: number;
  type: string;
  namaBarang: string;
  harga: number;
  quantity: number;
  actualQuantity: number;
}

interface Cart {
  idCart: number;
  products: Product[];
  diskon: string;
  total: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  idOrder: number;
  codeOrder: string;
  jumlahDibayar: number;
  kembalian: number;
  idCart: number;
  cart: Cart;
}

const ViewOrder = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [codeOrder, setCodeOrder] = useState("");
  const [subTotal, setSubTotal] = useState(0);
  const [jumlahDibayar, setJumlahDibayar] = useState("");
  const [kembalian, setKembalian] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [orderDate, setOrderDate] = useState("");
  const [total, setTotal] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getOrderById();
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    calculateSubTotal();
  }, [products]);

  const calculateSubTotal = () => {
    const sum = products.reduce((acc, product) => {
      return acc + (product.harga * product.quantity);
    }, 0);
    setSubTotal(sum);
  };

  const getOrderById = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/order/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const orderData = response.data;
      setOrder(orderData);
      setCodeOrder(orderData.codeOrder);
      setJumlahDibayar(orderData.jumlahDibayar);
      setKembalian(orderData.kembalian);
      setProducts(orderData.cart.products);
      setTotal(orderData.cart.total);

      // Format the date from createdAt in the cart
      if (orderData.cart && orderData.cart.createdAt) {
        const date = new Date(orderData.cart.createdAt);
        setOrderDate(
          date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        );
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  const getProductId = (product: Product) => {
    return product.type === "product" ? product.codeProduct : product.id;
  }

  const formatCurrency = (number: string | number) => {
    // Konversi string ke number
    const num = typeof number === "string" ? parseFloat(number) : number;

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const handlePrintButtonClick = () => {
    window.print();
  };

  return (
    <div>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Order Details</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/dashboard">Home</a>
              </li>
              <li className="breadcrumb-item">
                <a href="/order">List Order</a>
              </li>
              <li className="breadcrumb-item active">View Order</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="card">
            <div className="card-body">
              <div
                className="pagetitle-detail printable"
                style={{
                  marginTop: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ flexGrow: 1 }}>
                  <h1 style={{ marginRight: "10px" }}>Order ID: #{codeOrder}</h1>
                  <ol className="breadcrumb mt-3" style={{ margin: 0 }}>
                    <li className="me-2">
                      <FontAwesomeIcon
                        className="ms-auto"
                        icon={faCalendarDays}
                      />
                    </li>
                    <li className="breadcrumb-item active">{orderDate}</li>
                  </ol>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button
                    style={{
                      width: 50,
                      height: 50,
                      background: "#F4F2F2",
                      borderRadius: 8,
                      marginLeft: "10px",
                      border: "none",
                    }}
                    onClick={handlePrintButtonClick}
                  >
                    <FontAwesomeIcon icon={faPrint} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="card">
            <div className="card-body">
              <h5
                className="card-title"
                style={{ fontWeight: "bolder", color: "black" }}
              >
                Products
              </h5>

              <table id="table-id" className="table printable">
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Product ID</th>
                    <th style={{ textAlign: "left" }}>Product Name</th>
                    <th>Quantity</th>
                    <th></th>
                    <th className="pe-4" style={{ textAlign: "right" }}>
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index}>
                      <td style={{ textAlign: "left" }}>{getProductId(product)}</td>
                      <td style={{ textAlign: "left" }}>
                        {product.namaBarang}
                      </td>
                      <td>{product.quantity}</td>
                      <td></td>
                      <td style={{ textAlign: "right" }}>
                        {formatCurrency(product.harga * product.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <table id="table-id" className="table">
                <thead>
                  <tr>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                    <td className="printable" style={{ textAlign: "right" }}>
                      Sub Total
                    </td>
                    <td className="printable" style={{ textAlign: "right" }}>
                    {formatCurrency(subTotal)}
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td className="printable" style={{ textAlign: "right" }}>
                      Diskon
                    </td>
                    <td className="printable" style={{ textAlign: "right" }}>
                      {order?.cart?.diskon}%
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td className="printable" style={{ textAlign: "right" }}>
                      Jumlah Dibayar
                    </td>
                    <td className="printable" style={{ textAlign: "right" }}>
                      {formatCurrency(jumlahDibayar)}
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td className="printable" style={{ textAlign: "right" }}>
                      Kembalian
                    </td>
                    <td className="printable" style={{ textAlign: "right" }}>
                      {formatCurrency(kembalian)}
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td
                      className="printable"
                      style={{ textAlign: "right", fontSize: "25px" }}
                    >
                      Total
                    </td>
                    <td
                      className="printable"
                      style={{ textAlign: "right", fontSize: "25px" }}
                    >
                      {formatCurrency(total)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ViewOrder;
