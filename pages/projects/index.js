import { Container, HStack, Tag, Box, Icon, Button } from "@chakra-ui/react";
import DataTable from "react-data-table-component";
import { Image } from "@chakra-ui/react";
import prisma from "../../lib/prisma";
import Link from "next/link";
import { FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";

export default function Project({ data }) {
  const router = useRouter()
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "User",
      selector: (row) => row.user.username,
    },
    {
      name: "Edit",
      cell: (e) => {
        return (
          
          <Link href={`projects/${e.id}`}>
            <Button>Edit</Button>
          </Link>
        );
      },
    },
    {
      name: "Delete",
      width: "90px",
      selector: (row) => row.id,
      center: true,
      cell: (e) => {
        const del = async (id) => {
          await axios.post('/api/project/deleteCounts',{id:id})
          await axios.post('/api/project/delete',{id:id})
          router.replace(router.asPath);
        }
        return <Icon onClick={()=> del(e.id)} p={2} h={7} w={7} cursor={"pointer"} as={FaTrash}/>;
      },
    },
  ];

  return (
    <>
      <Container maxW="container.xl">
        <Link href="/projects/create">
          <Button my={4} size={"sm"} bg="white" colorScheme={"gray"}>
            <Box mr={2}>Create Project</Box> <FaPlus />
          </Button>
        </Link>
        <DataTable columns={columns} data={data} />
      </Container>
    </>
  );
}

export async function getServerSideProps() {
  const data = await prisma.project.findMany({
    orderBy:{
      id: 'asc'
    },
    select: {
      id: true,
      name: true,
      user: {
        select: {
          username: true,
        },
      },
    },
  });

  return {
    props: {
      data: data,
    },
  };
}
