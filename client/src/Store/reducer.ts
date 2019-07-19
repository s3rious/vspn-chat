import { Message } from "../types/message";
import { Action } from './actions';

type State = {
  isLoading: boolean;
  isFetchedAllMessages: boolean;
  messages: Message[];
};

const initialState: State = {
  isLoading: true,
  isFetchedAllMessages: false,
  messages: []
};

const reducer = (state: State, action: Action): State => {
  if (action.type === "setIsLoading") {
    return {
      ...state,
      isLoading: action.isLoading
    };
  }

  if (action.type === "setIsFetchedAllMessages") {
    return {
      ...state,
      isFetchedAllMessages: action.isFetchedAllMessages
    };
  }

  if (action.type === 'setMessages') {
    return {
      ...state,
      messages: action.messages
    };
  }

  if (action.type === 'prependMessages') {
    return {
      ...state,
      messages: [
        ...action.messages,
        ...state.messages
      ]
    };
  }

  if (action.type === 'appendMessages') {
    return {
      ...state,
      messages: [
        ...state.messages,
        ...action.messages
      ]
    };
  }

  return state;
};

export {
  State,

  initialState,
  reducer
};
