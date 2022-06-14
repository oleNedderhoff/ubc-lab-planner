import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

const getColor = (props) => {
  if (props.isDragAccept) {
    return "#00e676";
  }
  if (props.isDragReject) {
    return "#ff1744";
  }
  if (props.isFocused) {
    return "#2196f3";
  }
  return "#eeeeee";
};

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
`;

export default function Import({ isOpen, onClose, model, router, delEntry }) {

  const [body, setBody] = useState([])

  const loadBook = async (file) => {
    const ExcelJS = require("exceljs");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);
    return workbook;
  };

  useEffect(() => {
    console.log(body)
  }, [body])
  

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        loadBook(binaryStr).then((workbook) => {
          const sheet = workbook.worksheets[0];
          setBody([])
          let keys = []
          sheet.eachRow({ includeEmpty: false },(row, rowNumber) => {

            if (rowNumber == 1) {
                console.log("headers", row.values.filter(item => item != null))
                keys = row.values.filter(item => item != null)
                
            } else {
                const values = row.values.filter(item => item != null)
                let datapoint = {}
                keys.forEach((key,i) => {
                  datapoint[key] = values[i]
                })
                setBody(state => ([...state, datapoint]))
                
            }
          
           
            
          });
        });
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({ onDrop });

  const [loading, setLoading] = useState(false);

  const createMany = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "../api/admin/createMany",
        {
          model: model,
          data: body,
        },
        { "Content-Type": "application/json" }
      );
      onClose();
      setLoading(false);
      router.replace(router.asPath);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Import {model} Data</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Container
              {...getRootProps({ isFocused, isDragAccept, isDragReject })}
            >
              <input {...getInputProps()} />
              <p>Drag and drop some files here, or click to select files</p>
            </Container>
            <p>
              Data found
            </p>
            <p>
              {JSON.stringify(body)}
            </p>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => createMany()} colorScheme="blue">
              Import &nbsp; {loading ? <Spinner /> : null}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
