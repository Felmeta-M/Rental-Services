class ErrorMessage{
    message : string;
    time : string;    
    constructor(message: string){
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);
        
        this.message = message;
        this.time = today.toISOString();
    }
}

export default ErrorMessage