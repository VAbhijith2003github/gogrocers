const CART_SERVICE = "https://cart-service-production-6202.up.railway.app";

async function GetCart(userid) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${CART_SERVICE}/api/cart/${userid}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log("Cart not found for UID:", userid);
        return null;
      }
      throw new Error(`GetCart failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("Cart data retrieved:", data);
    return data;
  } catch (error) {
    console.error("Error getting cart:", error);
    throw error;
  }
}

export default GetCart;