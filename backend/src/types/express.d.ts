import 'multer';
declare global{
  namespace Express{
    interface Request{
      user?:{
        user_id:string
      };
      file?:Express.Multer.File;
    }
  }
}
export{};