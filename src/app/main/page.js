"use client";

import React, { useState, useEffect } from "react";
import Container from "@components/container";
import Button from "@components/Button/page";
import FileUpload from "@components/Button/fileUpload";
import Modal from "@components/Modal/page";
import Toggle from "@components/Button/toggle";
import useUserStore from "../../useStore";
import useUpload from "@hooks/useUpload";
import WebcamSkeleton from "@components/Skeleton/webcamSkeleton";
import Roboflow from "@components/Roboflow/roboflow";
import useAnalyze from "@hooks/useAnalyze";
import Skeleton from "@components/Skeleton/Skeleton";

const Main = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const { user, isAuthenticated } = useUserStore();
  const { uploadFile } = useUpload();
  const { analyzeFile } = useAnalyze();
  const [file, setFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analyzedImage, setAnalyzedImage] = useState(null);
  const [extension, setExtension] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selected, setSelected] = useState(0);
  const [toggleButton, setToggleButton] = useState(false);
  const [loading, setLoading] = useState(false);
  let authorization;
  if (user) {
    authorization = user.user.access_token;
  }
  const handleFileUpload = async () => {
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadFile({
        body: formData,
      });
      if (response) {
        console.log("Image uploaded successfully");
        console.log(response.data.name.split(".").pop());
        setUploadedImage(response.data);
        setExtension(response.data.name.split(".").pop());
        console.log(extension);
        setLoading(false);
      } else {
        setLoading(false);
        console.error("Image upload not successful");
      }
    } else {
      console.error("No file selected");
    }
  };

  const handleSelectModel = (modelName) => {
    setSelectedModel(modelName);
    // setIsModalOpen(false)
  };

  const handleAnalyze = async () => {
    if (uploadedImage) {
      try {
        setLoading(true);
        console.log(uploadedImage)
        const response = await analyzeFile(
          {
            fileUrl: uploadedImage.url,
          },
          authorization
        );

        if (response.status === 201) {
          console.log("Image analyzed successfully");
          setAnalyzedImage(response.data);
          setLoading(false);
        } else {
          console.error("Image analyze unsuccessful");
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error analyzing file:", error.message);
      }
    } else {
      console.error("No file selected");
    }
  };

  const handleExport = () => {
    if (analyzedImage) {
      const link = document.createElement("a");
      link.href = analyzedImage.url;
      link.setAttribute("download", "image.png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  useEffect(() => {
    if (uploadedImage) {
      console.log("Uploaded Image:", uploadedImage);
    }

    if (analyzedImage) {
      console.log("Analyzed Image:", analyzedImage);
    }
    if (extension) {
      console.log("Extension:", extension);
    }
    if (selectedModel) {
      console.log("Model:", selectedModel);
    }
  }, [uploadedImage, analyzedImage, extension, selectedModel]);

  const renderContent = () => {
    return (
      <div>
        <div className="flex flex-col mb-[20px]">
          <div className="w-full flex justify-end mb-[20px]">
            <Toggle title="Use custom weights" />
          </div>
          <h1 className="font-bold text-[20px]">Model</h1>
          <span className="text-gray-400">
            Select from any from our pre-defined model you want to use.
          </span>
          <ul className="flex py-[20px] gap-3">
            <li
              className="w-fit text-gray-500 px-[10px] py-[5px] cursor-pointer rounded-md border border-gray-300 hover:border-green-300 hover:text-green-500"
              onClick={() => handleSelectModel("General")}
            >
              <span className="">General</span>
            </li>
            <li
              className="w-fit text-gray-500 px-[10px] py-[5px] cursor-pointer rounded-md border border-gray-300 hover:border-green-300 hover:text-green-500"
              onClick={() => handleSelectModel("LaserSolder")}
            >
              <span className="">Laser Solder</span>
            </li>
          </ul>
        </div>
        <div className="flex flex-col">
          <h1 className="font-bold text-[20px]">Upload your own model</h1>
          <span className="text-gray-400">
            You can add your own custom dataset to be used in the AI model.
          </span>
          <FileUpload />
        </div>
      </div>
    );
  };

  return (
    <>
      <Container>
        {/* <div className="min-h-[100vh] float-left text-neutral-900 w-full justify-center p-[20px]"> */}
        <ul className="flex flex-wrap -mb-px  border-b border-gray-200">
          <li className="mr-2">
            <div>
              <a
                className={`inline-block p-4 cursor-pointer ${
                  selected === 0
                    ? "text-green-600 border-b-2 font-bold border-green-600 rounded-t-lg active"
                    : "border-b-2 border-transparent rounded-t-lg hover:text-gray-600  hover:border-gray-300"
                }`}
                onClick={() => setSelected(0)}
              >
                Upload Image
              </a>
              <a
                className={`inline-block p-4 cursor-pointer ${
                  selected === 1
                    ? "text-green-600 border-b-2 font-bold border-green-600 rounded-t-lg active"
                    : "border-b-2 border-transparent rounded-t-lg hover:text-gray-600  hover:border-gray-300"
                }`}
                onClick={() => setSelected(1)}
              >
                External Webcam
              </a>
            </div>
          </li>
        </ul>
        {user && isAuthenticated && isModalOpen && (
          <Modal
            title="Setup your AI model"
            onClose={() => {
              setIsModalOpen(!isModalOpen);
            }}
            content={renderContent}
            footer={() => {
              return (
                <div className="w-full flex justify-end">
                  <Button
                    style={" bg-green-400 text-white ml-[20px]"}
                    title="Continue"
                    onClick={() => {
                      setIsModalOpen(!isModalOpen);
                    }}
                  />
                </div>
              );
            }}
          />
        )}
        {selected === 0 ? (
          <>
            <div className="w-full flex flex-col gap-x-1 items-left justify-between mb-4 h-48 rounded shadow p-6 mt-10">
              <h1 className="text-3xl font-bold">Upload your image</h1>
              <form
                id="fileUploadForm"
                method="POST"
                encType="multipart/form-data"
                className="flex justify-between"
              >
                <input
                  type="file"
                  name="file"
                  accept=".txt, .pdf, .png, .jpg, .jpeg, .gif"
                  onChange={({ target }) => {
                    setUploadedImage(null);
                    setAnalyzedImage(null);
                    setFile(target.files[0]);
                  }}
                />
                <Button
                  title="Upload"
                  style=" bg-green-400 text-white hover:bg-green-500"
                  onClick={handleFileUpload}
                />
              </form>
            </div>
            {uploadedImage && (
              <div className="w-full flex flex-col gap-y-10 mb-4 rounded shadow p-6 items-center md:flex-row md:items-start md:gap-x-10">
                <img
                  className="flex-shrink w-1/3 h-1/2 object-cover"
                  src={uploadedImage.url}
                  alt="Uploaded"
                />
                <div className="flex flex-col flex-shrink items-start font text-base">
                  <div className="flex items-start mb-2">
                    <p className="font-bold mr-5" style={{ width: "100px" }}>
                      Filename:
                    </p>
                    <p className="break-words max-w-[400px] xl:max-w-[23rem] md:max-w-[10rem]">
                      {uploadedImage.name}
                    </p>
                  </div>
                  <div className="flex items-center mb-2">
                    <p className="font-bold mr-5" style={{ width: "100px" }}>
                      Dimensions:
                    </p>
                    <p>{uploadedImage.dimensions}</p>
                  </div>
                  <div className="flex items-center mb-2">
                    <p className="font-bold mr-5" style={{ width: "100px" }}>
                      Size:
                    </p>
                    <p>{uploadedImage.size}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="font-bold mr-5" style={{ width: "100px" }}>
                      Extension:
                    </p>
                    <p>{extension}</p>
                  </div>
                </div>
                <Button
                  title="Analyze"
                  style=" bg-green-400 text-white hover:bg-green-500 md:ml-auto"
                  onClick={handleAnalyze}
                />
              </div>
            )}
            {analyzedImage && (
              <div className="w-full flex flex-col gap-y-10 mb-4 rounded shadow p-6 items-center md:flex-row md:items-start md:gap-x-10">
                <img
                  className="flex-shrink-0 w-1/3 h-1/2 object-cover"
                  src={analyzedImage.url}
                  alt="Uploaded"
                />
                <div className="flex flex-col flex-shrink items-start font text-base">
                  <div className="flex items-start mb-2">
                    <p className="font-bold" style={{ width: "120px" }}>
                      Classification:
                    </p>
                    <p
                      className={
                        analyzedImage.classification == "Good"
                          ? `text-green-400 font-bold`
                          : `text-red-500 font-bold`
                      }
                    >
                      {analyzedImage.classification}
                    </p>
                  </div>
                  <div className="flex items-center mb-2 ">
                    <p
                      className="font-bold mr-5"
                      style={{ width: '100px' }}
                    >
                      Accuracy:
                    </p>
                    <p>{analyzedImage.accuracy}</p>
                  </div>
                  <div className="flex items-center mb-2">
                    <p
                      className="font-bold mr-5"
                      style={{ width: '100px' }}
                    >
                      Error Rate:
                    </p>
                    <p>{analyzedImage.error_rate} </p>
                  </div>
                  <div className="flex items-start">
                    <p className="font-bold mr-20">
                      Path:
                    </p>
                    <p
                    	className='break-words max-w-[400px] xl:max-w-[23rem] md:max-w-[10rem]'
                    >
                      {analyzedImage.url}
                    </p>
                  </div>
                </div>
                <Button
                  title="Export"
                  style=" bg-green-400 text-white hover:bg-green-500 md:ml-auto"
                  onClick={handleExport}
                />
              </div>
            )}
            {loading && (
              <div className="w-full flex flex-col gap-x-1 items-left justify-between mb-4 h-fit rounded shadow p-6 mt-10">
                <Skeleton title={"Loading..."} />
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full mt-10 flex flex-col items-center gap-[20px]">
            <div className="w-full flex justify-end">
              <Button
                title={!toggleButton ? "Open Webcam" : "Close Webcam"}
                onClick={() => setToggleButton(!toggleButton)}
                style=" bg-green-400 text-white hover:bg-green-500"
              />
            </div>
            {toggleButton ? (
              <Roboflow modelName="body parts" modelVersion="1" />
            ) : (
              <WebcamSkeleton />
            )}
          </div>
        )}
        {/* </div> */}
      </Container>
    </>
  );
};

export default Main;
