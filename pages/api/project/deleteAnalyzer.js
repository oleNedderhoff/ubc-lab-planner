import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
    console.log("req body: ", req.body)
    const id = Number(req.body["id"]);
    
  
    const analyzer = await prisma.countAnalyzer.delete({
        where: {
            id: id,
        }
    })

    res.json(analyzer);
}