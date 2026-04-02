const CART_SERVICE = "https://cart-service-production-6202.up.railway.app";

async function UpdateCart(uid, cart) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${CART_SERVICE}/api/cart/${uid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cart }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `UpdateCart failed: ${response.status}`);
    }

    console.log("Cart updated via API.");
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
}

export default UpdateCart;