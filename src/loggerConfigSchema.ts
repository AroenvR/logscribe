/**
 * Logger configuration schema for AJV.
 */
export const loggerConfigSchema = {
    type: "object",
    properties: {
        appName: { type: "string" },
        driver: { type: "string" },
        enableCorrelation: { type: "boolean" },
        level: { type: "string" },
        console: { type: "boolean" },
        file: {
            type: "object",
            properties: {
                enabled: { type: "boolean" },
                path: { type: "string" },
                name: { type: "string" }
            },
            required: ["enabled"],
        },
        http: {
            type: "object",
            properties: {
                enabled: { type: "boolean" },
                host: { type: "string" },
                path: { type: "number" },
                token: { type: "string" },
            },
            required: ["enabled"],
        },
        useWhitelist: { type: "boolean" },
        prefixWhitelist: {
            type: "array",
            items: { type: "string" },
        },
    },
    required: ["appName", "driver", "enableCorrelation", "level", "console", "file", "http", "useWhitelist", "prefixWhitelist"],
};