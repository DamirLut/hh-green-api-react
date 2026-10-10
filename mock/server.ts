import type {
	GreenApiAccountSettings,
	GreenApiChat,
	GreenApiChatItem,
	GreenApiContact,
} from "../src/lib/green-api/types.ts";

interface Db {
	account: GreenApiAccountSettings;
	chats: GreenApiChat[];
	contacts: Record<string, GreenApiContact>;
	messages: Record<string, GreenApiChatItem[]>;
}

const db: Db = await Bun.file(new URL("./db.json", import.meta.url)).json();

const PORT = 3000;

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type",
};

function json(data: unknown, status = 200) {
	return Response.json(data, { status, headers: corsHeaders });
}

async function readParams(request: Request): Promise<Record<string, unknown>> {
	if (request.method !== "POST") return {};
	try {
		return (await request.json()) as Record<string, unknown>;
	} catch {
		return {};
	}
}

Bun.serve({
	port: PORT,
	async fetch(request) {
		if (request.method === "OPTIONS") {
			return new Response(null, { status: 204, headers: corsHeaders });
		}

		// /waInstance{idInstance}/{method}/{apiTokenInstance}
		const [, instance, method] = new URL(request.url).pathname.split("/");
		if (!instance?.startsWith("waInstance") || !method) {
			return json({ error: "not found" }, 404);
		}

		const params = await readParams(request);
		switch (method) {
			case "getAccountSettings":
				return json(db.account);
			case "getChats":
				return json(db.chats);
			case "getContactInfo": {
				const contact = db.contacts[String(params.chatId)];
				return contact
					? json(contact)
					: json({ error: `contact '${params.chatId}' not found` }, 404);
			}
			case "getChatHistory": {
				const messages = db.messages[String(params.chatId)] ?? [];
				const count = Number(params.count) || 1;
				return json(messages.slice(0, count));
			}
			default:
				return json({ error: `unknown method '${method}'` }, 404);
		}
	},
});

console.log(`Mock Green API listening on http://localhost:${PORT}`);
