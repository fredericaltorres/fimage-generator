import { fal } from "@fal-ai/client";
import { modelInfos } from "./modelInfos";

// http://localhost:3000/api/generateImage

const round1 = (n: number) => Math.round(n * 10) / 10;

const width = Math.trunc(1280 / 3 * 2);
const height = Math.trunc(720 / 3 * 2);

export async function POST(request: Request) {

  const { prompt, modelName } = await request.json() as { prompt: string, modelName: string };
  const modelInfo = modelInfos.find((modelInfo) => modelInfo.name === modelName);
  if (!modelInfo)
    throw new Error(`Model ${modelName} not found`);

  console.log(`Call model: ${modelInfo.name}`);

  const result = await fal.subscribe(modelInfo.model, { // THE FAL_KEY is in the machine environment variables
    input: {
      prompt: prompt,
      image_size: { "width": width, "height": height },
      num_images: 1,
      enable_safety_checker: false,
      //"output_format": "jpeg",
      acceleration: "none",
      //seed: 123457,
    },
    logs: true,
    onQueueUpdate: (update) => {
      console.log("onQueueUpdate", update.status);
      if (update.status === "IN_PROGRESS") {
        update.logs.map((log) => log.message).forEach(console.log);
      }
    }
  });

  console.log("Result: ", result);

  const r = {
    url: result.data.images[0]?.url,
    width: result.data.images[0]?.width,
    height: result.data.images[0]?.height,
    content_type: result.data.images[0]?.content_type,
    timings: round1(result.data?.timings?.inference),
    prompt: result.data?.prompt,
    requestId: result.requestId,
    description: result.data?.description, // nanobanana has description
    modelName: modelInfo.name,
  }

  return Response.json(r)
}
