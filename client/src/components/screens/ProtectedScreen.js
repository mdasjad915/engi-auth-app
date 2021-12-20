import { useState, useEffect } from "react";
import axios from "axios";
import EngifestRegister from "./EngifestRegister";
import "./ProtectedScreen.css";

const ProtectedScreen = ({ history }) => {
  const [error, setError] = useState("");
  const [privateData, setPrivateData] = useState("");

  useEffect(() => {
    const fetchPrivateDate = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const { data } = await axios.get("/api/protect", config);
        setPrivateData(data.data);
      } catch (error) {
        localStorage.removeItem("authToken");
        setError("You are not authorized please login");
      }
    };

    fetchPrivateDate();
  }, [history]);

  const logoutHandler = () => {
    localStorage.removeItem("authToken");
    history.push("/login");
  };

  return (
    <>
      {error ? (
        <span className="error-message">{error}</span>
      ) : (
        <div>
          <div className="server_msg">{privateData}</div>
          <h1 className="welcome_msg">Welcome to Engifest Registration</h1>
          <p className="about_msg">
            <span className="start_msg">About Engifest:</span> Lorem Ipsum is simply dummy text of the printing and
            typesetting industry. Lorem Ipsum has been the industry's standard
            dummy text ever since the 1500s, when an unknown printer took a
            galley of type and scrambled it to make a type specimen book. It has
            survived not only five centuries, but also the leap into electronic
            typesetting, remaining essentially unchanged. There are many
            variations of passages of Lorem Ipsum available, but the majority
            have suffered alteration in some form, by injected humour, or
            randomised words which don't look even slightly believable. If you
            are going to use a passage of Lorem Ipsum, you need to be sure there
            isn't anything embarrassing hidden in the middle of text.
          </p>
          <h2>Register here: </h2>
          <EngifestRegister />
          <button className="logout_btn" onClick={logoutHandler}>Logout</button>
        </div>
      )}
    </>
  );
};

export default ProtectedScreen;
