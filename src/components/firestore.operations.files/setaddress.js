const USER_SERVICE = "https://user-service-production-43f5.up.railway.app";

async function SetUser(uid, Addresses) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${USER_SERVICE}/api/users/${uid}/set-address`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ addresses: Addresses }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `SetAddress failed: ${response.status}`);
    }

    console.log("Addresses overwritten successfully.");
  } catch (error) {
    console.error("Error setting address:", error);
    throw error;
  }
}

export default SetUser;