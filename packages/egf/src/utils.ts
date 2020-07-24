import { TrieMap } from "@thi.ng/associative";
import { implementsFunction, isPlainObject } from "@thi.ng/checks";
import { illegalArgs } from "@thi.ng/errors";
import type { IToEGFConvert, Node, NodeRef, Prefixes } from "./api";

export const isNode = (x: any): x is Node => isPlainObject(x) && "$id" in x;

export const isRef = (x: any): x is NodeRef => isPlainObject(x) && "$ref" in x;

export const isToEGF = (x: any): x is IToEGFConvert =>
    implementsFunction(x, "toEGF");

const RE_QFN = /^([a-z0-9-_$]*):([a-z0-9-_$.+]+)$/i;

export const qualifiedID = (prefixes: Prefixes, id: string) => {
    if (id[0] === "<" && id[id.length - 1] === ">") {
        return id.substring(1, id.length - 1);
    }
    if (id.indexOf(":") !== -1) {
        const match = RE_QFN.exec(id);
        if (match) {
            const prefix = prefixes[match[1]];
            return prefix
                ? prefix + match[2]
                : illegalArgs(`unknown prefix: ${id}`);
        }
    }
    return id;
};

export const defPrefixer = (prefixes: Prefixes) => {
    const rev = new TrieMap<string>();
    const used = new Set<string>();
    Object.entries(prefixes).forEach(([id, url]) => rev.set(url, id));
    return {
        used,
        prefixID(id: string) {
            const known = rev.knownPrefix(id);
            if (known) {
                const pre = rev.get(known)!;
                used.add(pre);
                return pre + ":" + id.substr(known.length);
            }
        },
    };
};
