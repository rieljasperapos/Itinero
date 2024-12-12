import React, { useEffect, useState } from 'react';
import {Button} from '@/components/button';
import { CirclePlus } from 'lucide-react';
import ItineraryCard from '@/components/itinerary_card';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog';
import CreateItineraryForm from './itinerary/create/page';


const Dashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const [itineraries, setItineraries] = useState([]);
  console.log({ session });
  console.log("session access token ", session?.user.accessToken);
  if (!session?.user) {
    redirect("/auth/signin")
  }

  const fetchUser = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axios.get(`${apiBaseUrl}/users`, {
        headers: {
          Authorization: `Bearer ${session?.user.accessToken}`,
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  const fetchItineraries = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      console.log("session access token ::: ", session?.user.accessToken);
      const response = await axios.get(`${apiBaseUrl}/itineraries`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });
      console.log("CHECK RESPONSE: ", response.data.data);
      // Set the fetched itineraries to the state
      setItineraries(response.data.data);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    }
  };

  const onClick = () => {
    console.log("clicked");
    fetchItineraries
  }

  useEffect(() => {
    if (session && session.user && session.user.accessToken) {
      fetchUser();
      fetchItineraries();
      console.log("where ", {itineraries});
    }
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
               <Dialog>
                  <DialogTrigger asChild>
                  <Button variant="ghost" className='mediumtext'>
                    <CirclePlus className="mr-1 size-6" strokeWidth={1} />
                    Add Itinerary
                  </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[825px]">

                  {/* Dont touch this */}
                  <VisuallyHidden.Root>
                    <DialogDescription/>
                      <DialogTitle/>
                  </VisuallyHidden.Root>

                  {/* Form Popup */}
                  <CreateItineraryForm>
                    <DialogFooter>
                      <div className="mt-4">
                        <Button type="submit" onClick={onClick}>Create Itinerary</Button>
                      </div>
                    </DialogFooter>
                  </CreateItineraryForm>
                  </DialogContent>
                </Dialog>
                <Dialog>
                </Dialog>
            </div>


                {/* Map over itineraries and display them */}
                <div style={{ marginTop: '10px', marginLeft: '50px' }}>
                  {itineraries.map((itinerary) => (
                    <ItineraryCard
                      key={itinerary.id} // Ensure each itinerary has a unique 'id'
                      title={itinerary.title}
                      dateStart={itinerary.startDate}
                      dateEnd={itinerary.endDate}
                      collaborators={itinerary.collaborators.length} // Adjust according to your data structure
                    />
                  ))}
                </div>
            
            <Button onClick={() => signOut()}>Logout</Button>
        </div>
    );
};

export default Dashboard;