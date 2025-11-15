import React from "react";

const Avatar = ({ src, alt, size = 40 }) => {
    return (
        <img
            src={src}
            alt={alt}
            className="rounded-full object-cover"
            style={{ width: size, height: size }}
        />
    );
};

export default Avatar;
