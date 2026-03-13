import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";
import mammoth from "mammoth";

const pdfParse = require("pdf-parse");

export class FileStorageUtil {

  static uploadDir = path.join(process.cwd(), "uploads");

  static ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir);
    }
  }

  static async processFile(file: Express.Multer.File) {

    this.ensureUploadDir();

    const ext = path.extname(file.originalname).toLowerCase();

    const fileName = `${randomUUID()}-${file.originalname}`;
    const filePath = path.join(this.uploadDir, fileName);

    fs.writeFileSync(filePath, file.buffer);

    const rawText = await this.extractText(file.buffer, ext);

    return {
      fileName: file.originalname,
      storageKey: `uploads/${fileName}`,
      rawText,
      documentType: this.detectDocumentType(ext),
    };
  }

  static detectDocumentType(ext: string): string {
    const map: Record<string, string> = {
      ".pdf": "pdf",
      ".docx": "docx",
      ".txt": "text",
    };

    return map[ext] ?? "unknown";
  }

  static async extractText(buffer: Buffer, ext: string): Promise<string> {

    if (ext === ".pdf") {
      const data = await pdfParse(buffer);
      return data.text;
    }

    if (ext === ".docx") {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    if (ext === ".txt") {
      return buffer.toString("utf8");
    }

    return "";
  }
}