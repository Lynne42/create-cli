type State = {
    containerWidth: number;
    containerHeight: number;
    [propsName: string]: any;
};
type Action = {
    type: string;
    [propsName: string]: any;
};

export const initialState = {
    containerWidth: 0,
    containerHeight: 0,
    userInfo: null,
};

export const CONTAINER_INFO = "CONTAINER_INFO";
export const USERINFO = "USERINFO";

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case CONTAINER_INFO:
            return {
                ...state,
                ...action.data,
            };

        case USERINFO:
            return {
                ...state,
                userInfo: action.data,
            };

        default:
            return state;
    }
}

export default reducer;
