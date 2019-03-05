import React from "react";
import { Menu, Icon, Row, Col } from "antd";

import styled from "styled-components/macro";
import { OAuthLogin } from "./Login";
import { IGlobalState, GlobalState } from "../providers";
import { SubMenuProps } from "antd/lib/menu/SubMenu";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const LogoSpan = styled.span`
  font-weight: bold;
  font-size: 1rem;
  padding-right: 20px;
`;

const Logo = () => {
  return <LogoSpan>Kerckhoff</LogoSpan>;
};

const Navbar = () => {
  return (
    <Row>
      <Col>
        <GlobalState.Consumer>
          {globalState => {
            return <NavbarMenu gs={globalState} />;
          }}
        </GlobalState.Consumer>
      </Col>
    </Row>
  );
};

const NavbarMenu = (props: { gs: IGlobalState }) => {
  return props.gs.user ? <LoggedInMenu gs={props.gs} /> : <PublicMenu />;
};

const PublicMenu = () => {
  return (
    <Menu mode="horizontal">
      <Logo />

      <Menu.Item key="login">
        <OAuthLogin />
      </Menu.Item>
    </Menu>
  );
};

const LoggedInMenu = (props: { gs: IGlobalState }) => {
  return (
    <Menu mode="horizontal">
      <Logo />

      <>
        <span style={{ float: "right" }}>Hi {props.gs.user!.firstName!}!</span>
      </>
      <SubMenu
        title={
          <span className="submenu-title-wrapper">
            <Icon type="folder" />
            {props.gs.selectedPackageSet
              ? props.gs.selectedPackageSet.slug
              : "Create A New Package Set"}
          </span>
        }
      >
        <MenuItemGroup title="Package Sets">
          {(props.gs.packageSets ? props.gs.packageSets : []).map(ps => {
            return <Menu.Item key={ps.id}>{ps.slug}</Menu.Item>;
          })}
        </MenuItemGroup>
        <Menu.Item key="create-new">New Package Set</Menu.Item>
      </SubMenu>
    </Menu>
  );
};

export default Navbar;
