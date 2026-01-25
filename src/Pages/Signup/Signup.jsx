import { useRef, useEffect, useState } from "react";
import styles from "./Signup.module.css";
import googleIcon from "../../assets/google.png";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext.jsx";
import InputBox from "../../components/InputBox/InputBox.jsx";
import { useForm } from "react-hook-form";
import SpinAnimation from "../../components/LoadingAnimation/SpinAnimation/SpinAnimation.jsx";

import axiosClient from "../../libs/axiosClient";

function Signup() {
  const usernameInput = useRef(null);
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  const confirmPasswordInput = useRef(null);
  const typingText = useRef(null);
  const [loading, setLoading] = useState();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  let waveElement = null;

  const handleSignup = async (data) => {
    console.log("data:", data);
    delete data.repassword;
    try {
      setLoading(true);
      const result = await axiosClient.post("/users/signup", data);
      setLoading(false);
      showNotification("success", result.message);
      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (err) {
      setLoading(false);
      showNotification("error", err.message);
    }
  };

  const addWaveAnimation = (e) => {
    if (!waveElement) {
      waveElement = document.createElement("div");
      waveElement.classList.add(styles.waveElement);
      document.body.appendChild(waveElement);
      waveElement.style.top = `${e.clientY}px`;
      waveElement.style.left = `${e.clientX}px`;
    } else {
      waveElement.style.top = `${e.clientY}px`;
      waveElement.style.left = `${e.clientX}px`;
    }
    setTimeout(() => {
      waveElement?.remove();
      waveElement = null;
    }, 300);
  };

  useEffect(() => {
    const text = "Welcome to our website!\nPlease sign up to continue... <3";
    let index = 0;
    const typeEffect = () => {
      if (!typingText.current) return;

      typingText.current.innerHTML =
        text.slice(0, index) + `<span class='${styles.caretElement}'></span>`;
      index++;
      if (index <= text.length) {
        setTimeout(typeEffect, 70);
      } else {
        typingText.current.style.borderRight = "none";
      }
    };
    typeEffect();
  }, []);

  return (
    <div
      className={
        styles.entireSignupPage +
        " w-full h-auto flex justify-center items-center"
      }
    >
      <div
        className={
          styles.formSignupBox +
          " w-auto h-auto bg-black/70 rounded-[10px] p-3 absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] border-[1px] border-solid border-white text-white flex flex-col sm:flex-row justify-center"
        }
        onClick={addWaveAnimation}
      >
        <div className="min-w-[300px] flex justify-center relative mt-[40px]">
          <p
            className={
              styles.typingText +
              " max-w-[200px] h-auto text-center relative p-0"
            }
            ref={typingText}
          ></p>
        </div>
        <form
          onSubmit={handleSubmit(handleSignup)}
          className="min-w-[300px] h-auto border-[1px] border-solid border-white rounded-[10px] p-[8px] relative"
        >
          <InputBox
            id="username-input"
            type="text"
            label="username"
            refName={usernameInput}
            validation={register("username", {
              required: "Username isn't empty!",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters!",
              },
              maxLength: {
                value: 10,
                message: "Username must be no more than 10 characters!",
              },
            })}
            error={errors.username}
          />
          <InputBox
            id="email-input"
            type="text"
            label="email"
            refName={emailInput}
            validation={register("email", {
              required: "Email isn't empty!",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Email is invalid!",
              },
            })}
            error={errors.email}
          />
          <InputBox
            id="dateOfBirth"
            type="date"
            label="Date of birth"
            validation={register("dateOfBirth", {
              required: "DateOfBirth isn't empty!",
            })}
            error={errors.dateOfBirth}
          />
          <InputBox
            id="password-input"
            type="password"
            label="password"
            refName={passwordInput}
            validation={register("password", {
              required: "Password isn't empty!",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters!",
              },
              maxLength: {
                value: 15,
                message: "Password must be no more than 15 characters!",
              },
            })}
            error={errors.password}
          />
          <InputBox
            id="confirm-password-input"
            type="password"
            label="password again"
            refName={confirmPasswordInput}
            validation={register("repassword", {
              required: "Password isn't empty!",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters!",
              },
              maxLength: {
                value: 15,
                message: "Password must be no more than 15 characters!",
              },
              validate: (value) =>
                value === watch("password") || "Passwords do not match!",
            })}
            error={errors.repassword}
          />
          <div className="flex justify-between mx-1 mt-[8px]">
            <p>Already have an account?</p>
            <Link to="/login/" className="text-blue-800 underline">
              Login
            </Link>
          </div>
          <button
            type="submit"
            className="globalButtonStyle w-full h-[30px] outline-none bg-blue-500 mt-[20px] flex justify-center items-center shadow-[2px_2px_2px_grey]"
          >
            {loading ? (
              <SpinAnimation
                onLoading={loading}
                additionalStyles={{
                  width: "22px",
                  height: "22px",
                  border: "4px solid white",
                }}
              ></SpinAnimation>
            ) : (
              <p>Signup</p>
            )}
          </button>
          <div className="relative w-full h-[1px] bg-slate-500 mt-8">
            <span className="block absolute left-[50%] top-[-13px] bg-black px-2 transform translate-x-[-50%]">
              Or
            </span>
          </div>
          <div className="flex mt-[15px] border border-1px border-solid border-black cursor-pointer items-center pl-[8px] p-1 bg-white text-black">
            <img src={googleIcon} className="w-[23px]" alt="" />
            <p className="ml-[5px]">Signup with Google</p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
