import { USER_SERVICE } from "../../config/endpoints.js";

async function UpdateUser(uid, newAddress) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${USER_SERVICE}/api/users/${uid}/add-address`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ address: newAddress }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `UpdateAddress failed: ${response.status}`);
    }

    console.log("User document updated with new address:", newAddress);
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
}

export default UpdateUser;
