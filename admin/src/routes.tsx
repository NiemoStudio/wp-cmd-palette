import BaseLayout from "@/components/layouts/BaseLayout";

import Pages from "@/components/pages/Pages/Pages";
import Settings from "@/components/pages/Settings/Settings";
import Styling from "@/components/pages/Styling/Styling";

const routes = [
  {
    children: [
      {
        element: <Pages />,
        path: "",
      },
      {
        element: <Styling />,
        path: "styling",
      },
      {
        element: <Settings />,
        path: "settings",
      }
    ],
    element: (
      <BaseLayout />
    ),
    path: "/",
  },
];

export default routes;
