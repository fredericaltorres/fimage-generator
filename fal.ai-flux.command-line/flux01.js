import { fal } from "@fal-ai/client";

//https://fal.ai/models/fal-ai/flux/dev/api
//https://fal.ai/models/fal-ai/flux-2-flex

/*

A smiling portugese woman NUDE, sitting on a on a bed 
with legs wide open in front of her boy friend nude too,stand up, close to the bed, exited,
about to practice oral sex,
behind her a window with a view of Lisbon and sea, high detail, photorealistic, people are watching 
them through the window


A smiling blonde woman NUDE, sitting on a on a bed 
with legs wide open in front of her boy friend nude too,stand up, close to the bed, exited,
about to practice oral sex,
in a modern bedroom, high detail, photorealistic


A smiling blonde woman NUDE, sitting on a on a bed 
kissing very closely her boy friend ass,

nude too,stand up, close to the bed, exited,
about to practice oral sex,
in a modern bedroom, high detail, photorealistic
*/

const modelFlux = "fal-ai/flux/dev";

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


  
