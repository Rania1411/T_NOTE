import ratelimit from "../config/upstash.js"
const rateLimiter=async(req,res,next)=>{
 try {
    const{ success }= await ratelimit.limit(req.ip)
    if(!success){
        return  res.status(429).json({
            message:" too many request , please try again"
        })
    }
      next()
 } catch (error) {
    console.error(" the error is",error);
       next(error);
 }
}
export default rateLimiter