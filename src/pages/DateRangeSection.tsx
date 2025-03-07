import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faPrint } from "@fortawesome/free-solid-svg-icons";

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

interface DateRangeProps {
  orders: Order[];
  setFilteredOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

interface DateRangeState {
  start: string;
  end: string;
}

interface DateRangeResult extends DateRangeState {
  startDate: Date;
  endDate: Date;
}

const DateRangeSection: React.FC<DateRangeProps> = ({ orders, setFilteredOrders }) => {
  const [dateRange, setDateRange] = useState<DateRangeState>({
    start: "1 Maret 2025",
    end: "8 Maret 2025"
  });
  const [timeFrame, setTimeFrame] = useState<string>("Minggu");

  // Function to get date range based on selected timeframe
  const getDateRange = (selectedTimeFrame: string): DateRangeResult => {
    const today = new Date();
    let startDate: Date, endDate: Date;

    switch (selectedTimeFrame) {
      case "Minggu":
        // Current week (starting from current day, going back 7 days)
        endDate = new Date(today);
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 6);
        break;
      case "Bulan":
        // Current month (from 1st day of current month to today)
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today);
        break;
      case "Tahun":
        // Current year (from January 1st to today)
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today);
        break;
      default:
        // Default to weekly view
        endDate = new Date(today);
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 6);
    }

    // Format dates in Indonesian style
    const formatDate = (date: Date): string => {
      const day = date.getDate();
      const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    };

    return {
      start: formatDate(startDate),
      end: formatDate(endDate),
      startDate,
      endDate
    };
  };

  // Handle timeframe change
  const handleTimeFrameChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedTimeFrame = e.target.value;
    setTimeFrame(selectedTimeFrame);
    
    if (selectedTimeFrame !== "Pilih") {
      const newDateRange = getDateRange(selectedTimeFrame);
      setDateRange({
        start: newDateRange.start,
        end: newDateRange.end
      });

      // Filter orders based on selected date range
      filterOrdersByDateRange(newDateRange.startDate, newDateRange.endDate);
    }
  };

  // Filter orders by date range
  const filterOrdersByDateRange = (startDate: Date, endDate: Date): void => {
    if (!orders || !orders.length) return;

    const filtered = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });

    setFilteredOrders(filtered);
  };

  // Handle print button click
  const handlePrintButtonClick = (): void => {
    // Filter orders based on current date range
    const range = getDateRange(timeFrame);
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= range.startDate && orderDate <= range.endDate;
    });

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      // Generate HTML content for the print window
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Laporan Penjualan - ${range.start} sampai ${range.end}</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            body { padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .table th, .table td { padding: 10px; }
            @media print {
              .no-print { display: none; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Laporan Penjualan</h1>
              <h4>${range.start} - ${range.end}</h4>
            </div>
            
            <button class="btn btn-primary no-print mb-3" onclick="window.print()">Print Laporan</button>
            
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kode Order</th>
                  <th>Tanggal</th>
                  <th>Produk</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${filteredOrders.map((order, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${order.codeOrder}</td>
                    <td>${new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
                    <td>
                      <ul>
                        ${order.cart.products.map(product => `
                          <li>${product.namaBarang} (${product.quantity} x ${formatCurrency(product.harga)})</li>
                        `).join('')}
                      </ul>
                    </td>
                    <td>${formatCurrency(order.cart.total)}</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="4" class="text-end"><strong>Total Pendapatan:</strong></td>
                  <td>
                    <strong>${formatCurrency(
                      filteredOrders.reduce((sum, order) => sum + order.cart.total, 0)
                    )}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </body>
        </html>
      `);
      
      printWindow.document.close();
    }
  };

  // Format currency for display
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Initialize with default time frame
  useEffect(() => {
    if (orders && orders.length > 0) {
      const initialRange = getDateRange(timeFrame);
      filterOrdersByDateRange(initialRange.startDate, initialRange.endDate);
    }
  }, [orders]);

  return (
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
              <ol className="breadcrumb mt-3" style={{ margin: 0 }}>
                <li className="me-2">
                  <FontAwesomeIcon
                    className="ms-auto"
                    icon={faCalendarDays}
                  />
                </li>
                <li className="breadcrumb-item active">{dateRange.start} - {dateRange.end}</li>
              </ol>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <select
                style={{
                  width: 219,
                  height: 52,
                  padding: 16,
                  background: "#F4F2F2",
                  borderRadius: 8,
                  border: "none",
                }}
                value={timeFrame}
                onChange={handleTimeFrameChange}
              >
                <option>Pilih</option>
                <option>Minggu</option>
                <option>Bulan</option>
                <option>Tahun</option>
              </select>

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
  );
};

export default DateRangeSection;