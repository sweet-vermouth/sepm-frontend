import React from "react";
import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import OTPPage from "../views/OTPPage";
import LoginPage from "../views/LoginPage";
import AboutPage from "../views/AboutPage";
import RegisterPage from "../views/RegisterPage";
import HomePage from "../views/HomePage";
import VerifyEmailPage from "../views/VerifyEmailPage";
import NotFoundPage from "../views/NotFoundPage";
import DetailPage from "../views/DetailPage";
import ProfilePage from "../views/ProfilePage";
import CartPage from "../views/CartPage";
import OrderSuccessPage from "../views/OrderSuccessPage";
import RegisterFailPage from "../views/RegisterFailPage";
import DishesPage from "../views/DishesPage";
import DashBoardPage from "../views/DashBoardPage";
import SearchPage from "../views/SearchPage";
import OrderDetailPage from "../views/OrderDetailPage";
import PricePage from "../views/PricePage";

const AnimatedRoutes = () => {
	const location = useLocation();
	return (
		<AnimatePresence>
			<Routes location={location} key={location.pathname}>
				<Route path="/" element={<HomePage />} />
				<Route path="/detail/:foodId" element={<DetailPage />} />
				<Route path="/otp/:username/:hash" element={<OTPPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/about" element={<AboutPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/verify-email" element={<VerifyEmailPage />} />
				<Route path="/profile" element={<ProfilePage />} />
				<Route path="/cart" element={<CartPage />} />
				<Route path="/order-success" element={<OrderSuccessPage />} />
				<Route path="/fail/:msg" element={<RegisterFailPage />} />
				<Route path="/dishes/:category" element={<DishesPage />} />
				<Route path="/dashboard" element={<DashBoardPage />} />
				<Route path="/search/:search" element={<SearchPage />} />
				<Route path="/order-detail" element={<OrderDetailPage />} />
				<Route
					path="/food/:minPrice/:maxPrice"
					element={<PricePage />}
				/>

				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</AnimatePresence>
	);
};

export default AnimatedRoutes;
