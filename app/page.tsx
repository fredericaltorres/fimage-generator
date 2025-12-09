'use client';

import { Button } from "components/Button/Button"
import { useState } from 'react';
import { modelInfos } from './api/generateImage/modelInfos';

interface ImageInfo {
  url: string;
  width?: number;
  height?: number;
  content_type: string;
  timings?: any;
  prompt: string;
  requestId: string;
  modelName: string;
}

const blankImageInfo: ImageInfo = { url: "", width: 0, height: 0, content_type: "", timings: {}, prompt: "", requestId: "", modelName: "" }

function GetWordCountDifference(prompt1: string, prompt2: string) {

  const words1 = prompt1.split(" ");
  const words2 = prompt2.split(" ");
  return words1.length - words2.length;
}

const MAX_WORD_TRIGGER = 4;

function IsTimeToReGenerateImage(prompt1: string, prompt2: string) {

  const wordCountDifference = GetWordCountDifference(prompt1, prompt2);
  return wordCountDifference >= MAX_WORD_TRIGGER;
}

const defaultCurrentPrompt = ``;

const callImageGeneratorApi = async (prompt: string, modelName: string) => {

  console.log("callImageGeneratorApi START");
  const response = await fetch("/api/generateImage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, modelName }),
  });
  const data = await response.json() as ImageInfo;
  console.log('callImageGeneratorApi END', data);
  return data;
};

export default function Web() {

  const [previousPrompt, setPreviousPrompt] = useState(defaultCurrentPrompt);
  const [currentPrompt, setCurrentPrompt] = useState(defaultCurrentPrompt);
  const [imageInfo, setImageInfo] = useState<ImageInfo>(blankImageInfo);
  const [computingImage, setComputingImage] = useState(false);
  const [modelName, setModelName] = useState(modelInfos.length > 0 ? modelInfos[0]?.name : "");

  const modelInfo = modelInfos.find((modelInfo) => modelInfo.name === modelName);

  const clearPrompt = () => {
    setCurrentPrompt(defaultCurrentPrompt);
    setPreviousPrompt(defaultCurrentPrompt);
    setImageInfo(blankImageInfo);
  };

  const generateNewImage = async (prompt: string, modelName: string) => {
    try {
      console.log("Regenerate image START");
      setComputingImage(true);
      setPreviousPrompt(prompt);
      const newImageInfo = await callImageGeneratorApi(prompt, modelName);
      setImageInfo(newImageInfo);
    }
    catch (error) {
      console.error("Error generating image", error);
      setImageInfo(blankImageInfo);
    }
    finally {
      setComputingImage(false);
      console.log("Regenerate image END");
    }
  };

  const onPromptChange = async (e: React.ChangeEvent<HTMLTextAreaElement>, modelName: string) => {

    const model = modelInfos.find((modelInfo) => modelInfo.name === modelName);
    if (!model)
      throw new Error(`Model ${modelName} not found`);

    setCurrentPrompt(e.target.value);
    if (model.autoTrigger && IsTimeToReGenerateImage(e.target.value, previousPrompt)) {
      generateNewImage(e.target.value, modelName);
    }
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto grid max-w-(--breakpoint-xl) px-1 py-1 text-center lg:py-3">
          <div className="mx-auto place-self-center">

            <h1 className="mb-4 max-w-2xl text-4xl leading-none font-extrabold tracking-tight md:text-3xl xl:text-3xl dark:text-white mx-auto">
              Fred Image Generator
            </h1>

            {computingImage && <div>Computing image...</div>}

            <span className="flex">
              <span className="m-2">Prompt:</span>
              <textarea value={currentPrompt} onChange={(e) => onPromptChange(e, modelName as string)} rows={4} cols={250} className="border border-black m-2 p-2 rounded w-full max-w-2xl" />
            </span>

            <span className="flex">
              <span className="m-2">Model:</span>&nbsp;&nbsp;
              <select value={modelName} onChange={(e) => setModelName(e.target.value)} className="border border-black m-2 p-2 rounded ">
                {modelInfos.map((modelInfo) => (
                  <option key={modelInfo.name} value={modelInfo.name}>
                    {modelInfo.name}
                  </option>
                ))}
              </select>
              <span className="m-2">{modelInfo?.autoTrigger && <div>Auto trigger enabled</div>}</span>
            </span>

            <Button href="#" onClick={() => generateNewImage(currentPrompt, modelName as string)} className="mr-3" size="sm"> Generate Image </Button>
            <Button href="#" onClick={() => clearPrompt()} className="mr-3" size="sm"> Clear </Button>
            <br />
            <br />
            {imageInfo && imageInfo.url && <div> Image size: {imageInfo.width} x {imageInfo.height}, timings: {imageInfo.timings}, model: {imageInfo.modelName}, content_type: {imageInfo.content_type} </div>}

            <br /><hr /><br />

            {imageInfo && imageInfo.url && <img src={imageInfo.url} />}

            {/* <Button href="https://vercel.com/new/git/external?repository-url=https://github.com/Blazity/next-enterprise" intent="secondary"> Deploy Now</Button> */}
          </div>
        </div>
      </section>
    </>
  )
}
