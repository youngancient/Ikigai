import React, { ReactNode, useState } from "react";
import logo from "../../assets/images/cryptowillLogo.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { NavLink } from "react-router-dom";

export const Layout = ({
  title,
  titleChild,
  children,
}: {
  title: string;
  titleChild?: ReactNode;
  children?: ReactNode;
}) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="w-full max-w-full overflow-hidden fixed top-0 left-0 h-full flex items-center justify-center font-Kodchasan bg-black">
      <div className="w-full h-full max-w-[1920px] flex justify-between">
        <div className="lg:w-[250px] p-[1px] bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] h-[98%] max-h-full fixed rounded-lg hidden lg:flex">
          <div className="w-full h-full bg-black rounded-[inherit] p-4 flex flex-col text-white">
            <div>
              <img className="max-w-[150px]" src={logo} />
            </div>

            <NavLink className={"w-full mt-20 "} to={"/dashboard"}>
              <div className="w-full flex items-centertext-xl">
                <div>
                  <span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11.9995 2.54167C10.8143 1.65278 9.18465 1.65278 7.99946 2.54167L2.27233 6.83702C1.35455 7.52535 0.855235 8.63725 0.950506 9.7805L1.47798 16.1102C1.62195 17.8378 3.06617 19.1667 4.7998 19.1667H15.1991C16.9328 19.1667 18.377 17.8378 18.521 16.1102L19.0484 9.7805C19.1437 8.63725 18.6444 7.52535 17.7266 6.83702L11.9995 2.54167ZM8.99946 3.875C9.59206 3.43056 10.4069 3.43056 10.9995 3.875L16.7266 8.17035C17.1855 8.51452 17.4351 9.07047 17.3875 9.6421L16.86 15.9717C16.7881 16.8356 16.0659 17.5 15.1991 17.5H12.5718L12.7402 15.4787C12.8739 13.8752 11.6085 12.5 9.99946 12.5C8.39044 12.5 7.12506 13.8752 7.25869 15.4787L7.42713 17.5H4.7998C3.93298 17.5 3.21087 16.8356 3.13889 15.9717L2.61142 9.6421C2.56378 9.07047 2.81344 8.51452 3.27233 8.17035L8.99946 3.875ZM11.0793 15.3403L10.8994 17.5H9.09958L8.9196 15.3403C8.86695 14.7085 9.36551 14.1667 9.99946 14.1667C10.6334 14.1667 11.132 14.7085 11.0793 15.3403Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                </div>
                <div className="ml-3">
                  <h3>Dashboard</h3>
                </div>
              </div>
            </NavLink>

            <NavLink className={"w-full mt-5 "} to={"/vault"}>
              <div className="w-full flex items-center text-xl">
                <div>
                  <span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.63894 2.5C2.99731 2.5 1.6665 3.8308 1.6665 5.47243V14.1667C1.6665 16.0076 3.15889 17.5 4.99984 17.5H10.8332C11.2934 17.5 11.6665 17.1269 11.6665 16.6667C11.6665 16.2064 11.2934 15.8333 10.8332 15.8333H4.99984C4.07936 15.8333 3.33317 15.0871 3.33317 14.1667V5.47243C3.33317 4.75128 3.91778 4.16667 4.63894 4.16667H6.73657C6.73731 4.16723 6.73984 4.16825 6.7442 4.17003C6.76778 4.17961 6.84512 4.21105 6.98594 4.3094C7.1856 4.44884 7.41867 4.65529 7.67228 4.90487C7.90853 5.13736 8.14091 5.38542 8.36295 5.62245L8.40425 5.66654C8.62504 5.90215 8.8585 6.15095 9.04807 6.31802C9.18279 6.43675 9.37477 6.5507 9.52529 6.62738C9.60906 6.67005 9.70647 6.71477 9.80713 6.75086C9.88779 6.77978 10.0503 6.83333 10.2371 6.83333H15.001C15.921 6.83333 16.6665 7.57903 16.6665 8.5V10.4167C16.6665 10.8769 17.0396 11.25 17.4998 11.25C17.9601 11.25 18.3332 10.8769 18.3332 10.4167V8.5C18.3332 6.65954 16.8424 5.16667 15.001 5.16667H10.3328C10.3186 5.1603 10.3013 5.15222 10.2818 5.1423C10.2415 5.12178 10.2023 5.09927 10.1712 5.07964C10.1571 5.07067 10.1469 5.06377 10.1408 5.05943C10.0247 4.95563 9.85523 4.7775 9.6204 4.52691L9.57461 4.47802C9.3569 4.24558 9.10275 3.97424 8.84132 3.71696C8.564 3.44405 8.25342 3.16171 7.94024 2.94299C7.65762 2.7456 7.23612 2.5 6.7618 2.5H4.63894Z"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M18.0554 13.8889C18.0554 12.6616 17.0605 11.6667 15.8332 11.6667C14.6059 11.6667 13.6109 12.6616 13.6109 13.8889V14.076C12.954 14.3881 12.4998 15.0577 12.4998 15.8333V17.2222C12.4998 18.1427 13.246 18.8889 14.1665 18.8889H17.4998C18.4203 18.8889 19.1665 18.1427 19.1665 17.2222V15.8333C19.1665 15.0577 18.7123 14.3881 18.0554 14.076V13.8889ZM15.2776 13.8889C15.2776 13.5821 15.5263 13.3333 15.8332 13.3333C16.14 13.3333 16.3887 13.5821 16.3887 13.8889H15.2776ZM14.1665 15.8333C14.1665 15.6799 14.2909 15.5556 14.4443 15.5556H17.2221C17.3755 15.5556 17.4998 15.6799 17.4998 15.8333V17.2222H14.1665V15.8333Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                </div>
                <div className="ml-3">
                  <h3>Vault</h3>
                </div>
              </div>
            </NavLink>

            <NavLink className="w-full mt-5 " to={"/trustfund"}>
              <div className="w-full flex items-center text-xl">
                <div>
                  <span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M4.35381 2.5C2.86965 2.5 1.6665 3.70314 1.6665 5.1873V14.1667C1.6665 16.0076 3.15889 17.5 4.99984 17.5H14.9998C16.8408 17.5 18.3332 16.0076 18.3332 14.1667V8.7963C18.3332 6.9557 16.842 5.46296 15.0007 5.46296H12.4079C12.3747 5.41405 12.3364 5.35183 12.293 5.27427C12.1756 5.06429 12.0614 4.81759 11.9304 4.53459C11.8993 4.46744 11.8672 4.39822 11.834 4.32699C11.6747 3.98558 11.4816 3.58459 11.2581 3.26646C11.0726 3.00239 10.6672 2.5 10.0113 2.5H4.35381ZM10.4062 5.2098C10.4442 5.29197 10.4835 5.37702 10.5238 5.46296H3.33317V5.1873C3.33317 4.62362 3.79012 4.16667 4.35381 4.16667H9.85146C9.86383 4.18236 9.87814 4.20148 9.89437 4.22458C10.0215 4.40559 10.1584 4.67764 10.3237 5.03184C10.3504 5.08899 10.3779 5.14863 10.4062 5.2098ZM4.99984 15.8333C4.07936 15.8333 3.33317 15.0871 3.33317 14.1667V7.12963H12.065C12.0672 7.12968 12.0694 7.12971 12.0716 7.12974C12.0811 7.12987 12.0906 7.12983 12.1001 7.12963H15.0007C15.9208 7.12963 16.6665 7.87547 16.6665 8.7963V9.16667H14.9998C13.6191 9.16667 12.4998 10.286 12.4998 11.6667C12.4998 13.0474 13.6191 14.1667 14.9998 14.1667H16.6665C16.6665 15.0871 15.9203 15.8333 14.9998 15.8333H4.99984ZM14.1665 11.6667C14.1665 11.2064 14.5396 10.8333 14.9998 10.8333H16.6665V12.5H14.9998C14.5396 12.5 14.1665 12.1269 14.1665 11.6667ZM9.79266 4.10269C9.79267 4.10227 9.79611 4.10471 9.80296 4.1113C9.79607 4.10641 9.79265 4.10312 9.79266 4.10269Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                </div>
                <div className="ml-3">
                  <h3>Trustfund</h3>
                </div>
              </div>
            </NavLink>

            <NavLink className={"w-full mt-5 "} to={"/liquidity"}>
              <div className="w-full flex items-center text-xl">
                <div>
                  <span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M1.6665 7.08335C1.6665 8.23395 2.59924 9.16669 3.74984 9.16669L16.2498 9.16669C17.4004 9.16669 18.3332 8.23395 18.3332 7.08335V3.75002C18.3332 2.59943 17.4004 1.66669 16.2498 1.66669H3.74984C2.59924 1.66669 1.6665 2.59943 1.6665 3.75002V7.08335ZM3.74984 7.50002C3.51972 7.50002 3.33317 7.31347 3.33317 7.08335L3.33317 3.75002C3.33317 3.5199 3.51972 3.33335 3.74984 3.33335L16.2498 3.33335C16.48 3.33335 16.6665 3.5199 16.6665 3.75002V7.08335C16.6665 7.31347 16.48 7.50002 16.2498 7.50002L3.74984 7.50002Z"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M3.74984 18.3334C2.59924 18.3334 1.6665 17.4006 1.6665 16.25V12.0834C1.6665 10.9328 2.59924 10 3.74984 10H7.08317C8.23376 10 9.1665 10.9328 9.1665 12.0834V16.25C9.1665 17.4006 8.23377 18.3334 7.08317 18.3334H3.74984ZM3.33317 16.25C3.33317 16.4801 3.51972 16.6667 3.74984 16.6667H7.08317C7.31329 16.6667 7.49984 16.4801 7.49984 16.25V12.0834C7.49984 11.8532 7.31329 11.6667 7.08317 11.6667H3.74984C3.51972 11.6667 3.33317 11.8532 3.33317 12.0834L3.33317 16.25Z"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12.9165 18.3334C11.7659 18.3334 10.8332 17.4006 10.8332 16.25V12.0834C10.8332 10.9328 11.7659 10 12.9165 10H16.2498C17.4004 10 18.3332 10.9328 18.3332 12.0834V16.25C18.3332 17.4006 17.4004 18.3334 16.2498 18.3334H12.9165ZM12.4998 16.25C12.4998 16.4801 12.6864 16.6667 12.9165 16.6667H16.2498C16.48 16.6667 16.6665 16.4801 16.6665 16.25V12.0834C16.6665 11.8532 16.48 11.6667 16.2498 11.6667H12.9165C12.6864 11.6667 12.4998 11.8532 12.4998 12.0834V16.25Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                </div>
                <div className="ml-3">
                  <h3>Liquidity</h3>
                </div>
              </div>
            </NavLink>
          </div>
        </div>
        {showSidebar && (
          <div className="w-full fixed z-20 bg-black top-0 left-0 h-full bg-opacity-10 backdrop-blur-lg">
            <div className="w-[250px] p-[1px] bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] h-[98%] max-h-full fixed rounded-lg flex lg:hidden">
              <div className="w-full h-full bg-black rounded-[inherit] p-4 flex flex-col text-white">
                <div className="w-full flex items-center justify-between">
                  <img className="max-w-[150px]" src={logo} />

                  <span onClick={() => setShowSidebar(!showSidebar)}>
                    <IoClose color="white" size={26} />
                  </span>
                </div>

                <NavLink className={"w-full mt-20 "} to={"/dashboard"}>
                  <div className="w-full flex items-centertext-xl">
                    <div>
                      <span>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M11.9995 2.54167C10.8143 1.65278 9.18465 1.65278 7.99946 2.54167L2.27233 6.83702C1.35455 7.52535 0.855235 8.63725 0.950506 9.7805L1.47798 16.1102C1.62195 17.8378 3.06617 19.1667 4.7998 19.1667H15.1991C16.9328 19.1667 18.377 17.8378 18.521 16.1102L19.0484 9.7805C19.1437 8.63725 18.6444 7.52535 17.7266 6.83702L11.9995 2.54167ZM8.99946 3.875C9.59206 3.43056 10.4069 3.43056 10.9995 3.875L16.7266 8.17035C17.1855 8.51452 17.4351 9.07047 17.3875 9.6421L16.86 15.9717C16.7881 16.8356 16.0659 17.5 15.1991 17.5H12.5718L12.7402 15.4787C12.8739 13.8752 11.6085 12.5 9.99946 12.5C8.39044 12.5 7.12506 13.8752 7.25869 15.4787L7.42713 17.5H4.7998C3.93298 17.5 3.21087 16.8356 3.13889 15.9717L2.61142 9.6421C2.56378 9.07047 2.81344 8.51452 3.27233 8.17035L8.99946 3.875ZM11.0793 15.3403L10.8994 17.5H9.09958L8.9196 15.3403C8.86695 14.7085 9.36551 14.1667 9.99946 14.1667C10.6334 14.1667 11.132 14.7085 11.0793 15.3403Z"
                            fill="white"
                          />
                        </svg>
                      </span>
                    </div>
                    <div className="ml-3">
                      <h3>Dashboard</h3>
                    </div>
                  </div>
                </NavLink>

                <NavLink className={"w-full mt-5 "} to={"/vault"}>
                  <div className="w-full flex items-center text-xl">
                    <div>
                      <span>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.63894 2.5C2.99731 2.5 1.6665 3.8308 1.6665 5.47243V14.1667C1.6665 16.0076 3.15889 17.5 4.99984 17.5H10.8332C11.2934 17.5 11.6665 17.1269 11.6665 16.6667C11.6665 16.2064 11.2934 15.8333 10.8332 15.8333H4.99984C4.07936 15.8333 3.33317 15.0871 3.33317 14.1667V5.47243C3.33317 4.75128 3.91778 4.16667 4.63894 4.16667H6.73657C6.73731 4.16723 6.73984 4.16825 6.7442 4.17003C6.76778 4.17961 6.84512 4.21105 6.98594 4.3094C7.1856 4.44884 7.41867 4.65529 7.67228 4.90487C7.90853 5.13736 8.14091 5.38542 8.36295 5.62245L8.40425 5.66654C8.62504 5.90215 8.8585 6.15095 9.04807 6.31802C9.18279 6.43675 9.37477 6.5507 9.52529 6.62738C9.60906 6.67005 9.70647 6.71477 9.80713 6.75086C9.88779 6.77978 10.0503 6.83333 10.2371 6.83333H15.001C15.921 6.83333 16.6665 7.57903 16.6665 8.5V10.4167C16.6665 10.8769 17.0396 11.25 17.4998 11.25C17.9601 11.25 18.3332 10.8769 18.3332 10.4167V8.5C18.3332 6.65954 16.8424 5.16667 15.001 5.16667H10.3328C10.3186 5.1603 10.3013 5.15222 10.2818 5.1423C10.2415 5.12178 10.2023 5.09927 10.1712 5.07964C10.1571 5.07067 10.1469 5.06377 10.1408 5.05943C10.0247 4.95563 9.85523 4.7775 9.6204 4.52691L9.57461 4.47802C9.3569 4.24558 9.10275 3.97424 8.84132 3.71696C8.564 3.44405 8.25342 3.16171 7.94024 2.94299C7.65762 2.7456 7.23612 2.5 6.7618 2.5H4.63894Z"
                            fill="white"
                          />
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M18.0554 13.8889C18.0554 12.6616 17.0605 11.6667 15.8332 11.6667C14.6059 11.6667 13.6109 12.6616 13.6109 13.8889V14.076C12.954 14.3881 12.4998 15.0577 12.4998 15.8333V17.2222C12.4998 18.1427 13.246 18.8889 14.1665 18.8889H17.4998C18.4203 18.8889 19.1665 18.1427 19.1665 17.2222V15.8333C19.1665 15.0577 18.7123 14.3881 18.0554 14.076V13.8889ZM15.2776 13.8889C15.2776 13.5821 15.5263 13.3333 15.8332 13.3333C16.14 13.3333 16.3887 13.5821 16.3887 13.8889H15.2776ZM14.1665 15.8333C14.1665 15.6799 14.2909 15.5556 14.4443 15.5556H17.2221C17.3755 15.5556 17.4998 15.6799 17.4998 15.8333V17.2222H14.1665V15.8333Z"
                            fill="white"
                          />
                        </svg>
                      </span>
                    </div>
                    <div className="ml-3">
                      <h3>Vault</h3>
                    </div>
                  </div>
                </NavLink>

                <NavLink className="w-full mt-5 " to={"/trustfund"}>
                  <div className="w-full flex items-center text-xl">
                    <div>
                      <span>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M4.35381 2.5C2.86965 2.5 1.6665 3.70314 1.6665 5.1873V14.1667C1.6665 16.0076 3.15889 17.5 4.99984 17.5H14.9998C16.8408 17.5 18.3332 16.0076 18.3332 14.1667V8.7963C18.3332 6.9557 16.842 5.46296 15.0007 5.46296H12.4079C12.3747 5.41405 12.3364 5.35183 12.293 5.27427C12.1756 5.06429 12.0614 4.81759 11.9304 4.53459C11.8993 4.46744 11.8672 4.39822 11.834 4.32699C11.6747 3.98558 11.4816 3.58459 11.2581 3.26646C11.0726 3.00239 10.6672 2.5 10.0113 2.5H4.35381ZM10.4062 5.2098C10.4442 5.29197 10.4835 5.37702 10.5238 5.46296H3.33317V5.1873C3.33317 4.62362 3.79012 4.16667 4.35381 4.16667H9.85146C9.86383 4.18236 9.87814 4.20148 9.89437 4.22458C10.0215 4.40559 10.1584 4.67764 10.3237 5.03184C10.3504 5.08899 10.3779 5.14863 10.4062 5.2098ZM4.99984 15.8333C4.07936 15.8333 3.33317 15.0871 3.33317 14.1667V7.12963H12.065C12.0672 7.12968 12.0694 7.12971 12.0716 7.12974C12.0811 7.12987 12.0906 7.12983 12.1001 7.12963H15.0007C15.9208 7.12963 16.6665 7.87547 16.6665 8.7963V9.16667H14.9998C13.6191 9.16667 12.4998 10.286 12.4998 11.6667C12.4998 13.0474 13.6191 14.1667 14.9998 14.1667H16.6665C16.6665 15.0871 15.9203 15.8333 14.9998 15.8333H4.99984ZM14.1665 11.6667C14.1665 11.2064 14.5396 10.8333 14.9998 10.8333H16.6665V12.5H14.9998C14.5396 12.5 14.1665 12.1269 14.1665 11.6667ZM9.79266 4.10269C9.79267 4.10227 9.79611 4.10471 9.80296 4.1113C9.79607 4.10641 9.79265 4.10312 9.79266 4.10269Z"
                            fill="white"
                          />
                        </svg>
                      </span>
                    </div>
                    <div className="ml-3">
                      <h3>Trustfund</h3>
                    </div>
                  </div>
                </NavLink>

                <NavLink className={"w-full mt-5 "} to={"/liquidity"}>
                  <div className="w-full flex items-center text-xl">
                    <div>
                      <span>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M1.6665 7.08335C1.6665 8.23395 2.59924 9.16669 3.74984 9.16669L16.2498 9.16669C17.4004 9.16669 18.3332 8.23395 18.3332 7.08335V3.75002C18.3332 2.59943 17.4004 1.66669 16.2498 1.66669H3.74984C2.59924 1.66669 1.6665 2.59943 1.6665 3.75002V7.08335ZM3.74984 7.50002C3.51972 7.50002 3.33317 7.31347 3.33317 7.08335L3.33317 3.75002C3.33317 3.5199 3.51972 3.33335 3.74984 3.33335L16.2498 3.33335C16.48 3.33335 16.6665 3.5199 16.6665 3.75002V7.08335C16.6665 7.31347 16.48 7.50002 16.2498 7.50002L3.74984 7.50002Z"
                            fill="white"
                          />
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M3.74984 18.3334C2.59924 18.3334 1.6665 17.4006 1.6665 16.25V12.0834C1.6665 10.9328 2.59924 10 3.74984 10H7.08317C8.23376 10 9.1665 10.9328 9.1665 12.0834V16.25C9.1665 17.4006 8.23377 18.3334 7.08317 18.3334H3.74984ZM3.33317 16.25C3.33317 16.4801 3.51972 16.6667 3.74984 16.6667H7.08317C7.31329 16.6667 7.49984 16.4801 7.49984 16.25V12.0834C7.49984 11.8532 7.31329 11.6667 7.08317 11.6667H3.74984C3.51972 11.6667 3.33317 11.8532 3.33317 12.0834L3.33317 16.25Z"
                            fill="white"
                          />
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M12.9165 18.3334C11.7659 18.3334 10.8332 17.4006 10.8332 16.25V12.0834C10.8332 10.9328 11.7659 10 12.9165 10H16.2498C17.4004 10 18.3332 10.9328 18.3332 12.0834V16.25C18.3332 17.4006 17.4004 18.3334 16.2498 18.3334H12.9165ZM12.4998 16.25C12.4998 16.4801 12.6864 16.6667 12.9165 16.6667H16.2498C16.48 16.6667 16.6665 16.4801 16.6665 16.25V12.0834C16.6665 11.8532 16.48 11.6667 16.2498 11.6667H12.9165C12.6864 11.6667 12.4998 11.8532 12.4998 12.0834V16.25Z"
                            fill="white"
                          />
                        </svg>
                      </span>
                    </div>
                    <div className="ml-3">
                      <h3>Liquidity</h3>
                    </div>
                  </div>
                </NavLink>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard content */}

        <div className="lg:ml-[255px] w-full lg:w-fit flex-grow h-[98%] p-4  overflow-y-auto">
          {/* <h3 className="text-white">Home Page Here</h3> */}

          <div className="w-full text-white flex items-center justify-between">
            <div className="lg:hidden block w-fit">
              <span onClick={() => setShowSidebar(!showSidebar)}>
                {!showSidebar ? (
                  <GiHamburgerMenu color="white" size={25} />
                ) : (
                  <IoClose color="white" size={25} />
                )}
              </span>
            </div>

            <div className="hidden lg:block">
              <h3 className="text-2xl capitalize">{title}</h3>
            </div>

            <div className="flex gap-4">
              {titleChild}
              <button className="bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999] px-4 py-2 rounded-xl">
                Connect Wallet
              </button>
            </div>
          </div>

          <main className="w-full mt-5">{children}</main>
        </div>
      </div>
    </div>
  );
};
