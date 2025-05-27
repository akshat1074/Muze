import { NextRequest } from "next/server";
import {z} from "zod";

const CreateStreamSchema = z.object({
     creatorId:z.string(),
     url:z.string()
})


export async function POST(req:NextRequest){

}