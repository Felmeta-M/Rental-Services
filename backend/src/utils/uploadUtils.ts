export function getImageUrl(file : any){
    return "http://localhost:5001/" + file.path.substring(8,file.path.length);
}

export function getValidPath(str: String) {
    return str.split(' ')[0];
}