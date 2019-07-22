import EthClient from './eth-client';
/**
 * This helper function takes a node URL and returns the appropriate client, whether it's a websocket or https client
 * Resolves when the client is ready to use
 * @param nodeUrl the url of the node, http/https/ws/wss format
 * @param validated pass true if the client should validate responses coming from the RPC
 */
export default function getClient(nodeUrl: string, validated?: boolean): Promise<EthClient>;
