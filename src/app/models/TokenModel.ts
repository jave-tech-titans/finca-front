export class TokenModel{
    constructor(
        public refreshToken: string | "",
        public accessToken: string | ""
    ){}
}