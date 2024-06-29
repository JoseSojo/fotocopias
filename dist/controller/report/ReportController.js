"use strict";
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
exports.ReportBaseController = void 0;
const html_pdf_1 = __importDefault(require("html-pdf"));
const userName = `josesojo12`;
const date = new Date();
class ReportBaseController {
    /**
     * name
     */
    name() {
    }
    /**
     * GetHeader
     */
    GetHeader() {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    * {
                        padding: 0;
                        margin: 0;
                    }
                    h6,h5,h4,h2,h1 {
                        text-align: center
                    }
                    body {
                        background: #e0e0ef;
                        padding: 3em 5em
                    }
                    table {
                        width: 100%;border-collapse: collapse;  
                    }  
                    th, td {
                        border: 1px solid black;
                        padding: 2px 0;
                        font-size: 7px;
                        color: #212529;
                        text-align: center;  
                    }  
                    th {
                        background-color: #f2f2f2;  
                    }  
                    .row {display: flex;flex-wrap: wrap;  
                    }  
                      
                    .card {width: 25%;height: 200px;border: 1px solid #ccc;margin: 10px;padding: 10px;text-align: center;  
                    }  
                </style>                
            </head>
            <body>
        `;
    }
    /**
     * GetFooter
     */
    GetFooter() {
        return `
            </body>
            </html>
        `;
    }
    /**
     * GenerateName
     */
    GenerateName() {
        const date = new Date();
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}:${date.getMinutes()}`;
    }
    /**
     * GenerateHeaderPdf
     */
    GenerateHeaderPdf() {
        return ``;
    }
    /**
     * GenerateTablePdf
     */
    GenerateTablePdf({ title, tHead, listTr }) {
        return `
            ${title}
            <table>
                <thead>${tHead}</thead>
                <tbody>${listTr}</tbody>
            </table>
        `;
    }
    GeneratePDF(_a) {
        return __awaiter(this, arguments, void 0, function* ({ content, pathPdf }) {
            return html_pdf_1.default
                .create(content, {})
                .toFile(pathPdf, (err, res) => {
                if (err)
                    return false;
                return res;
            });
        });
    }
}
exports.ReportBaseController = ReportBaseController;
