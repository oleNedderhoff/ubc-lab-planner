import { uploadImage } from "../../../lib/cloudinary";
import prisma from "../../../lib/prisma";
import FileReader from "filereader";
import { getImage } from "../../../lib/formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handle(req, res) {
  const foridableData = await getImage(req);
  const imagePath = foridableData.files.image.path;

  console.log("fields", foridableData.fields);
  console.log("path", foridableData.files.image.path);

  const imageDate = await uploadImage(imagePath);
  console.log(imageDate);

  const client = await prisma.client.create({
    data: {
      name: foridableData.fields.name,
      imgUrl: imageDate.url,
    },
  });

  // console.log(req.body);

  res.json(client);
}
