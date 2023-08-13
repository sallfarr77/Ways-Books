import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { useEffect } from 'react';
import { useContext } from 'react';
import { UserContext } from '../context/userContext';
import { Routes, Route, } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { API, setAuthToken } from '../config/api';

import HomePage from '../pages/Home';
import DetailBookPage from '../pages/DetailBook';
import ProfilePage from '../pages/Profile';
import AddBookPage from '../pages/AddBook';
import AdminPage from '../pages/AdminPage';
import CartPage from '../pages/CartPage';



export default function RoutesPage() {

  const navigate = useNavigate()
  if (localStorage.token) {
    setAuthToken(localStorage.token)
  }
  const [state, dispatch] = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (state.isLogin === false) {
      navigate('/');
    } else {
      if (state.user.role === 'admin') {
        navigate('/income');
      } else if (state.user.role === 'user') {
        navigate('/');
      }
    }
  }, [state]);


  const checkUser = async () => {
    try {
      const response = await API.get('/check-auth')

      if (response.status === 404) {
        return dispatch({
          type: 'AUTH_ERROR',
        })
      }

      let payload = response.data.data
      payload.token = localStorage.token

      dispatch({
        type: 'USER_SUCCESS',
        payload,
      });
      console.log(state);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      checkUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
    {isLoading ? ( <></>) : (
      
    <>
      <Routes>
        <Route exacth path="/" element={< HomePage />} />
        <Route exacth path="/profile" element={< ProfilePage />} />
        <Route exacth path="/cart" element={< CartPage />} />
        <Route exacth path="/detail/:id" element={< DetailBookPage />} />
        <Route exacth path="/add-book" element={< AddBookPage />} />
        <Route exacth path="/income" element={< AdminPage />} />
       
      </Routes>
    </>
    )}
    </>
)
}




