import React from "react";

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
                onChange={(e) =>
                  onCustomQuantityChange(Number(e.target.value))
                }
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
  children?: React.ReactNode;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  show,
  onClose,
}) => {
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
                        placeholder="Rp."
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
                        placeholder="Rp."
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
                        placeholder="0.00"
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
                            <span>1</span>
                          </li>
                          <li className="d-flex justify-content-between py-2 border-bottom">
                            <span>Total</span>
                            <span>10.000</span>
                          </li>
                          <li className="d-flex justify-content-between py-2 border-bottom">
                            <span>Discount</span>
                            <span>10%</span>
                          </li>
                          <li className="d-flex justify-content-between py-2">
                            <strong>Total Semuanya</strong>
                            <strong>9.000</strong>
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
