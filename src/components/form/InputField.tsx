import {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
} from "react";

import "./style.scss";

export type InputProps = {
  errMsg?: string;
  label?: string;
  extraClass?: string;
  variant?: "condensed" | "free";
  spaceY?: boolean;
  bg?: string;
  suffix?: any;
  prefix?: any;
  extralabel?: string | ReactNode;
  showError?: boolean;
  onkeypress?: any;
  containerClass?: string;
  autoFocus?: boolean;
  name?: string;
  openUpgradeModal?: boolean;
  setOpenUpgradeModal?: (value: boolean) => void;
} & Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "spaceY" | "bg" | "variant" | "extraClass"
>;

const InputField = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      errMsg,
      extraClass = "",
      spaceY = true,
      variant = "condensed",
      bg = "white",
      prefix,
      suffix,
      extralabel,
      containerClass,
      autoFocus,
      showError = true,
      onKeyDown,
      name,
      openUpgradeModal,
      setOpenUpgradeModal,
      ...props
    },
    ref
  ): JSX.Element => {
    return (
      <div className={`form-group-wrapper ${containerClass}`}>
        {label && (
          <label className={`${extralabel ? "flex_label" : ""}  `}>
            {label}{" "}
            {/* {props.required ? <span className="text-error">*</span> : ""} */}
            {extralabel && extralabel}
          </label>
        )}
        <div className={`form-group ${extraClass} `}>
          {prefix}
          <input
            {...props}
            name={name}
            ref={ref}
            autoFocus={autoFocus}
            onKeyDown={onKeyDown}
            className={`focus:outline-none placeholder-neutral text-black bg-transparent w-full z-10 `}
          />
          {suffix}
        </div>
        {errMsg && showError && <div className="input-err-msg">{errMsg}</div>}
      </div>
    );
  }
);

export default InputField;
