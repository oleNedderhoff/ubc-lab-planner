import { lowermize } from "../../../lib/main";
import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const model = lowermize(req.body.model);
  const body = req.body.data;

  const data = await prisma[model].update({
      where: {
        id: body.id
      },
      data: body
    });

  res.json(data);
}