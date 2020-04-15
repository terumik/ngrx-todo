export class User {
  constructor(
    public userId: string,
    public email: string,
    public username: string,
    // private _token: string,
    // private _tokenExpirationDate: Date
  ) { }

  // note: get is for 'doing something with private property and then make it accessible by calling .token'
  // get token() {
  //   if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
  //     return null;
  //   }
  //   return this._token;
  // }
}
