import { NextResponse, NextRequest } from 'next/server'

const backend_url = process.env.BACKEND_URL;

export async function POST(request, context ) {
    const filename = context.params.filename
    const project = context.params.project
    const scenario = context.params.scenario
    const layer = context.params.layer

    try{
        var filebody = await request.blob()
        const res = await fetch(

            `${backend_url}/api/new/${layer}/${project}/${scenario}/${filename}`, {
                method: 'POST',
                body: filebody,
            }
        )
        const data = await res.json()

        return NextResponse.json(data, { status: 201 })

    }
    catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
