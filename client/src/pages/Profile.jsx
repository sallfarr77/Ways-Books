import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Button, Container } from 'react-bootstrap';
import { useMutation, useQuery } from 'react-query';
import Swal from 'sweetalert2';
import NavbarUser from '../components/Navbar';
import PurchasedBooks from '../components/PurchasedBooks';
import UpdateProfileModal from '../components/ModalUpdatesP';
import email from '../assets/email.png';
import gender from '../assets/gender.png';
import phone from '../assets/phone.png';
import map from '../assets/map.png';
import { UserContext } from '../context/userContext';
import { API } from '../config/api';

export default function ProfilePage() {
    const [showShipping, setShowShipping] = useState(null);
    const [showSuccess, setShowsuccess] = useState(null);
    const handleShowShipping = () => setShowShipping(true);
    const handleCloseShipping = () => setShowShipping(false);
    const popSuccess = () => {
        setShowsuccess(true);
        setShowShipping(false);
      };

      const [state] = useContext(UserContext);
  const { data: user, refetch } = useQuery('profileCachessss', async () => {
    const response = await API.get('/user-info');
    return response.data.data;
  });

  return (
    <>
      <NavbarUser />
      <Container
        className="py-4 rounded mt-5"
        style={{ backgroundColor: 'pink', width: '60%' }}
      >
        <Row>
          <Col sm={8}>
            <div className="mb-3 d-flex">
              <div className="d-flex align-items-center me-3">
                <img src={email} alt="" />
              </div>
              <div>
                <span className="d-block fw-bold" style={{ fontSize: '14px' }}>
                  {user?.email}
                </span>
                <span className="text-muted" style={{ fontSize: '12px' }}>
                  Email
                </span>
              </div>
            </div>
            <div className="mb-3 d-flex">
              <div className="d-flex align-items-center me-3">
                <img src={gender} alt="" />
              </div>
              <div>
                <span className="d-block fw-bold" style={{ fontSize: '14px' }}>
                  {user?.profile?.gender}
                </span>
                <span className="text-muted" style={{ fontSize: '12px' }}>
                  Gender
                </span>
              </div>
            </div>
            <div className="mb-3 d-flex">
              <div className="d-flex align-items-center me-3">
                <img src={phone} alt="" />
              </div>
              <div>
                <span className="d-block fw-bold" style={{ fontSize: '14px' }}>
                  {user?.profile?.phone}
                </span>
                <span className="text-muted" style={{ fontSize: '12px' }}>
                  Phone
                </span>
              </div>
            </div>
            <div className="mb-3 d-flex">
              <div className="d-flex align-items-center me-3">
                <img src={map} alt="" />
              </div>
              <div>
                <span className="d-block fw-bold" style={{ fontSize: '14px' }}>
                  {user?.profile?.address}
                </span>
                <span className="text-muted" style={{ fontSize: '12px' }}>
                  Addres
                </span>
              </div>
            </div>
          </Col>
          <Col sm={4}>
            <div className="d-flex justify-content-center mb-4">
              <img
                src={ user?.profile?.photo}
                alt={phone}
                style={{ width: '60%' }}
              />
            </div>
            <div className="d-flex justify-content-center ">
              <Button
             onClick={handleShowShipping}
                variant="danger"
                className="px-5"
                type="submit"
              >
                Edit Profile
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
      <PurchasedBooks />
      <UpdateProfileModal
       show={showShipping} onHide={handleCloseShipping} handleSuccess={popSuccess}
       user={user} refetch={refetch} 
      />
    </>
  );
}
