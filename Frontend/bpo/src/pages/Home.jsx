import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import bpoImage from "../assets/bpo.png";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Home = () => {
  const [data, setData] = useState([
    { name: "USA", value: 40 },
    { name: "India", value: 30 },
    { name: "Philippines", value: 20 },
    { name: "Others", value: 10 },
  ]);

  // Fetch real-time data (mock example)
  useEffect(() => {
    const fetchData = () => {
      const updatedData = [
        { name: "USA", value: Math.random() * 50 },
        { name: "India", value: Math.random() * 50 },
        { name: "Philippines", value: Math.random() * 50 },
        { name: "Others", value: Math.random() * 50 },
      ];
      setData(updatedData);
    };

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#f4f7fc",
        color: "#333",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        overflowY: "auto",
      }}
    >
      {/* Header Section */}
      <header
        style={{
          backgroundColor: "#1e90ff",
          color: "#fff",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "28px" }}>BPO Dashboard</h1>
        <p style={{ margin: "5px 0", fontSize: "16px" }}>
          Insights into Global BPO Industry
        </p>
      </header>

      {/* Content Section */}
      <main style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* Left Section - Chart */}
        <div
          style={{
            flex: "1 1 40%",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3 style={{ marginBottom: "20px", fontSize: "20px" }}>
            Global BPO Distribution
          </h3>
          <PieChart width={400} height={300}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Right Section - Image */}
        <div
          style={{
            flex: "1 1 40%",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <img
            src={bpoImage}
            alt="BPO Illustration"
            style={{
              maxWidth: "100%",
              maxHeight: "300px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              animation: "fadeIn 2s",
            }}
          />
        </div>
      </main>

      {/* Contact Us Section */}
      <section
        style={{
          marginTop: "20px",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ marginBottom: "20px", fontSize: "20px", color: "#1e90ff" }}>
          Contact Us
        </h3>
        <form>
          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="name"
              style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              placeholder="Enter your name"
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="email"
              style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              placeholder="Enter your email"
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="message"
              style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}
            >
              Message
            </label>
            <textarea
              id="message"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                resize: "none",
              }}
              rows="4"
              placeholder="Enter your message"
            ></textarea>
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: "#1e90ff",
              color: "#fff",
              padding: "10px 15px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Submit
          </button>
        </form>
      </section>
    </div>
  );
};

export default Home;
