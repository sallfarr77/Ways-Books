import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { API } from "../config/api";
import { useQuery } from "react-query";

export default function DataBook() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let { data: listBook, refetch } = useQuery("listBookCache", async () => {
    const response = await API.get("/books");
    return response.data.data;
  });

  const handlePromo = async (id) => {
    const data = {
      status: "promo",
    };

    const body = JSON.stringify(data);
    await API.patch(`/book-promo/${id}`, body);
    refetch();
  };

  let handleDelete = async (id) => {
    await API.delete(`/book/` + id);
    refetch();
  };

  return (
    <>
      <Container className="mt-5">
        <Row md={4}>
          {listBook?.map((items) => (
            <Col className="m-4">
              <Card style={{ width: "18rem" }}>
                <Card.Img variant="top" src={items.image} alt="" />
                <Card.Body>
                  <Card.Title>{items.Title}</Card.Title>
                  <Card.Text>
                    <p className="fw-bold">{items.desc}</p>
                    <p style={{ marginBottom: "-5px" }}>Rp. {items.price}</p>
                  </Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                  <ListGroup.Item className="d-flex justify-content-between">
                    <Button
                      className="me-2"
                      onClick={() => {
                        if (window.confirm("Add to promo list?")) {
                          handlePromo(items?.id);
                        }
                      }}
                    >
                      Add Highlight
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        if (window.confirm("Delete the item?")) {
                          handleDelete(items?.id);
                        }
                      }}
                    >
                      Delete
                    </Button>

                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Discount</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email Discount (in %)</Form.Label>
              <Form.Control type="email" placeholder="" />
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button className="px-5" variant="warning" type="add discount">
                Submit
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal> */}
    </>
  );
}
