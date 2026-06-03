import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { UserContext } from "./UserContext";
import PrivateRoute from "./components/PrivateRoute";

//* Stores *//
import Stores from "./pages/Stores/Stores";
import FormAddStores from "./pages/Stores/FormAddStores";
import FormEditStores from "./pages/Stores/FormEditStores";

//* Companies *//
import Companies from "./pages/Companies/Companies";
import FormAddCompany from "./pages/Companies/FormAddCompany";
import FormEditCompany from "./pages/Companies/FormEditCompany";

//* Products *//
import Products from "./pages/Products/Products";
import FormAddProduct from "./pages/Products/FormAddProduct";
import FormEditProduct from "./pages/Products/FormEditProduct";

//* Users *//
import Users from "./pages/Users/Users";
import FormAddUser from "./pages/Users/FormAddUser";
import FormEditUser from "./pages/Users/FormEditUser";

function App() {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <Routes>
          {/* Landing y Login */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Home principal */}
          <Route path="/home" element={<Home />} />

          {/* Productos */}
          <Route path="/home/products" element={<Products />} />
          <Route path="/home/AddProduct" element={<FormAddProduct />} />
          <Route path="/home/FormEditProduct/:id" element={<FormEditProduct />} />

          {/* Usuarios */}
          <Route path="/home/users" element={<Users />} />
          <Route path="/home/AddUser" element={<FormAddUser />} />
          <Route path="/home/FormEditUser/:id" element={<FormEditUser />} />
          {/* Sucursales */}
          <Route path="/home/stores" element={<Stores />}/>
          <Route path="/home/AddStore" element={ <FormAddStores />}/>
          <Route path="/home/EditStore/:id" element={<FormEditStores />}/>
          {/* Companies */}
          <Route path="/home/companies" element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Companies />
            </PrivateRoute>
          } />
          <Route path="/home/AddCompany" element={
            <PrivateRoute allowedRoles={["admin"]}>
              <FormAddCompany />
            </PrivateRoute>
          } />
          <Route path="/home/EditCompany/:id" element={
            <PrivateRoute allowedRoles={["admin"]}>
              <FormEditCompany />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
