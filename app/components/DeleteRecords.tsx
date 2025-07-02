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
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/delete-record/${transid}`);
      if (res.status === 200) {
        toast({
          duration: 1000,
          variant: "default",
          description: "Record deleted successfully",
        });
      } else {
        throw new Error("Something went wrong, please try again");
      }
    } catch (error: any) {
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
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteRecords;
