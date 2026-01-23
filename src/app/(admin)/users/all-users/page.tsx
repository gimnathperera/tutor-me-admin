import { Metadata } from "next";
import Profile from "./components/page";

export const metadata: Metadata = {
  title: "Users | TuitionLanka",
  description: "This is the Users management page for TuitionLanka",
};

const AllUsers = () => {
  return (
    <div>
      <Profile />
    </div>
  );
};

export default AllUsers;
