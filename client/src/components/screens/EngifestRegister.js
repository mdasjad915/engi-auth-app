import { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
// import { Link } from "react-router-dom";
import "./EngifestRegister.css";
 
const EngifestRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [clgName, setClgName] = useState("");
  const [rollNo, setRollNo] = useState("");

  const createAndDownloadPdf = async (e) => {
    e.preventDefault();

    await axios
      .post("/api/create-pdf", { name, email, clgName, rollNo })
      .then(() => axios.get("/api/fetch-pdf", { responseType: "blob" }))
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });

        saveAs(pdfBlob, "newPdf.pdf");
      });

    setName("");
    setEmail("");
    setClgName("");
    setRollNo("");
  };

  return ( 
    <div className="register-screen">
      <form onSubmit={createAndDownloadPdf} className="register-screen__form">
        <h3 className="register-screen__title">Register for Engifest</h3>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            required
            id="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            required
            id="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="clgName">College/University:</label>
          <input
            type="text"
            required
            id="clgName"
            placeholder="Enter college name"
            value={clgName}
            onChange={(e) => setClgName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="rollNo">Roll/Enrollment No:</label>
          <input
            type="text"
            required
            id="rollNo"
            placeholder="Enter Roll No:"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
  );
};

export default EngifestRegister;
