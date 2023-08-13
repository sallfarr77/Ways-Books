import React from 'react';
import { Form } from 'react-bootstrap';
import { Fade } from 'react-awesome-reveal';
import instagram from '../assets/instagram.png'
import twitter from '../assets/twitter.png'
import facebook from '../assets/facebook.png'
import logoNav from '../assets/logoNav.png'

const Footer = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#D3D3D3',
            // padding: '20px',

        }} className='punten'>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%' }}>
                <div className=''>
                    <div className='mb-2'>
                        <span className='fw-bold me-2 ' style={{ letterSpacing: "5px" }}>Join Us On:{" "} </span>

                    </div>

                    <Fade style={{ animationDuration: '2s', animationIterationCount: 'infinite' }} direction="left" triggerOnce >
                        <h1 className='fw-bold' style={{ color: "" }}>Waysbook</h1>
                        <h2 className='fw-bold' style={{ color: "coral", marginLeft: "3rem" }}>Store</h2>
                    </Fade>
                    <p style={{ marginRight: "5rem" }}>waysbook Store <br /> adalah toko buku online dengan berbagai pilihan buku berkualitas dan terlengkap.</p>

                </div>
                <img style={{ position: "absolute", marginTop: "-50px", marginLeft: "auto", marginRight: "auto" }} src={logoNav} alt='' />
                <div className=''>
                    <div>
                        <p className='fw-bold' style={{ color: "blue" }}>NEED HELP?</p>
                    </div>
                    <div className='d-flex justify-content-between' style={{ marginTop: '20px', width: "12%" }}>
                        <h5 style={{ color: 'black', fontWeight: 'bold', marginRight: '1rem' }}>Contact Us</h5>
                        <h5 style={{ color: 'black', fontWeight: 'bold', marginLeft: '5rem' }}>General Inquiries</h5>
                    </div>

                    <div className='d-flex'>
                        <p className='mx-1' style={{ marginRight: "7rem" }}>+6285252525252</p>
                        <p style={{ marginLeft: "2rem" }}>Waysbook@gmail.com</p>
                    </div>
                </div>
                <div>
                    <Form.Group className="mb-3 w-100" >
                        <Form.Label className='fw-bold'>Connect With Us</Form.Label>
                        <div className=''>
                            <div className='d-flex ' style={{ width: "14rem" }}>
                                <div style={{ width: "30%" }}>
                                    <a href="https://www.instagram.com">
                                        <img className='w-100  pe-2' src={instagram} alt='' />
                                    </a>
                                </div>
                                <div style={{ width: "30%" }}>
                                    <a href="https://www.facebook.com">
                                        <img className='w-100  pe-2' src={facebook} alt='' />
                                    </a>
                                </div>

                                <div style={{ width: "30%" }}>
                                    <a href="https://www.twitter.com">
                                        <img className='w-100  pe-2' src={twitter} alt='' />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Form.Group>
                    <h5 className='fw-bold' style={{ fontWeight: 'bold', marginBottom: '10px' }}>Website Feedback</h5>
                    <div>
                        <h5 className='fw-bold'>Jam Pelayanan</h5>
                        <p>Senin - Jumat pukul 08.00 - 17.00 WIB</p>
                        <p>(Pesan Sabtu/Mingu akan diproses Hari Senin)</p>
                    </div>


                </div>
            </div>

            <div style={{ marginTop: '20px', color: '#333', fontSize: '14px' }}>
                © {new Date().getFullYear()} Waysbook. All Rights Reserved.
            </div>
        </div>

    );
}

export default Footer;