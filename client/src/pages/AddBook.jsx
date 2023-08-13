import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { API } from '../config/api'
import { useNavigate } from 'react-router-dom'

import { Container, Form, FloatingLabel } from 'react-bootstrap'
import NavbarAdmin from '../components/Navbar'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const Swal2 = withReactContent(Swal)



export default function AddBookPage() {

    const navigate = useNavigate()

    const [preview, setPreview] = useState(null)

    const [form, setForm] = useState({
        title: "",
        price: "",
        isbn: "",
        publication_date: "",
        pages: "",
        about: "",
        author: "",
        content: "",
        thumbnail: "",
    })

    console.log(form);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.type === "file" ? e.target.files : e.target.value,
        })

        if (e.target.type === "file" && e.target.name === "thumbnail") {
            let url = URL.createObjectURL(e.target.files[0])
            setPreview(url)
        }
    }
    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault()
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            let formData = new FormData()
            formData.set('title', form.title)
            formData.set('price', form.price)
            formData.set('isbn', form.isbn)
            formData.set('publication_date', form.publication_date)
            formData.set('pages', form.pages)
            formData.set('about', form.about)
            formData.set('author', form.author)
            formData.set('content', form.content[0])
            formData.set('thumbnail', form.thumbnail[0])

            const response = await API.post('/book', formData, form, config)
            if (response?.status === 200) {
                Swal2.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'New Book Added',
                    showConfirmButton: false,
                    timer: 2000
                })
                navigate("/")
            }
            console.log(response);

        } catch (error) {
            console.log(error);
        }
    })

    return (
        <>
            <NavbarAdmin />
            <Container className='w-50'>
                <p style={{
                    fontSize: "36px",
                    fontWeight: "bold",
                    fontFamily: "times new roman"
                }}>
                    Add Book
                </p>
                <Form
                    onSubmit={(e) => handleSubmit.mutate(e)}
                >
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control
                            name="title"
                            onChange={handleChange}
                            className='bg-lightgray' type="text" placeholder="Title" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control
                            name="author"
                            onChange={handleChange}
                            className='bg-lightgray' type="text" placeholder="Author" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            name="publication_date"
                            onChange={handleChange}
                            className='bg-lightgray' type="date" placeholder="Publication Date" />
                    </Form.Group>

                    <Form.Group className="mb-3" >
                        <Form.Control
                            name="pages"
                            onChange={handleChange}
                            className='bg-lightgray' type="text" placeholder="Pages" />
                    </Form.Group>

                    <Form.Group className="mb-3" >
                        <Form.Control
                            name="isbn"
                            onChange={handleChange}
                            className='bg-lightgray' type="text" placeholder="ISBN" />
                    </Form.Group>

                    <Form.Group className="mb-3" >
                        <Form.Control
                            name="price"
                            onChange={handleChange}
                            className='bg-lightgray' type="text" placeholder="Price" />
                    </Form.Group>

                    <FloatingLabel controlId="floatingTextarea2" label="About this book ...">
                        <Form.Control
                            name="about"
                            onChange={handleChange}
                            className='bg-lightgray'
                            as="textarea"
                            placeholder="Leave a comment here"
                            style={{ height: '150px' }}
                        />
                    </FloatingLabel>

                    <Form.Group controlId="formFile" className="my-3">
                        <Form.Label>File Book</Form.Label>
                        <Form.Control
                            name="content"
                            onChange={handleChange}
                            className='bg-lightgray' l type="file" />
                    </Form.Group>

                    <Form.Group controlId="formFile" className="my-3">
                        <img
                            src={preview}
                            style={{
                                maxWidth: "150px",
                                maxHeight: "150px",
                                objectFit: "cover",
                            }}
                            alt={preview}
                        />
                        <br />
                        <Form.Label>Image Book</Form.Label>
                        <Form.Control
                            name="thumbnail"
                            onChange={handleChange}
                            className='bg-lightgray' l type="file" />
                    </Form.Group>


                    <div className='d-flex justify-content-center mb-5 pt-3'>

                        <button className='py-2' style={{
                            border: 0,
                            width: "75%",
                            backgroundColor: "black",
                            color: "white"
                        }} type="submit">
                            Add Book
                        </button>
                    </div>
                </Form>
            </Container>
        </>
    )
}
