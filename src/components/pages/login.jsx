import React from "react";
import "../../styles.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { app } from "../../firebase-config.js";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateUser from "../firestore.operation.files/createuser.js";


function Login() {
  
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const token = user.getIdToken();
        const userEmail = user.email;
        const userName = user.displayName;
        const userid = user.uid;
        localStorage.setItem("token", token);
        localStorage.setItem("authenticated", true);
        localStorage.setItem("name", userName);
        localStorage.setItem("email", userEmail);
        localStorage.setItem("uid", userid);
        CreateUser(userid, userEmail, userName);
        navigate("/");
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  };

  const Loginwithgoogle = async () => {
    signInWithPopup(auth, provider)
      .then((userCredential) => {
        const user = userCredential.user;
        const userName = user.displayName;
        const userEmail = user.email;
        const userid = user.uid;
        const token = userCredential.idToken;
        localStorage.setItem("token", token);
        localStorage.setItem("authenticated", true);
        localStorage.setItem("name", userName);
        localStorage.setItem("email", userEmail);
        localStorage.setItem("uid", userid);
        CreateUser(userid, userEmail, userName);
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage, errorCode);
      });
  };

  return (
    <div>
      <div style={{ height: "80px", backgroundColor: "rgb(68, 184, 76)" }}>
        <Link to="/" className="navbrandlogin" id="loginlogo">
          <h2
            className="Title"
            style={{ paddingTop: "15px", paddingLeft: "75px" }}
          >
            GoGrocers
          </h2>
        </Link>
      </div>
      <div className="login containery">
        <h1 className="headinglogin">LOGIN</h1>
        <hr className="loginline" />
        <form className="loginform" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="your_email@org.com"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
          />
          <button className="loginbutton" type="submit">
            Login
          </button>
        </form>
        <hr className="loginline" id="line" />
        <button className="loginbutton" id="google" onClick={Loginwithgoogle}>
          <i class="fab fa-google icon" style={{ paddingRight: "10px" }}></i>
          Sign in with Google
        </button>
        <Link to="/signup" className="createacc">
          create an account ?
        </Link>
        <div></div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default Login;
