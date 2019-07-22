import BigNumber from 'bignumber.js';
import { Method } from './json-rpc-methods';
export declare type MethodParameter = boolean | string | number | BigNumber | MethodParameterObject | MethodParameterArray;
export interface MethodParameterObject {
    [key: string]: MethodParameter | undefined;
}
export interface MethodParameterArray extends Array<MethodParameter> {
}
/**
 * Takes a method parameter and serializes it to something that the JSON RPC accepts
 * @hidden
 * @param param parameter that should be serialized
 */
export declare function serializeToMethodParameter(param: any): MethodParameter;
/**
 * Build a request for sending to the JSON RPC
 * @param id of the request
 * @param method method for the request
 * @param params parameters to be serialized to the request
 * @hidden
 */
export declare function buildRequest(id: number, method: Method, params: MethodParameter[]): {
    id: number;
    jsonrpc: string;
    method: Method;
    params: MethodParameter;
};
