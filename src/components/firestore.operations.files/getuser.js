const USER_SERVICE = "https://65.2.10.164.sslip.io";

async function GetUser(userid) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${USER_SERVICE}/api/users/${userid}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log("User document not found for UID:", userid);
        return null;
      }
      throw new Error(`GetUser failed: ${response.status}`);
    }

    const userData = await response.json();
    console.log("User data retrieved:", userData);
    return userData;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
}

export default GetUser;