"use strict";
// Modified version of https://github.com/kotx/render
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var range_parser_1 = require("range-parser");
function hasBody(object) {
    return object.body !== undefined;
}
var resolvedKeyHeader = "x-resolved-r2-key";
function rangeToHeader(range, file) {
    var _a, _b;
    if (range) {
        var offset = (_a = range.offset) !== null && _a !== void 0 ? _a : 0;
        var length_1 = (_b = range.length) !== null && _b !== void 0 ? _b : 0;
        return "bytes ".concat(offset, "-").concat(offset + length_1 - 1, "/").concat(file.size);
    }
    else {
        return "";
    }
}
exports["default"] = {
    fetch: function (request, env, ctx) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __awaiter(this, void 0, void 0, function () {
            var allowedMethods, url, cache, response, range, path, file, rangeHeader, parsedRanges, firstRange, getHeaderEtag, ifMatch, ifNoneMatch, ifModifiedSince, ifUnmodifiedSince, ifRange, maybeDate, _m, _o;
            var _p, _q, _r, _s, _t;
            return __generator(this, function (_u) {
                switch (_u.label) {
                    case 0:
                        allowedMethods = ["GET", "HEAD", "OPTIONS"];
                        if (allowedMethods.indexOf(request.method) === -1)
                            return [2 /*return*/, new Response("Method Not Allowed", { status: 405 })];
                        if (request.method === "OPTIONS") {
                            return [2 /*return*/, new Response(null, { headers: { "allow": allowedMethods.join(", ") } })];
                        }
                        url = new URL(request.url);
                        if (url.pathname === "/") {
                            url.pathname = '/index.html';
                        }
                        cache = caches["default"];
                        return [4 /*yield*/, cache.match(request)];
                    case 1:
                        response = _u.sent();
                        if (!(!response || !response.ok)) return [3 /*break*/, 17];
                        console.warn("Cache miss");
                        path = decodeURIComponent(url.pathname.substring(1));
                        file = void 0;
                        if (!(request.method === "GET")) return [3 /*break*/, 3];
                        rangeHeader = request.headers.get("range");
                        if (!rangeHeader) return [3 /*break*/, 3];
                        return [4 /*yield*/, env.R2_BUCKET.head(path)];
                    case 2:
                        file = _u.sent();
                        if (file === null)
                            return [2 /*return*/, new Response("File Not Found", {
                                    status: 404,
                                    headers: (_p = {},
                                        _p[resolvedKeyHeader] = path,
                                        _p)
                                })];
                        parsedRanges = (0, range_parser_1["default"])(file.size, rangeHeader);
                        // R2 only supports 1 range at the moment, reject if there is more than one
                        if (parsedRanges !== -1 && parsedRanges !== -2 && parsedRanges.length === 1 && parsedRanges.type === "bytes") {
                            firstRange = parsedRanges[0];
                            range = {
                                offset: firstRange.start,
                                length: firstRange.end - firstRange.start + 1
                            };
                        }
                        else {
                            return [2 /*return*/, new Response("Range Not Satisfiable", {
                                    status: 416,
                                    headers: (_q = {},
                                        _q[resolvedKeyHeader] = path,
                                        _q)
                                })];
                        }
                        _u.label = 3;
                    case 3:
                        getHeaderEtag = function (header) { return header === null || header === void 0 ? void 0 : header.trim().replace(/^['"]|['"]$/g, ""); };
                        ifMatch = getHeaderEtag(request.headers.get("if-match"));
                        ifNoneMatch = getHeaderEtag(request.headers.get("if-none-match"));
                        ifModifiedSince = Date.parse(request.headers.get("if-modified-since") || "");
                        ifUnmodifiedSince = Date.parse(request.headers.get("if-unmodified-since") || "");
                        ifRange = request.headers.get("if-range");
                        if (range && ifRange && file) {
                            maybeDate = Date.parse(ifRange);
                            if (isNaN(maybeDate) || new Date(maybeDate) > file.uploaded) {
                                // httpEtag already has quotes, no need to use getHeaderEtag
                                if (ifRange !== file.httpEtag)
                                    range = undefined;
                            }
                        }
                        if (!(ifMatch || ifUnmodifiedSince)) return [3 /*break*/, 5];
                        return [4 /*yield*/, env.R2_BUCKET.get(path, {
                                onlyIf: {
                                    etagMatches: ifMatch,
                                    uploadedBefore: ifUnmodifiedSince ? new Date(ifUnmodifiedSince) : undefined
                                },
                                range: range
                            })];
                    case 4:
                        file = _u.sent();
                        if (file && !hasBody(file)) {
                            return [2 /*return*/, new Response("Precondition Failed", {
                                    status: 412,
                                    headers: (_r = {},
                                        _r[resolvedKeyHeader] = path,
                                        _r)
                                })];
                        }
                        _u.label = 5;
                    case 5:
                        if (!(ifNoneMatch || ifModifiedSince)) return [3 /*break*/, 10];
                        if (!ifNoneMatch) return [3 /*break*/, 7];
                        return [4 /*yield*/, env.R2_BUCKET.get(path, { onlyIf: { etagDoesNotMatch: ifNoneMatch }, range: range })];
                    case 6:
                        file = _u.sent();
                        return [3 /*break*/, 9];
                    case 7:
                        if (!ifModifiedSince) return [3 /*break*/, 9];
                        return [4 /*yield*/, env.R2_BUCKET.get(path, { onlyIf: { uploadedAfter: new Date(ifModifiedSince) }, range: range })];
                    case 8:
                        file = _u.sent();
                        _u.label = 9;
                    case 9:
                        if (file && !hasBody(file)) {
                            return [2 /*return*/, new Response(null, { status: 304 })];
                        }
                        _u.label = 10;
                    case 10:
                        if (!(request.method === "HEAD")) return [3 /*break*/, 12];
                        return [4 /*yield*/, env.R2_BUCKET.head(path)];
                    case 11:
                        _m = _u.sent();
                        return [3 /*break*/, 16];
                    case 12:
                        if (!(file && hasBody(file))) return [3 /*break*/, 13];
                        _o = file;
                        return [3 /*break*/, 15];
                    case 13: return [4 /*yield*/, env.R2_BUCKET.get(path, { range: range })];
                    case 14:
                        _o = _u.sent();
                        _u.label = 15;
                    case 15:
                        _m = (_o);
                        _u.label = 16;
                    case 16:
                        file = _m;
                        if (file === null) {
                            return [2 /*return*/, new Response("File Not Found", {
                                    status: 404,
                                    headers: (_s = {},
                                        _s[resolvedKeyHeader] = path,
                                        _s)
                                })];
                        }
                        response = new Response(hasBody(file) ? file.body : null, {
                            status: ((file === null || file === void 0 ? void 0 : file.size) || 0) === 0 ? 204 : (range ? 206 : 200),
                            headers: (_t = {
                                    "accept-ranges": "bytes",
                                    "etag": file.httpEtag,
                                    "cache-control": (_a = file.httpMetadata.cacheControl) !== null && _a !== void 0 ? _a : (env.CACHE_CONTROL || ""),
                                    "expires": (_c = (_b = file.httpMetadata.cacheExpiry) === null || _b === void 0 ? void 0 : _b.toUTCString()) !== null && _c !== void 0 ? _c : "",
                                    "last-modified": file.uploaded.toUTCString(),
                                    "content-encoding": (_e = (_d = file.httpMetadata) === null || _d === void 0 ? void 0 : _d.contentEncoding) !== null && _e !== void 0 ? _e : "",
                                    "content-type": (_g = (_f = file.httpMetadata) === null || _f === void 0 ? void 0 : _f.contentType) !== null && _g !== void 0 ? _g : "application/octet-stream",
                                    "content-language": (_j = (_h = file.httpMetadata) === null || _h === void 0 ? void 0 : _h.contentLanguage) !== null && _j !== void 0 ? _j : "",
                                    "content-disposition": (_l = (_k = file.httpMetadata) === null || _k === void 0 ? void 0 : _k.contentDisposition) !== null && _l !== void 0 ? _l : "",
                                    "content-range": rangeToHeader(range, file)
                                },
                                _t[resolvedKeyHeader] = path,
                                _t)
                        });
                        _u.label = 17;
                    case 17:
                        if (request.method === "GET" && !range)
                            ctx.waitUntil(cache.put(request, response.clone()));
                        return [2 /*return*/, response];
                }
            });
        });
    }
};
