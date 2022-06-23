import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";

function useWindowSize() {
    const isClient: boolean = typeof window === "object";

    const getSize = useCallback(() => {
        const config = {
            currentWidth: isClient ? window.innerWidth : 0,
            currentHeight: isClient ? window.innerHeight : 0,
        };
        return config;
    }, [isClient]);

    const [windowSize, setWindowSize] = useState(getSize);

    useEffect((): any => {
        if (!isClient) {
            return false;
        }

        function handleResize() {
            setWindowSize(getSize());
        }

        window.addEventListener("resize", debounce(handleResize, 300));
        return () => window.removeEventListener("resize", debounce(handleResize, 300));
    }, [isClient, getSize]);

    return windowSize;
}

export default useWindowSize;
