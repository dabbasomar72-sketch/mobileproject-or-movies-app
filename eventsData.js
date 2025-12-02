// eventsData.js - sample events used across Home and Events screens
// const sampleEvents = [
//   {
//     id: 1,
//     name: "Community Concert",
//     description: "An evening of live local music.",
//     category: "Concert",
//     starttime: new Date().toISOString(),
//     endtime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
//     spotsRemaining: 50,
//   },
//   {
//     id: 2,
//     name: "Outdoor Yoga",
//     description: "Morning yoga in the park for all levels.",
//     category: "Outdoors",
//     starttime: new Date().toISOString(),
//     endtime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
//     spotsRemaining: 20,
//   },
//   {
//     id: 3,
//     name: "Tech Meetup",
//     description: "Networking and lightning talks for developers.",
//     category: "Meetup",
//     starttime: new Date().toISOString(),
//     endtime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
//     spotsRemaining: 100,
//   },
//   {
//     id: 4,
//     name: "Charity Fun Run",
//     description: "5K run to raise funds for local charities.",
//     category: "Charity",
//     starttime: new Date().toISOString(),
//     endtime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
//     spotsRemaining: 200,
//   },
//   {
//     id: 5,
//     name: "Art Exhibition",
//     description: "Local artists exhibit their latest work.",
//     category: "Exhibition",
//     starttime: new Date().toISOString(),
//     endtime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
//     spotsRemaining: 80,
//   },
//   {
//     id: 6,
//     name: "Cooking Class",
//     description: "Hands-on workshop: Italian weeknight dinners.",
//     category: "Class",
//     starttime: new Date().toISOString(),
//     endtime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
//     spotsRemaining: 12,
//   },
//   {
//     id: 7,
//     name: "Community Market",
//     description: "Local vendors, food stalls, and live music.",
//     category: "Market",
//     starttime: new Date().toISOString(),
//     endtime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
//     spotsRemaining: 999,
//   },
//   {
//     id: 8,
//     name: "Film Screening",
//     description: "Outdoor screening of a family-friendly film.",
//     category: "Screening",
//     starttime: new Date().toISOString(),
//     endtime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
//     spotsRemaining: 120,
//   },
// ];

// export default sampleEvents;
const fetchEvents = async () => {
  try {
    const response = await fetch("https://grmobile.onrender.com/events");
    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }
    const events = await response.json();
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  } 
};

export default fetchEvents;