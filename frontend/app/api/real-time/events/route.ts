import { NextRequest } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  
  // Get the base URL from the request
  const baseUrl = 'http://localhost:3000';
  
  const stream = new ReadableStream({
    start(controller) {
      let isStreamActive = true;
      
      // Send initial connection message
      if (isStreamActive) {
        controller.enqueue(encoder.encode('data: {"type":"connected","payload":{"message":"Real-time connection established"}}\n\n'));
      }
      
      // Set up interval to check for database changes
      const interval = setInterval(async () => {
        try {
          // Check if stream is still active before writing
          if (!isStreamActive) {
            clearInterval(interval);
            return;
          }



        } catch (error) {
          console.error('Error checking for updates:', error);
          // If there's an error, check if we should close the stream
          if (error instanceof Error && 'code' in error && error.code === 'ERR_INVALID_STATE') {
            isStreamActive = false;
            clearInterval(interval);
            try {
              controller.close();
            } catch {
              // Stream already closed, ignore
            }
          }
        }
      }, 10000); // Check every 10 seconds to reduce stream pressure

      // Clean up interval when connection closes
      request.signal.addEventListener('abort', () => {
        isStreamActive = false;
        clearInterval(interval);
        try {
          controller.close();
        } catch {
          // Stream already closed, ignore
        }
      });

      // Handle stream close events
      request.signal.addEventListener('close', () => {
        isStreamActive = false;
        clearInterval(interval);
        try {
          controller.close();
        } catch {
          // Stream already closed, ignore
        }
      });

      // Additional safety: check if stream is still active before each interval
      const checkStreamActive = () => {
        if (!isStreamActive) {
          clearInterval(interval);
        }
      };
      
      // Check stream state every second as additional safety
      const safetyInterval = setInterval(checkStreamActive, 1000);
      
      // Clean up safety interval
      request.signal.addEventListener('abort', () => {
        clearInterval(safetyInterval);
      });
      
      request.signal.addEventListener('close', () => {
        clearInterval(safetyInterval);
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
}
