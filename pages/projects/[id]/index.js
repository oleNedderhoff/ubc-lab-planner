import { Button, Container, FormLabel, Input, useBoolean, FormControl, Icon } from "@chakra-ui/react";
import prisma from "../../../lib/prisma";
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, OrbitControls } from '@react-three/drei'
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from 'next/router'
import Link from "next/link";
import { FaTrash, FaPlus, FaDownload, FaFileExcel } from "react-icons/fa";
import DataTable from "react-data-table-component";
import { Select } from "chakra-react-select";
import safeWorkBook from "../../../lib/excelJS";
import { exportData } from "../../../lib/excelJS/admin/exportData";
import { SliderPicker } from 'react-color';
import MaterialTable from "@material-table/core";

export default function ProjectDetail({ project, analyzerTotal, projectId, projectName, tableData }) {
  const refs = [];
  const names = [];
  const analyzerIds = [];
  const analyzers = []
  for (let x = 0; x < project.length; x++) {
    analyzers[x] = project[x]["analyzer"]
  }
  for (let i = 0; i < analyzers.length; i++) {
    names[i] = analyzers[i]["name"];
    analyzers[i]["zaehler"] = i
  }
  
  for (let index = 0; index < analyzers.length; index++) {
    analyzerIds[index] = analyzers[index]["id"]
  }
  console.log(names, refs, analyzerIds)
  const router = useRouter()

  const analyzerOptions = []
  for (let i = 0; i < analyzerTotal.length; i++) {
    analyzerOptions.push({
      label: analyzerTotal[i]['name'],
      value: analyzerTotal[i]['id']
    },);
    }
  
  const analyzersChosen = []
  analyzers.map(c =>
    analyzersChosen.push({
      label: c['name'],
      value: c['id']
    })
  )


    const defaultValues = { analyzer: analyzersChosen};
  
    const {
      register,
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm({defaultValues: defaultValues});

    const submit = async (data) => {
      
      data['projectId'] = projectId;
      const dataIds = []
      data['analyzer'].map(c =>
        dataIds.push(c['value']))
      data['addedIds'] = dataIds.filter(n => !analyzerIds.includes(n))
      data['deletedIds'] = analyzerIds.filter(n => !dataIds.includes(n))
      await axios.post("/api/project/create",data);
      await axios.post("/api/project/deleteMultiple",data);
      router.push("/projects/" + projectId)
    };

  const columns = [
    
    {
      name: "Name",
      selector: (row) => row.analyzer.name,
    },
    {
      name: "Breite",
      selector: (row) => row.analyzer.width,
    },
    {
      name: "Höhe",
      selector: (row) => row.analyzer.height,
    },
    {
      name: "Tiefe",
      selector: (row) => row.analyzer.depth,
    },
    {
      name: "Anzahl",
      Cell: (e) => {
        const {
          register,
          control,
          handleSubmit,
          reset,
          formState: { errors },
        } = useForm({defaultValues: {
          count: e.count
        }});

        const submit = async (data) => {
          data["id"] = e.id
          await axios.post("/api/project/updateCount",data);
          router.push("/projects/" + projectId)
        };

        return (
        <Container         
          as="form"
          p={6}
          
          onSubmit={handleSubmit(submit)}>
          <FormControl>
            <Input
              id="count"
              bgColor="white"
              {...register("count", {
              })}
            />
          </FormControl>
          <Button
            mt={4}
            type="submit"
            colorScheme="blackAlpha"
            isFullWidth
          >Save</Button>
        </Container>
        )
      }
    },
    {
      name: "Model",
      width: "350px",
      Cell: (e) => {
        console.log(e.id);
        refs[e.analyzerId] = (useRef());
        console.log(refs)
        const teiler = 1;
        const [color, setColor] = useState(e.analyzer.color);

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
            <mesh ref={refs[e.analyzer.id]} scale={0.01}>
              <boxGeometry args={[e.analyzer.width/teiler, e.analyzer.height/teiler, e.analyzer.depth/teiler]}/>
              <meshPhongMaterial color={color}/>
            </mesh>
          </Canvas>
          </div>
        )
      }
    },
    {
      name: "Export",
      cell: (e) => {
        return (
          <Button onClick={()=>exportdata(refs[e.analyzer.id], e.analyzer.name + ".gltf")}>Export</Button>
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
          await axios.post('/api/project/deleteAnalyzer',{id:id})
        }
        return <Icon onClick={()=> del(e.id)} p={2} h={7} w={7} cursor={"pointer"} as={FaTrash}/>;
      },
    },
  ];

  const fields = [
    {
      name: 'Name',
      key: 'name',
      kind: 'scalar',
      isList: false,
      isRequired: true,
      isUnique: false,
      isId: false,
      isReadOnly: false,
      type: 'String',
      hasDefaultValue: false,
      isGenerated: false,
      isUpdatedAt: false
    },
    {
      name: 'Hersteller',
      key: 'client',
      kind: 'object',
      isList: false,
      isRequired: true,
      isUnique: false,
      isId: false,
      isReadOnly: false,
      type: 'String',
      hasDefaultValue: false,
      isGenerated: false,
      isUpdatedAt: false
    },
    {
      name: 'Anzahl',
      key: 'count',
      kind: 'scalar',
      isList: false,
      isRequired: true,
      isUnique: false,
      isId: false,
      isReadOnly: true,
      type: 'Int',
      hasDefaultValue: false,
      isGenerated: false,
      isUpdatedAt: false
    },
    {
      name: 'Breite [mm]',
      key: 'width',
      kind: 'scalar',
      isList: false,
      isRequired: true,
      isUnique: false,
      isId: false,
      isReadOnly: false,
      type: 'Float',
      hasDefaultValue: false,
      isGenerated: false,
      isUpdatedAt: false
    },
    {
      name: 'Höhe [mm]',
      key: 'height',
      kind: 'scalar',
      isList: false,
      isRequired: true,
      isUnique: false,
      isId: false,
      isReadOnly: false,
      type: 'Float',
      hasDefaultValue: false,
      isGenerated: false,
      isUpdatedAt: false
    },
    {
      name: 'Tiefe [mm]',
      key: 'depth',
      kind: 'scalar',
      isList: false,
      isRequired: true,
      isUnique: false,
      isId: false,
      isReadOnly: false,
      type: 'Float',
      hasDefaultValue: false,
      isGenerated: false,
      isUpdatedAt: false
    },
    {
      name: 'Gewicht [kg]',
      key: 'weight',
      kind: 'scalar',
      isList: false,
      isRequired: true,
      isUnique: false,
      isId: false,
      isReadOnly: false,
      type: 'Float',
      hasDefaultValue: false,
      isGenerated: false,
      isUpdatedAt: false
    },
    {
      name: 'Wärmelast [BTU oder Joule]',
      key: 'waermelast',
      kind: 'scalar',
      isList: false,
      isRequired: true,
      isUnique: false,
      isId: false,
      isReadOnly: false,
      type: 'Float',
      hasDefaultValue: false,
      isGenerated: false,
      isUpdatedAt: false
    },
    {
      name: 'max. elektr. Leistungsaufnahme [W]',
      key: 'maxLeistungsaufnahme',
      kind: 'scalar',
      isList: false,
      isRequired: true,
      isUnique: false,
      isId: false,
      isReadOnly: false,
      type: 'Float',
      hasDefaultValue: false,
      isGenerated: false,
      isUpdatedAt: false
    },
    {
      name: 'Ø elektr. Leistungsaufnahme [W]',
      key: 'avgLeistungsaufnahme',
      kind: 'scalar',
      isList: false,
      isRequired: true,
      isUnique: false,
      isId: false,
      isReadOnly: false,
      type: 'Float',
      hasDefaultValue: false,
      isGenerated: false,
      isUpdatedAt: false
    },
    {
      name: 'Ø Wasserverbrauch [L/std]',
      key: 'avgWasserverbrauch',
      kind: 'scalar',
      isList: false,
      isRequired: true,
      isUnique: false,
      isId: false,
      isReadOnly: false,
      type: 'Float',
      hasDefaultValue: false,
      isGenerated: false,
      isUpdatedAt: false
    },
    {
      name: 'Druckluft [Bar]',
      key: 'druckluft',
      kind: 'scalar',
      isList: false,
      isRequired: true,
      isUnique: false,
      isId: false,
      isReadOnly: false,
      type: 'Float',
      hasDefaultValue: false,
      isGenerated: false,
      isUpdatedAt: false
    },
    {
      name: 'Wasserqualität [µS]',
      key: 'wasserqualitaet',
      kind: 'scalar',
      isList: false,
      isRequired: true,
      isUnique: false,
      isId: false,
      isReadOnly: false,
      type: 'Float',
      hasDefaultValue: false,
      isGenerated: false,
      isUpdatedAt: false
    },
    {
      name: 'Geräuschpegel [dB]',
      key: 'sound',
      kind: 'scalar',
      isList: false,
      isRequired: true,
      isUnique: false,
      isId: false,
      isReadOnly: false,
      type: 'Float',
      hasDefaultValue: false,
      isGenerated: false,
      isUpdatedAt: false
    },
 


  ]

  for (let index = 0; index < tableData.length; index++) {
    tableData[index]['name'] = tableData[index]['analyzer']['name']
    tableData[index]['width'] = tableData[index]['analyzer']['width']
    tableData[index]['height'] = tableData[index]['analyzer']['height']
    tableData[index]['depth'] = tableData[index]['analyzer']['depth']
    tableData[index]['weight'] = tableData[index]['analyzer']['weight']
    tableData[index]['waermelast'] = tableData[index]['analyzer']['waermelast']
    tableData[index]['maxLeistungsaufnahme'] = tableData[index]['analyzer']['maxLeistungsaufnahme']
    tableData[index]['avgLeistungsaufnahme'] = tableData[index]['analyzer']['avgLeistungsaufnahme']
    tableData[index]['avgWasserverbrauch'] = tableData[index]['analyzer']['avgWasserverbrauch']
    tableData[index]['druckluft'] = tableData[index]['analyzer']['druckluft']
    tableData[index]['wasserqualitaet'] = tableData[index]['analyzer']['wasserqualitaet']
    tableData[index]['sound'] = tableData[index]['analyzer']['sound']
    tableData[index]['client'] = tableData[index]['analyzer']['client']['name']
  }

  const exportxlsx = async () => {
    const headers = fields.map((item) => ({
      header: item.name,
      key: item.key,
    }));
    const book = exportData(headers, tableData);
    console.log(projectName)
    safeWorkBook(book, projectName['name']);
  }



  return (
    <>
    <Container maxW="container.xl">
        <Button my={4} size={"sm"} bg="white" colorScheme={"gray"} onClick={()=>exportAll(refs, names, analyzerIds)}>
          <Box mr={2}>Export Project </Box> <FaDownload />
        </Button>
        &nbsp;
        <Button my={4} size={"sm"} bg="white" colorScheme={"gray"} onClick={()=>exportxlsx()}>
          <Box mr={2}>Export Project </Box> <FaFileExcel color="green" />
        </Button>
        <Container
          as="form"
          p={6}
          bg="white"
          onSubmit={handleSubmit(submit)}
        >
          <Controller
            control={control}
            name="analyzer"
            rules={{ required: "Please enter at least one analyzer." }}
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { invalid, error }
            }) => (
          <FormControl pb={4} isInvalid={errors.name}>
            <Select
              isMulti
              name={name}
              ref={ref}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              options={analyzerOptions}
              placeholder="Analyzers"
              closeMenuOnSelect={false}
            />
          </FormControl>
          )}
          />
          <Button
            mt={4}
            type="submit"
            colorScheme="blackAlpha"
            isFullWidth
          >
            Save Changes
          </Button>
        </Container>
        <div>
          &nbsp;
        </div>
      <DataTable columns={columns} data={project}/>
      <Button onClick={()=>console.log(refs)}>Export</Button> 
    </Container>
  </>
  );
  
}


export async function getServerSideProps({ params }) {
  const projectId = Number(params.id);
  

  const project = await prisma.countAnalyzer.findMany({
    orderBy: {
      analyzerId: 'asc'
    },
    where: {
      projectId: projectId,
    },
    include: {
      analyzer: true,
    }
  });

  const projectName = await prisma.project.findFirst({
    where: {
      id: projectId
    },
    select: {
      name: true
    }

  });

  const analyzerTotal = await prisma.analyzer.findMany({
    orderBy: {
      id: 'asc'
    }
  });

  const tableData = await prisma.countAnalyzer.findMany({
    where: {
      projectId: projectId
    },
    orderBy: {
      analyzerId: 'asc'
    },
    select: {
      count: true,
      analyzer: {
        select:{
          name: true,
          depth: true,
          height: true,
          width: true,
          avgLeistungsaufnahme: true,
          druckluft: true,
          avgWasserverbrauch: true,
          maxLeistungsaufnahme: true,
          waermelast: true,
          sound: true,
          wasserqualitaet: true,
          weight: true,
          client:{
            select:{
              name: true
            }
          }
        }
      }
    },
  })

  return {
    props: { project, analyzerTotal, projectId, projectName, tableData},
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
    console.log(ref, filename)
    const exporter = new GLTFExporter();
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

function exportAll(refs, names, analyzerIds) {
  
  for (let index = 0; index < names.length; index++) {
    exportdata(refs[analyzerIds[index]], names[index] + ".gltf")    
  }
}


