const USER_SERVICE = "http://65.2.10.164";

async function UpdateUser(uid, name, phonenumber) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${USER_SERVICE}/api/users/${uid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, phonenumber }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `UpdateUser failed: ${response.status}`);
    }

    console.log("User document updated:", { name, phonenumber });
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export default UpdateUser;
