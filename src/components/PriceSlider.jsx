// src/components/PriceRangeSlider.js

import { useState } from "react";
import Slider from "react-rangeslider";


const PriceRangeSlider = () => {
  const [priceRange, setPriceRange] = useState([0, 2000]); // Default range [min, max]

  const handleChange = (newRange) => {
    setPriceRange(newRange);
  };

  return (
    <div className="price-range-slider">
      <h3>
        Price: ${priceRange[0]} - ${priceRange[1]}
      </h3>
      <Slider
        className="horizontal-slider"
        thumbClassName="thumb"
        trackClassName="track"
        min={0}
        max={2000}
        step={50}
        value={priceRange}
        onChange={handleChange}
        withTracks={true}
        ariaLabel={["Lower thumb", "Upper thumb"]}
        ariaValuetext={(state) => `Price: ${state.valueNow}`}
      />
    </div>
  );
};

export default PriceRangeSlider;
