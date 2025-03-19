import multer from "multer";
import { nanoid } from "nanoid";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "temp/uploads/avatars");
  },
  filename: function (req, file, cb) {
    // code to get file extension
    const fileExtension = file.originalname.split(".").pop();
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + nanoid() + "." + fileExtension);
  },
});

export const upload = multer({ storage: storage });

const bufferStorage = multer.memoryStorage();
export const uploadBuffer = multer({ storage: bufferStorage });

// app.post('/upload', upload.single('file'), (req, res) => {
//   const fileBuffer = req.file.buffer;
//   // Process the fileBuffer
//   res.send('File uploaded and buffer created successfully!');
// });
