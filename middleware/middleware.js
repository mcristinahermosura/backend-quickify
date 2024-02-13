const path = require("path");
const multer = require("multer");
const { MIME_TYPES } = require("../constant");

module.exports.logger = (req, res, next) => {
  const currentDate = new Date().toLocaleString("en-US");
  try {
    const requestLog = `DATE: ${currentDate} - IP(${req.ip}) - HOST: ${
      req.headers.host
    } - METHOD: ${req.method} ${req.originalUrl} - ORIGIN: ${
      req.headers.origin
    } -  AUTHORIZATION: ${req.headers.authorization} -   ${
      Object.keys(req.body).length > 0
        ? `BODY: ${JSON.stringify(req.body)}`
        : ""
    } `;

    console.log(requestLog);
  } catch (e) {
    const errLog = ` ERROR: ${e.message} - DATE: ${currentDate} - IP:${req.ip} - ${e.message}  \n -------------------------------- \n`;
    console.error(errLog);
  }
  next();
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(".")[0];
    const extension = MIME_TYPES[file.mimetype];
    const date = new Date();
    const formattedDate = date
      .toISOString()
      .slice(0, 16)
      .replace(/T/, "-")
      .replace(/:/g, "-");
    callback(null, `${name}-${formattedDate}-.${extension}`);
  },
});

module.exports.processFile = (req, res, next) => {
  multer({ storage: storage }).single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error(err);
      return res.status(400).json({ error: "Invalid file format" });
    } else if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }

    next();
  });
};
