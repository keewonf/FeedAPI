const AppError = require("../utils/AppError")

function verifyUserAuthorization(permissionToVerify){
  return (request, response, next) => {
    const { permission } = request.user
    
    if(permission !== 'owner' || !permissionToVerify.includes(role)){
      throw new AppError("Unauthorized", 401)
    }

    return next()
  }
}

module.exports = verifyUserAuthorization