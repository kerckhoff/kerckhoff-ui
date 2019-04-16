import React from "react";
import { Menu, Icon, Row, Col, Modal } from "antd";

import styled from "styled-components/macro";
import { OAuthLogin } from "./Login";
import { IGlobalState, GlobalState } from "../providers";
import { SubMenuProps } from "antd/lib/menu/SubMenu";
import { NewPackageSetModal } from "./NewPackageSetModal";
import { Link } from "react-router-dom";

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

      <Menu.Item style={{ float: "right" }} key="login">
        <OAuthLogin />
      </Menu.Item>
    </Menu>
  );
};

interface ILoggedMenuState {
  showCreatePackageSetModal: boolean;
}

class LoggedInMenu extends React.Component<
  { gs: IGlobalState },
  ILoggedMenuState
> {
  state = {
    showCreatePackageSetModal: false
  };

  setCreatePackageSetModalOpen = (cond: boolean) =>
    this.setState({ showCreatePackageSetModal: cond });

  render() {
    const { gs } = this.props;

    return (
      <>
        <Menu mode="horizontal">
          <Logo />
          <>
            <span style={{ float: "right" }}>Hi {gs.user!.firstName!}!</span>
          </>
          <SubMenu
            title={
              <span className="submenu-title-wrapper">
                <Icon type="folder" />
                {gs.selectedPackageSet
                  ? gs.selectedPackageSet.slug
                  : "Create A New Package Set"}
              </span>
            }
          >
            <MenuItemGroup title="Package Sets">
              {(gs.packageSets ? gs.packageSets : []).map(ps => {
                return (
                  <Menu.Item key={ps.id}>
                    <Link to={`/${ps.slug}`}>{ps.slug} </Link>
                  </Menu.Item>
                );
              })}
            </MenuItemGroup>
            <Menu.Item
              key="create-new"
              onClick={() => this.setCreatePackageSetModalOpen(true)}
            >
              New Package Set
            </Menu.Item>
          </SubMenu>
        </Menu>
        {/* It seems that for whatever f**king reason,
        putting modal inside of a menu kills antd's normal behavior of state updating DOM */}
        <NewPackageSetModal
          isOpen={this.state.showCreatePackageSetModal}
          setOpen={(cond: boolean) =>
            this.setState({ showCreatePackageSetModal: cond })
          }
        />
      </>
    );
  }
}

export default Navbar;
