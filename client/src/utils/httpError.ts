export default class HTTPError extends Error {
  status: number;

  constructor(status: number, message?: string){
    super(message);
    this.name = 'Http-Error';
    this.status=status;
  }
}