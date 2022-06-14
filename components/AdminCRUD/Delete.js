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
import { useState } from "react";
  
  export default function Delete({ isOpen, onClose, model, router, delEntry }) {

    const [loading, setLoading] = useState(false)

  
    const deleteEntry = async () => {
      setLoading(true)
      try {
        const res = await axios.post(
          "../api/admin/delete",
          {
            model: model,
            data: {id: delEntry},
          },
          { "Content-Type": "application/json" }
        );
        onClose()
        setLoading(false)
        router.replace(router.asPath);
      } catch(err) {
        console.log(err)
      }
    };
  
   
  
    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete {model}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
             Delete {model} with id:{delEntry} ?
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => deleteEntry()} colorScheme="blue">
                Delete &nbsp; {loading ? <Spinner /> : null}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
  