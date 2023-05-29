import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function StarCourseRating({ value, onChange }) {
  const [hoverValue, setHoverValue] = useState(0);
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleClick = (newValue) => {
    const intValue = Math.round(newValue);
    setSelectedValue(intValue);
    onChange(intValue);
  };

  const handleMouseEnter = (newValue) => {
    setHoverValue(newValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(selectedValue);
  };

  const renderStar = (starValue, index) => {
    const starClassName = starValue <= hoverValue ? 'text-warning' : 'text-secondary';

    return (
      <FontAwesomeIcon
        key={index}
        icon={faStar}
        className={starClassName}
        onClick={() => handleClick(starValue)}
        onMouseEnter={() => handleMouseEnter(starValue)}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: 'pointer' }}
      />
    );
  };

  const stars = [];
  const starCount = 5;

  for (let i = 1; i <= starCount; i++) {
    stars.push(renderStar(i, i));
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {stars}
        <span style={{ marginLeft: '0.5rem', fontSize: '1.2rem', fontWeight: 'bold', }}>{selectedValue} / 5 </span>
      </div>
    </div>
  );
}

export default StarCourseRating;
