import React from "react";
import { Link } from "gatsby";
import { FaGithub } from "react-icons/fa";

import { useSiteMetadata } from "hooks";

import Container from "components/Container";

const Header = () => {
  const { companyName, companyUrl } = useSiteMetadata();

  return (
    <header>
      <div className="container">
      <p>IMMACULATE COVID TRACKER</p>
      {/* <FaGithub /> */}
      </div>
      
    </header>
  );
};

export default Header;
