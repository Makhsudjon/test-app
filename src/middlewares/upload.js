import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads');
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const fileName = 'message-file-'+Date.now()+ext;
        cb(null, fileName);
    } 

});



const upload = multer({storage});
export default upload