const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, (__dirname, "../server/public/images/postImages"));
  },
  filename: function (req, file, cb) {
    cb(null, "-" + Date.now() + ".jpeg");
  },
});
// const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const createPost = async (req, res) => {
  try {
    upload.single("imagen")(req, res, async function (err) {
      if (err) {
        return res.status(400).send({ message: err.message });
      }

      const idioma = req.body.idioma;
      const descripcion = req.body.descripcion;

      // const imageBuffer = await sharp(req.file.buffer)
      // .resize(800)
      // .toFormat("jpeg")
      // .toBuffer();

      // const folderPath = path.join(__dirname, '../../public/images/postImages');
      // const fileName = `imagenPost-${Date.now()}.jpeg`;
      // const imagePath = path.join(folderPath, fileName);

      // await sharp(imageBuffer).toFile(imagePath);

      console.log("waza");

      await sharp(req.file.path)
        .toFormat("jpeg")
        .jpeg({ quality: 80 })
        .toFile(req.file.destination + req.file.filename);

      fs.unlinkSync(req.file.path);

      const newPost = await prisma.publicaciones.create({
        data: {
            descripcion: descripcion,
            idioma: idioma,
            imagen: req.file.filename
        }
      })
      
      res.json({
        message: "Publicación guardada",
      });
      console.log(req.file);
      console.log("Idioma:", idioma);
      console.log("Descripción:", descripcion);
    });
  } catch (error) {
    console.error("Error creando el post:", error);
    return res.status(500).json({ message: error });
  }
};

const readPosts = (req, res) => {
  res.send("adsflkaj");
};

module.exports = {
  createPost,
  readPosts,
};