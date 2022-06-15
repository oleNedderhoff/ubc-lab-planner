import { Container, HStack, Tag, Box, Button, Icon } from "@chakra-ui/react";
import DataTable from "react-data-table-component";
import { Image } from "@chakra-ui/react";
import prisma from "../../lib/prisma";
import Link from "next/link";
import { FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/router";

export default function Edit({ data }) {

  const router = useRouter()

  console.log(data);
  const columns = [
    {
      name: "Logo",
      width: "90px",
      selector: (row) => row.imgUrl,
      cell: (e) => {
        return <Image borderRadius={"10%"} src={e.imgUrl} width={35} height={35} />;
      },
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Delete",
      width: "90px",
      selector: (row) => row.id,
      center: true,
      cell: (e) => {
        const del = async (id) => {
          await axios.post('/api/client/delete',{id:id})
          router.replace(router.asPath);
        }
        return <Icon onClick={()=> del(e.id)} p={2} h={7} w={7} cursor={"pointer"} as={FaTrash}/>;
      },
    },
  ];

  console.log(data);
  return (
    <>
      <Container maxW="container.xl">
        <Link href="/clients/create">
          <Button my={4} size={"sm"} bg="white" colorScheme={"gray"}>
            <Box mr={2}>Create Client</Box> <FaPlus/>
          </Button>
        </Link>
        <DataTable columns={columns} data={data} />
      </Container>
    </>
  );
}

export async function getServerSideProps() {
  const data = await prisma.client.findMany();

  return {
    props: {
      data: data,
    },
  };
}
