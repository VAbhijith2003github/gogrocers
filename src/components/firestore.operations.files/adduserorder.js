const ORDER_SERVICE = "http://65.2.10.164";

async function AddUserOrder(userid, order) {
  try {
    const token = localStorage.getItem("token");
    
    // Map fields for backend Kafka producer/Mailer compatibility
    const augmentedOrder = {
      ...order,
      items: order.orderdetail, // Backend expects 'items' for Mailer
      total: order.totalPrice,   // Backend expects 'total' for Mailer
      address: order.deliveryaddress // Backend expects 'address' for Mailer
    };

    const response = await fetch(`${ORDER_SERVICE}/api/orders/${userid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ order: augmentedOrder }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `AddUserOrder failed: ${response.status}`);
    }

    console.log("Order placed successfully via API.");
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
}

export default AddUserOrder;
