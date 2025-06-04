import React, { useState } from "react";
import "./Cart.css";

const Cart = ({
	cart,
	updateQuantity,
	removeFromCart,
	showCart,
	setShowCart,
}) => {
	const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
	const totalPrice = cart.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);

	return (
		<>
			<button className="cart-button" onClick={() => setShowCart(!showCart)}>
				Корзина ({totalItems})
			</button>

			{showCart && (
				<div className="cart-modal">
					<div className="cart-content">
						<h2>Корзина</h2>
						{cart.length === 0 ? (
							<p>Ваша корзина пуста</p>
						) : (
							<>
								<div className="cart-items">
									{cart.map((item) => (
										<div key={item.id} className="cart-item">
											<img src={item.image} alt={item.name} />
											<div className="cart-item-details">
												<h4>{item.name}</h4>
												<p>{item.price} V-Bucks</p>
												<div className="quantity-controls">
													<button
														onClick={() =>
															updateQuantity(item.id, item.quantity - 1)
														}
													>
														-
													</button>
													<span>{item.quantity}</span>
													<button
														onClick={() =>
															updateQuantity(item.id, item.quantity + 1)
														}
													>
														+
													</button>
												</div>
											</div>
											<button
												className="remove-item"
												onClick={() => removeFromCart(item.id)}
											>
												×
											</button>
										</div>
									))}
								</div>
								<div className="cart-summary">
									<h3>Итого: {totalPrice} V-Bucks</h3>
								</div>
							</>
						)}
						<button className="close-cart" onClick={() => setShowCart(false)}>
							Закрыть
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default Cart;
