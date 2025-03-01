const fs = require("fs")
const path = require("path")
const uploadConfig = require('../configs/upload')

class DiskStorage {
  async saveFile(file, folder){
    const destinationFolder = folder === 'avatar' ? path.resolve(uploadConfig.UPLOADS_FOLDER, 'avatars') : path.resolve(uploadConfig.UPLOADS_FOLDER, 'banners')

    await fs.promises.rename(
      path.resolve(uploadConfig.TMP_FOLDER, file),
      path.resolve(destinationFolder, file)
    )

    return file
  }

  async deleteFile(file, folder){
    const destinationFolder = folder === 'avatar' ? path.resolve(uploadConfig.UPLOADS_FOLDER, 'avatars') : path.resolve(uploadConfig.UPLOADS_FOLDER, 'banners')
    
    const filePath = path.resolve(destinationFolder, file)
    
    try {
      await fs.promises.stat(filePath)
    } catch {
        return
    }

    await fs.promises.unlink(filePath)
  }
}

module.exports = DiskStorage