import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ShopComponent.css";
import Header from "./header";

const ShopComponent = () => {
  const [shopItems, setShopItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const response = await axios.get(
          "https://fortniteapi.io/v2/shop?lang=en",
          { headers: { Authorization: `5cf95d13-309ee665-2e625ba4-51cb7a33` } }
        );

        if (response.data.result && response.data.shop) {
          const processedItems = response.data.shop.map((item) => {
            const rarity = item.rarity
              ? item.rarity.name || "Unknown"
              : "Unknown";

            const price = item.price
              ? {
                  final: item.price.finalPrice || 0,
                  regular: item.price.regularPrice || 0,
                }
              : { final: 0, regular: 0 };

            let imageUrl =
              "https://www.internetmatters.org/wp-content/uploads/2024/10/Fortnite-image.jpg";
            if (item.displayAssets && item.displayAssets[0]) {
              imageUrl =
                item.displayAssets[0].background ||
                item.displayAssets[0].url ||
                imageUrl;
            } else if (
              item.granted &&
              item.granted[0] &&
              item.granted[0].images
            ) {
              imageUrl = item.granted[0].images.icon || imageUrl;
            }

            return {
              id: item.mainId || Math.random().toString(36).substr(2, 9),
              name: item.displayName || "Unknown Item",
              price: price.final,
              originalPrice: price.regular,
              rarity: rarity,
              image: imageUrl,
              type: item.mainType || "unknown",
              description: item.displayDescription || "",
            };
          });

          setShopItems(processedItems);
        } else {
          setError("No shop data available");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, []);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>Загружаем товары...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-screen">
      <div className="error-icon">⚠️</div>
      <p>Произошла ошибка: {error}</p>
    </div>
  );

  return (
    <div className="shop-wrapper">
      <Header
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        showCart={showCart}
        setShowCart={setShowCart}
      />

      <main className="shop-main">

        <div className="products-container">
          {shopItems.map((item) => (
            <article 
              key={item.id} 
              className="product-card"
              data-rarity={item.rarity.toLowerCase()}
            >
              <div className="card-media">
                <div className="image-wrapper">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/200";
                    }}
                  />
                </div>
                {item.originalPrice > item.price && (
                  <div className="sale-sticker">
                    <span className="sale-percent">
                      {Math.round((1 - item.price / item.originalPrice) * 100)}%
                    </span>
                    <span className="sale-text">СКИДКА</span>
                  </div>
                )}

              </div>

              <div className="card-body">
                <div className="product-meta">
                  <span className="product-category">{item.type}</span>
                  <span className="product-rarity">{item.rarity}</span>
                </div>
                <h3 className="product-name">{item.name}</h3>
                
                <div className="price-section">
                  {item.originalPrice > item.price ? (
                    <>
                      <span className="old-price">{item.originalPrice} V-B</span>
                      <span className="current-price">{item.price} V-B</span>
                    </>
                  ) : (
                    <span className="normal-price">{item.price} V-B</span>
                  )}
                </div>

                {item.description && (
                  <p className="product-description">{item.description}</p>
                )}

                <button 
                  className="cart-action-btn"
                  onClick={() => addToCart(item)}
                >
                  <span>В корзину</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ShopComponent;