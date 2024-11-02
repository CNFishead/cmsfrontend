import React, { useEffect } from 'react';
import './Animatable.scss';
import { useLocation } from 'react-router-dom';

const Animatable = ({ children, shouldNotReflow }) => {
  const location = useLocation();
  useEffect(() => {
    if (!shouldNotReflow) {
      var el = document.getElementById('animated');
      el.style.animation = 'none';
      console.log(el.offsetHeight);

      el.style.animation = null;
    }
  }, [location.pathname]);

  return (
    <div className={'animate'} id="animated">
      {children}
    </div>
  );
};

export default Animatable;
