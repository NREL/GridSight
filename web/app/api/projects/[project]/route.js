import { NextResponse } from 'next/server'

const backend_url = process.env.BACKEND_URL;

export async function GET(req, context ) {

    if (true) {
        try{
            const project = context.params.project
            const res = await fetch(`${backend_url}/api/projects/${project}`, {cache: 'no-store'})
            const data = await res.json()

            return NextResponse.json(data['body'], { status: 200 })
        }
        catch (e){
            console.log(e, e.stack)
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }
    }

}
