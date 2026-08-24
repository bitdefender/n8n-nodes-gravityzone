import { IDataObject, IDisplayOptions, IExecuteFunctions, INodeExecutionData, INodeProperties, NodeOperationError, jsonParse } from "n8n-workflow";

type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mergeObjects(base: PlainObject, overrides: PlainObject): PlainObject {
	const result: PlainObject = { ...base };

	for (const [key, value] of Object.entries(overrides)) {
		const baseValue = result[key];

		if (isPlainObject(baseValue) && isPlainObject(value)) {
			result[key] = mergeObjects(baseValue, value);
			
			continue;
		}

		result[key] = Array.isArray(value) ? [...value] : value;
	}

	return result;
}

function mergeDisplayOptions(base: IDisplayOptions, overrides: IDisplayOptions): IDisplayOptions {
	const baseObject = (base ?? {}) as PlainObject;
	const overrideObject = (overrides ?? {}) as PlainObject;

	return mergeObjects(baseObject, overrideObject) as IDisplayOptions;
}

export function updateDisplayOptions(
	displayOptions: IDisplayOptions,
	properties: INodeProperties[],
) {
	return properties.map((nodeProperty) => {
		return {
			...nodeProperty,
			displayOptions: mergeDisplayOptions(nodeProperty.displayOptions ?? {}, displayOptions),
		};
	});
}

export function processJsonInput<T>(ctx: IExecuteFunctions, jsonData: T, inputName?: string) {
	let values;

	const input = inputName ? `'${inputName}' ` : '';

	if (typeof jsonData === 'string') {
		try {
			values = jsonParse(jsonData);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			throw new NodeOperationError(ctx.getNode(), `Input ${input} must contain a valid JSON`);
		}
	} else if (typeof jsonData === 'object') {
		values = jsonData;
	} else {
		throw new NodeOperationError(ctx.getNode(), `Input ${input} must contain a valid JSON`);
	}

	return values;
}

export function wrapData(data: IDataObject | IDataObject[]): INodeExecutionData[] {
	if (!Array.isArray(data)) {
		return [{ json: data }];
	}

	return data.map((item) => ({
		json: item,
	}));
}