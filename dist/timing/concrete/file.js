"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTiming = void 0;
const fs_1 = __importDefault(require("fs"));
const path = __importStar(require("path"));
class FileTiming {
    constructor(filepath) {
        this.filepath = filepath;
        this.locker = {};
        const dir = path.dirname(this.filepath);
        // ディレクトリが存在しない場合は作成
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        // ファイルが存在しない場合は作成
        if (!fs_1.default.existsSync(this.filepath)) {
            this.flush();
            return;
        }
        this.read();
    }
    read() {
        this.locker = JSON.parse(fs_1.default.readFileSync(this.filepath, 'utf-8'));
    }
    flush() {
        fs_1.default.writeFileSync(this.filepath, JSON.stringify(this.locker), 'utf-8');
    }
    allow(_a) {
        return __awaiter(this, arguments, void 0, function* ({ key, date, }) {
            if (this.locker[key] === undefined) {
                return true;
            }
            const nextTime = new Date(this.locker[key]);
            return date >= nextTime;
        });
    }
    complete(_a) {
        return __awaiter(this, arguments, void 0, function* ({ key, constraint, date, }) {
            this.locker[key] = constraint.next(date).toISOString();
            this.flush();
        });
    }
}
exports.FileTiming = FileTiming;
