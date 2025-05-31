import { NextRequest ,NextResponse} from "next/server";
import {z} from "zod";
import {prismaClient} from "@/app/lib/db"
//@ts-ignore
import youtubesearchapi from "youtube-search-api"
const YT_REGEX = new RegExp("")


const CreateStreamSchema = z.object({
     creatorId:z.string(),
     url:z.string()
})


export async function POST(req:NextRequest){
     try{
        const data = CreateStreamSchema.parse(await req.json());
        const isYt = YT_REGEX.test(data.url);
        if(!isYt){
         return NextResponse.json({
            message:"Wrong URL format"
         },{
            status:411
         })
        }
        const extractedId = data.url.split("?v=")[1];

        const res =await youtubesearchapi.GetVideoDetails(extractedId); 
      const thumbnails = res.thumbnail.thumbnails;


         const stream =  await prismaClient.stream.create({
            data:{
               userId:data.creatorId,
               url:data.url,
               extractedId,
               type:"youtube",
               title:res.title ?? 'Cant find video',
               smallImg:(thumbnails.length > 1? thumbnails[thumbnails.length - 2 ].url : thumbnails[thumbnails.length-1].url),
               bigImg: thumbnails[thumbnails.length-1].url

            }
             
        });

        return NextResponse.json({
         message:"Added stream",
         id:stream.id
      })       


     } catch(e){
        return NextResponse.json({
        message:"Error while adding a stream"
        },{
            status:411
        })
     }
}

export async function GET(req:NextRequest){
   const creatorId = req.nextUrl.searchParams.get("creatorId");
   const streams = await prismaClient.stream.findMany({
      where:{
         userId:creatorId ?? ""
      }
   })

   return NextResponse.json({
      streams
   })
}