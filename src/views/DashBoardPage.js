import React, { useState, useEffect } from "react";
import FoodCard from "../components/dishes/FoodCard";
import Footer from "../components/footer/Footer";
import NavBar from "../components/header/NavBar";
import axios from "axios";
import Button from "../utilities/Button";
import { BsFillPlusCircleFill, BsFillPenFill } from "react-icons/bs";
import { AiFillDelete, AiFillEye } from "react-icons/ai";
import DashboardModal from "../components/dashboard/DashboardModal";
import ImgFrame from "../utilities/ImgFrame";
import search from "../assets/svg/search.svg";
import EditModal from "../components/dashboard/EditModal";
import { io } from "socket.io-client";
import OrderCard from "../components/order/OrderCard";
import { ReactNotifications } from "react-notifications-component";
import { Store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import authenticationApi from "../api/authenticationApi";
import { useNavigate } from "react-router-dom";

const DashBoardPage = () => {
	const [dishes, setDishes] = useState([]);
	const [nextCursor, setNextCursor] = useState();
	const [query, setQuery] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [token, setToken] = useState();
	const [orders, setOrders] = useState([]);
	const [nextCursorOrder, setNextCursorOrder] = useState();

	console.log(token);
	const navigate = useNavigate();

	useEffect(() => {
		if (!authenticationApi.isAdmin()) {
			navigate("/");
		}
	}, [navigate]);

	useEffect(() => {
		const fetch = async () => {
			const response = await axios.get("/api/order/getOrders");
			console.log("get all orders: ", response);
			setOrders(response.data.results);
			setNextCursorOrder(response.data.next_cursor);
		};

		fetch();
	}, []);

	const handleSeeMoreOrder = () => {
		const fetch = async () => {
			const response = await axios.get(
				`/api/order/getOrders?next_cursor=${nextCursorOrder}`
			);

			console.log(response);

			setOrders([...orders, ...response.data.results]);
		};

		fetch();
	};

	useEffect(() => {
		const fetch = async () => {
			const response = await axios.get("/api/order/getSubscriptionToken");
			console.log(response);
			setToken(response.data.token);

			const socket = io("https://food-suggestion-rmit.herokuapp.com", {
				auth: { token: response.data.token },
			});

			console.log("socket: ", socket);

			socket.emit(
				"subscribe",
				JSON.parse(localStorage.getItem("user")).userId
			);

			socket.on("notification", (payload) => {
				console.log("new order!");
				console.log(payload);

				Store.addNotification({
					title: "New Order",
					message: `${payload.user.username} has just ordered ${payload.numberOfFood} ${payload.food.foodName}`,
					type: "success",
					insert: "top",
					container: "bottom-right",
					animationIn: ["animate__animated", "animate__fadeIn"],
					animationOut: ["animate__animated", "animate__fadeOut"],
					dismiss: {
						duration: 5000,
						onScreen: true,
					},
				});
			});

			return () => {
				socket.off("notification", () => console.log("off"));
			};
		};

		fetch();
	}, []);

	const handleDel = (id) => {
		const newDishes = dishes.filter((food) => food._id !== id);
		setDishes(newDishes);
	};

	const handleAdd = (food) => {
		const add = async () => {
			console.log("add");

			const res = await axios.post(`/api/food`, food);

			console.log(res);
		};

		add();
	};

	const handleEdit = (id, food) => {
		const edit = async () => {
			console.log("edit");

			const res = await axios.patch(`/api/food/${id}`, food);

			console.log(res);
		};

		edit();
	};

	const handleGetOne = () => {
		const fetch = async () => {
			const res = await axios.get(`/api/food?foodName=${query}`);

			console.log(res);

			setDishes(res.data.results);
			setNextCursor(null);
		};

		fetch();
	};

	const handleShowMore = () => {
		if (!nextCursor) return;

		const fetch = async () => {
			const res = await axios.get(
				`/api/food/?vendor=global&next_cursor=${nextCursor}`
			);
			console.log(res);
			setDishes([...dishes, ...res.data.results]);
			setNextCursor(res.data.next_cursor);
		};
		fetch();
	};

	useEffect(() => {
		const fetch = async () => {
			const res = await axios.get(`/api/food/?vendor=global`);
			console.log(res);
			setDishes(res.data.results);
			setNextCursor(res.data.next_cursor);
		};
		fetch();
	}, []);

	const handleSeeAll = () => {
		const fetch = async () => {
			const res = await axios.get(`/api/food/?vendor=global`);
			console.log(res);
			setDishes(res.data.results);
			setNextCursor(res.data.next_cursor);
		};
		fetch();
	};

	const handleShowEdit = () => setShowEdit(true);

	return (
		<div className="page-container">
			<NavBar />

			<div className="!fixed -translate-x-1/2 right-4 bottom-4">
				<ReactNotifications />
			</div>

			<div className="my-8">
				<h3 className="my-4 text-3xl font-bold uppercase">
					Global featured dishes
				</h3>

				<div className="flex mb-12 md:mb-[30px] items-center h-[50px] justify-between mt-8 space-x-2 lg:text-2xl">
					<input
						type="text"
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Pick your favorite"
						className="w-full h-full p-3 border border-black lg:p-6 dark:placeholder:text-white md:text-xl md:placeholder:text-xl lg:text-2xl lg:placeholder:text-2xl dark:border-white placeholder:text-black input"
					/>

					<div className="cursor-pointer" onClick={handleGetOne}>
						<ImgFrame
							src={search}
							imgClassName="w-6 h-6"
							className="flex items-center justify-center h-full p-2 rounded-md w-14 bg-red"
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 place-items-center">
					{dishes?.length > 0 &&
						dishes.map((item, index) => (
							<FoodCard
								handleShowEdit={handleShowEdit}
								handleDel={handleDel}
								isAdmin
								food={item}
								key={index}
							/>
						))}
				</div>
				{nextCursor && (
					<div className="flex items-center justify-center my-8">
						<Button content="Show more" onClick={handleShowMore} />
					</div>
				)}
			</div>
			<div className="my-8 lg:my-12">
				<h3 className="my-4 text-3xl font-bold uppercase">
					Manage food
				</h3>
				<div className="grid grid-cols-2 gap-5 my-8 lg:grid-cols-4 place-items-center">
					<Button
						onClick={() => setShowModal(!showModal)}
						className="w-[75px] h-[75px] md:h-[120px] md:w-[120px]"
						content={
							<BsFillPlusCircleFill className="text-3xl md:text-4xl lg:text-5xl" />
						}
					/>
					<Button
						onClick={handleSeeAll}
						className="w-[75px] h-[75px] md:h-[120px] md:w-[120px]"
						content={
							<AiFillEye className="text-3xl md:text-4xl lg:text-5xl" />
						}
					/>
					<Button
						className="w-[75px] h-[75px] md:h-[120px] md:w-[120px]"
						content={
							<AiFillDelete className="text-3xl md:text-4xl lg:text-5xl" />
						}
					/>
					<Button
						className="w-[75px] h-[75px] md:h-[120px] md:w-[120px]"
						content={
							<BsFillPenFill className="text-3xl md:text-4xl lg:text-5xl" />
						}
					/>
				</div>
			</div>

			{showModal && <DashboardModal onAdd={handleAdd} />}
			{showEdit && <EditModal onEdit={handleEdit} />}

			<div className="my-8">
				<h3 className="my-4 text-3xl font-bold uppercase">
					Order food
				</h3>

				<div>
					{orders?.length > 0 &&
						orders.map((item) => (
							<OrderCard key={item._id} order={item} />
						))}
				</div>

				{nextCursorOrder && (
					<Button
						className="my-8"
						onClick={handleSeeMoreOrder}
						content="View more"
					/>
				)}
			</div>

			<Footer />
		</div>
	);
};

export default DashBoardPage;
