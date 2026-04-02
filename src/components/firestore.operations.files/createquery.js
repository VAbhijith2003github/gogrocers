const QUERY_SERVICE = "https://query-service-production.up.railway.app";

async function CreateQuery(userid, userEmail, query) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${QUERY_SERVICE}/api/queries/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ uid: userid, email: userEmail, query }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `CreateQuery failed: ${response.status}`);
    }

    console.log("Query submitted via API.");
  } catch (error) {
    console.error("Error submitting query:", error);
    throw error;
  }
}

export default CreateQuery;
