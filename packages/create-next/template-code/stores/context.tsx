/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useReducer } from "react";
import reducer, { initialState } from "./reducer";

export const CommonContext = React.createContext<any>("");

type Props = {
    children: React.ReactNode;
};
export default function Provider(props: Props) {
    const { children } = props;
    const [state, dispatch] = useReducer(reducer, initialState);

    return <CommonContext.Provider value={{ state, dispatch }}>{children}</CommonContext.Provider>;
}
