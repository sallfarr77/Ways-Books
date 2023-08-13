import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { Modal, Form, } from 'react-bootstrap';
import { API } from '../../config/api';


import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const Swal2 = withReactContent(Swal)

export default function Register({ modalRegister, setModalRegister, switchLogin }) {



    const [form, setForm] = useState({
        fullname: "",
        email: "",
        password: "",

    })

    console.log(form);

    const handleOnChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.type === 'file' ? e.target.files : e.target.value
        })
    }
    console.log(form)

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault()



            console.log(form);
            const response = await API.post('/register', form)
            // setMessage(alert)

            if (response?.status === 200) {


                Swal2.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'REGISTER SUCCESS',
                    showConfirmButton: false,
                    timer: 2000
                })
                setModalRegister(false)
                switchLogin(true)
            }


        } catch (error) {
            console.log(error);
        }
    })

    return (
        <>
            <Modal

                size='md p-4'
                // style={{ width: '50rem', alignContent: 'center' }}
                centered
                show={modalRegister}
                onHide={() => setModalRegister(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header className='d-flex justify-content-center'>
                    <h4 style={{
                        fontFamily: "times new roman",
                        fontSize: "36px",
                        fontWeight: "bold"
                    }} >Register</h4>
                </Modal.Header>

                <Form
                    onSubmit={(e) => handleSubmit.mutate(e)}
                    className='m-3'   >
                    {/* {message} */}
                    <div className='overflow-auto px-2'
                    //  style={{ height: '45vh' }}
                    >

                        <Form.Group className="mb-4 mt-4" controlId="nameId">
                            <Form.Control
                                onChange={handleOnChange}
                                id='name' className="bg-lightgray border-0" name='name' placeholder="Name" type="text" />
                        </Form.Group>

                        <Form.Group className="mb-4 mt-4" controlId="formBasicEmail">
                            <Form.Control
                                onChange={handleOnChange}
                                id='email' className="bg-lightgray border-0" name='email' placeholder="Email" type="email" />
                        </Form.Group>

                        <Form.Group className="mb-4 mt-4" controlId='passwordId'>
                            <Form.Control
                                onChange={handleOnChange}
                                id='password' className="bg-lightgray border-0" name='password' placeholder="Password" type="password" />
                        </Form.Group>

                        {/* <Form.Group className="mb-4 mt-4">
                            <Form.Control
                                onChange={handleOnChange}
                                id='gender' className="bg-lightgray border-0" name='gender' placeholder="gender" type="text" />
                        </Form.Group>

                        <Form.Group className="mb-4 mt-4">
                            <Form.Control
                                onChange={handleOnChange}
                                id='name' className="bg-lightgray border-0" name='address' placeholder="address" type="text" />
                        </Form.Group> */}


                    </div>

                    <Form.Group className="mb-4 mt-4" controlId='passwordId'>
                            <Form.Control
                                onChange={handleOnChange}
                                id='password' className="bg-lightgray border-0" name='password' placeholder="Password" type="submit" />
                        </Form.Group>
                    <Form.Label className='d-flex justify-content-center pt-3 pb-2'>
                        <span>already have an account? click <span className='fw-bolder pointer' onClick={() => { setModalRegister(false); switchLogin(true) }} >here</span></span>
                    </Form.Label>
                </Form>
            </Modal>
        </>
    )
}