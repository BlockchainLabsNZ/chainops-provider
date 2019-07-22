"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eth_http_client_1 = __importDefault(require("./eth-http-client"));
const eth_web_socket_client_1 = __importDefault(require("./eth-web-socket-client"));
const validated_eth_client_1 = __importDefault(require("./validated-eth-client"));
/**
 * This helper function takes a node URL and returns the appropriate client, whether it's a websocket or https client
 * Resolves when the client is ready to use
 * @param nodeUrl the url of the node, http/https/ws/wss format
 * @param validated pass true if the client should validate responses coming from the RPC
 */
function getClient(nodeUrl, validated = false) {
    return __awaiter(this, void 0, void 0, function* () {
        let client;
        const lower = nodeUrl.toLowerCase();
        if (lower.indexOf('https:/') === 0 || lower.indexOf('http:/') === 0) {
            client = new eth_http_client_1.default({ endpointUrl: nodeUrl });
        }
        else if (lower.indexOf('wss:/') === 0 || lower.indexOf('ws:/') === 0) {
            client = yield eth_web_socket_client_1.default.Connect(nodeUrl);
        }
        else {
            throw new Error(`unknown protocol in url "${nodeUrl}"`);
        }
        if (validated) {
            client = new validated_eth_client_1.default(client);
        }
        return client;
    });
}
exports.default = getClient;
