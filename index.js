import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import multer from "multer";
import path from "path";

import { fileURLToPath } from "url";

import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 4000;

const username=process.env.MONGO_USERNAME
const password=process.env.MONGO_PASSWORD

// console.log(username,password);  

app.use(cors({ origin: "*" }));

mongoose
  .connect(
    "mongodb+srv://"+username+":"+password+"@cluster0.rz07emt.mongodb.net/blogs?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(port, () => {
      console.log("Server running on port " + port);
    });
  });

const blogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  blogContent: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const blogModel = mongoose.model("blog", blogSchema);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/sendBlog", upload.single("image"), (req, res) => {
  console.log(req.body);

  const { name, title, blogContent } = req.body;
  const image = req.file.path;
  const dataToSave = new blogModel({ name, title, blogContent, image });

  dataToSave.save().then(() => res.json("Blog Saved Successfully... :)"));
});

app.get("/getBlogs", async (req, res) => {
  const blogsToSend = await blogModel.find();

  await res.json(blogsToSend);
});

app.get("/search", async (req, res) => {
  const search = req.query.q;
  const data = await blogModel.find({
    $or: [{ title: search }, { name: search }],
  });

  res.json(data);
});

//------- For Message -------//

const infoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const infoModel = mongoose.model("userInformation", infoSchema, "data");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/sendData", async (req, res) => {
  console.log(req.body);
  const dataToSave = new infoModel(req.body);

  await dataToSave.save();
  res.json(req.body);
});

app.get("/getData", async (req, res) => {
  console.log(await infoModel.find());
  res.json(await infoModel.find());
});

app.delete("/delete", async (req, res) => {
  const deletedData = await infoModel.findByIdAndDelete(req.body.id);
  if (deletedData._id) res.json({ Deleted: "Data Deleted" });
});

app.put("/updateData", async (req, res) => {
  // console.log(req.body)
  const { isUpdate, name, message } = req.body;
  let updated = await infoModel.findByIdAndUpdate(isUpdate, {
    name,
    message,
  });
  updated ? res.json("Data Updated") : "";
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

// import express from "express";
// const app = express();

// import fs from "fs";

// const port = 3000;

// const data = [
//   {
//     id: 1,
//     name: "Sankalp",
//     age: 20,
//   },
//   {
//     id: 2,
//     name: "Muskan",
//     age: 20,
//   },
//   {
//     id: 3,
//     name: "Erfan",
//     age: 20,
//   },
//   {
//     id: 4,
//     name: "Shashank",
//     age: 19,
//   },
// ];

// let fileNames = [];

// data.forEach((x) => {
//   fs.writeFileSync(x.name, x.id + "\n" + x.name + "\n" + x.age);
//   fileNames.push(x.name);
// });
// console.log("All-Files: ", fileNames);

// let d = "";
// fileNames.forEach((fname) => {
//   d += fs.readFileSync(fname, "utf8", (err, data) => {
//     if (err) throw err;
//   });

//   d += "\n~~~~~~~~~~~~~\n";
// });
// console.log(d);

// //   const file_data=fs.readFileSync('file1.txt','utf8',(err,data)=>{

// //     if(err) throw err
// //   });
// //   console.log(file_data)
