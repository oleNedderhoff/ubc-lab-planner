import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const data = req.body

  const deleteproject = await prisma.project.delete({
    where: data
  })

  res.json(deleteproject);
}
