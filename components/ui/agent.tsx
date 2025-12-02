import { cn } from '@/lib/utils';
import { Span } from 'next/dist/trace';
import Image from 'next/image'
import React from 'react'

enum CallStatus{
    INACTIVE='INACTIVE',
    ACTIVE='ACTIVE',
    FINISHED='FINISHED',
    CONNECTING='CONNECTING',
}

const agent = ({userName}:AgentProps) => {
    const callStatus=CallStatus.FINISHED;
    const messages=[
        'Hello, welcome to your interview practice session.',
        'Can you tell me about yourself?',
        'What are your strengths and weaknesses?',
        'My name is Vapi, and I will be your AI interviewer today.',
    ];
    const lastMessage=messages[messages.length-1];
    const isSpeaking=true;
  return (
    <>
    <div className='call-view'>
        <div className='card-interviewer'>
            <div className='avatar'>
                <Image src='/ai-avatar.png' alt='Vapi' width={65} height={54} className='object-cover'>
                </Image>
                {isSpeaking && <span className='animate-speak'/>}

            </div>
            <h3>
                AI Interviewer
            </h3>
        </div>

        <div className='card-border'>
            <div className='card-content'>
                <Image src='/user-avatar.png' alt='User Avatar' width={540} height={540} className='rounded-full object-cover size-[120px]' />
                <h3>{userName}</h3>
            </div>
        </div>
    </div>

    {messages.length > 0 && (
        <div className='transcript-border'>
            <div className='transcript'>
                <p key={lastMessage} className={cn('transition-opacity duration-500 opacity-0','animate-fadeIn opacity-100')}>
                    {lastMessage}
                </p>

            </div>

        </div>
    )}

    <div className='w-full flex justify-center'>
        {callStatus !== 'ACTIVE' ?(
            <button className='relative btn-call'>
                <span className={cn('absolute animate-ping rounded-full opacity-75',callStatus !== 'CONNECTING' & 'hidden')}/>
                <span>
                    {
                        callStatus === 'INACTIVE' || callStatus==='FINISHED' ? 'Call' : 'Connecting...'
                    }
                </span>
            </button>
        ):(
            <button className='btn-disconnect'>
                End 
            </button>
        )
        }

    </div>
    </>
  )
}

export default agent