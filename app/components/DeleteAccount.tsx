'use client'
import { AlertDialogFooter, AlertDialogHeader,AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import axios, { AxiosError } from 'axios'
 
import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const DeleteAccount = ({userId}:{userId:number| undefined}) => {

  const router = useRouter();

  async function handleClick() {
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/user-details`);
      if (res.status === 200 || res.status === 204) {
        toast({
          duration: 3000,
          description: 'Account deleted successfully',
        });
      }
    } catch (error) {
      let errorMessage = 'An unexpected error occurred.'; 
      let errorTitle = 'Deletion Failed';

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError; 

        if (axiosError.response) {
          errorMessage = (axiosError.response.data as { message?: string })?.message || `Server responded with status ${axiosError.response.status}`;
          if (axiosError.response.status === 401) {
              errorTitle = 'Authentication Error';
          } else if (axiosError.response.status === 404) {
              errorTitle = 'Not Found';
          }
        } else if (axiosError.request) {
          errorMessage = 'Network error: Please check your internet connection.';
          errorTitle = 'Network Issue';
        } else {
          errorMessage = axiosError.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: errorTitle,
        duration: 5000,
        variant: 'destructive',
        description: errorMessage, 
      });
    } finally {
      router.refresh();
    }    
  }
  return (
    <Card className="w-11/12 mx-auto">
      <CardHeader>
        <CardTitle>Delete</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between">
        <h1>Delete your account</h1>
        <AlertDialog>
          <AlertDialogTrigger>
            <ChevronRight />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className='text-foreground'>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col md:gap-0">
              <AlertDialogAction onClick={handleClick}>
                Confirm
              </AlertDialogAction>
              <AlertDialogCancel className="bg-card hover:bg-muted">
                Cancel
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

export default DeleteAccount