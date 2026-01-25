import React, { useState, forwardRef } from "react";
import styles from "./InputBox.module.css";

const InputBox = forwardRef(({ id, type, label, validation, error }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative mt-[20px]">
      <input
        id={id}
        ref={ref}
        type={!showPassword ? type : "text"}
        className={
          styles.inputElement +
          ` w-full h-[35px] text-black outline-none p-1 px-3 cursor-pointer `
        }
        placeholder=" "
        {...validation}
      />
      <label
        htmlFor={id}
        className={
          styles.labelElement +
          ` text-black absolute top-[43%] left-[11px] transform translate-y-[-50%] transition-all duration-150 ease-linear bg-white cursor-pointer`
        }
      >
        Enter {label}:
      </label>
      {type === "password" && (
        <img
          src={
            showPassword
              ? "https://img.icons8.com/ultraviolet/40/blind.png"
              : "https://img.icons8.com/ultraviolet/40/visible.png"
          }
          alt={showPassword ? "hide" : "visible"}
          onClick={() => setShowPassword(!showPassword)}
          className="w-[17px] h-auto absolute top-[50%] right-[3px] transform translate-y-[-50%] cursor-pointer"
        />
      )}
      {error && (
        <p className="w-full text-red-500 text-right">{error.message}</p>
      )}
    </div>
  );
});

export default InputBox;
