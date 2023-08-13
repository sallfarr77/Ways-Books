import React from 'react'
import { Container, Row, Col, Card, } from 'react-bootstrap'
import { API } from '../config/api'
import { useQuery } from 'react-query'


export default function PurchasedBooks() {
    let { data: purchasedBook } = useQuery("transUserCache", async () => {
        const response = await API.get("/books-user")

        return response.data.data
    })

    console.log("purchased books", purchasedBook);

    return (
        <>
            <div className='d-flex justify-content-center' >
                <hr className='colored' style={{ width: "100%", marginTop: "5rem" }} />
            </div>
            <p className='text-center py-3' style={{
                fontFamily: "time new roman",
                fontSize: "36px",
            }}>
                My Books
            </p>
            <Container className='my-5 d-flex'>
                <Row xs={1} md={4} >
                    {purchasedBook?.map((e, index) => {
                        return (
                            <div className='d-flex mx-5' key={index}>
                                {e.cart.map((a, index) => {
                                    return (
                                        <>

                                            <Col key={index}>
                                                <Card className='border-0 p-4' style={{ width: '18rem' }}>
                                                    <img className='rounded' src={a.book.image} alt=''></img>
                                                    <p style={{
                                                        fontFamily: "times new roman",
                                                        fontSize: "24px"
                                                    }}>{a.book.title}</p>
                                                    <p className='text-muted' style={{
                                                        fontStyle: "italic",
                                                        fontSize: "14px"
                                                    }}>by {a.book.author}</p>
                                                    <button
                                                        onClick={() => { window.location.href = `${a.book.filePDF}` }}
                                                        // onClick={() => a.book.filePDF}
                                                        className='my-2 py-2' style={{
                                                            border: 0,
                                                            color: "white",
                                                            backgroundColor: "black",
                                                            fontSize: "18px"
                                                        }} > Download </button>
                                                </Card>
                                            </Col>
                                        </>
                                    )
                                })}
                            </div>
                        )
                    })}




                </Row>
            </Container>
        </>
    )
}
