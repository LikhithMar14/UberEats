  import multer from 'multer';

  const storage = multer.diskStorage({

    destination: (req, file, cb) => cb(null, './public/temp'),
    filename: (req, file, cb) => {
      console.log("Multer destination triggered");


      const filename = `${file.fieldname}-temp-${file.originalname}`;
      
      cb(null, filename);
    },
  });


export default multer({ storage });