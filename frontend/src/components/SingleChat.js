import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getSender, getSenderFull } from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider'
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import "./styles.css"
import io from "socket.io-client"

const ENDPOINT = "http://localhost:5000";

var socket, selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const { user, selectedChat, setSelectedChat }=ChatState();
  const toast = useToast();

  const fetchMessages = async() =>{

      if(!selectedChat)return;

      try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }
        
        setLoading(true);
        const {data} = await axios.get(
            `/api/message/${selectedChat._id}`,
            config
        ); 
        setMessages(data);
        setLoading(false);

        socket.emit("join chat", selectedChat._id);
        // console.log(messages)
      } catch (error) {
        toast({
            title: "Error Occured!",
            description: "Failed to load the message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        })
      }
  }

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on('connection',()=> setSocketConnected(true));
  }, [])

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat])
  
  useEffect(()=>{
      socket.on("message recieved", (newMessageRecieved)=>{
          if(!selectedChatCompare || selectedChatCompare._id!== newMessageRecieved.chat._id){
              // give notification
          }
          else{
              setMessages([...messages,newMessageRecieved]);
          }
      })
  })

  const sendMessage = async (event) =>{
    if(event.key==="Enter" && newMessage){
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            
            setNewMessage("");
            const { data } = await axios.post('/api/message',{
                content: newMessage,
                chatId: selectedChat._id
            }, config);
            // console.log(data);

            socket.emit('new message', data);
            setMessages([...messages, data])
        } catch (error) {
            // console.log(error)
            toast({
                title: "Error Occured!",
                description: "Failed to send the message",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
        }
    }
  }


  
  

  const typingHandler = (e) =>{
      setNewMessage(e.target.value);


    //   Typing Indicator Logic
  }
  return (
      <>
        {selectedChat ?(
            <>
                <Text
                    fontSize={{base: "28px" ,md: "30px"}}
                    pb={3}
                    px={2}
                    width="100%"
                    fontFamily="Inter"
                    display="flex"
                    justifyContent={{base: "space-between"}}
                    alignItems="center"
                >
                     <IconButton
                        display={{base: "flex", md: "none"}}
                        icon={<ArrowBackIcon/>}
                        onClick={() => setSelectedChat("")}
                     />
                        {!selectedChat.isGroupChat ? (
                            <>
                             {getSender(user, selectedChat.users)}
                             <ProfileModal user={getSenderFull(user, selectedChat.users)}/>
                            </>
                        ) : (
                            <>
                            {selectedChat.chatName.toUpperCase()}
                             <UpdateGroupChatModal
                                 fetchAgain={fetchAgain}
                                setFetchAgain={setFetchAgain}
                                fetchMessages={fetchMessages}
                            />
                            </>
                        )}
                </Text>
                <Box
                    display="flex"
                    flexDir="column"
                    justifyContent="flex-end"
                    p={3}
                    bg="#e8e8e8"
                    width="100%"
                    height="100%"
                    borderRadius="lg"
                    overflowY="hidden"
                >
                    {loading ? (
                        <Spinner
                            size="xl"
                            w={20}
                            h={20}
                            alignSelf="center"
                            margin="auto"
                        />
                    ):(
                        <div className='messages'>
                            <ScrollableChat messages={messages}/>
                        </div>
                    )}
                    <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                        <Input variant="filled" 
                            bg="#e0e0e0"
                            placeholder='Enter a message'
                            onChange={typingHandler}
                            value={newMessage}
                        />
                    </FormControl>
                </Box>
            </>
        ) : (
            <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                <Text fontSize="3xl" pb={3} fontFamily="Inter">
                    Click on a user to start chatting..
                </Text>
            </Box>
        )}

      </>
  )
}

export default SingleChat