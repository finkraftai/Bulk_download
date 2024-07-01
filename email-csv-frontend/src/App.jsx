import React, { useState } from "react";
import axios from "axios";
import { Modal } from "antd";
import "./App.css";
import logo from "./assets/finkraft_logo.png";

function App() {
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [total_pages, settotalpages] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const [invalid_s3, setInvalid_s3] = useState("");
  const [error, setError] = useState("");
  const [invalid_Access, setInvalid_Access] = useState("");
  const [not_existing, setNotexisting] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !file) {
      setMessage("Please fill in all fields.");
      return;
    }

    setIsLoading(true); // Set loading status to true when the request starts

    const formData = new FormData();
    formData.append("email", email);
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v2/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.msg);
      settotalpages(response.data["details"]["total"]);
      setInvalid_s3(response.data["details"]["invalid_s3"]);
      setInvalid_Access(response.data["details"]["invalid_access"]);
      setNotexisting(response.data["details"]["not_existing"]);
      setError(response.data["details"]["skipped"]["Error"]);

      console.log(total_pages);
      console.log(invalid_Access);
      console.log(invalid_s3);
      console.log(error);
      console.log(not_existing);
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while sending the data."+ error);
      Modal.error({
        title: 'Error',
        content: message,
      });
      
    } finally {
      setIsLoading(false); // Set loading status to false when the request is completed
      // alert("Mail sent successfully to " + email); // Show alert with success message
      Modal.success({
        title: "Success",
        content: `Mail sent successfully to ${email}             Total Files: ${total_pages}`,
      });
    }
  };

  return (
    <>
      <div className="logo">
        <img src={logo} alt="" />
      </div>
      <div className="App">
        <form onSubmit={handleSubmit}>
          <h1>BULK DOWNLOAD</h1>
          <div className="inputbox">
            {/* <label>Email</label> */}
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
              placeholder="Email"
            />
          </div>
          <div className="filebox">
            {/* <label>File:</label> */}
            <input type="file" onChange={handleFileChange} required />
          </div>
          <div className="button">
            <button type="submit" disabled={isLoading}>
              {" "}
              {/* Disable the button when loading */}
              {isLoading ? "Processing..." : "SUBMIT"}{" "}
              {/* Change button text when loading */}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default App;
