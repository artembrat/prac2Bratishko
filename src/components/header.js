import React from "react";
import "./header.css";
import Cart from "./cart";

export default function Header({
	cart,
	updateQuantity,
	removeFromCart,
	showCart,
	setShowCart,
}) {
	return (
		<div className="header">
			<div className="container">
				<div className="header_box">
					<div className="logo">React Shop</div>
					<Cart
						cart={cart}
						updateQuantity={updateQuantity}
						removeFromCart={removeFromCart}
						showCart={showCart}
						setShowCart={setShowCart}
					/>
				</div>
			</div>
		</div>
	);
}
