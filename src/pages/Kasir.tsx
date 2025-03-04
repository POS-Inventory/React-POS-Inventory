/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, KeyboardEvent, useRef } from "react";
import axios from "axios";
import moment from "moment";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../app/store";
import { getMe } from "../features/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  CustomQuantityModal,
  PaymentModal,
  Backdrop,
  Barang,
  ReceiptModal,
} from "../components/Modal";

import "../assets/css/style.css";

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

interface Diskon {
  idDiskon: string;
  namaDiskon: string;
  tanggalBerakhir: string;
  persentaseDiskon: string;
  status: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

interface BarangCartItem extends Barang {
  stock: number;
  customQuantity: number; // Custom quantity in grams
}

const Kasir = () => {
  const [products, setProduct] = useState<Product[]>([]);
  const [barang, setBarang] = useState<Barang[]>([]);
  const [activeDiskon, setActiveDiskon] = useState<Diskon | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchBarangInput, setSearchBarangInput] = useState("");
  const [filteredBarang, setFilteredBarang] = useState<Barang[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // Regular Product Cart
  const [barangCartItems, setBarangCartItems] = useState<BarangCartItem[]>([]); // Barang Cart with Custom Quantity (Grams)
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedBarang, setSelectedBarang] = useState<Barang | null>(null); // Store selected barang for modal
  const [customQuantity, setCustomQuantity] = useState<number>(0); // Store the custom quantity input
  const [showStrukModal, setShowStrukModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const [modalData, setModalData] = useState({
    total: 0,
    paymentAmount: 0,
    change: 0,
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getProduct();
      getBarang();
      getDiskon();
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    // Close the dropdown if clicked outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/product", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getBarang = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/barang-all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);

      setBarang(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getDiskon = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/new-diskon", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setActiveDiskon(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const searchCode = searchInput.trim();
      const foundProduct = products.find(
        (product) => product.codeProduct === searchCode
      );

      if (foundProduct) {
        addToCart(foundProduct);
        setSearchInput(""); // Clear input after adding to cart
      } else {
        alert("Produk tidak ditemukan!");
      }
    }
  };

  // Handle search input for barang
  const handleBarangSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    setSearchBarangInput(input.value);

    if (e.key === "Enter") {
      const searchQuery = input.value.trim().toLowerCase();
      setFilteredBarang(
        barang.filter((item) => item.nama.toLowerCase().includes(searchQuery))
      );
      setDropdownOpen(true); // Open the dropdown on keypress
    }
  };

  const addToCart = (product: Product) => {
    // Check if product already exists in cart
    const existingItemIndex = cartItems.findIndex(
      (item) => item.idProduct === product.idProduct
    );

    if (existingItemIndex >= 0) {
      // If product exists, increase quantity
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += 1;
      setCartItems(updatedCart);
    } else {
      // If product doesn't exist, add it with quantity 1
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  // Handle adding Barang with custom quantity
  const addBarangToCart = (barang: Barang) => {
    setSelectedBarang(barang); // Set the selected Barang to show in modal
    setCustomQuantity(0); // Reset custom quantity
  };

  const handleAddBarangToCart = () => {
    if (selectedBarang && customQuantity > 0) {
      const existingItemIndex = barangCartItems.findIndex(
        (item) => item.idBarang === selectedBarang.idBarang
      );

      if (existingItemIndex >= 0) {
        const updatedCart = [...barangCartItems];
        updatedCart[existingItemIndex].stock += customQuantity; // Increase stock by custom quantity
        updatedCart[existingItemIndex].customQuantity = customQuantity; // Update the custom quantity
        setBarangCartItems(updatedCart);
      } else {
        setBarangCartItems([
          ...barangCartItems,
          {
            ...selectedBarang,
            stock: customQuantity,
            customQuantity: customQuantity,
          },
        ]);
      }
    }
    setSelectedBarang(null); // Close modal
  };

  const totalPrice = cartItems.reduce((total, item) => {
    return total + Number(item.hargaJual) * item.quantity;
  }, 0);

  const totalBarangPrice = barangCartItems.reduce((total, item) => {
    return total + (Number(item.hargaJual) * item.customQuantity) / 1000;
  }, 0);

  const isDiscountActive = (discount: Diskon | null): boolean => {
    if (!discount || !discount.tanggalBerakhir) {
      return false;
    }
    const discountEndDate = moment
      .utc(discount.tanggalBerakhir)
      .local()
      .endOf("day");
    const currentDate = moment();
    return currentDate.isSameOrBefore(discountEndDate);
  };

  const calculateChange = () => {
    const payment = parseFloat(paymentAmount) || 0;

    // Calculate the total with discount applied
    const subtotal = totalPrice + totalBarangPrice;
    let finalTotal = subtotal;

    // Apply discount if active
    if (activeDiskon && isDiscountActive(activeDiskon)) {
      const discountPercentage = parseFloat(activeDiskon.persentaseDiskon);
      finalTotal = subtotal * (1 - discountPercentage / 100);
    }

    const change = payment - finalTotal;
    return change >= 0 ? change : 0;
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPaymentAmount(value);
  };

  // Fungsi untuk menggabungkan data dan mengirim POST ke API
  const handleCheckout = async () => {
    const subtotal = totalPrice + totalBarangPrice;
    const discountVal =
      activeDiskon && isDiscountActive(activeDiskon)
        ? parseFloat(activeDiskon.persentaseDiskon)
        : 0;

    const finalTotal =
      discountVal > 0 ? subtotal * (1 - discountVal / 100) : subtotal;

    const change = calculateChange();

    // Set modal data
    setModalData({
      total: finalTotal,
      paymentAmount: parseFloat(paymentAmount),
      change: change,
    });

    // Prepare regular product items with IDs and type
    const productItems = cartItems.map((item) => ({
      id: item.idProduct,
      type: "product",
      namaBarang: item.nama,
      harga: Number(item.hargaJual),
      quantity: item.quantity,
      actualQuantity: item.quantity, // Same for regular products
    }));

    // Prepare barang items with IDs and type
    const barangItems = barangCartItems.map((item) => ({
      id: item.idBarang,
      type: "barang",
      namaBarang: item.nama,
      harga: Number(item.hargaJual),
      quantity: item.customQuantity / 1000, // Convert to kg for pricing
      actualQuantity: item.customQuantity, // Store the actual grams for stock updates
    }));

    // Combine both types of items
    const allItems = [...productItems, ...barangItems];

    // Create payload matching your current API format
    const payload = {
      products: allItems,
      diskon: discountVal,
      total: finalTotal,
      updateStock: true, // Add flag to update stock
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/cart", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // After successful checkout, refresh product and barang data
      getProduct();
      getBarang();

      // Clear carts
      setCartItems([]);
      setBarangCartItems([]);

      // Show receipt modal
      setShowStrukModal(true);
    } catch (error: any) {
      console.error("Error during checkout:", error);

      // Show error message to user
      if (error.response && error.response.data && error.response.data.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert("Gagal melakukan checkout. Silakan coba lagi.");
      }
    }
  };

  return (
    <div>
      <main id="main" className="main">
        <div
          className="pagetitle"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <div>
            <h1>Kasir</h1>
            <nav>
              <ol className="breadcrumb" style={{ margin: 0 }}>
                <li className="breadcrumb-item">
                  <a href="/dashboard">Beranda</a>
                </li>
                <li className="breadcrumb-item active">Kasir</li>
              </ol>
            </nav>
          </div>

          {/* Field untuk Input Code Barang */}
          <div
            className="position-relative"
            style={{ width: "400px", marginLeft: "100px" }}
          >
            <div className="input-group shadow-sm">
              <input
                type="text"
                className="form-control border-0 ps-4 pe-5 rounded-3"
                placeholder="Search code product or any order..."
                style={{
                  height: "48px",
                  fontSize: "14px",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                }}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearch}
              />
              <span
                className="position-absolute"
                style={{
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 4,
                  color: "#6C757D",
                }}
              >
                <FontAwesomeIcon icon={faSearch} />
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4" style={{ display: "flex", gap: "24px" }}>
          {/* Product Grid Section - 70% width */}
          <div style={{ width: "70%" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "20px",
              }}
            >
              {products.map((product) => (
                <div
                  key={product.idProduct}
                  className="card-body card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <img
                      style={{
                        width: "84px",
                        height: "84px",
                        borderRadius: "8px",
                      }}
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
                        {`Rp. ${Number(product.hargaJual).toLocaleString(
                          "id-ID"
                        )}`}
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: 1, marginBottom: "10px" }}>
                    <div
                      style={{
                        color: "#232321",
                        fontSize: "16px",
                        fontWeight: "600",
                        wordWrap: "break-word",
                      }}
                    >
                      Deskripsi
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
                  </div>
                  <div>
                    <button
                      className="btn btn-outline-success w-100 py-2 mt-auto"
                      onClick={() => addToCart(product)}
                    >
                      Tambahkan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Section - 30% width */}
          <div className="col-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Transaksi</h5>

                {/* Transaction Items */}
                <div
                  className="transaction-items overflow-auto"
                  style={{ maxHeight: "400px" }}
                >
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-light rounded mb-3 p-3 border-bottom"
                    >
                      <div className="d-flex">
                        <div
                          className="me-3"
                          style={{ width: "60px", height: "60px" }}
                        >
                          <img
                            src={item.url}
                            alt={item.nama}
                            className="img-fluid rounded w-100 h-100 object-fit-cover"
                          />
                        </div>

                        <div className="flex-grow-1">
                          <div className="fw-semibold fs-6">{item.nama}</div>
                          <div className="d-flex justify-content-between align-items-center mt-2">
                            <div>
                              <div className="fw-semibold">
                                {`Rp.${Number(item.hargaJual).toLocaleString(
                                  "id-ID"
                                )}`}
                              </div>
                            </div>
                            <div className="d-flex align-items-center">
                              <div className="me-3 fw-medium">QUANTITY</div>
                              <div className="fw-bold fs-5">
                                {item.quantity}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tambah Barang (Gram) */}
                <div
                  className="mt-3 transaction-items overflow-auto"
                  style={{ maxHeight: "300px" }}
                >
                  <div>
                    <h5 className="text-primary-emphasis">
                      Tambah barang (Gram)
                    </h5>
                  </div>

                  {/* Barang Search Input */}
                  {/* Barang Search Input */}
                  <div className="position-relative" style={{ width: "300px" }}>
                    <div className="input-group shadow-sm">
                      <input
                        type="text"
                        className="form-control border-0 ps-4 pe-5 rounded-3"
                        placeholder="Search Barang"
                        style={{
                          height: "88px",
                          fontSize: "14px",
                          backgroundColor: "#FFFFFF",
                          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                        }}
                        value={searchBarangInput}
                        onChange={(e) => setSearchBarangInput(e.target.value)}
                        onKeyDown={handleBarangSearch}
                      />
                      <span
                        className="position-absolute"
                        style={{
                          right: "15px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          zIndex: 4,
                          color: "#6C757D",
                        }}
                      >
                        <FontAwesomeIcon icon={faSearch} />
                      </span>
                    </div>

                    {/* Filtered Barang Dropdown */}
                    {dropdownOpen && filteredBarang.length > 0 && (
                      <div
                        ref={dropdownRef}
                        className="list-group"
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          maxHeight: "200px",
                          backgroundColor: "#fff",
                          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {filteredBarang.map((item) => (
                          <button
                            key={item.idBarang}
                            className="list-group-item list-group-item-action"
                            onClick={() => addBarangToCart(item)}
                          >
                            {item.nama} -{" "}
                            {`Rp. ${Number(item.hargaJual).toLocaleString(
                              "id-ID"
                            )}`}{" "}
                            (Stock: {item.stock} gram)
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Barang Cart Items */}
                  {barangCartItems.length > 0 && (
                    <div className="mt-3">
                      {barangCartItems.map((item, index) => (
                        <div
                          key={index}
                          className="bg-light rounded mb-3 p-3 border-bottom"
                        >
                          <div className="d-flex justify-content-between">
                            <div className="fw-semibold fs-6">{item.nama}</div>
                            <div className="fw-semibold fs-6">
                              {`Rp.${(
                                (Number(item.hargaJual) * item.customQuantity) /
                                1000
                              ).toLocaleString("id-ID")}`}{" "}
                              {/* Price calculation */}
                            </div>
                            <div className="fw-semibold fs-6">
                              {item.customQuantity} gram
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Total Section */}
                {(cartItems.length > 0 || barangCartItems.length > 0) && (
                  <div className="mt-4">
                    <div className="d-flex justify-content-between py-3 border-top border-bottom border-2">
                      <div className="fs-6">Diskon</div>
                      <div className="fs-6">
                        {activeDiskon && isDiscountActive(activeDiskon)
                          ? `${activeDiskon.persentaseDiskon}%`
                          : "Tidak ada diskon"}
                      </div>
                    </div>
                    <div className="d-flex justify-content-between py-3 border-top border-bottom border-2 mb-4">
                      <div className="fw-bold fs-5">Total</div>
                      <div className="fw-bold fs-5">
                        {(() => {
                          const subtotal = totalPrice + totalBarangPrice;
                          let finalTotal = subtotal;

                          // Apply discount if active
                          if (activeDiskon && isDiscountActive(activeDiskon)) {
                            const discountPercentage = parseFloat(
                              activeDiskon.persentaseDiskon
                            );
                            finalTotal =
                              subtotal * (1 - discountPercentage / 100);
                          }

                          return `Rp.${finalTotal.toLocaleString("id-ID")}`;
                        })()}
                      </div>
                    </div>

                    {/* Payment Input Section */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Uang yang Dibayarkan
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">Rp.</span>
                        <input
                          type="text"
                          className="form-control py-3"
                          value={paymentAmount}
                          onChange={handlePaymentChange}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Change Section */}
                    <div className="mb-4">
                      <div className="d-flex justify-content-between py-3 border-top border-bottom">
                        <div className="fw-bold">Kembalian</div>
                        <div className="fw-bold">
                          {`Rp.${calculateChange().toLocaleString("id-ID")}`}
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn btn-primary w-100 py-3 fw-semibold"
                      onClick={handleCheckout}
                    >
                      Bayar dan Cetak Struk
                    </button>
                  </div>
                )}

                {cartItems.length === 0 && barangCartItems.length === 0 && (
                  <div
                    className="d-flex flex-column align-items-center justify-content-center text-center"
                    style={{ height: "300px" }}
                  >
                    <div className="text-muted fs-5 mb-2">
                      Keranjang masih kosong
                    </div>
                    <div className="text-secondary fs-6">
                      Tambahkan produk dengan mengklik tombol "Tambahkan" atau
                      "Scan Kode Produk"
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Panggil Modal untuk Custom Quantity Input */}
      <CustomQuantityModal
        show={!!selectedBarang}
        selectedBarang={selectedBarang}
        customQuantity={customQuantity}
        onCustomQuantityChange={setCustomQuantity}
        onClose={() => setSelectedBarang(null)}
        onSubmit={handleAddBarangToCart}
      />

      {/* Panggil Modal untuk Pembayaran */}
      <PaymentModal
        show={showStrukModal}
        onClose={() => setShowStrukModal(false)}
        modalData={modalData}
        onPaymentProcessed={() => setShowReceiptModal(true)}
      />

      <ReceiptModal
        show={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
      />

      {/* Backdrop untuk menggelapkan background saat modal aktif */}
      <Backdrop show={showStrukModal || showReceiptModal || !!selectedBarang} />
    </div>
  );
};

export default Kasir;
