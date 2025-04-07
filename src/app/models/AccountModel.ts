export class AccountModel{
    constructor(
        public names: string | "",
        public lastNames: string | "",
        public email : string | "",
        public password : string | "",
        public number: string | "",
        public role: string | ""
    ){}
}