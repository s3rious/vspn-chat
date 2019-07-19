import { Message } from "../types/message";

type Action =
  | { type: "setIsLoading"; isLoading: boolean }
  | { type: "setIsFetchedAllMessages"; isFetchedAllMessages: boolean }
  | { type: "setMessages"; messages: Message[] }
  | { type: "prependMessages"; messages: Message[] }
  | { type: "appendMessages"; messages: Message[] }

const setIsLoading = (isLoading: boolean): Action => {
  return {
    type: 'setIsLoading',
    isLoading,
  }
}

const setIsFetchedAllMessages = (isFetchedAllMessages: boolean): Action => {
  return {
    type: 'setIsFetchedAllMessages',
    isFetchedAllMessages,
  }
}

const fetchMessages = async (count?: number, from?: number): Promise<Message[]> => {
  let query = '';

  if (count && !from) {
    query = `?count=${count}`
  }

  if (count && from) {
    query = `?count=${count}&from=${from}`
  }

  if (from && !count) {
    throw new Error('Cannot fetch messages from and without count')
  }

  const response = await fetch(`http://localhost:1337/messages${query}`);
  const messages = await response.json();

  return messages;
}

const fetchInitalMessages = async (): Promise<Message[]> => fetchMessages(100);

const setMessages = (messages: Message[]): Action => {
  return {
    type: 'setMessages',
    messages
  }
}

const prependMessages = (messages: Message[]): Action => {
  return {
    type: 'prependMessages',
    messages
  }
}

const appendMessages = (messages: Message[]): Action => {
  return {
    type: 'appendMessages',
    messages
  }
}

export {
  Action,

  setIsLoading,
  setIsFetchedAllMessages,
  fetchMessages,
  fetchInitalMessages,
  setMessages,
  prependMessages,
  appendMessages
}
