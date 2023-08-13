// import required modules
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useState } from "react";
import { Container, Row, Col, InputGroup, Form, Button } from "react-bootstrap";
import { useQuery  } from "react-query";
import { API } from "../config/api";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
// Import Swiper React components
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// define format currency function
const formatIDR = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function ListBook() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [modalLogin, setModalLogin] = useState(false);
  const [modalRegister, setModalRegister] = useState(false);
  const [state, _] = useContext(UserContext)


  let { data: listBook, refetch } = useQuery("listBookCache", async () => {
    const response = await API.get("/books");
    return response.data.data;
  });

  // handle delete book

  const alertLogin =async ()=>{
    setModalLogin(true)
  }


  // check if no books found based on the search value
  const isBookFound =
    listBook?.filter((value) => {
      if (search === "") {
        return value;
      } else if (
        value.title.toLowerCase().includes(search.toLocaleLowerCase())
      ) {
        return value;
      } else if (
        value.isbn.toLocaleLowerCase().includes(search.toLowerCase())
      ) {
        return value;
      } else if (
        value.author.toLocaleLowerCase().includes(search.toLowerCase())
      ) {
        return value;
      }
    }).length > 0;









  return (
    <Container className="punten">
      <Col md={12} className="text-end d-flex justify-content-center py-4">
        <Col md={6}>
          <InputGroup className="mb-3 mt-2 shadow-2 fw-bold">
            <Form.Control
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="Search Your Books Here ..."
            />
          </InputGroup>
        </Col>
      </Col>

      <h1 className=" fs-36 fw-bold mb-3">
        B<span style={{ color: "salmon" }}>oo</span>
        <span style={{ display: "inline-block", transform: "scaleX(-1)" }}>
          k
        </span>{" "}
        L<span style={{ color: "red" }}>i</span>st
        <span style={{ color: "red" }}>s</span>
      </h1>
      {/* display message if no books found */}
      {!isBookFound && (
        <p className="text-center">
          No books found based on your search value!
        </p>
      )}

      {/* display book list if there are books found */}
      {isBookFound && (
        <Row className="d-flex justify-content-center mx-auto mb-5">
          <div className="d-flex flex-wrap">
            {listBook
              ?.filter((value) => {
                if (search === "") {
                  return value;
                } else if (
                  value.title
                    .toLowerCase()
                    .includes(search.toLocaleLowerCase())
                ) {
                  return value;
                } else if (
                  value.isbn.toLocaleLowerCase().includes(search.toLowerCase())
                ) {
                  return value;
                } else if (
                  value.author
                    .toLocaleLowerCase()
                    .includes(search.toLowerCase())
                ) {
                  return value;
                }
              })
              .map((item) => (
                <Col
                  key={item.id}
                  style={{
                    width: "250px",
                    cursor: "pointer",
                    boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
                    borderRadius: "5px",
                    marginRight:"15px"
                  }}
                  className="text-start col-12 col-md-6 col-lg-3 text-center mb-4 p-2"

                >
                     {state.isLogin ? (
  <Link
    to={`/detail/${item?.id}`}
    style={{ display: "flex", flexDirection: "column" }}>
    <img
      className="mb-3"
      src={item?.thumbnail}
      alt="book"
      style={{
        height: "255px",
        objectFit: "cover",
        width: "100%",
        flex: "start",
      }}
    />

    <div className="w-full">
      <h4 className="fw-bold text-start mb-1">{item?.title}</h4>
      <p
        className="text-start fs-14 text-grey mb-1"
        style={{
          fontSize: "14px",
          fontStyle: "italic",
          fontWeight: "400",
          color: "#929292",
        }}
      >
        By {item?.author}
      </p>
      <p
        className="fs-18 text-start fw-bold"
        style={{
          color: "green",
          fontSize: "18px",
          fontWeight: "800",
          lineHeight: "25px",
        }}
      >
        {formatIDR.format(item?.price)}
      </p>
    </div>
  </Link>
) : (
  <>
    <img
      onClick={alertLogin}
      className="mb-3"
      src={item?.thumbnail}
      alt="book"
      style={{
        height: "255px",
        objectFit: "cover",
        width: "100%",
        flex: "start",
      }}
    />

    <div className="w-full">
      <h4 className="fw-bold text-start mb-1">{item?.title}</h4>
      <p
        className="text-start fs-14 text-grey mb-1"
        style={{
          fontSize: "14px",
          fontStyle: "italic",
          fontWeight: "400",
          color: "#929292",
        }}
      >
        By {item?.author}
      </p>
      <p
        className="fs-18 text-start fw-bold"
        style={{
          color: "green",
          fontSize: "18px",
          fontWeight: "800",
          lineHeight: "25px",
        }}
      >
        {formatIDR.format(item?.price)}
      </p>
    </div>
  </>
)}



        </Col>
              ))}
          </div>
        </Row>
      )}

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

    </Container>
  );
}

