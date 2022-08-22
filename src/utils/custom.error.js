
class CustomError extends Error{
    
    constructor( code, name, data, error, token){
        super(name);
        this.code = code;
        if(code>=400&&code<=500){
            this.success = false;
            this.error = error;
        }else{
            this.success = true;
            this.data = data;
        }
        
        this.token = token;
    }

    static Success(data, token){
        return new CustomError(200, 'Success', data, null, token);
    }

    static BadRequest(error){
        return new CustomError(400, 'Unknown Error', null, error);
    }

    static AuthorizationError(error){
        return new CustomError(401, 'Authorization Error', null, error);
    }
    
    static NotFoundError(error){
        return new CustomError(404, 'Not Found Error', null, error);
    } 

    static UnknownError(error){
        return new CustomError(500, 'Unknown Error', null, error);
    }   

}

export default CustomError;