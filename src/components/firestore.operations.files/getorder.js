const ORDER_SERVICE = "https://65.2.10.164.sslip.io";

async function GetOrder(userid) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${ORDER_SERVICE}/api/orders/${userid}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log("No orders found for UID:", userid);
        return null;
      }
      throw new Error(`GetOrder failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("Orders retrieved:", data);
    return data;
  } catch (error) {
    console.error("Error getting orders:", error);
    throw error;
  }
}

export default GetOrder;