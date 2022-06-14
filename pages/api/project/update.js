import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
    console.log("req body: ", req.body)
    const id = Number(req.body["id"]);
    const analyzers = req.body["analyzers"].split(",")
    for (let index = 0; index < analyzers.length; index++) {
        analyzers[index] = Number(analyzers[index]);
    }
    
  
    const analyzer = await prisma.project.update({
        where: {
            id: id,
        },
        data: {
            name: req.body["name"],
            analyzers: {
                set: [],
                connect: analyzers.map(c => ({ id: c })) || [],
            }
        }
    })

    res.json(analyzer);
}