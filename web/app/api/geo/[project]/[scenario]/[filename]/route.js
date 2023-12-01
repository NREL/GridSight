import { NextResponse } from 'next/server'

const backend_url = process.env.BACKEND_URL;

export async function GET(req, context ) {

    if (true) {
        try{
            const project = context.params.project
            const scenario = context.params.scenario
            const filename = context.params.filename
            const res = await fetch(
                `${backend_url}/api/geo/${project}/${scenario}/${filename}`, {
                    headers: {
                    "X-MyApp-ApiKey": process.env.API_KEY,
                  }
                }
            )
            const data = await res.json()

            return NextResponse.json(data, { status: 200 })
        }
        catch (e){
            console.log(e, e.stack)
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }
    }

}