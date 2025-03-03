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
}) => {
  const [cart, setCart] = useState<Cart | null>(null);

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
              // onClick={...} // Tambahkan logika final pembayaran
            >
              Proses Pembayaran
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
