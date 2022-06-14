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
import { useForm } from "react-hook-form";
import CropperComp from "../../components/Unsorted/Cropper";
import { useToast } from "@chakra-ui/react";
import axios from "axios";


export default function Client() {
  const router = useRouter()
  const [imgUrl, setImgUrl] = useState();
  const [croppedImage, setCroppedImage] = useState("/pasteDefault.svg");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setLoading] = useBoolean(false);
  const toast = useToast();
  const [blober, setBlober] = useState();

  const paster = (e) => {
    const image = e.clipboardData.files[0];

    if (image == null) {
      toast({
        title: "Wrong File",
        description: "Make sure to paste jpeg or png image",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    // const blob = image.getAsFile()
    const url = URL.createObjectURL(image);
    setImgUrl(url);
    onOpen();
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetcher = async () => {
    let blob = await fetch(croppedImage).then(r => r.blob());

    setBlober(blob)
  }

  useEffect(() => {

    fetcher()
    
  }, [croppedImage])
  

  const submit = async (data) => {
    console.log(data);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("image", blober);

    setLoading.on();
    await axios.post("../api/client/create",formData);
    setLoading.off();
    router.push("/clients")
  };

  return (
    <>
      <Container
        onPaste={paster}
        as="form"
        p={6}
        bg="white"
        onSubmit={handleSubmit(submit)}
      >
        <FormControl pb={4} isInvalid={errors.name}>
          <FormLabel htmlFor="name">Clientname</FormLabel>
          <Input
            id="name"
            placeholder="name"
            {...register("name", {
              required: "This is required",
              minLength: { value: 4, message: "Minimum length should be 4" },
            })}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
        <FormLabel htmlFor="image">Logo</FormLabel>
        <div style={{ cursor: "pointer" }}>
          <Image
            onClick={imgUrl && onOpen}
            src={croppedImage}
            width={150}
            height={150}
            alt={"paste Image"}
          ></Image>
        </div>
        <Button
          mt={4}
          isLoading={isLoading}
          type="submit"
          colorScheme="blackAlpha"
          isFullWidth
        >
          Create
        </Button>
        <CropperComp
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          imgUrl={imgUrl}
          setCroppedImage={setCroppedImage}
        />
      </Container>
    </>
  );
}
