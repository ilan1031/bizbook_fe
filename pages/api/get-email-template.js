import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    // Path to the static HTML template
    const filePath = path.join(process.cwd(), "public", "email-template.html");
    const templateHtml = fs.readFileSync(filePath, "utf8");

    // Send the template as a response
    res.status(200).json({ template: templateHtml });
  } catch (error) {
    res.status(500).json({ error: "Failed to load email template" });
  }
}