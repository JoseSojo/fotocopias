import pdf from 'html-pdf';
import BaseController from '../BaseController';
import { Response } from 'express';

const userName = `josesojo12`;
const date = new Date();

export class ReportBaseController {

    /**
     * name
     */
    public name() {
        
    }



    /**
     * GetHeader
     */
    public GetHeader(): string {
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
    public GetFooter(): string {
        return `
            </body>
            </html>
        `;
    }

    /**
     * GenerateName
     */
    public GenerateName(): string {
        const date = new Date();
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}_${date.getHours()}:${date.getMinutes()}`;
    }

    /**
     * GenerateHeaderPdf
     */
    public GenerateHeaderPdf(): string {
        return ``;
    }

    /**
     * GenerateTablePdf
     */
    public GenerateTablePdf({title,tHead,listTr}: {title:string,tHead:string,listTr:string}): string {
        return `
            ${title}
            <table>
                <thead>${tHead}</thead>
                <tbody>${listTr}</tbody>
            </table>
        `;
    }

    public async GeneratePDF({ content, pathPdf }: { content:any, pathPdf:string }) {

        return pdf
            .create(
                content,{
                                        
            })
            .toFile(
                pathPdf,
                (err, res) => {
                    if(err) return false;
                    return res;
                }
            );
    }
}
