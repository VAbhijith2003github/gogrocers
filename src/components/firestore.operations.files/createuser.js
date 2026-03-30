const USER_SERVICE = "https://user-service-production-43f5.up.railway.app";

async function CreateUser(userid, userEmail, userName) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${USER_SERVICE}/api/users/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ uid: userid, email: userEmail, name: userName }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      // 409 = user already exists — treat as success (idempotent)
      if (response.status !== 409) {
        throw new Error(err.message || `CreateUser failed: ${response.status}`);
      }
    }

    console.log("CreateUser: user ensured via API");
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export default CreateUser;
