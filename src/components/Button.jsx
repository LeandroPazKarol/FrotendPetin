import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Button = ({ text, onClick, variant = 'primary', type = 'button', fullWidth = false, icon }) => {
  // Clases base para todos los botones
  let baseClasses = "px-6 py-3 rounded-full font-semibold transition-all duration-300 flex justify-center items-center gap-2";

  if (fullWidth) {
    baseClasses += " w-full";
  }


  const variants = {
    primary: "bg-gradient-brand shadow-soft hover:opacity-90 hover:shadow-lg",
    outline: "border-2 border-gray-200 text-gray-700 bg-white hover:border-gray-300",
    black: "bg-black text-white hover:bg-gray-800",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          className="w-5 h-5"
        />
      )}
      {text}
    </button>
  );
};

export default Button;
