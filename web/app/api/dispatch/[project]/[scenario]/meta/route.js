import { NextResponse } from 'next/server'

const backend_url = process.env.BACKEND_URL;

export async function GET(request, context ) {
    const index = context.params.index
    const project = context.params.project
    const scenario = context.params.scenario

    try{

        const res = await fetch(
            `${backend_url}/api/dispatch/${project}/${scenario}/meta`, {
                headers: {
                "X-MyApp-ApiKey": process.env.API_KEY,
              }
            }
        )
        const data = await res.json()


        return NextResponse.json(data, { status: 200 })

    }
    catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
