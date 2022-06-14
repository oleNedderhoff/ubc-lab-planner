import prisma from "../../../lib/prisma";


export default async function handle(req, res, session) {
    
    
    console.log(req.body)

    const project = await prisma.project.create({
            data: {
                id: req.body['projectId'],
                name: req.body['name'],
                userId: req.body['userId'],
            }
                
            })
            

    res.json(project);
}