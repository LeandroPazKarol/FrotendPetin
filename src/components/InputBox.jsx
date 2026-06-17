const InputBox = ({ label, type = "text", placeholder, name, value, onChange, readOnly = false }) => {
  return (
    <div className="flex flex-col gap-1 mb-4">
      {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
      
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all ${readOnly ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}`}
      />
    </div>
  );
};

export default InputBox;
