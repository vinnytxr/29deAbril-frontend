import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function StarRating({ value, textSize='1.1rem', starSize='14' }) {
  const fullStars = Math.floor(value);
  const halfStars = Math.ceil(value - fullStars);
  const emptyStars = 5 - fullStars - halfStars;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-warning" style={{fontSize:starSize}}/>);
  }

  if (halfStars > 0) {
    stars.push(<FontAwesomeIcon key={stars.length} icon={faStar} className="text-warning" style={{ opacity: 0.5, fontSize:starSize}} />);
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FontAwesomeIcon key={stars.length} icon={faStar} className="text-secondary" style={{fontSize:starSize}}/>);
  }

  return (
    <div>
      <div>
        {stars}
        <span style={{ marginLeft: '0.5rem', fontSize: textSize, fontWeight: 'bold', }}>{value} / 5 </span>
      </div>
    </div>
  );
}

export default StarRating;