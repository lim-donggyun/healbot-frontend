import React from 'react';

const NaverIcon = ({ size = 20 }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="24" height="24" fill="#03C75A" rx="2"/>
            <path
                d="M16.273 12.845L7.376 0H0V24H7.727V11.155L16.624 24H24V0H16.273V12.845Z"
                fill="white"
            />
        </svg>
    );
};

export default NaverIcon;
