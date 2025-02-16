import React from "react";
import { navContent } from "../../content/NavContent";
import { Link } from "react-router-dom";
import authenticationApi from "../../api/authenticationApi";

const NavDesktop = () => {
	return (
		<div className="flex gap-4">
			{navContent.length > 0 &&
				navContent.map((item, index) => (
					<Link
						className="p-2 text-2xl font-semibold capitalize list-none transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:text-red"
						key={index}
						to={item.to}
					>
						{item.title}
					</Link>
				))}

			{authenticationApi.isAdmin() && (
				<Link
					className="p-2 text-2xl font-semibold capitalize list-none transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:text-red"
					to="/dashboard"
				>
					Dashboard
				</Link>
			)}
		</div>
	);
};

export default NavDesktop;
