import React, { useState, useContext } from 'react';
import './AISuggestions.css'; // Make sure the path matches where you saved the file
import $ from 'jquery';
import { MyContext } from '../App';

const AISuggestion = () => {
  const [prompt, setPrompt] = useState("");
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Default to Ingredient Mode (true)
  const [isIngredientMode, setIsIngredientMode] = useState(true);

  // --- Content Variables ---
  const heading = isIngredientMode ? "✨ AI Cooking Assistant" : "🛒 AI Event Planner";
  
  const description = isIngredientMode 
    ? "Tell me what you want to cook, and I'll find the ingredients!" 
    : "Planning a party or need supplies? Tell me what the event is!";
    
  const placeholderText = isIngredientMode 
    ? "e.g. I want to bake a chocolate cake..." 
    : "e.g. Supplies for a movie night / birthday party";
    
  const buttonText = isIngredientMode ? "Find Ingredients" : "Get Supplies";
  
  const apiEndpoint = isIngredientMode ? '/api/getSuggestion' : '/api/getSuggestion_2';

  // Helper to switch modes
  const switchMode = (mode) => {
    if (isIngredientMode === mode) return; 
    setIsIngredientMode(mode);
    setPrompt(""); 
    setSuggestedProducts([]);
    setError(null);
  };

  // --- Cart context from App ---
  const { cart, updatecart, updatecartdec } = useContext(MyContext);

  const isItemInCart = (itemName) => {
    return cart && cart.some((item) => item.name === itemName);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setSuggestedProducts([]);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSuggestedProducts(data.products);

    } catch (err) {
      console.error(err);
      setError(`Sorry, I couldn't find suggestions for that. Please check backend logic.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-container">
      
      <div className="ai-header">
        
        {/* --- SLIDER TOGGLE --- */}
        <div className="toggle-container">
          {/* The moving white background: adds 'move-right' class when in event mode */}
          <div className={`toggle-slider ${!isIngredientMode ? 'move-right' : ''}`}></div>

          {/* Left Label (Recipes) */}
          <div 
            onClick={() => switchMode(true)} 
            className={`toggle-label ${isIngredientMode ? 'active-green' : ''}`}
          >
            🍳 Recipes
          </div>

          {/* Right Label (Events) */}
          <div 
            onClick={() => switchMode(false)} 
            className={`toggle-label ${!isIngredientMode ? 'active-blue' : ''}`}
          >
            🎉 Events
          </div>
        </div>

        {/* Headings and Form */}
        <h2 className="ai-heading">{heading}</h2>
        <p className="ai-description">{description}</p>
        
        <form onSubmit={handleSearch} className="search-form">
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={placeholderText} 
            className="search-input"
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className={`search-button ${isIngredientMode ? 'btn-green' : 'btn-blue'}`}
          >
            {isLoading ? "Thinking..." : buttonText}
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}
      </div>

      {/* --- The Results Area --- */}
      {suggestedProducts.length > 0 && (
        <div className="results-section">
          <h3 className="results-heading">Suggested Items ({suggestedProducts.length})</h3>
          <div className="results-grid">

            {suggestedProducts.map((product) => (
              <div key={product.id || product.name} className="product-card">
                <div className="imgdiv" style={{ display: 'flex', justifyContent: 'center' }}>
                  { (product.src || product.image || product.img || product.thumbnail) ? (
                    <img
                      className="cardimgproduct"
                      src={product.src || product.image || product.img || product.thumbnail}
                      alt={product.name}
                      style={{ maxWidth: '120px', maxHeight: '120px', objectFit: 'contain' }}
                    />
                  ) : null }
                </div>

                <h4 className="product-name">{product.name}</h4>

                {/* Dynamically color the price based on mode */}
                <p className={`product-price ${isIngredientMode ? 'text-green' : 'text-blue'}`}>
                  {product.price}
                </p>

                <div className="infodev">
                  {isItemInCart(product.name) ? (
                    <>
                      <button
                        className="cartbuttons"
                        style={{ scale: "0.8" }}
                        onClick={() => updatecart(product)}
                      >
                        +
                      </button>
                      <button className="cartbuttons" style={{ scale: "0.8" }}>
                        {cart.find((item) => item.name === product.name)?.frequency}
                      </button>
                      <button
                        className="cartbuttons"
                        style={{ scale: "0.8" }}
                        onClick={() => updatecartdec(product)}
                      >
                        -
                      </button>
                    </>
                  ) : (
                    <button
                      className="productaddtocart"
                      onClick={() => {
                        updatecart({
                          name: product.name,
                          price: product.price,
                          src: product.src || product.image || '',
                          priceint: product.priceint || 0,
                          weight: product.weight || '',
                          unit: product.unit || 'gm',
                          type: product.type || 'ai-suggestion',
                        });

                        // mimic the small animation used elsewhere
                        try {
                          $("#addtocart").addClass("animatecart");
                          setTimeout(function () {
                            $("#addtocart").removeClass("animatecart");
                          }, 100);
                        } catch (e) {
                          // ignore if jQuery or element not present
                        }
                      }}
                    >
                      ADD
                    </button>
                  )}
                  <h4 className="productprice">{product.price}</h4>
                </div>
              </div>
            ))}

          </div>
        </div>
      )}
    </div>
  );
};

export default AISuggestion;