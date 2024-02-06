export async function POST(req) {
    const { content } = await req.json()
    const apiKey = "6d207e02198a847aa98d0a2a901485a5"

    // Create form data
    const formData = new FormData()
    formData.append("key", apiKey)
    formData.append("action", "upload")
    formData.append("source", content)
    formData.append("format", "json")

    try {
        const response = await fetch(`https://freeimage.host/api/1/upload/key=${apiKey}`, {
            method: "POST",
            body: formData, // Send form data
        })

        const data = await response.json()
        console.log("response data", data)

        return new Response(JSON.stringify(data), { status: 200 })
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
        })
    }
}
