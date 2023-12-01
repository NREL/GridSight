import { NextResponse } from 'next/server'

const backend_url = process.env.BACKEND_URL;

export async function GET(request, context ) {
    const project = context.params.project
    const scenario = context.params.scenario
    const filename = context.params.filename

    try{

        const res = await fetch(
            `${backend_url}/api/timeseries/${project}/${scenario}/files/${filename}`, {
                headers: {
                "X-MyApp-ApiKey": process.env.API_KEY,
              },
              cache: "no-store"

            }
        )
        const data = await res.json()


        return NextResponse.json(data, { status: 200 })

    }
    catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
