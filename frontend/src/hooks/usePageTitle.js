import { useEffect } from "react";

const usePageTitle = (title) => {
    useEffect(() => {
        document.title = title ? `${title} | AjoPay` : "AjoPay";
    }, [title]);
};

export default usePageTitle;