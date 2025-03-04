import React, { useEffect, useState } from "react";
import axios from "axios";

export interface Barang {
  idBarang: string;
  nama: string;
  hargaModal: string;
  hargaJual: string;
  untungBersih: string;
  stock: number;
}

interface CustomQuantityModalProps {
  show: boolean;
  selectedBarang: Barang | null;
  customQuantity: number;
  onCustomQuantityChange: (value: number) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const CustomQuantityModal: React.FC<CustomQuantityModalProps> = ({
  show,
  selectedBarang,
  customQuantity,
  onCustomQuantityChange,
  onClose,
  onSubmit,
}) => {
  return (
    <div
      className={`modal fade ${show ? "show" : ""}`}
      style={{ display: show ? "block" : "none" }}
      tabIndex={-1}
      aria-labelledby="customQuantityModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="customQuantityModalLabel">
              Masukkan Jumlah dalam Gram
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Jumlah Gram</label>
              <input
                type="text"
                className="form-control"
                value={customQuantity}
                onChange={(e) => onCustomQuantityChange(Number(e.target.value))}
                min="1"
                max={selectedBarang?.stock || 0}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Tutup
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onSubmit}
            >
              Tambahkan ke Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PaymentModalProps {
  show: boolean;
  onClose: () => void;
  modalData: { total: number; paymentAmount: number; change: number };
  onPaymentProcessed: () => void;
}

interface Cart {
  idCart: string;
  products: Product[];
  diskon: string;
  total: number;
}

interface Product {
  id: number;
  type: string;
  namaBarang: string;
  harga: number;
  quantity: number;
  actualQuantity: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  show,
  onClose,
  modalData,
  onPaymentProcessed,
}) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    if (show) {
      getCart();
    }
  }, [show]);

  const getCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/new-cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart(response.data);
      console.log("Cart data:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const saveOrder = async () => {
    if (!cart) {
      console.error("Cart is null, cannot save order");
      return;
    }

    const jsonData = {
      jumlahDibayar: modalData.paymentAmount,
      kembalian: modalData.change,
      idCart: cart.idCart,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/order",
        jsonData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response dari Server:", response);
      onClose();
      if (onPaymentProcessed) onPaymentProcessed();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data); // Log detailed error response
      } else {
        console.log(error);
      }
    }
  };

  // Calculate total products based on the sum of all product quantities
  const totalProducts = cart?.products ? cart.products.length : 0;

  const discount = cart?.diskon || "0";

  return (
    <div
      className={`modal fade ${show ? "show" : ""}`}
      style={{ display: show ? "block" : "none" }}
      tabIndex={-1}
      aria-labelledby="paymentModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          {/* Header Modal */}
          <div className="modal-header">
            <h5 className="modal-title" id="paymentModalLabel">
              Buat Pembayaran
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Body Modal */}
          <div className="modal-body">
            <div className="row">
              {/* Kolom Kiri (Form Input Pembayaran) */}
              <div className="col-md-8 col-sm-12">
                <div className="mb-3">
                  <label htmlFor="receivedAmount" className="form-label">
                    Jumlah yang Diterima
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="receivedAmount"
                    value={`Rp. ${modalData.total.toLocaleString("id-ID")}`}
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="payingAmount" className="form-label">
                    Jumlah yang Dibayar
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="payingAmount"
                    value={`Rp. ${modalData.paymentAmount.toLocaleString(
                      "id-ID"
                    )}`}
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="changeReturn" className="form-label">
                    Kembalian
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="changeReturn"
                    value={`Rp. ${modalData.change.toLocaleString("id-ID")}`}
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="paymentType" className="form-label">
                    Payment Type
                  </label>
                  <select className="form-select" id="paymentType">
                    <option value="cash">Cash</option>
                    <option value="card">Qris</option>
                  </select>
                </div>
              </div>

              {/* Kolom Kanan (Ringkasan Order) */}
              <div className="col-md-4 col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <ul className="list-unstyled mb-0">
                      <li className="d-flex justify-content-between py-2 border-bottom">
                        <span>Total Products</span>
                        <span>{totalProducts}</span>
                      </li>
                      <li className="d-flex justify-content-between py-2 border-bottom">
                        <span>Discount</span>
                        <span>{discount}%</span>
                      </li>
                      <li className="d-flex justify-content-between py-2">
                        <strong>Total Semuanya</strong>
                        <strong>
                          Rp. {modalData.total.toLocaleString("id-ID")}
                        </strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* End Kolom Kanan */}
            </div>
          </div>

          {/* Footer Modal */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Tutup
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={saveOrder}
            >
              Proses Pembayaran
            </button>
          </div>
        </div>
      </div>
      <ReceiptModal
        show={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
      />
    </div>
  );
};

interface ReceiptModalProps {
  show: boolean;
  onClose: () => void;
}

interface Product {
  id: number;
  type: string;
  namaBarang: string;
  harga: number;
  quantity: number;
  actualQuantity: number;
}

interface Cart {
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
  userId: number;
  createdAt: string;
  updatedAt: string;
  cart: Cart;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  show,
  onClose,
}) => {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (show) {
      getOrder();
    }
  }, [show]);

  const getOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/new-order", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrder(response.data);
      console.log("Order data:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const codeOrder = order?.codeOrder || "0";
  const jumlahDibayar = order?.jumlahDibayar || 0;
  const kembalian = order?.kembalian || 0;
  const products = order?.cart?.products || [];
  const diskon = order?.cart?.diskon || "0";
  const total = order?.cart?.total || 0;

  const calculateSubtotal = () => {
    return products.reduce((sum, product) => sum + (product.harga * product.quantity), 0);
  };

  const subtotal = calculateSubtotal();

  const handlePrint = () => {
    window.print();
  };

  const formatPrice = (price: any) => {
    return price.toLocaleString("id-ID");
  };

  return (
    <div
      className={`modal fade ${show ? "show" : ""}`}
      style={{ display: show ? "block" : "none" }}
      tabIndex={-1}
      aria-labelledby="receiptModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-sm">
        <div className="modal-content">
          {/* Header Modal */}
          <div className="modal-header">
            <h5 className="modal-title" id="receiptModalLabel">
              Struk Pembayaran
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Body Modal */}
          <div className="modal-body printable text-dark">
            <div className="receipt-content" style={{ fontSize: "12px" }}>
              <div className="text-center mb-2">
                <h6 className="mb-1">UD. Tani Sejahtera</h6>
                <p className="mb-1" style={{ fontSize: "10px" }}>ID Order: {codeOrder}</p>
                <hr className="my-2" />
              </div>

              <div className="receipt-items small">
              {products.map((product, index) => (
                  <div className="mb-2" key={index}>
                    <div className="d-flex justify-content-between mb-1">
                      <span>{product.namaBarang}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>
                        {product.quantity} {product.type === "barang" ? "Kg" : "Pcs"} X {formatPrice(product.harga)}
                      </span>
                      <span>Rp. {formatPrice(product.harga * product.quantity)}</span>
                    </div>
                  </div>
                ))}

                <div className="d-flex justify-content-between border-top pt-2 mt-2 text-dark">
                  <span>Total:</span>
                  <span>Rp. {formatPrice(subtotal)}</span>
                </div>

                <div className="d-flex justify-content-between text-dark">
                  <span>Discount:</span>
                  <span>{diskon}%</span>
                </div>

                <div className="d-flex justify-content-between border-top border-bottom py-2 my-2 text-dark">
                  <strong>Grand Total:</strong>
                  <strong>Rp. {total.toLocaleString("id-ID")}</strong>
                </div>

                <div className="d-flex justify-content-between">
                  <span>Dibayar:</span>
                  <span>Rp. {jumlahDibayar.toLocaleString("id-ID")}</span>
                </div>

                <div className="d-flex justify-content-between">
                  <span>Kembalian:</span>
                  <span>Rp. {kembalian.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div className="text-center text-dark mt-3 small">
                <p className="mb-1">Terima kasih telah membeli!</p>
                <p className="mb-0">Kembali lagi</p>
              </div>
            </div>
          </div>

          {/* Footer Modal */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Tutup
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handlePrint}
            >
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface BackdropProps {
  show: boolean;
}

export const Backdrop: React.FC<BackdropProps> = ({ show }) => {
  return show ? (
    <div
      className="modal-backdrop fade show"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1040,
      }}
    ></div>
  ) : null;
};
