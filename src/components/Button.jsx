// src/components/Button.jsx

const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  ...props
}) => {
  // Base UI
  const baseClasses = `
    font-medium 
    rounded-xl
    transition-all 
    duration-200
    ease-out
    focus:outline-none 
    focus:ring-2 
    focus:ring-offset-2
    active:scale-[0.97]
  `;

  // Variants (nâng cấp)
  const variants = {
    primary: `
      bg-blue-600 
      text-white 
      hover:bg-blue-700
      focus:ring-blue-400
      shadow-sm
    `,

    secondary: `
      bg-gray-100 
      hover:bg-gray-200 
      text-gray-900 
      focus:ring-gray-400
    `,

    // ⭐ Outline trắng — premium
    outline: `
      border-2 border-white 
      text-white 
      hover:bg-white hover:text-blue-700 
      focus:ring-white 
      shadow-sm hover:shadow-white/30 
      hover:scale-[1.02]
    `,

    danger: `
      bg-red-600 
      hover:bg-red-700 
      text-white 
      focus:ring-red-400
    `,
  };

  // Size nâng cấp
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-5 py-2.5 text-base rounded-xl",
    lg: "px-7 py-3 text-lg rounded-2xl",
  };

  // Disabled style
  const disabledClasses = "opacity-60 cursor-not-allowed hover:none active:none shadow-none";

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${disabled ? disabledClasses : ""}
    ${className}
  `;

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
