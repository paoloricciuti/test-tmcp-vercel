import { McpServer } from 'tmcp';
import { ValibotJsonSchemaAdapter } from '@tmcp/adapter-valibot';
import { HttpTransport } from '@tmcp/transport-http';

const server = new McpServer(
	{
		name: 'Test API',
		version: '1.0.0',
		description: 'A simple test API',
	},
	{
		capabilities: {
			tools: {
				listChanged: true,
			},
		},
		adapter: new ValibotJsonSchemaAdapter(),
	}
);

const transport = new HttpTransport(server, {
	path: '/api/test',
});

async function request_or_404(request) {
	const ret = await transport.respond(request);
	if (!ret) {
		return new Response('Not Found', { status: 404 });
	}
	return ret;
}

export function GET(request) {
	return request_or_404(request);
}

export function POST(request) {
	return request_or_404(request);
}

export function DELETE(request) {
	return request_or_404(request);
}
