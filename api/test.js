import { McpServer } from 'tmcp';
import { ValibotJsonSchemaAdapter } from '@tmcp/adapter-valibot';
import { HttpTransport } from '@tmcp/transport-http';
import * as v from 'valibot';

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
			resources: {
				listChanged: true,
			},
		},
		adapter: new ValibotJsonSchemaAdapter(),
	}
);

server.tool(
	{
		name: 'add-numbers',
		description: 'Adds two numbers together',
		schema: v.object({
			first: v.number(),
			second: v.number(),
		}),
	},
	({ first, second }) => {
		return {
			content: [
				{
					type: 'text',
					text: `The sum of ${first} and ${second} is ${
						first + second
					}.`,
				},
			],
		};
	}
);

server.template(
	{
		name: 'products',
		description: 'A list of products from the products API',
		uri: 'test://products/{product}',
		title: 'Products',
		list: async () => {
			const products = await fetch('https://dummyjson.com/products').then(
				(res) => res.json()
			);
			const ret = products.products.map((product) => ({
				name: product.title,
				uri: `test://products/${product.id}`,
				title: product.title,
				description: product.description,
			}));
			return ret;
		},
		complete: {
			product: async () => {
				const products = await fetch(
					'https://dummyjson.com/products'
				).then((res) => res.json());
				return products.products.map((product) => product.id);
			},
		},
	},
	async (uri, { product }) => {
		const res = await fetch(
			`https://dummyjson.com/products/${product}`
		).then((res) => res.text());
		return {
			contents: [
				{
					uri,
					text: res,
					mimeType: 'application/json',
				},
			],
		};
	}
);

const transport = new HttpTransport(server, {
	path: '/api/test',
	getSessionId: () => crypto.randomUUID(),
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
