import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
    console.log("req body: ", req.body)
    const id = Number(req.body["id"]);
    const count = Number(req.body["count"])
    
  
    const analyzer = await prisma.countAnalyzer.update({
        where: {
            id: id,
        },
        data: {
            count: count,
            
        }
    })

    res.json(analyzer);
}