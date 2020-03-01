import React from 'react';
import { CSSTransition } from 'react-transition-group';
import '../assets/styles/PageAnimation.css';

const PageAnimation = ({ children }) => {
    return (
        <CSSTransition
            transitionName="homeTransition"
            transitionAppear={true}
            transitionAppearTimeout={500}
            transitionEnter={false}
            transitionLeave={false}
        >
          {children}
        </CSSTransition>
    )
}

export default PageAnimation;