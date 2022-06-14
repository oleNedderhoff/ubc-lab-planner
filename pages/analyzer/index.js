import { Container, HStack, Tag, Box, Icon, Button } from "@chakra-ui/react";
import DataTable from "react-data-table-component";
import { Image } from "@chakra-ui/react";
import prisma from "../../lib/prisma";
import Link from "next/link";
import { FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box as Box2, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { SliderPicker } from 'react-color';





export default function Analyzer({ data }) {
  const refs = []

  const router = useRouter()


  

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Breite",
      selector: (row) => row.width,
    },
    {
      name: "Höhe",
      selector: (row) => row.height,
    },
    {
      name: "Tiefe",
      selector: (row) => row.depth,
    },
    {
      name: "Client",
      selector: (row) => row.client.name,
    },
    
    {
      name: "Model",
      width: "350px",
      Cell: (e) => {
        const teiler = 1;
        const [color, setColor] = useState(e.color);
        console.log(color)
        refs[e.id] = (useRef());
        console.log(refs)
        console.log(e);
        console.log(refs[e.id]);
        return (
          <div>
            <SliderPicker
              color={color}
              onChangeComplete={color => {
                setColor(color.hex);
              }}
            />
          <Canvas>
          <OrbitControls
            autoRotate/>
            <ambientLight intensity={0.7} />
            <directionalLight color="white" position={[0, 0, 5]} />
            <mesh ref={refs[e.id]} scale={0.01}>
              <boxGeometry args={[e.width/teiler, e.height/teiler, e.depth/teiler]}/>
              <meshPhongMaterial color={color}/>
            </mesh>
          </Canvas>
          </div>
        )
      }
    },
    {
      name: "Edit",
      cell: (e) => {
        return (
          <Link href={`analyzer/${e.id}`}>
            <Button>Edit</Button>
          </Link>
        );
      },
    },
    {
      name: "Export",
      cell: (e) => {
        return (
          <Button onClick={()=>exportdata(refs[e.id], e.name + ".gltf")}>Export</Button>
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
          await axios.post('/api/analyzer/delete',{id:id})
          router.replace(router.asPath);
        }
        return <Icon onClick={()=> del(e.id) } p={2} h={7} w={7} cursor={"pointer"} as={FaTrash}/>;
      },
    },
  ];

  return (
    <>
      <Container maxW="container.xl">
        <Link href="/analyzer/create">
          <Button my={4} size={"sm"} bg="white" colorScheme={"gray"}>
            <Box mr={2}>Create Analyzer</Box> <FaPlus />
          </Button>
        </Link>
        <DataTable columns={columns} data={data} />
        {console.log(refs)}
      </Container>
    </>
  );
}

export async function getStaticProps() {
  const data = await prisma.analyzer.findMany({
    select: {
      id: true,
      name: true,
      width: true,
      height: true,
      depth: true,
      color: true,
      client: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [
      {
        id: 'asc'
      }
    ]
  });

  return {
    props: {
      data: data,
    },
  };
}

export function save(blob, filename) {
  const link = document.createElement("a");
  link.style.display = "none";
  document.body.appendChild(link);

  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();

}

function exportdata(ref, filename) {
  const exporter = new GLTFExporter();
  console.log(exporter);
  const options = {
    trs: false,
    onlyVisible: true,
    truncateDrawRange: true,
    binary: false,
    maxTextureSize: Number(4096) || Infinity // To prevent NaN value
  };
  exporter.parse(
      ref.current,
      function (result) {
          const output = JSON.stringify(result, null, 2);
          save(new Blob([output], { type: "text/plain" }), filename);      
      },
      options
    );
  
  };


