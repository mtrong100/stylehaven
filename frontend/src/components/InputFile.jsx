import React from "react";

const InputFile = ({ label, onFileChange }) => {
  return (
    <div className="flex flex-col items-start space-y-2 w-full">
      {label && <label>{label}</label>}
      <input type="file" multiple accept="image/*" onChange={onFileChange} />
    </div>
  );
};

export default InputFile;
