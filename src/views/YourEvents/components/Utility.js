export const getFirstName =(fullName)=>{
    let name = fullName.split(' ').slice(0, -1).join(' ');

    return name===''? fullName: name
};

