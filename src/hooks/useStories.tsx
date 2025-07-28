// import { useEffect, useState } from "react";

// import type { Story } from "../types";

// export function useStories() {
//   const [stories, setStories] = useState<Story[]>([]);

//   useEffect(() => {
//     const saved = localStorage.getItem("projects");
//     if (saved) setStories(JSON.parse(saved));
//   }, []);

//   const save = (updated: Story[]) => {
//    localStorage.setItem("projects", JSON.stringify(projects));
//    setStories(projects);
//   };

//   const createStory = (s: Story) => save([...stories, s]);
//   const updateStory = (s: Story) =>
//     save(stories.map((st) => (st.id === s.id ? s : st)));
//   const deleteStory = (id: string) =>
//     save(stories.filter((st) => st.id !== id));

//   return {
//     stories,
//     createStory,
//     updateStory,
//     deleteStory,
//   };
// }
