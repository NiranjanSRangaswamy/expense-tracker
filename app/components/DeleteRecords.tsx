import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const DeleteRecords = ({ transid }: { transid: number }) => {

  const router = useRouter()
  const handleDelete = async () => {
    try {
      const res = await axios.delete(`/api/user/delete-record/${transid}`);
      if (res.status === 200) {
        toast({
          duration: 1000,
          variant: "default",
          description: "Record deleted successfully",
        });
      } 
    } catch (error: any) {
      let errorMessage = error.message
      if(axios.isAxiosError(error)){
        errorMessage =  error.response?.data.message
      }
      toast({
        duration: 1000,
        variant: "destructive",
        description: error.message,
      });
    }
    finally{
      router.refresh()
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="text-sm rounded-md bg-primary h-10 px-4 py-2 text-primary-foreground hover:bg-primary/90">
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-foreground">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col ">
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          <AlertDialogCancel className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 border border-input bg-card hover:bg-muted hover:text-accent-foreground">
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteRecords;
