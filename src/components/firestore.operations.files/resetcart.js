const CART_SERVICE = "https://cart-service-production-6202.up.railway.app";

async function ResetCart(uid) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${CART_SERVICE}/api/cart/${uid}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `ResetCart failed: ${response.status}`);
    }

    console.log("Cart cleared via API.");
  } catch (error) {
    console.error("Error resetting cart:", error);
    throw error;
  }
}

export default ResetCart;