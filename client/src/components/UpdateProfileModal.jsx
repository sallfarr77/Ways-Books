import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { API } from "../config/api";
import Swal from "sweetalert2";

export default function UpdateProfileModal(props) {
  const user = props.user;
  const success = props.handleSuccess;
  const refetch = props.refetch
  const [imageUrl, setImageUrl] = useState(user.photo);
  const [formUpdateProfile, setFormUpdateProfile] = useState({
    gender: user?.profile?.gender || "",
    phone: user?.profile?.phone || "",
    address: user?.profile?.address || "",
    photo: user?.profile?.photo || "",
  });

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;

    if (type === "file") {
      setFormUpdateProfile({
        ...formUpdateProfile,
        [name]: files,
      });

      const url = URL.createObjectURL(files[0]);
      setImageUrl(url);
    } else {
      setFormUpdateProfile({
        ...formUpdateProfile,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("kontol", formUpdateProfile);
      // Store data with FormData as object
      const formData = new FormData();
      formData.set("gender", formUpdateProfile.gender);
      formData.set("phone", formUpdateProfile.phone);
      formData.set("address", formUpdateProfile.address);

      if (formUpdateProfile.photo) {
        formData.set("photo", formUpdateProfile.photo[0]);
      }

      // Configuration
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };
      // await disini berfungsi untuk menunggu sampai promise tersebut selesai dan mengembalikkan hasilnya
      const response = await API.patch("/profile", formData, config);
      console.log(response.data);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Update Photo Success",
        showConfirmButton: false,
        timer: 1500,
      });
      success()
      refetch()
    } catch (error) {
      console.log(error);
    }
  };
  const preview = imageUrl || formUpdateProfile.photo;
  return (
    <>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3 text-white" controlId="">
            <Form.Label>Gender</Form.Label>
            <Form.Control
              name="gender"
              type="text"
              value={formUpdateProfile.gender}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3 text-white" controlId="">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="number"
              name="phone"
              value={formUpdateProfile.phone}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3 text-white" controlId="">
            <Form.Label>Address</Form.Label>
            <Form.Control
              name="address"
              value={formUpdateProfile.address}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="">
            <div className=" rounded border-opacity-25">
              <img
                src={preview}
                style={{
                  maxWidth: "150px",
                  maxHeight: "150px",
                  objectFit: "cover",
                  marginBottom: "15px",
                  borderRadius: "10px",
                }}
                alt=""
              />
              <Form.Control
                type="file"
                name="photo"
                accept="image/*"
                id="addProductImage"
                onChange={handleChange}

                style={{
                  borderColor: "black",
                  borderWidth: "3px",
                  backgroundColor: "#FFF3F7",
                }}
              />
            </div>
          </Form.Group>

          <div className="d-flex justify-content-center">
            <Button
              type="submit"
              className="w-75 mx-2 text-center fw-bold text-white"
              variant="warning"
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Container>
    </>
  );
}
