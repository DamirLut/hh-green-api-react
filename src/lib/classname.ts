type ClassValue =
	| ClassArray
	| ClassDictionary
	| SignalishClass
	| string
	| number
	| bigint
	| null
	| boolean
	| undefined;
type ClassDictionary = Record<string, unknown>;
type ClassArray = ClassValue[];
type SignalishClass = {
	value: string | undefined;
};

function toVal(mix: ClassValue): string {
	if (typeof mix === "string" || typeof mix === "number") {
		return String(mix);
	}

	if (typeof mix === "bigint") {
		return mix.toString();
	}

	if (!mix || typeof mix !== "object") {
		return "";
	}

	if (isSignalishClass(mix)) {
		return mix.value ?? "";
	}

	if (Array.isArray(mix)) {
		return mix.map(toVal).filter(Boolean).join(" ");
	}

	const classes: string[] = [];
	for (const key in mix) {
		if (mix[key]) {
			classes.push(key);
		}
	}

	return classes.join(" ");
}

export function cn(...args: ClassValue[]) {
	return args.map(toVal).filter(Boolean).join(" ");
}

function isSignalishClass(value: object): value is SignalishClass {
	if (!("value" in value)) {
		return false;
	}

	const signalValue = value.value;
	return signalValue === undefined || typeof signalValue === "string";
}
