// http://localhost:3000/api/generateImage

const lastImageUrl = 'https://v3b.fal.media/files/b/0a8571d1/qvFR_JlD3hremyp8I-x3E.jpg';

export async function POST(request: Request) {
  const { prompt } = await request.json() as { prompt: string };
  console.log(prompt);
  return Response.json({ status: "ok", imageUrl: lastImageUrl })
}
