import { Button, Container, ListItem, UnorderedList, FormControl,
    FormErrorMessage,
    FormLabel,useBoolean,
    Input} from "@chakra-ui/react";
  import prisma from "../../lib/prisma";
  import { Canvas, useFrame } from '@react-three/fiber';
  import { Box, OrbitControls } from '@react-three/drei'
  import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
  import React, { useRef, useState } from "react";
  import { useForm, Controller } from "react-hook-form";
  import axios from "axios";
  import { useRouter } from 'next/router';
  import { SketchPicker } from "react-color";
  import {
    AsyncCreatableSelect,
    AsyncSelect,
    CreatableSelect,
    Select,
  } from "chakra-react-select";

export default function Create({ clients }) {
  
    const [isLoading, setLoading] = useBoolean(false);
    const router = useRouter()
    const [color, setColor] = useState("#808080");
  
    const {
      register,
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm();
  

    const submit = async (data) => {
      data["Color"] = color
      console.log(data)
      await axios.post("/api/analyzer/create",data);
      setLoading.off();
      router.push("/analyzer")
    };

    const clientOptions = [];
    
    for (let i = 0; i < clients.length; i++) {
        clientOptions.push({
        label: clients[i]['name'],
        value: clients[i]['id']
      },);
      }

  
  
  
  
    return (
      
      <Container maxW="container.xl">
        <Container         
          as="form"
          p={6}
          onSubmit={handleSubmit(submit)}>
          <Controller
            control={control}
            name="analyzer"
            rules={{ required: "Please enter at least one food group." }}
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { invalid, error }
            }) => (
          <FormControl id="analyzer">
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              id="name"
              bgColor = "White"
              {...register("name", {
              })}
            />
             <FormLabel htmlFor="width">Breite [mm]</FormLabel>
            <Input
              id="width"
              bgColor = "White"
              {...register("width", {
              })}
            />
             <FormLabel htmlFor="height">Höhe [mm]</FormLabel>
            <Input
              id="height"
              bgColor = "White"
              {...register("height", {
              })}
            />
            <FormLabel htmlFor="depth">Tiefe [mm]</FormLabel>
            <Input
              id="depth"
              bgColor = "White"
              {...register("depth", {
              })}
            />
            <FormLabel htmlFor="weight">Gewicht [KG]</FormLabel>
            <Input
              id="weight"
              bgColor = "White"
              {...register("weight", {
              })}
            />
            <FormLabel htmlFor="waermelast">Wärmelast [BTU oder Joule]</FormLabel>
            <Input
              id="waermelast"
              bgColor = "White"
              {...register("waermelast", {
              })}
            />
            <FormLabel htmlFor="maxLeistungsaufnahme">max. elektr. Leistungsaufnahme [W]</FormLabel>
            <Input
              id="maxLeistungsaufnahme"
              bgColor = "White"
              {...register("maxLeistungsaufnahme", {
              })}
            />
            <FormLabel htmlFor="avgLeistungsaufnahme">Ø elektr. Leistungsaufnahme [W]</FormLabel>
            <Input
              id="avgLeistungsaufnahme"
              bgColor = "White"
              {...register("avgLeistungsaufnahme", {
              })}
            />
            <FormLabel htmlFor="avgWasserverbrauch">Ø Wasserverbrauch [L/std]</FormLabel>
            <Input
              id="avgWasserverbrauch"
              bgColor = "White"
              {...register("avgWasserverbrauch", {
              })}
            />
            <FormLabel htmlFor="druckluft">Druckluft [Bar]</FormLabel>
            <Input
              id="druckluft"
              bgColor = "White"
              {...register("druckluft", {
              })}
            />
            <FormLabel htmlFor="wasserqualitaet">Wasserqualität [µS]</FormLabel>
            <Input
              id="wasserqualitaet"
              bgColor = "wasserqualitaet"
              {...register("depth", {
              })}
            />
            <FormLabel htmlFor="sound">Geräuschpegel [dB]</FormLabel>
            <Input
              id="sound"
              bgColor = "White"
              {...register("sound", {
              })}
            />
            <FormLabel>
            Client
            </FormLabel>
            <Select
              name="client"
              ref={ref}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              options={clientOptions}
              placeholder="Clients"
              closeMenuOnSelect={true}
            />
            <FormLabel>
              Color
            </FormLabel>
            <SketchPicker
              color={color}
              onChangeComplete={color => {
                setColor(color.hex);
              }}
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
    </Container>
    );
  }
  
  export async function getServerSideProps({ params }) {
    
  
    const clients = await prisma.client.findMany({
    });
  
    return {
      props: { clients },
    };
  }