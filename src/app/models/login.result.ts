import { User } from "./user";

export class LoginResult {
    public currentUser: User;
    public token: string;
    
    public static fromResponse(r: any): LoginResult {
        var m = new LoginResult;

        m.currentUser = User.fromResponse(r.currentUser);
        m.token = r.token;

        return m;
    }
}
