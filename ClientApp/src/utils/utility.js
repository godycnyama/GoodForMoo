import { toast } from 'react-toastify';


export const openToast = (type, message) => {
    if(type === "success"){
      return  toast.success(message,{
            position: toast.POSITION.TOP_CENTER
        });
    }
    if(type === "error"){
        return  toast.error(message,{
            position: toast.POSITION.TOP_CENTER
        });
    }
}