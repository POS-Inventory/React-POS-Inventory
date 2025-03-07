import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../app/store";
import { getMe } from "../features/authSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import DateRangeSection from "./DateRangeSection"; // Import the new component

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faPrint } from "@fortawesome/free-solid-svg-icons";

interface RevenueData {
  day: string;
  penjualan: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    name: string;
  }>;
  label?: string;
}

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

interface User {
  username: string;
  email: string;
  role: string;
}

interface Order {
  idOrder: number;
  codeOrder: string;
  jumlahDibayar: number;
  kembalian: number;
  idCart: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  cart: Cart;
  user: User;
}

interface TopProduct {
  name: string;
  quantity: number;
  total: number;
  percentage?: number;
  color?: string;
}

const Laporan: React.FC = () => {
  const [orders, setOrder] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([
    { day: "Senin", penjualan: 0 },
    { day: "Selasa", penjualan: 0 },
    { day: "Rabu", penjualan: 0 },
    { day: "Kamis", penjualan: 0 },
    { day: "Jumat", penjualan: 0 },
    { day: "Sabtu", penjualan: 0 },
    { day: "Minggu", penjualan: 0 },
  ]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  const progressBarColors: string[] = [
    "#0088FF", // Blue
    "#00E396", // Green
    "#775DD0", // Purple
    "#FF9800", // Orange
  ];

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

  // Update this effect to use filteredOrders instead of orders
  useEffect(() => {
    if (filteredOrders.length > 0) {
      // Process top products
      const processedTopProducts = getTopProducts(filteredOrders);
      
      // Find the maximum quantity to use as baseline for percentage
      const maxQuantity = Math.max(...processedTopProducts.map(p => p.quantity));
      
      // Add percentage and color to each product
      const enhancedProducts = processedTopProducts.slice(0, 4).map((product, index) => {
        return {
          ...product,
          percentage: (product.quantity / maxQuantity) * 100,
          color: progressBarColors[index % progressBarColors.length]
        };
      });
      
      setTopProducts(enhancedProducts);
      
      // Calculate revenue data by day of week
      const dailyRevenue = getDailyRevenueData(filteredOrders);
      setRevenueData(dailyRevenue);
      
      // Calculate total revenue
      const total = dailyRevenue.reduce((sum, day) => sum + day.penjualan, 0);
      setTotalRevenue(total);
    }
  }, [filteredOrders]);

  // Initialize filteredOrders when orders are loaded
  useEffect(() => {
    if (orders.length > 0) {
      setFilteredOrders(orders);
    }
  }, [orders]);

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "white",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <p className="label">{`${label} : ${formatCurrency(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  const getOrder = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<Order[]>("http://localhost:5000/order", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrder(response.data);
    } catch (error: any) {
      console.error("Error fetching data:", error);
    }
  };

  const getDayOfWeek = (dateString: string): string => {
    const date = new Date(dateString);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[date.getDay()];
  };
  
  const getDailyRevenueData = (orders: Order[]): RevenueData[] => {
    const dailyRevenue: Record<string, number> = {
      'Senin': 0,
      'Selasa': 0,
      'Rabu': 0,
      'Kamis': 0,
      'Jumat': 0,
      'Sabtu': 0,
      'Minggu': 0
    };
    
    orders.forEach(order => {
      const day = getDayOfWeek(order.createdAt);
      dailyRevenue[day] += parseFloat(order.cart.total.toString());
    });
    
    const chartData: RevenueData[] = Object.entries(dailyRevenue).map(([day, penjualan]) => ({
      day,
      penjualan: parseFloat(penjualan.toFixed(2))
    }));
    
    const orderedDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    chartData.sort((a, b) => orderedDays.indexOf(a.day) - orderedDays.indexOf(b.day));
    
    return chartData;
  };

  const getTopProducts = (orders: Order[]): TopProduct[] => {
    const productMap: Record<string, TopProduct> = {};

    orders.forEach((order) => {
      if (
        order.cart &&
        order.cart.products &&
        Array.isArray(order.cart.products)
      ) {
        order.cart.products.forEach((product) => {
          const productName = product.namaBarang;
          const productQuantity = parseFloat(product.quantity.toString());
          const productPrice = parseFloat(product.harga.toString());

          if (productMap[productName]) {
            productMap[productName].quantity += productQuantity;
            productMap[productName].total += productQuantity * productPrice;
          } else {
            productMap[productName] = {
              name: productName,
              quantity: productQuantity,
              total: productQuantity * productPrice,
            };
          }
        });
      }
    });

    const sortedProducts = Object.values(productMap).sort(
      (a, b) => b.quantity - a.quantity
    );

    return sortedProducts;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Laporan</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/dashboard">Home</a>
              </li>
              <li className="breadcrumb-item active">Laporan</li>
            </ol>
          </nav>
        </div>

        {/* Use the new DateRangeSection component */}
        <DateRangeSection 
          orders={orders} 
          setFilteredOrders={setFilteredOrders} 
        />

        <section className="section">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title fw-bolder text-dark mb-0">
                  Total Pendapatan
                </h5>
                <div className="fs-4 fw-bold text-success">
                  {formatCurrency(totalRevenue)}
                </div>
              </div>

              <div style={{ width: "100%", height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="penjualan"
                      name="Penjualan"
                      fill="#00E396"
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
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
                Top Products
              </h5>

              <div className="table-responsive">
                <table
                  className="table"
                  style={{
                    borderCollapse: "separate",
                    borderSpacing: "0 10px",
                  }}
                >
                  <thead className="text-muted">
                    <tr className="border-bottom">
                      <th style={{ width: "5%" }} className="fw-normal">No</th>
                      <th style={{ width: "25%" }} className="fw-normal">Name</th>
                      <th style={{ width: "50%" }} className="fw-normal">Penjualan</th>
                      <th style={{ width: "20%" }} className="fw-normal text-end">Sales</th>
                    </tr>
                  </thead>
                  <tbody>
                  {topProducts.map((product, index) => (
                      <tr key={index} className="py-3">
                        <td>{index + 1}</td>
                        <td>{product.name}</td>
                        <td className="px-3">
                          <div className="progress" style={{ height: "10px", backgroundColor: `${product.color}20` }}>
                            <div 
                              className="progress-bar" 
                              role="progressbar" 
                              style={{ 
                                width: `${product.percentage}%`, 
                                backgroundColor: product.color 
                              }}
                              aria-valuenow={product.percentage}
                              aria-valuemin={0} 
                              aria-valuemax={100}
                            ></div>
                          </div>
                        </td>
                        <td className="text-end">
                          <span 
                            className="badge rounded-pill py-2 px-3"
                            style={{ 
                              backgroundColor: `${product.color}10`,
                              color: product.color,
                              fontSize: "15px"
                            }}
                          >
                            {Math.round(product.quantity)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Laporan;