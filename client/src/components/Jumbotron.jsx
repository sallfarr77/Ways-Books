import React, { useState, } from 'react'
import { useMutation } from 'react-query'
import { Container, Stack, Card, } from 'react-bootstrap'
// import { MotionAnimate } from 'react-motion-animate'
import { API } from '../config/api'
import { useQuery } from 'react-query'
import Login from './Auth/Login';
import Register from './Auth/Register';

import bg1 from '../assets/bg1.png'
import bg2 from '../assets/bg2.png'

import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import "../App.css";



// import required modules
import { FreeMode, Pagination } from "swiper";
import { useContext } from 'react'
import { UserContext } from '../context/userContext'

import { Fade, Slide, JackInTheBox } from "react-awesome-reveal";


export default function Jumbotron() {

    const navigate = useNavigate();

    const [modalLogin, setModalLogin] = useState(false)
    const [modalRegister, setModalRegister] = useState(false)

    const [state,] = useContext(UserContext)

    console.log("ini state", state);

    const { data: favorite } = useQuery("favoriteCache", async () => {
        const response = await API.get("/books-favorite")

        return response.data.data
    })


    const handleSubmit = useMutation(async (data) => {
        try {

            const form = {
                book_id: data.book_id
            }

            const response = await API.post("/cart", form)

            console.log("yang dikirim: ", form);
            alert("sukses")

        } catch (error) {

        }
    })


    return (
        <>

            <div className='d-flex justify-content-between' style={{ position: "absolute", width: "100%", zIndex:"-1"}} >
                <img src={bg1} alt='' ></img>
                <img src={bg2} alt='' ></img>
            </div>

                <JackInTheBox>

                    <Container className='d-flex justify-content-center' >
                        <p className='text-center mt-5 w-50' style={{ fontWeight: "400", fontSize: "33px" }}>
                        Belanja Mudah, Belanja Murah dan Original Langsung dari Penerbit hanya di WaysBooks Store
                        </p>
                    </Container>
                </JackInTheBox>


                <Container >
                    <Fade>
                        <Swiper
                            slidesPerView={2}
                            spaceBetween={30}
                            // freeMode={true}
                            pagination={{
                                clickable: true
                            }}
                            modules={[FreeMode, Pagination]}
                        >


                            {favorite?.map((value) => (
                                <SwiperSlide className="mySwiper bg-transparent" onClick={
                                    state.isLogin
                                      ? () => navigate(`/detail/${value?.id}`)
                                      : () => setModalLogin(true)
                                  }>
                                    <div className="container overflow-hidden text-center pb-5">
                                        <div className="row gx-5">
                                            <div className="col">
                                                <div >
                                                    <div>
                                                        <img className=' object-fit-contain' src={value?.image} alt="" ></img>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col">
                                                <div>
                                                    <Card.Body >

                                                        <Card.Title className=' text-start pb-2'
                                                            style={{ fontFamily: "Avenir", fontSize: "25px", fontWeight: "700" }}>{value?.title}</Card.Title>
                                                        <span className='text-muted  d-flex justify-content-start fw-light' style={{ fontStyle: "italic", fontSize: "16px", fontWeight: "400" }}>by. {value?.author}</span>
                                                        <Card.Text className=' text-start '>
                                                        {value?.description.substring(0,200)}...
                                                        </Card.Text>
                                                        <span className='text-success d-flex justify-content-start fw-bold' >
                                                            Rp.{value?.price}
                                                        </span>
                                                        <div className=' justify-content-center mt-5'>

                                                            <button
                                                                onClick={state.isLogin ? (() => handleSubmit.mutate({
                                                                    book_id: value?.id, total: value?.pricePromo
                                                                })) : (() => setModalLogin(true))}
                                                                className='px-5 bg-dark text-white border-0 py-1 ' >Add to Cart</button>
                                                        </div>
                                                    </Card.Body>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </Fade>
                </Container>


            <Login modalLogin={modalLogin} setModalLogin={setModalLogin} switchRegister={setModalRegister} />
            <Register modalRegister={modalRegister} setModalRegister={setModalRegister} switchLogin={setModalLogin} />
        </>
    )
}
