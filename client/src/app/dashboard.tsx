import React, { useEffect } from 'react';
import {Button} from '@/components/button';
import { CirclePlus } from 'lucide-react';
import ItineraryCard from '@/components/itinerary_card';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const { data: session, status } = useSession();
  console.log({ session });
  console.log("session access token ", session?.user.accessToken);
  if (!session?.user) {
    redirect("/auth/signin")
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users", {
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`,
          }
        });
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    fetchUser();
  }, [])

    return (
        <div style={{ 
            backgroundColor: '#F5F7FA', 
            height: '100vh', 
            width: '100vw', 
            margin: 0, 
            padding: 0 
        }}>
            <h1 className="heading" style={{ margin: '20px'}}>
                My Plans
            </h1>
            <hr style={{ marginBottom: '30px'}}/>

            <div className = "mediumtext" style={{ marginLeft: '50px' }}>
                <Button variant="outline"> Upcoming</Button>
                <Button variant="outline" style={{ marginLeft: '10px' }}>Ongoing</Button>
                <Button variant="outline" style={{ marginLeft: '10px' }}>Past</Button>  

            </div>  

            <div style={{ marginTop: '10px', marginLeft: '35px' }}>
                <Button variant="ghost" className='mediumtext'>
                <CirclePlus className="mr-1 size-6" strokeWidth={1} />
                Add Itinerary
                </Button>
            </div>

            <div style={{ marginTop: '10px', marginLeft: '50px' }}>
                <ItineraryCard 
                    title="Sample Title" 
                    dateStart="2023-10-01" 
                    dateEnd="2023-10-02"
                    collaborators={3}
                />
            </div>
            
            <Button onClick={() => signOut()}>Logout</Button>
        </div>
    );
};

export default Dashboard;