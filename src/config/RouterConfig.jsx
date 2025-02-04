import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import QuizApp from '../pages/QuizApp';
import PrivateRoute from './PrivateRoute';

function RouterConfig() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/register" element={<Register />} />
            <Route path="/quizApp" element={<PrivateRoute><QuizApp /></PrivateRoute>} />
        </Routes>
    );
}

export default RouterConfig;