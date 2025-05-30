/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import { IoEye } from "react-icons/io5";
import * as yup from "yup";
import { Formik, Form } from "formik";
import { announcement, user } from "../../utils/api";
import { IoEyeOff } from "react-icons/io5";
import { notification } from "../../utils/api";
import { IoMdInformationCircle } from "react-icons/io";
import { TiWarning } from "react-icons/ti";
import { RiErrorWarningFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
// import Role from "../checkRole/checkRole";
import { useModal } from "./modalContext";
import { useLogin } from "../loginContext/loginContext";
const Modal = ({ isvisible, onClose, from, setIsVisible }) => {
  const navigate = useNavigate();
  // const role = Role();
  const { visible, setVisible } = useModal();
  const { popup, setPopup } = useLogin();
  const [check1, setCheck1] = useState(true);
  const [check2, setCheck2] = useState(true);
  const [check3, setCheck3] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const schema = yup.object({
    password: yup.string().required("Password harus diisi"),
    newPassword: yup.string().required("New Password harus diisi"),
    confirmPassword: yup.string().required("Confirm Password harus diisi"),
  });

  const [notif, setNotif] = useState([]);
  const getNotif = async () => {
    await axios
      .get(notification.get + "all&&limit=10&&page=1", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setNotif(response.data.data);
        console.log("yahaha", response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [image, setImage] = useState([]);
  const getPopup = async () => {
    await axios
      .get(announcement.get)
      .then((response) => {
        setImage(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  let count = 0;
  const handleOnNextClick = async () => {
    const productsLength = image.length;
    count = (currentIndex + productsLength + 1) % image.length;
    await setCurrentIndex(count);
  };
  const handleOnPrevClick = async () => {
    const productsLength = image.length;
    count = (currentIndex + productsLength - 1) % productsLength;
    await setCurrentIndex(count);
  };
  const startSlider = async () => {
    setInterval(() => {
      handleOnNextClick();
    }, 2000);
  };
  useEffect(() => {
    // let intervalId;
    if (isvisible && from === "notification") {
      getNotif();
    } else if (isvisible && from === "login") {
      getPopup();
      // intervalId = startSlider();
    }
  }, [isvisible, from]);

  useEffect(() => {
    let intervalId;
    if (isvisible && from === "login" && image.length > 0) {
      intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % image.length);
      }, 5000);
    }
    return () => clearInterval(intervalId);
  }, [isvisible, from, image]);
  const images = image.map((item, index) => item.image);
  console.log("yahaha", images);
  const handleSubmitComplete = async (
    password,
    newPassword,
    confirmPassword
  ) => {
    try {
      const response = await axios.patch(
        user.changePassword,
        {
          password: password,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log("Response:", response);
      if (response.status === 200) {
        alert("Password berhasil diganti");
        setIsVisible(false);
      }
    } catch (error) {
      console.error("Error:", error);

      if (error.response) {
        console.error("Server Response:", error.response.data);
        alert(error.response.data.message);
      } else {
        console.error("Network Error:", error.message);
        alert("Terjadi kesalahan jaringan. Silakan coba lagi.");
      }
    }
  };
  if (!isvisible) return null;
  return (
    <>
      {from == "edit-profile" ? (
        <div
          className="fixed  h-screen w-screen rounded-md inset-0 bg-black bg-opacity-25 
     justify-center items-center flex backdrop-blur-sm"
        >
          <div className="md:w-[50%] bg-white w-[85%]">
            <div className="bg-white p-2 w-full flex-row flex rounded justify-between">
              <div>
                <h1 className="text-gray-700 font-semibold font-[inter]">
                  {from == "edit-profile" ? "Edit Password" : null}
                </h1>
              </div>
              <div>
                <button
                  onClick={() => onClose()}
                  className="text-black font-semibold text-xl "
                >
                  X
                </button>
              </div>
            </div>
            <div className="w-full bg-slate-700 opacity-5  h-[0.13rem]"></div>
            {from == "edit-profile" ? (
              <Formik
                initialValues={{
                  password: "",
                  newPassword: "",
                  confirmPassword: "",
                }}
                validationSchema={schema}
                onSubmit={(values, actions) => {
                  actions.resetForm();
                  console.log(values);
                }}
              >
                {({
                  values,
                  errors,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                }) => (
                  <Form onSubmit={handleSubmit} className="w-full">
                    <div>
                      <div className="w-full px-10 mb-6">
                        <label
                          htmlFor="password"
                          className="block my-2 text-sm font-medium text-gray-900"
                        >
                          Password
                        </label>
                        <div className="mb-6 relative flex justify-between items-center">
                          <input
                            onChange={(e) => {
                              setFieldValue("password", e.target.value);
                            }}
                            onBlur={handleBlur}
                            required
                            type={check1 ? "password" : "text"}
                            id="input-group-1"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="******************"
                          />
                          <div className="inset-y-0 flex ml-5 items-center w-4 h-4 justify-center  ">
                            {check1 ? (
                              <IoEyeOff onClick={() => setCheck1(!check1)} />
                            ) : (
                              <IoEye onClick={() => setCheck1(!check1)} />
                            )}
                          </div>
                        </div>
                        {<div className="text-[color:var(--color-primary)] text-sm mt-1">{}</div>}
                      </div>
                      <div className="w-full px-10 mb-6">
                        <label
                          htmlFor="newPassword"
                          className="block my-2 text-sm font-medium text-gray-900"
                        >
                          New Password
                        </label>
                        <div className="mb-6 relative flex justify-between items-center">
                          <input
                            onChange={(e) => {
                              setFieldValue("newPassword", e.target.value);
                            }}
                            onBlur={handleBlur}
                            required
                            type={check2 ? "password" : "text"}
                            id="input-group-2"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="******************"
                          />
                          <div className="inset-y-0 flex ml-5 items-center w-4 h-4 justify-center  ">
                            {check2 ? (
                              <IoEyeOff onClick={() => setCheck2(!check2)} />
                            ) : (
                              <IoEye onClick={() => setCheck2(!check2)} />
                            )}
                          </div>
                        </div>
                        {<div className="text-[color:var(--color-primary)] text-sm mt-1">{}</div>}
                      </div>
                      <div className="w-full px-10 mb-6">
                        <label
                          htmlFor="confirmPassword"
                          className="block my-2 text-sm font-medium text-gray-900"
                        >
                          Confirm New Password
                        </label>
                        <div className="mb-6 relative flex justify-between items-center">
                          <input
                            onChange={(e) => {
                              setFieldValue("confirmPassword", e.target.value);
                            }}
                            onBlur={handleBlur}
                            required
                            type={check3 ? "password" : "text"}
                            id="input-group-3"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="******************"
                          />
                          <div className="inset-y-0 flex ml-5 items-center w-4 h-4 justify-center  ">
                            {check3 ? (
                              <IoEyeOff onClick={() => setCheck3(!check3)} />
                            ) : (
                              <IoEye onClick={() => setCheck3(!check3)} />
                            )}
                          </div>
                        </div>
                        {<div className="text-red-500 text-sm mt-1">{}</div>}
                      </div>
                      <div className="w-full flex justify-center items-center">
                        <button
                          onClick={() => {
                            handleSubmitComplete(
                              values.password,
                              values.newPassword,
                              values.confirmPassword
                            );
                          }}
                          type="submit"
                          className="w-1/2 mb-10 bg-[background-color:var(--color-primary)] text-white p-2 rounded-md"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            ) : null}
          </div>
        </div>
      ) : from == "notification" ? (
        <div
          className="fixed z-40  h-screen w-screen rounded-md inset-0 bg-black bg-opacity-25 
    justify-center items-center flex backdrop-blur-sm"
        >
          <div
            onClick={() => setIsVisible(false)}
            className=" h-screen flex w-[10%] md:w-[48%]  lg:w-[60%]"
          ></div>
          <div className=" h-screen flex-col flex w-[81%] md:w-[41%] lg:w-[31%]">
            <div
              onClick={() => setIsVisible(false)}
              className=" h-[5%] flex w-full"
            ></div>
            <div className="bg-white text-black h-[80%] rounded-lg flex-col justify-evenly  flex w-full">
              <div className=" justify-between h-[95%] flex-col my-5 items-center overflow-auto flex w-full">
                {notif.map((item, index) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <>
                      {item.type === 1 ? (
                        <div
                          onClick={() => {
                            item.relation === 1
                              ? navigate("/account")
                              : item.relation === 2
                              ? navigate("/document")
                              : item.relation === 3
                              ? navigate("/inventory")
                              : item.relation === 4
                              ? navigate("/profile")
                              : item.relation === 5
                              ? navigate("/account")
                              : null;
                            setVisible(false);
                          }}
                          className="cursor-pointer flex w-full items-center"
                        >
                          <div
                            key={index}
                            className="flex justify-between bg-[#FCE8DB] border-2 border-[#a73232] py-2 my-2 mx-2 px-4 rounded-md w-[93%]"
                          >
                            <div className="mr-2 flex justify-center">
                              <RiErrorWarningFill className="text-[#EF665B] w-7 h-auto" />
                            </div>
                            <div>{item.message}</div>
                          </div>
                          {item.isRead == false ? (
                            <div className="relative shadow-md border-black bg-blue-500 rounded-full px-[0.4rem] py-[0.4rem]"></div>
                          ) : null}
                        </div>
                      ) : item.type === 2 ? (
                        <div
                          onClick={() => {
                            item.relation === 1
                              ? navigate("/account")
                              : item.relation === 2
                              ? navigate("/document")
                              : item.relation === 3
                              ? navigate("/inventory")
                              : item.relation === 4
                              ? navigate("/profile")
                              : item.relation === 5
                              ? navigate("/account")
                              : null;
                            setVisible(false);
                          }}
                          className="flex w-full items-center"
                        >
                          <div
                            key={index}
                            className="cursor-pointer flex justify-between bg-[#D7F1FD] border-2 border-[#509AF8] py-2 my-2 mx-2 px-4 rounded-md w-[93%]"
                          >
                            <div className="mr-2 flex justify-center">
                              <IoMdInformationCircle className="text-[#509AF8] w-7 h-auto" />
                            </div>
                            <div>{item.message}</div>
                          </div>
                          {item.isRead == false ? (
                            <div className="relative shadow-md border-black bg-blue-500 rounded-full px-[0.4rem] py-[0.4rem]"></div>
                          ) : null}
                        </div>
                      ) : item.type === 3 ? (
                        <div
                          onClick={() => {
                            item.relation === 1
                              ? navigate("/account")
                              : item.relation === 2
                              ? navigate("/document")
                              : item.relation === 3
                              ? navigate("/inventory")
                              : item.relation === 4
                              ? navigate("/profile")
                              : item.relation === 5
                              ? navigate("/account")
                              : null;
                            setVisible(false);
                          }}
                          className="cursor-pointer flex w-full items-center"
                        >
                          <div
                            key={index}
                            className="flex justify-between bg-[#FEF7D1] border-2 border-[#ab9933] py-2 my-2 mx-2 rounded-md px-2 w-[93%]"
                          >
                            <div className="mr-2 flex justify-center">
                              <TiWarning className="text-[#F7C752] w-7 h-auto" />
                            </div>
                            <div>{item.message}</div>
                          </div>
                          {item.isRead == false ? (
                            <div className="relative shadow-md border-black bg-blue-500 rounded-full px-[0.4rem] py-[0.4rem]"></div>
                          ) : null}
                        </div>
                      ) : (
                        <></>
                      )}
                    </>
                  );
                })}
              </div>
              <Link
                onClick={() => {
                  setVisible(false);
                }}
                to={"/notification"}
                className="flex h-[5%] justify-center items-center"
              >
                See More
              </Link>
            </div>
            <div
              onClick={() => setIsVisible(false)}
              className=" h-[15%] flex w-full"
            ></div>
          </div>
          <div
            onClick={() => setIsVisible(false)}
            className=" h-screen flex w-[9%] md:w-[12%] lg:w-[9%]"
          ></div>
        </div>
      ) : from == "login" ? (
        <div
          className="fixed z-40 h-screen w-screen rounded-md inset-0 bg-black bg-opacity-25 
     justify-center items-center flex backdrop-blur-sm"
        >
          <div
            onClick={() => setIsVisible(false)}
            className=" h-screen flex w-[10%] md:w-[20%]"
          ></div>
          <div className=" text-black h-full  rounded-lg flex-col  md:w-[60%] w-[90%] flex">
            <div
              onClick={() => setIsVisible(false)}
              className=" h-[20%] md:h-[22.5%]"
            ></div>
            <div className="bg-white h-[60%] md:h-[55%] rounded-md">
              <div className="flex-row  h-full flex justify-center items-center   ">
                {image.length > 0 && (
                  <div className="w-full select-none relative">
                    <div className="w-full aspect-square md:aspect-video">
                      <img
                        onChange={() => startSlider}
                        src={images[currentIndex]}
                        alt="Gambar"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="absolute w-full top-1/2 transform -translate-y-1/2 px-3 flex justify-between items-center">
                      <button onClick={handleOnPrevClick}>
                        <div className="flex px-3 py-3 rounded-full bg-[background-color:var(--color-primary)]">
                          <GrPrevious className="text-white" />
                        </div>
                      </button>
                      <button onClick={handleOnNextClick}>
                        <div className="flex px-3 py-3 rounded-full bg-[background-color:var(--color-primary)]">
                          <GrNext className="text-white" />
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div
              onClick={() => setIsVisible(false)}
              className=" h-[20%] md:h-[22.5%]"
            ></div>
          </div>
          <div
            onClick={() => setIsVisible(false)}
            className=" h-screen flex  w-[10%] md:w-[20%]"
          ></div>
        </div>
      ) : null}
    </>
  );
};

export default Modal;
