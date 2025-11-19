const fs = require("fs");
const path = require("path");

function getProductData() {
  const filePath = path.join(process.cwd(), "data", "products.json");
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { prompt } = req.body || {};
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    if (!process.env.GEMINI_API_KEY)
      return res.status(500).json({ error: "Gemini API key missing" });

    // --- Gemini request ---
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const query = `
    You are a grocery shopping assistant.
    The user wants ingredients or supplies for: "${prompt}".
    Respond ONLY with a JSON array of ingredient or supplies strings which are buyable materials.
    The response should be in the following format: example for a chocolate cake, respond with
    ["flour", "sugar", "cocoa powder", "eggs", "butter", "baking powder", "vanilla extract","butter","egg","maida"]
    `;

    const result = await model.generateContent(query);

    const raw = await result.response.text();

    console.log("AI raw response:", raw);

    let ingredients;

    try {
      ingredients = JSON.parse(
        raw
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim()
      );
    } catch (e) {
      return res.status(500).json({
        error: "AI response was not valid JSON",
        ai_raw_response: raw,
      });
    }

    // --- match ingredients with products.json ---

    const allProducts = getProductData();

    let matches = [];

    for (const ing of ingredients) {
      const term = String(ing).toLowerCase();

      matches.push(
        ...allProducts.filter((p) => p.name?.toLowerCase().includes(term))
      );
    }

    // ---------------------------------------------------------
    // 🛑 CHANGED CODE STARTS HERE
    // ---------------------------------------------------------

    // pruning irrelavant searches using gemini pro
    
    // We create a variable to hold the final result.
    // By default, it equals 'matches' (the unpruned list).
    let finalMatches = matches;
    let responseSource = "gemini-broad"; // To track if pruning happened
    matches = matches.slice(0,200); // Defensive copy

    try {
        // Only attempt pruning if we actually have matches
        if (matches.length > 0) {
            let input_string = "";
            for (const match of matches) {
              input_string += match.name + ", ";
            }

            const model2 = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
            
            const query2 = `
              You are a grocery shopping assistant.
              The user is looking for ingredients for: "${prompt}".
              From the following list of product names: "${input_string}"
              return a JSON array (no extra text) with the names of only the relevant products to fulfill the user's request.
              Example: ["name1", "name2"]
            `;
            
            const result2 = await model2.generateContent(query2);
            const raw2 = await result2.response.text();

            // try to parse AI response as a JSON array of product names
            let keepList = [];
            keepList = JSON.parse(
                raw2
                  .replace(/```json/g, "")
                  .replace(/```/g, "")
                  .trim()
            );
              
            if (!Array.isArray(keepList)) keepList = [];

            const prunedMatches = [];
            // filter matches by the names returned by the AI (case-insensitive)
            for (const match of matches) {
              if (
                keepList.some(
                  (k) =>
                    String(k).toLowerCase().trim() ===
                    String(match.name).toLowerCase().trim()
                )
              ) {
                prunedMatches.push(match);
              }
            }
            
            // ✅ SUCCESS: We updated the final result
            finalMatches = prunedMatches;
            responseSource = "gemini-pruned";
        }
    } catch (pruningError) {
        // ⚠️ OVERLOAD / ERROR HANDLING
        // If model2 is overloaded (503), crashes, or returns bad JSON:
        // We Log it, but we DO NOT crash the response.
        // The code proceeds using the original 'finalMatches' (which is just 'matches').
        console.warn("⚠️ Pruning skipped (AI Overloaded or Error). Returning broad matches.");
        console.warn("Error details:", pruningError.message);
    }

    return res.status(200).json({
      products: finalMatches,
      ingredients,
      source: responseSource,
    });

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};