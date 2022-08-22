import path from 'path';
import { fileURLToPath } from 'url';

function getFileDirectory(fileMetaUrl){
    const __filename = fileURLToPath(fileMetaUrl);
    const dirname = path.dirname(__filename); 
    return dirname;
}

export default {
    getFileDirectory   
}