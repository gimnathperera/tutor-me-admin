import { GridIcon } from "@/icons";
import {
  BookOpen,
  HelpCircle,
  LibraryBig,
  MessageSquareHeart,
  NotebookText,
  TextSearch,
  User,
} from "lucide-react";

const NavItems = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    name: "Academics",
    icon: <BookOpen />,
    subItems: [
      { name: "Grades", path: "/grade", pro: false },
      { name: "Subjects", path: "/subjects", pro: false },
      { name: "Levels", path: "/levels", pro: false },
      { name: "Papers", path: "/papers", pro: false },
    ],
  },
  {
    name: "Tuition",
    icon: <LibraryBig />,
    subItems: [
      { name: "Tuition Rates", path: "/tuition-rates", pro: false },
      { name: "Tuition Assignments", path: "/assignments", pro: false },
    ],
  },
  {
    icon: <NotebookText />,
    name: "Blog",
    path: "/blogs",
  },
  {
    icon: <MessageSquareHeart />,
    name: "Testimonials",
    path: "/testimonials",
  },
  {
    icon: <HelpCircle />,
    name: "FAQ",
    path: "/faqs",
  },
  {
    icon: <TextSearch />,
    name: "Inquiries",
    path: "/inquiries",
    subItems: [
      { name: "Contact Us", path: "/inquiries/contactus", pro: false },
    ],
  },
  {
    name: "Users",
    icon: <User />,
    path: "/users",
    subItems: [
      { name: "Tutors", path: "/tutors", pro: false },
      { name: "Students", path: "/users/all-users", pro: false },
    ],
  },
  // {
  //   icon: <MessageSquareMore />,
  //   name: "Contact Us",
  //   path: "/#keep-in-touch-section",
  // },
  // {
  //   icon: <CalenderIcon />,
  //   name: "Calendar",
  //   path: "/calendar",
  // },
  // {
  //   icon: <UserCircleIcon />,
  //   name: "User Profile",
  //   path: "/profile",
  // },
  // {
  //   name: "Forms",
  //   icon: <ListIcon />,
  //   subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  // },
  // {
  //   name: "Tables",
  //   icon: <TableIcon />,
  //   subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  // },
  // {
  //   name: "Pages",
  //   icon: <PageIcon />,
  //   subItems: [
  //     { name: "Blank Page", path: "/blank", pro: false },
  //     { name: "404 Error", path: "/error-404", pro: false },
  //   ],
  // },
];

export default NavItems;
