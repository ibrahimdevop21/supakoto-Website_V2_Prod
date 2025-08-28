// import type { APIRoute } from 'astro';

// export const POST: APIRoute = async ({ request }) => {
//   try {
//     const formData = await request.formData();
//     const name = formData.get('name')?.toString();
//     const phone = formData.get('phone')?.toString();
//     const message = formData.get('message')?.toString();
//     const branchId = formData.get('branchId')?.toString();

//     // Validate required fields
//     if (!name || !phone) {
//       return new Response('Missing required fields', { status: 400 });
//     }

//     // Here you would typically:
//     // 1. Save to database
//     // 2. Send notification email
//     // 3. Integrate with CRM
//     // 4. Send WhatsApp/SMS notification

//     console.log('New lead received:', {
//       name,
//       phone,
//       message,
//       branchId,
//       timestamp: new Date().toISOString()
//     });

//     // For now, return a simple success response
//     // In production, you might redirect to a thank you page
//     return new Response(
//       `
//       <!DOCTYPE html>
//       <html dir="rtl" lang="ar">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>تم إرسال طلبك بنجاح</title>
//         <script src="https://cdn.tailwindcss.com"></script>
//         <style>
//           body { background-color: #000; color: #fff; font-family: system-ui, -apple-system, sans-serif; }
//         </style>
//       </head>
//       <body class="min-h-screen flex items-center justify-center">
//         <div class="max-w-md mx-auto text-center p-8">
//           <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
//             <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
//             </svg>
//           </div>
//           <h1 class="text-2xl font-bold text-white mb-4">تم إرسال طلبك بنجاح!</h1>
//           <p class="text-neutral-300 mb-6">سيتم التواصل معك في أقرب وقت ممكن</p>
//           <a href="/contact" class="inline-block bg-[#bf1e2e] text-white rounded-xl px-6 py-3 font-semibold hover:bg-[#a01825] transition-colors duration-200">
//             العودة إلى صفحة التواصل
//           </a>
//         </div>
//       </body>
//       </html>
//       `,
//       {
//         status: 200,
//         headers: {
//           'Content-Type': 'text/html; charset=utf-8'
//         }
//       }
//     );

//   } catch (error) {
//     console.error('Error processing lead:', error);
//     return new Response('Internal server error', { status: 500 });
//   }
// };
