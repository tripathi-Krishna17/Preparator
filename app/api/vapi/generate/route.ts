import { db } from '@/firebase/admin';
import { getRandomInterviewCover } from '@/lib/utils';
import { google } from '@ai-sdk/google'
import {generateText} from "ai";

export async function GET() {
    return Response.json({success:true,data:'THANK YOU'},{status:200});
}

export async function POST(request:Request) {
    const {type,role,level,techstack,amount,userid }= await request.json();

    try{
        const {text:questions}=await generateText({
            model:google("gemini-2.0-flash-001"),
            prompt:`prepare questions for a job interview.
            The job role is ${role}.
            The experience level required is ${level}.
            The tech stack required is ${techstack}.
            The number of questions to be prepared is ${amount}.
            The focus between behavioral and technical questions is ${type}.
            Please return only the questions without any additional text.
            The questions are going to be read by a voice assistant so do not use "/" or "*" or any other characters that might break the voice assistant.
            Return the questions in a json array format like this:
            ["Question 1","Question 2","Question 3"]
            Thank you!`,
        });
const cleanedText = questions.replace(/```json/g, '').replace(/```/g, '').trim();
        const interview={
            role,
            level,
            techstack:techstack.split(','),
            type,
            questions: JSON.parse(cleanedText),
            userid,
            finalized:true,
            coverImage:getRandomInterviewCover(),
            createdAt:new Date().toISOString(),
        }

        await db.collection('interviews').add(interview);

        return Response.json({success:true},{status:200})
    }catch(error){
        console.log(error);
        return Response.json({success:false,error},{status:500});
    }
}