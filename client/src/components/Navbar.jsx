import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Nav, Navbar, NavDropdown, Badge, Button } from "react-bootstrap";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { useQuery } from "react-query";
import { API } from "../config/api";
import Swal from "sweetalert2";

import Login from "./Auth/Login";
import Register from "./Auth/Register";

import circleLogo from "../assets/circleLogo.png";
import Avatar from "react-avatar";
import logoNav from "../assets/logoNav.png";

import profileicon from "../assets/profileicon.png";
import complainicon from "../assets/complainicon.png";
import logouticon from "../assets/logouticon.png";
import cart from "../assets/cart.png";
import addbook from "../assets/addbook.png";

import { BsPerson, BsCalendar3 } from "react-icons/bs";

export default function NavbarUser() {
  const { data: user } = useQuery("profileCache", async () => {
    const response = await API.get("/user-info")

    return response.data.data
})

console.log("data user", user);

const [state, dispatch] = useContext(UserContext)
console.log("ini state", state);
let { data: cartUser, refetch } = useQuery('cartUserLengthCache', async () => {
    const response = await API.get('/cart-user')
    console.log("ini cart= ",response.data.data);
    return response.data.data
})

const logout = () => {
    Swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Logout'
    }).then((result) => {
        if (result.isConfirmed) {
            dispatch({
                type: "LOGOUT",
            })
            Swal.fire(
                'Logged Out Success',
            )
        }
    })
}

const [modalLogin, setModalLogin] = useState(false)
const [modalRegister, setModalRegister] = useState(false)

const navigate = useNavigate()

  return (
    <>
      <Navbar bg="white" expand="lg">
        <Container>
          <div>
            <Navbar.Brand onClick={() => navigate("/")}>
              <img src={circleLogo} alt="" style={{ opacity: "0.2" }} />
              <img
                className="pointer"
                src={logoNav}
                alt="logo"
                style={{
                  position: "absolute",
                  marginLeft: "-4rem",
                  marginTop: "1rem",
                }}
              />
            </Navbar.Brand>
          </div>

          <div>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
              {state.isLogin === true ? (
  <>
    {state.user.role === "user" ? (
      <div
        onClick={() => navigate("/cart")}
        className="d-flex align-items-center me-4 pointer"
        style={{ position: "relative" }}
      >
        <img src={cart} alt="" style={{ maxWidth: "60px" }} />
        <Badge
          style={{
            position: "absolute",
            top: "-10px",
            right: "-10px",
          }}
          className="rounded-circle"
          bg="danger"
        >
          {cartUser?.cart.length}
        </Badge>
      </div>
    ) : null}

    <NavDropdown
      title={
        <Avatar src={user?.profile?.photo} size="48" round={true} />
      }
      id="basic-nav-dropdown"
    >
      {state?.user?.role === "user" ? (
        <>
          <NavDropdown.Item
            onClick={() => {
              navigate(`/profile`);
            }}
          >
            <img
              src={user?.profile?.photo}
              alt=""
              style={{ width: "20%", marginRight: "1rem" }}
            />
            Profile
          </NavDropdown.Item>
        </>
      ) : (
        <>
          <NavDropdown.Item
            onClick={() => {
              navigate(`/add-book`);
            }}
          >
            <img
              src={addbook}
              alt=""
              style={{ width: "20%", marginRight: "1rem" }}
            />
            Add Book
          </NavDropdown.Item>
          <NavDropdown.Item
            onClick={() => {
              navigate(`/income`);
            }}
          >
            <img
              src={addbook}
              alt=""
              style={{ width: "20%", marginRight: "1rem" }}
            />
            Income
          </NavDropdown.Item>
        </>
      )}
      <NavDropdown.Divider />
      <NavDropdown.Item onClick={logout}>
        <img
          src={logouticon}
          alt=""
          style={{ width: "20%", marginRight: "1rem" }}
        />
        Logout
      </NavDropdown.Item>
    </NavDropdown>
  </>
) : (
  <div>
    <button
      onClick={() => setModalLogin(true)}
      className="px-5 p-2 shadow-sm"
      variant="light"
      style={{
        borderStyle: "solid",
        borderWidth: "1px",
        backgroundColor: "white",
        color: "black",
      }}
    >
      Login
    </button>
    <button
      onClick={() => setModalRegister(true)}
      className="ms-3 px-5 p-2"
      style={{
        borderStyle: "solid",
        borderWidth: "1px",
        backgroundColor: "black",
        color: "white",                   
      }}               
    >
      Register
    </button>
  </div>
)}

              </Nav>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
      <Login
        modalLogin={modalLogin}
        setModalLogin={setModalLogin}
        switchRegister={setModalRegister}
      />
      <Register
        modalRegister={modalRegister}
        setModalRegister={setModalRegister}
        switchLogin={setModalLogin}
      />
    </>
  );
}
