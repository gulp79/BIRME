# MyBIRME – Bulk Image Resizer & Cropper

MyBIRME is a fast, privacy‑focused, and user‑friendly web application for bulk image resizing and smart cropping, inspired by the original BIRME (Bulk Image Resizing Made Easy).  
All image processing happens **100% locally in your browser**, ensuring full privacy and zero uploads to external servers.

🚀 **Resize, crop, and export hundreds of images in seconds — instantly, securely, and for free.**

---

## ⚡ Features

- 📁 **Bulk Image Upload**  
  Drag & drop multiple images or select them from your device.

- ✂️ **Smart Auto‑Cropping**  
  Automatically crops images based on the specified dimensions.

- 📏 **Exact Size Controls**  
  Set width, height, aspect ratio lock, and crop options.

- 🖼️ **Real‑Time Preview**  
  See how each image will look before exporting.

- 📦 **Batch Export (ZIP)**  
  Download all processed images in a single compressed ZIP file.

- 💻 **Runs 100% in Browser**  
  No uploads, no tracking, no data stored on servers.

- 🎨 **Dark Mode Support**

- 💾 **Settings Persistence**  
  Your configuration is saved locally via LocalStorage.

---

## 🧩 How It Works

MyBIRME uses modern browser APIs to perform all operations client‑side:

- HTML5 Canvas for resizing & cropping  
- Web Workers for smooth performance with many images  
- JSZip for local ZIP file generation  
- No backend or server logic required  

This ensures maximum speed and complete privacy.

---

## 📚 Usage

1. Open the application in your browser.
2. Drag & drop your images (or click *Load Images*).
3. Adjust:
   - Width & height  
   - Crop mode  
   - Aspect ratio  
   - Output format (JPG/PNG/WEBP)  
   - Quality settings  
4. Preview the results.
5. Click **Download All** to export a ZIP containing all processed images.

---

## 🛠️ Technologies Used

- **JavaScript / TypeScript** (depending on your implementation)
- **React** or Vanilla JS (depending on final generated code)
- **TailwindCSS / Custom CSS**
- **Canvas API**
- **JSZip**
- **Web Workers**

*(If you want, I can update this section once your codebase is final.)*

---

## 📦 Installation (Development)

If you want to run or modify MyBIRME locally:

```bash
git clone https://github.com/gulp79/BIRME.git
cd BIRME
npm install
npm run dev
