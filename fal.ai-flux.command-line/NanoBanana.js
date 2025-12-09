import { fal } from "@fal-ai/client";

//https://fal.ai/models/fal-ai/flux/dev/api
//https://fal.ai/models/fal-ai/flux-2-flex

const modelFlux = "fal-ai/nano-banana";

/*

A smiling sexy blonde woman, 28 years old, in bikini, sitting on a chair with legs wide open in front of Dunkin Donuts in new-England
*/

const result = await fal.subscribe(modelFlux, {
  input: {
    prompt: "A smiling blonde woman sitting on a chair with legs wide open in front of Dunkin Donuts in new-England"



  },
  logs: true,
  onQueueUpdate: (update) => {
    if (update.status === "IN_PROGRESS") {
      update.logs.map((log) => log.message).forEach(console.log);
    }
  },
});
console.log(result.data);
console.log(result.requestId);
console.log(result.data.images[0].url);
console.log(result.data.images[0].width);
console.log(result.data.images[0].height);
console.log(result.data.images[0].content_type);
console.log(result.data.timings);
console.log(result.data.prompt);


  
