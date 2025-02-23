import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AllProducts from "./pages/AllProducts";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import ViewProduct from "./pages/ViewProduct";
import AddBarang from "./pages/AddBarang";
import EditBarang from "./pages/EditBarang";
import Kasir from "./pages/Kasir";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <LoginPage />
            </>
          }
        />

        <Route
          path="/dashboard"
          element={
            <>
              <Navbar />
              <Sidebar />
              <Dashboard />
            </>
          }
        />

        <Route
          path="/products"
          element={
            <>
              <Navbar />
              <Sidebar />
              <AllProducts />
            </>
          }
        />

        <Route
          path="/product/add"
          element={
            <>
              <Navbar />
              <Sidebar />
              <AddProduct />
            </>
          }
        />

        <Route
          path="/product/edit/:id"
          element={
            <>
              <Navbar />
              <Sidebar />
              <EditProduct />
            </>
          }
        />

        <Route
          path="/product/view/:id"
          element={
            <>
              <Navbar />
              <Sidebar />
              <ViewProduct />
            </>
          }
        />

        <Route
          path="/kasir"
          element={
            <>
              <Navbar />
              <Sidebar />
              <Kasir />
            </>
          }
        />

        <Route
          path="/barang/add"
          element={
            <>
              <Navbar />
              <Sidebar />
              <AddBarang />
            </>
          }
        />

        <Route
          path="/barang/edit/:id"
          element={
            <>
              <Navbar />
              <Sidebar />
              <EditBarang />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
