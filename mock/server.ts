import type {
	GreenApiAccountSettings,
	GreenApiChat,
	GreenApiChatItem,
	GreenApiContact,
	GreenApiNewNotification,
} from "../src/lib/green-api/types.ts";

interface FindableContact {
	name: string;
	username: string;
}

interface Db {
	account: GreenApiAccountSettings;
	chats: GreenApiChat[];
	findable: Record<string, FindableContact>;
	contacts: Record<string, GreenApiContact>;
	messages: Record<string, GreenApiChatItem[]>;
}

const db: Db = await Bun.file(new URL("./db.json", import.meta.url)).json();

const PORT = 3000;
const LONG_POLL_TIMEOUT_MS = 20_000;
const LONG_POLL_TICK_MS = 300;
const AUTO_REPLY_DELAY_MS = 1_000;

const notificationQueue: GreenApiNewNotification[] = [];
let nextReceiptId = 1;

function checkAccount(phoneNumber: string) {
	const chatId = phoneNumber.replace(/\D/g, "");
	if (db.contacts[chatId]) return { exist: true, chatId, fromCache: true };

	const found = db.findable[chatId];
	if (!found) return { exist: false, chatId, fromCache: false };

	// register the contact and chat so getContactInfo/getChats start returning them
	db.contacts[chatId] = {
		avatar: "",
		chatId,
		chatType: "user",
		contactName: found.name,
		description: "",
		isPremium: false,
		isScam: false,
		isVerified: false,
		lastSeen: Math.floor(Date.now() / 1000),
		name: found.name,
		phoneNumber: Number(chatId),
		phoneNumberTimestamp: new Date().toISOString(),
		username: found.username,
	};
	db.chats.push({
		chatId,
		name: found.name,
		phoneNumber: Number(chatId),
		type: "user",
		username: found.username,
	});
	return { exist: true, chatId, fromCache: false };
}

function simulateIncomingMessage(
	chatId: string,
	text: string,
): GreenApiNewNotification {
	const contact = db.contacts[chatId];
	const timestamp = Math.floor(Date.now() / 1000);
	const senderName = contact?.contactName ?? chatId;
	const idMessage = crypto.randomUUID();

	const messages = (db.messages[chatId] ??= []);
	messages.unshift({
		chatId,
		chatType: "user",
		forwardingScore: 0,
		idMessage,
		isDeleted: false,
		isEdited: false,
		isForwarded: false,
		senderContactName: senderName,
		senderId: chatId,
		senderName,
		senderType: "user",
		textMessage: text,
		timestamp,
		type: "incoming",
		typeMessage: "textMessage",
	});

	const notification: GreenApiNewNotification = {
		receiptId: nextReceiptId++,
		body: {
			typeWebhook: "incomingMessageReceived",
			instanceData: {
				idInstance: 0,
				wid: db.account.chatId ?? String(db.account.phone),
				typeInstance: "whatsapp",
			},
			timestamp,
			idMessage,
			senderData: {
				chatId,
				chatType: "user",
				chatName: senderName,
				sender: chatId,
				senderContactName: senderName,
				senderName,
				senderPhoneNumber: contact?.phoneNumber ?? 0,
				senderType: "user",
			},
			messageData: { textMessage: text, typeMessage: "textMessage" },
		},
	};
	notificationQueue.push(notification);
	return notification;
}

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
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
	idleTimeout: 0,
	async fetch(request) {
		if (request.method === "OPTIONS") {
			return new Response(null, { status: 204, headers: corsHeaders });
		}

		const pathname = new URL(request.url).pathname;

		// test-only route to inject an incoming message
		if (pathname === "/test/incoming" && request.method === "POST") {
			const params = await readParams(request);
			const chatId = String(params.chatId ?? "");
			if (!chatId) return json({ error: "chatId is required" }, 400);
			return json(simulateIncomingMessage(chatId, String(params.text ?? "")));
		}

		// /waInstance{idInstance}/{method}/{apiTokenInstance}
		const [, instance, method] = pathname.split("/");
		if (!instance?.startsWith("waInstance") || !method) {
			return json({ error: "not found" }, 404);
		}

		const params = await readParams(request);
		switch (method) {
			case "getAccountSettings":
				return json(db.account);
			case "checkAccount": {
				const phoneNumber = String(params.phoneNumber ?? "");
				return json(checkAccount(phoneNumber));
			}
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
			case "sendMessage": {
				const chatId = String(params.chatId ?? "");
				const idMessage = crypto.randomUUID();
				const messages = (db.messages[chatId] ??= []);
				const text = String(params.message ?? "");
				messages.unshift({
					chatId,
					chatType: "user",
					forwardingScore: 0,
					idMessage,
					isDeleted: false,
					isEdited: false,
					isForwarded: false,
					senderContactName: db.account.username,
					senderId: db.account.chatId ?? db.account.phone,
					senderName: db.account.username,
					senderType: "user",
					textMessage: text,
					timestamp: Math.floor(Date.now() / 1000),
					type: "outgoing",
					typeMessage: "textMessage",
				});
				setTimeout(
					() => simulateIncomingMessage(chatId, `pong: ${text}`),
					AUTO_REPLY_DELAY_MS,
				);
				return json({ idMessage });
			}
			case "receiveNotification": {
				const deadline = Date.now() + LONG_POLL_TIMEOUT_MS;
				while (Date.now() < deadline) {
					const notification = notificationQueue.shift();
					if (notification) return json(notification);
					await Bun.sleep(LONG_POLL_TICK_MS);
				}
				return json(null);
			}
			case "deleteNotification": {
				const receiptId = Number(pathname.split("/").at(-1));
				const index = notificationQueue.findIndex(
					(notification) => notification.receiptId === receiptId,
				);
				if (index !== -1) notificationQueue.splice(index, 1);
				return new Response(null, { status: 204, headers: corsHeaders });
			}
			default:
				return json({ error: `unknown method '${method}'` }, 404);
		}
	},
});

console.log(`Mock Green API listening on http://localhost:${PORT}`);
