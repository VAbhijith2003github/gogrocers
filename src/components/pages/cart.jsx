import React, { useContext, useState } from "react";
import "../../styles.css";
import Navbar from "../elements/navbar";
import { MyContext } from "../../App";
import Select from "react-select";

const Cart = () => {
  const { setcart, cart } = useContext(MyContext);
  const { updatecart, updatecartdec } = useContext(MyContext);
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

  const [selectedCity, setSelectedCity] = useState(null);
  const [deliverycharge] = useState(50);
  const [selectedCoupon, setselectedCoupon] = useState("");
  const [discount, setdiscount] = useState(0);
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
            {cart.map((item, index) => (
              <div
                key={index}
                className="col-lg-4 col-md-6 col-sm-12 colelement cardbg"
              >
                <div className="imgdiv" style={{ width: "120%" }}>
                  <img className="cardimgproduct" src={item.src} alt="pic" />
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
              setdiscount(
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
    </div>
  );
};

export default Cart;
