import { Button, Container, ListItem, UnorderedList, FormControl,
  FormErrorMessage,
  FormLabel,useBoolean,
  Input,} from "@chakra-ui/react";
import prisma from "../../../lib/prisma";
import { Canvas, useFrame } from '@react-three/fiber';
import { Stage } from "@react-three/drei";
import { Box, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from 'next/router'
import { SketchPicker } from 'react-color';





export default function AnalyzerDetail({ analyzer }) {
  const [color, setColor] = useState(analyzer.color);
  const teiler = 1;
  const ref = useRef();

  const [isLoading, setLoading] = useBoolean(false);
  const router = useRouter()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({defaultValues: analyzer});

  console.log(analyzer)

  const submit = async (data) => {
    data['color'] = color
    console.log(data);
    await axios.post("/api/analyzer/update",data);
    setLoading.off();
    router.push("/analyzer/" + analyzer.id)
  };






  return (
    
    <Container maxW="container.xl">
      <Container         
        as="form"
        p={6}
        onSubmit={handleSubmit(submit)}>
        <FormControl>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            id="name"
            placeholder={analyzer.name}
            bgColor = "White"
            {...register("name", {
            })}
          />
           <FormLabel htmlFor="width">Width</FormLabel>
          <Input
            id="width"
            bgColor = "White"
            {...register("width", {
            })}
          />
           <FormLabel htmlFor="height">Height</FormLabel>
          <Input
            id="height"
            placeholder={analyzer.height}
            bgColor = "White"
            {...register("height", {
            })}
          />
           <FormLabel htmlFor="depth">Depth</FormLabel>
          <Input
            id="depth"
            placeholder={analyzer.depth}
            bgColor = "White"
            {...register("depth", {
            })}
          />
        </FormControl>
        <Button
          mt={4}
          isLoading={isLoading}
          type="submit"
          colorScheme="blackAlpha"
          isFullWidth
        >
          Update
        </Button>
        <SketchPicker
          color={color}
          onChangeComplete={color => {
            setColor(color.hex);
          }}
        />
      </Container>
      <div>
      <Canvas>
      <OrbitControls
        autoRotate/>
        <ambientLight intensity={0.7} />
        <directionalLight color="white" position={[0, 0, 5]} />
        <mesh ref={ref} scale={0.02}>
          <boxGeometry args={[analyzer.width/teiler, analyzer.height/teiler, analyzer.depth/teiler]}/>
          <meshPhongMaterial color={color}/>
        </mesh>
      </Canvas>

      </div>
      <Button onClick={()=>exportdata(ref, analyzer.name + ".gltf")}>Export</Button> 
    <Button onClick={()=>updateAnalyzer()}>Save Changes</Button>
  </Container>
  );
}

export async function getServerSideProps({ params }) {
  const id = Number(params.id);
  

  const analyzer = await prisma.analyzer.findFirst({
    where: {
      id: id,
    },
  });


  return {
    props: { analyzer },
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
    console.log(ref);
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
