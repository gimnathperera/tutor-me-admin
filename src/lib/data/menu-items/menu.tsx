import {
  CalenderIcon,
  GridIcon,
  ListIcon,
  PageIcon,
  TableIcon,
  UserCircleIcon,
} from "@/icons";
import {
  BookOpen,
  GraduationCap,
  HelpCircle,
  LibraryBig,
  MessageSquareMore,
  NotebookText,
} from "lucide-react";

const NavItems = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [{ name: "Ecommerce", path: "/", pro: false }],
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
      { name: "Tuition Assignments", path: "/tuition-assignments", pro: false },
    ],
  },
  {
    icon: <GraduationCap />,
    name: "Levels and Exams",
    path: "/level-and-exams",
  },
  {
    icon: <HelpCircle />,
    name: "FAQ",
    path: "/faqs",
  },
  {
    icon: <NotebookText />,
    name: "Blog",
    path: "/blogs",
  },
  {
    icon: <MessageSquareMore />,
    name: "Contact Us",
    path: "/#keep-in-touch-section",
  },
  {
    icon: <CalenderIcon />,
    name: "Calendar",
    path: "/calendar",
  },
  {
    icon: <UserCircleIcon />,
    name: "User Profile",
    path: "/profile",
  },
  {
    name: "Forms",
    icon: <ListIcon />,
    subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  },
  {
    name: "Tables",
    icon: <TableIcon />,
    subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  },
  {
    name: "Pages",
    icon: <PageIcon />,
    subItems: [
      { name: "Blank Page", path: "/blank", pro: false },
      { name: "404 Error", path: "/error-404", pro: false },
    ],
  },
];

export default NavItems;
