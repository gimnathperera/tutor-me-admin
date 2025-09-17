import { Metadata } from "next";
import Profile from "./components/page";

export const metadata: Metadata = {
  title: "Users | TutorMe",
  description: "This is the Users management page for TutorMe",
};

const AllUsers = () => {
  return (
    <div>
      <Profile />
    </div>
  );
};

export default AllUsers;
