import { useEffect } from "react";

function useLeaveWarning(isRunning: boolean) {
    useEffect((): any => {
        const listener = (ev: any) => {
            if (isRunning) {
                ev.preventDefault();
                const msg = "文件正在上传中，确定要离开吗？";
                ev.returnValue = msg;
                return msg;
            }
        };
        if (isRunning) {
            window.addEventListener("beforeunload", listener);
        } else {
            window.removeEventListener("beforeunload", listener);
        }
        window.addEventListener("beforeunload", listener);
        return () => {
            window.removeEventListener("beforeunload", listener);
        };
    }, [isRunning]);
}

export default useLeaveWarning;
