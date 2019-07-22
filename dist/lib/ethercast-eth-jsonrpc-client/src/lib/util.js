"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const to_hex_1 = __importDefault(require("./to-hex"));
/**
 * Takes a method parameter and serializes it to something that the JSON RPC accepts
 * @hidden
 * @param param parameter that should be serialized
 */
function serializeToMethodParameter(param) {
    switch (typeof param) {
        case 'object':
            if (param instanceof bignumber_js_1.default) {
                return to_hex_1.default(param);
            }
            if (Array.isArray(param)) {
                return param.map(serializeToMethodParameter);
            }
            const serializedObject = {};
            for (const k in param) {
                if (param.hasOwnProperty(k)) {
                    serializedObject[k] = serializeToMethodParameter(param[k]);
                }
            }
            return serializedObject;
        case 'string':
            return param;
        case 'number':
            return to_hex_1.default(param);
        case 'boolean':
            return param;
        default:
            throw new Error('unhandled type');
    }
}
exports.serializeToMethodParameter = serializeToMethodParameter;
/**
 * Build a request for sending to the JSON RPC
 * @param id of the request
 * @param method method for the request
 * @param params parameters to be serialized to the request
 * @hidden
 */
function buildRequest(id, method, params) {
    return {
        id,
        jsonrpc: '2.0',
        method,
        params: serializeToMethodParameter(params)
    };
}
exports.buildRequest = buildRequest;
