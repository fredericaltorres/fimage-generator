import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/flux-2-flex", {
  input: {
    prompt: "A smiling blonde woman  sitting on a chair with legs wide open in front of Dunkin Donuts in new-England",
    image_size: "landscape_4_3",
    output_format: "jpeg",
    guidance_scale: 3.5,
    safety_tolerance: "2",
    num_inference_steps: 28,
    enable_safety_checker: true,
    enable_prompt_expansion: true
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