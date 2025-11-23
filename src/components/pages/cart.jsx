import React, { useContext, useEffect, useState } from "react";
import "../../styles.css";
import Navbar from "../elements/navbar";
import { MyContext } from "../../App";
import Select from "react-select";
import GetUser from "../firestore.operations.files/getuser";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import emptybasket from "../../images/accmedia/basketempty.png"
import GetCart from "../firestore.operations.files/getcart";

const Cart = () => {
  const { setcart, cart } = useContext(MyContext);
  const navigate = useNavigate();
  const { updatecart, updatecartdec } = useContext(MyContext);
  const [selectedCity, setSelectedCity] = useState(null);
  const [deliverycharge] = useState(50);
  const [selectedCoupon, setselectedCoupon] = useState("");
  const {discount, setDiscount} = useContext(MyContext);
  const options = [
    { value: "Delhi", label: "Delhi" },
    { value: "Mumbai", label: "Mumbai" },
    { value: "Bangalore", label: "Bangalore" },
    { value: "Chennai", label: "Chennai" },
    { value: "Kolkata", label: "Kolkata" },
    { value: "Hyderabad", label: "Hyderabad" },
    { value: "Kochi", label: "Kochi" },
  ];
  const optionscoupon = [
    {
      value: "WELCOMEGG - zero delivery fee + 10% off on all grocery items.",
      label: "WELCOMEGG - zero delivery fee + 10% off on all grocery items.",
    },
    {
      value: "GROCERY10 - 10% off on all grocery items.",
      label: "GROCERY10 - 10% off on all grocery items.",
    },
    {
      value: "VEGGIE20 - 20% off on all vegetable items.",
      label: "VEGGIE20 - 20% off on all vegetable items.",
    },
  ];


  const totalPrice = cart.reduce(
    (sum, item) => sum + item.priceint * item.frequency,
    0
  );
  const vegPrice = cart.reduce((sum, item) => {
    if (item.type === "veg") {
      return sum + item.priceint * item.frequency;
    } else {
      return sum;
    }
  }, 0);

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    const fetchUserData = async () => {
      if (localStorage.getItem("authenticated")=== "true") {
        try {
          console.log(uid);
          // const userdetails = await GetUser(uid);
          const usercart = await GetCart(uid);
          console.log(usercart);
          setcart(usercart.cart);
        } catch (error) {
          toast.error("Error fetching user data", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      }
    };
    fetchUserData();
  }, []);

 function handleClick()
  {
    if(cart.length > 0)
    {
      navigate("/checkout");
    }
    else
    {
      toast.error("Cart is empty", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  return (
    <div className="cart">
      <Navbar />
      <section className="vegetablessec">
        <section className="cardsproduct">
          <div>
            <h4
              style={{
                color: "green",
                fontWeight: "700",
                fontSize: "1.8em",
                paddingTop: "20px",
                paddingLeft: "60px",
              }}
            >
              Deliver to
            </h4>
            <Select
              className="cartselect"
              options={options}
              value={selectedCity}
              onChange={setSelectedCity}
              placeholder="Select a city..."
            />
          </div>
          <div
            className="row"
            style={{ width: "70%", position: "relative", left: "1.25%" }}
          >
            {cart.length > 0 && (
              <>
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="col-lg-4 col-md-6 col-sm-12 colelement cardbg"
                  >
                    <div className="imgdiv" style={{ width: "120%" }}>
                      <img
                        className="cardimgproduct"
                        src={item.src}
                        alt="pic"
                      />
                    </div>
                    <p className="cardtextproduct" style={{ width: "120%" }}>
                      {item.name}
                    </p>
                    <div className="infodev" style={{ width: "120%" }}>
                      <button
                        className="cartbuttons"
                        style={{ width: "3%" }}
                        onClick={() => {
                          updatecart({
                            name: item.name,
                          });
                        }}
                      >
                        +
                      </button>
                      <button
                        className="cartbuttons"
                        style={{ width: "3%" }}
                        disabled
                      >
                        <span>{item.frequency}</span>
                      </button>
                      <button
                        className="cartbuttons"
                        style={{ width: "3%" }}
                        onClick={() => {
                          updatecartdec({
                            name: item.name,
                          });
                        }}
                      >
                        -
                      </button>
                      <div style={{ minWidth: "100px" }}>
                        <h4
                          className="productprice"
                          style={{ display: "block", width: "120%" }}
                        >
                          <span style={{ marginRight: "5%" }}>
                            {" "}
                            Rs {item.frequency * item.priceint}
                          </span>
                        </h4>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {
              cart.length === 0 && (
                <>
                <div className="cartwarning">
                  <img src={emptybasket} alt="cart is empty" style={{height:"50px",margin:"10px"}}/>
                <h4>Your GoGrocers Cart is Empty</h4>
                </div>
                </>
              )
            }
          </div>
        </section>
      </section>
      <div className="sidepanel">
        <div className="cartheading">
          <h4>CART&nbsp;DETAILS&nbsp;</h4>
        </div>
        <p className="cartpaneltext">
          ORDER&nbsp;TOTAL&nbsp;:
          <span style={{ fontWeight: "700" }}> Rs {totalPrice} /-</span>
        </p>
        <p className="cartpaneltext">
          DELIVERY&nbsp;CHARGE&nbsp;:
          <span style={{ fontWeight: "700" }}>
            {" "}
            Rs&nbsp;{totalPrice === 0 ? 0 : deliverycharge}&nbsp;/-
          </span>
        </p>
        <div className="box">
          <p className="cartpaneltext">COUPON&nbsp;ENTRY&nbsp;: </p>
          <Select
            id="coupon"
            options={optionscoupon}
            value={selectedCoupon}
            onChange={(value) => {
              setselectedCoupon(value);
              console.log(
                value === optionscoupon[0] ? 50 + totalPrice * 0.1 : discount
              );
              setDiscount(
                value === optionscoupon[0]
                  ? 50 + Math.round(totalPrice * 0.1 * 100) / 100
                  : value === optionscoupon[1]
                  ? Math.round(totalPrice * 0.1 * 100) / 100
                  : optionscoupon[2]
                  ? Math.round(vegPrice * 0.2 * 100) / 100
                  : discount
              );
            }}
            placeholder="Enter coupon"
          />
        </div>
        <p className="cartpaneltext">
          <span>
            COUPON CODE DISCOUNT :
            <span style={{ color: "green", fontWeight: "600" }}>
              {" "}
              Rs&nbsp;{discount}
            </span>
          </span>
        </p>
        <hr
          style={{
            width: "95%",
            height: "2px",
            backgroundColor: "rgba(128, 128, 128, 0.819)",
            position: "relative",
            right: "4%",
            marginTop: "15%",
          }}
        />
        <p className="cartpaneltext">
          BILL TOTAL :{" "}
          <span style={{ fontWeight: "700" }}>
            {" "}
            RS {totalPrice === 0
              ? 0
              : totalPrice - discount + deliverycharge}{" "}
            /-
          </span>
        </p>
        <button
          onClick={handleClick}
          className="checkoutbutton"
        >
          proceed to checkout
        </button>
      </div>
      <div
        style={{
          backgroundColor: "rgba(180, 180, 180, 0.300)",
          paddingBottom: "30px",
        }}
      >
        <div className="row footerrow">
          <i className="fa-brands fa-twitter ficon"></i>
          <i className="fa-brands fa-facebook-f ficon"></i>
          <i className="fa-brands fa-instagram ficon"></i>
          <i className="fa-solid fa-envelope ficon"></i>
        </div>
        <p
          style={{
            textAlign: "center",
            position: "relative",
            right: "15px",
            paddingLeft: "50px",
            paddingRight: "50px",
          }}
        >
          © Copyright 2023 GoGrocers || Created by{" "}
          <a
            href="https://github.com/VAbhijith2003github?tab=repositories"
            style={{ color: "palevioletred" }}
          >
            Abhijith
          </a>
        </p>
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
};

export default Cart;
