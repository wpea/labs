import React from "react";

const Layout = ({ children }) => {
  return (
    <div className=" mx-auto flex   justify-center items-center px-20 pt-12 my-6">
      {children}
    </div>
  );
};

export default Layout;
