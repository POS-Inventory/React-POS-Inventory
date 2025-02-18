import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from '../app/store';
import { LogOut, reset } from "../features/authSlice";
import "../assets/css/style.css";
import logo from "../assets/img/logo.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const logout = async () => {
    await dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };
  
  return (
    <div>
      <header
        id="header"
        className="header fixed-top d-flex align-items-center"
      >
        <div className="d-flex align-items-center justify-content-between">
          <a href="/dashboard" className="logo d-flex align-items-center">
            <img className="ps-5" src={logo} alt=""/>
          </a>
          <i className="bi bi-list toggle-sidebar-btn"></i>
        </div>

        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">
            <li className="nav-item dropdown pe-3">
              <button
                className="nav-link nav-profile d-flex align-items-center pe-0"
                data-bs-toggle="dropdown"
              >
                <span className="d-none d-md-block dropdown-toggle ps-2" style={{color: "black"}}>
                {user ? user.role : "Guest"}
                </span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                {/* Tambahkan item profil lainnya di sini */}
                <li>
                  <button onClick={logout} className="dropdown-item">Logout</button>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
