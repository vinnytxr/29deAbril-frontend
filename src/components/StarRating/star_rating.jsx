import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function StarRating({ value }) {
  const fullStars = Math.floor(value);
  const halfStars = Math.ceil(value - fullStars);
  const emptyStars = 5 - fullStars - halfStars;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-warning" />);
  }

  if (halfStars > 0) {
    stars.push(<FontAwesomeIcon key={stars.length} icon={faStar} className="text-warning" style={{ opacity: 0.5 }} />);
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FontAwesomeIcon key={stars.length} icon={faStar} className="text-secondary" />);
  }

  return (
    <div>
      <div>
        {stars}
        <span style={{ marginLeft: '0.5rem', fontSize: '1.2rem', fontWeight: 'bold', }}>{value} / 5 </span>
      </div>
    </div>
  );
}

export default StarRating;