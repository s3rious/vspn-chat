import { h, FunctionComponent, ComponentChild, createContext } from "preact";
import { useReducer, useEffect, useCallback } from "preact/hooks";

import cnsl from "../util/cnsl";
import { reducer, initialState, State } from "./reducer";
import {
  setIsLoading,
  setIsFetchedAllMessages,
  fetchMessages,
  fetchInitalMessages,
  setMessages,
  prependMessages
} from "./actions";

type StoreProps = {
  children: ComponentChild;
};

type Context = {
  fetchMoreMessages: () => void;
  state: State;
};

const { Provider, Consumer } = createContext<Context>({
  // tslint:disable-next-line: no-empty
  fetchMoreMessages: () => {},
  state: initialState
});

const Store: FunctionComponent<StoreProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    cnsl.log("Store mounted", initialState);
    dispatch(setIsLoading(true));

    fetchInitalMessages().then(fetchedMessages => {
      cnsl.log("Initial messages fetched", fetchedMessages);
      dispatch(setIsLoading(false));
      dispatch(setMessages(fetchedMessages));
    });
  }, []);

  const fetchMoreMessages = useCallback(() => {
    if (state.isLoading || state.isFetchedAllMessages) {
      return;
    }

    const length = state.messages.length;
    cnsl.log("Fetching more messages", length);
    dispatch(setIsLoading(true));

    fetchMessages(100, length).then(fetchedMessages => {
      cnsl.log("More messages fetched", fetchedMessages);
      dispatch(setIsLoading(false));

      if (fetchedMessages.length < 1) {
        dispatch(setIsFetchedAllMessages(true));
        return;
      }

      dispatch(prependMessages(fetchedMessages));
    });
  }, [state.isLoading, state.isFetchedAllMessages, state.messages.length]);

  const contextValue = {
    fetchMoreMessages,
    state
  };

  return <Provider value={contextValue}>{children}</Provider>;
};

export { Store, Consumer };
