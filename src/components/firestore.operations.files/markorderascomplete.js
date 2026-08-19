import { ORDER_SERVICE } from "../../config/endpoints.js";

async function MarkOrderAsComplete(userid, order) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${ORDER_SERVICE}/api/orders/${userid}/complete`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ order }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `MarkOrderAsComplete failed: ${response.status}`);
    }

    console.log("Order marked as complete via API.");
  } catch (error) {
    console.error("Error marking order as complete:", error);
    throw error;
  }
}

export default MarkOrderAsComplete;
