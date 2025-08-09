import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Reveiw_page from "../src/components/Reveiw_page";
import Page from "../src/components/Page";
import Nav from "../src/components/Nav_bar";



const router = createBrowserRouter([
    {
    path: "/",
    element: 
    <div>
        <Nav></Nav>
    <Page></Page>
    </div>
  },
  {
    path: "/review",
    element: <Reveiw_page />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
