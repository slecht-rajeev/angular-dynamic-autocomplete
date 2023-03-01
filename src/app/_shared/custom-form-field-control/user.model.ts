export class UserModel{

    gender!: string;
    name!: Name;
    picture!: Picture;
}

export class Name {
    title!: string;
    first!:string;
    last!:string;
}

export class Picture {
    large!: string;
    medium!: string;
    thumbnail!: string;
}