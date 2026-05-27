import React from "react";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div>
      <Navbar />
      <main style={{ padding: "20px" }}>
        <h1 style={{ color: "#6a0dad" }}>Home Kedaval</h1>
        <p>Selecciona una opción del menú.</p>
      </main>
    </div>
  );
}

export default Home;
