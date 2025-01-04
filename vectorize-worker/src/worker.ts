// import { Ai } from '@cloudflare/ai';
// import { ExecutionContext } from '@cloudflare/workers-types';

// interface Env {
//   AI: any;
//   VECTORIZE_INDEX: any;
// }

// interface EmbedRequest {
//   text: string;
// }

// export default {
//   async fetch(request: Request, env: Env, ctx: ExecutionContext) {
//     // Enable CORS.
//     if (request.method === 'OPTIONS') {
//       return new Response(null, {
//         headers: {
//           'Access-Control-Allow-Origin': '*',
//           'Access-Control-Allow-Methods': 'POST, OPTIONS',
//           'Access-Control-Allow-Headers': 'Content-Type',
//         },
//       });
//     }

//     const ai = new Ai(env.AI);

//     try {
//       const { pathname } = new URL(request.url);

//       if (pathname === '/embed') {
//         if (request.method !== 'POST') {
//           return new Response('Method not allowed', { status: 405 });
//         }

//         const body = await request.json() as EmbedRequest;
        
//         if (!body.text || typeof body.text !== 'string') {
//           return new Response('Invalid input', { 
//             status: 400,
//             headers: { 'Content-Type': 'application/json' }
//           });
//         }

//         // Get embeddings from the AI model
//         const embeddings = await ai.run('@cf/baai/bge-base-en-v1.5', {
//           text: [body.text]
//         });

//         // Log the response for debugging
//         console.log('AI Response:', embeddings);

//         // Format the response to match expected structure
//         const response = {
//           data: [{
//             embedding: embeddings.data[0]  // Access the first embedding array
//           }]
//         };

//         return new Response(JSON.stringify(response), {
//           headers: { 
//             'Content-Type': 'application/json',
//             'Access-Control-Allow-Origin': '*'
//           }
//         });
//       }

//       return new Response('Not found', { status: 404 });
//     } catch (error) {
//       console.error('Worker error:', error);
//       return new Response(JSON.stringify({ 
//         error: error instanceof Error ? error.message : 'Internal server error',
//         errorDetails: error
//       }), {
//         status: 500,
//         headers: { 
//           'Content-Type': 'application/json',
//           'Access-Control-Allow-Origin': '*'
//         }
//       });
//     }
//   },
// }; 