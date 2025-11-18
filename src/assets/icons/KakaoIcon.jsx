import React from 'react';

const KakaoIcon = ({ size = 20 }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12 3C6.477 3 2 6.477 2 10.75C2 13.447 3.836 15.804 6.574 17.145L5.5 21L9.768 18.594C10.474 18.698 11.222 18.75 12 18.75C17.523 18.75 22 15.273 22 11C22 6.727 17.523 3 12 3Z"
                fill="#3C1E1E"
            />
        </svg>
    );
};

export default KakaoIcon;
