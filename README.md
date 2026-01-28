# Image Manager UI

Frontend application for the **Image Manager AWS backend**. This project provides a simple web interface for uploading images, viewing the image list, and deleting images via a REST API powered by AWS API Gateway and Lambda.

The UI is designed to be lightweight, mobile-friendly, and easy to integrate with a serverless backend.

---

## ✨ Features

* 📤 Upload images using presigned URLs
* 🖼 Display image list with thumbnails
* 📄 Show image metadata (name, size)
* 🗑 Delete images
* 📱 Responsive layout (mobile-friendly)

---

## 🧱 Architecture

* **Frontend**: JavaScript / HTML / CSS
* **Backend**: AWS API Gateway + Lambda
* **Storage**: Amazon S3
* **Metadata**: Amazon DynamoDB

The UI communicates with the backend exclusively via HTTP APIs.

---

## 📁 Project Structure

```
image-manager-ui/
├─ src/
│  ├─ api/            # API client logic
│  ├─ components/     # UI components
│  ├─ styles/         # CSS styles
│  └─ index.js        # App entry point
│
├─ public/
│  └─ index.html
│
├─ package.json
├─ package-lock.json
└─ README.md
```

---

## 🚀 Getting Started

### 1️⃣ Install dependencies

```bash
npm install
```

---

### 2️⃣ Configure API endpoint

Set the backend API base URL in the configuration file or environment variable:

```js
const API_BASE_URL = "https://<api-id>.execute-api.<region>.amazonaws.com/prod";
```

---

### 3️⃣ Run locally

```bash
npm start
```

or, if using a static server:

```bash
npm run build
```

---

## 🔗 Backend Integration

The UI expects the backend to expose the following endpoints:

* `POST /upload-request` — get presigned upload URL
* `GET /images` — list images
* `DELETE /images/{id}` — delete image

All responses are expected to be in JSON format.

---

## 🧪 Notes

* No backend logic is implemented in the UI
* All AWS credentials are handled server-side
* CORS must be enabled on API Gateway

---

## 📝 Git Ignore

```gitignore
node_modules/
dist/
build/
.env
.DS_Store
```

---

## 📌 Status

The UI is ready to be connected to the backend and can be extended with:

* authentication
* pagination
* drag-and-drop upload
* image preview modal

---

Happy coding 🎨
