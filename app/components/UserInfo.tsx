import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import EditUserInfo from './EditUserInfo'

const UserInfo = ({userDetails}:{userDetails: UserDetails | null}) => {
  return (
    <Card className='w-11/12  mx-auto'>
      <CardHeader >
        <CardTitle>My Profile</CardTitle>
        <CardDescription className='capitalize'>{`${userDetails?.firstname} ${userDetails?.lastname}`}</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        <div className='flex justify-between items-center'>
          <h1>First Name</h1>
          <h1 className='capitalize'>{userDetails?.firstname}</h1>
        </div>
        <Separator/>
        <div className='flex justify-between items-center'>
          <h1>Last Name</h1>
          <h1 className='capitalize'>{userDetails?.lastname}</h1>
        </div>
        <Separator/>
        <div className='flex justify-between items-center'>
          <h1>Email</h1>
          <h1 >{userDetails?.email}</h1>
        </div>
      </CardContent>
      <CardFooter className='flex flex-row-reverse'>
        <EditUserInfo userDetails = {userDetails}/>
      </CardFooter>
    </Card>
  )
}

export default UserInfo