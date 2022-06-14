import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
    const projectId = req.body
    console.log(projectId)
    
  
    const analyzer = await prisma.countAnalyzer.deleteMany({
        where: {
            projectId: projectId['id'],
        }
    })

    res.json(analyzer);
}