import { CART_SERVICE } from "../../config/endpoints.js";

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