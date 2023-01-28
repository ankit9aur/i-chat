import { ViewIcon } from '@chakra-ui/icons';
import { 
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    IconButton,
    useDisclosure ,
    Button,
    Image,
    Text
} from '@chakra-ui/react';
import React from 'react'

const ProfileModal = ({user,children}) => {
    // console.log(user);
    const { isOpen, onOpen, onClose } = useDisclosure()
    return <>
        {
            children?(<span onClick={onOpen}>{children}</span>)
            :
            (
                <IconButton
                    display={{base: "flex"}}
                    icon={<ViewIcon/>}
                    onClick={onOpen} 
                />
                
            )
        }
        <Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent
                h="410px"
            >
            <ModalHeader
                fontSize="40px"
                fontFamily="Inter"
                display="flex"
                justifyContent="center"
            >
                {user.name}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
                display="flex"
                flexDir="column"
                justifyContent="space-between"
                alignItems="center"
            >
                 <Image
                    borderRadius="full"
                    boxSize="150px"
                    src={user.pic}
                    alt={user.name}
                 />
                 <Text
                    fontSize={{base: "20px", md: "30px"}}
                    fontFamily="Inter"
                 >
                     Email:{user.email}
                 </Text>
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
                </Button>
            </ModalFooter>
            </ModalContent>
         </Modal>
    </>
}

export default ProfileModal