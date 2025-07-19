export function GET() {
	let i = 0;
	return new Response(
		new ReadableStream({
			start(controller) {
				setInterval(() => {
					controller.enqueue(`data: ${i++}\n\n`);
				});
			},
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive',
			},
		}
	);
}
