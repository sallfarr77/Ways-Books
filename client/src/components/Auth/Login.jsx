import React, { useState } from 'react'
import { useContext } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useMutation } from 'react-query';
import { API } from '../../config/api';
import { UserContext } from '../../context/userContext';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const Swal2 = withReactContent(Swal)

export default function Login({ modalLogin, setModalLogin, switchRegister}) {

    const [, dispatch] = useContext(UserContext)

    const [formLogin, setFormLogin] = useState({
        email: "",
        password: "",
        // role: "user"
    })

    const handleChange = (e) => {
        setFormLogin({
            ...formLogin,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault()
    
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
    
            const response = await API.post('/login', formLogin, config)
    
            if (response?.status === 200) {
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: response.data.data
                })
    
                setModalLogin(false)
                Swal2.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'LOGIN SUCCESS',
                    showConfirmButton: false,
                    timer: 2000
                })
            }

        } catch (error) {
            console.log(error);
        }
    })
    

    return (
        <>
            <Modal
                size="sm"
                centered
                show={modalLogin}
                onHide={() => setModalLogin(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header className='d-flex justify-content-center'>
                    <h4 style={{
                        fontFamily: "times new roman",
                        fontSize: "36px",
                        fontWeight: "bold"
                    }} >Login</h4>
                </Modal.Header>
                <Form
                    onSubmit={(e) => handleSubmit.mutate(e)}
                    className='p-2' >

                    <Form.Group className="mb-4 mt-4" controlId="formBasicEmail">
                        <Form.Control id='email' className="bg-lightgray border-0" name='email' onChange={handleChange} placeholder="Email" type="email" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control id='password' className="bg-lightgray border-0" name='password' onChange={handleChange} placeholder="Password" type="password" />
                    </Form.Group>

                    <Button className='w-100 bg-dark border-0 text-white fw-bolder mt-4' type="submit">
                        Login
                    </Button>
                    <Form.Label className='d-flex justify-content-center pt-3 pb-2'>
                        <span>don't have an account? click <span onClick={() => { setModalLogin(false); switchRegister(true) }} className='fw-bolder pointer'>here</span></span>
                    </Form.Label>
                </Form>
            </Modal>
        </>
    )
}