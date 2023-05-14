export class User {
    
    public id: string;
    public username: string;
    public password: string;
    public isAdmin: boolean;

    public static fromResponse(r: any): User {
        var m = new User;

        m.id = r.id;
        m.username = r.username;
        m.isAdmin = r.isAdmin;

        return m;
    }
}