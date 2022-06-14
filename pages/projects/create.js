import {
    Box,
    Button,
    Container,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    useBoolean,
    useDisclosure,
  } from "@chakra-ui/react";
  import Image from "next/image";
  import { useRouter } from 'next/router'
  import { useCallback, useEffect, useRef, useState } from "react";
  import { useForm, Controller } from "react-hook-form";
  import CropperComp from "../../components/Unsorted/Cropper";
  import { useToast } from "@chakra-ui/react";
  import axios from "axios";
  import {
    AsyncCreatableSelect,
    AsyncSelect,
    CreatableSelect,
    Select,
  } from "chakra-react-select";
  import prisma from "../../lib/prisma";
  import { useSession } from "next-auth/react";


  
  
  export default function Project({analyzer, projects}) {
    const [isLoading, setLoading] = useBoolean(false);
    const router = useRouter()
    const { data: session, status } = useSession();
    console.log(session)
  
    const {
      register,
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm();

    const projectIds=[]
    for (let index = 0; index < projects.length; index++) {
      projectIds.push(projects[index]['id']);
      
    }


    const id = []
    for (let index = 1; index < projects.length + 2; index++) {
      if (projectIds.includes(index)) {
        console.log('index: ' + index)
      } else { 
        id[0] = index;
        console.log('id: ' + id[0]) 
      }
       
    }
  

    const submit = async (data) => {
      data['userId'] = session['user']['id'];
      data['projectId'] = id[0];
      data['addedIds'] = [];
      data['analyzer'].map(c =>
      data['addedIds'].push(c['value']))
      console.log(data)
      await axios.post("/api/project/createProject",data);
      await axios.post("/api/project/create",data);
      setLoading.off();
      router.push("/projects")
    };

    const analyzerOptions = []
    for (let i = 0; i < analyzer.length; i++) {
      analyzerOptions.push({
        label: analyzer[i]['name'],
        value: analyzer[i]['id']
      },);
      }
  
    return (
      <>
        <Container
          as="form"
          p={6}
          bg="white"
          onSubmit={handleSubmit(submit)}
        >
          <Controller
            control={control}
            name="analyzer"
            rules={{ required: "Please enter at least one food group." }}
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { invalid, error }
            }) => (
          <FormControl pb={4} isInvalid={errors.name}>
            <FormLabel htmlFor="name">Projectname</FormLabel>
            <Input
              id="name"
              placeholder="name"
              {...register("name", {
              })}
            />
            <FormLabel>
              Select Analyzers
            </FormLabel>
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
            isLoading={isLoading}
            type="submit"
            colorScheme="blackAlpha"
            isFullWidth
          >
            Create
          </Button>
        </Container>
      </>
    );
  }

  export async function getServerSideProps({params}) {
    const analyzer = await prisma.analyzer.findMany({
      orderBy:{
        id: 'asc'
      },
      select: {
        id: true,
        name: true,
        width: true,
        height: true,
        depth: true,
        client: {
          select: {
            name: true,
          },
        },
      },
    });

    const projects = await prisma.project.findMany({
      select:{
        id: true
      }
    })
  
    return {
      props: { analyzer, projects },
    };
  }




  