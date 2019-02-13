import React from "react";
import { Menu, Icon, Row, Col } from "antd";

import styled from "styled-components/macro";
import { OAuthLogin } from "./Login";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const Logo = styled.div`
  width: 100px;
  height: 30px;
  h3 {
    line-height: 48px;
  }
`;

const Navbar = () => {
  return (
    <Row>
      <Col span={3}>
        <Logo>
          <h3>Kerckhoff</h3>
        </Logo>
      </Col>
      <Col>
        <Menu mode="horizontal">
          <Menu.Item key="mail">
            <Icon type="mail" />
            Navigation One
          </Menu.Item>
          <Menu.Item key="app" disabled>
            <Icon type="appstore" />
            Navigation Two
          </Menu.Item>
          <SubMenu
            title={
              <span className="submenu-title-wrapper">
                <Icon type="setting" />
                Navigation Three - Submenu
              </span>
            }
          >
            <MenuItemGroup title="Item 1">
              <Menu.Item key="setting:1">Option 1</Menu.Item>
              <Menu.Item key="setting:2">Option 2</Menu.Item>
            </MenuItemGroup>
            <MenuItemGroup title="Item 2">
              <Menu.Item key="setting:3">Option 3</Menu.Item>
              <Menu.Item key="setting:4">Option 4</Menu.Item>
            </MenuItemGroup>
          </SubMenu>
          <Menu.Item key="alipay">
            <a
              href="https://ant.design"
              target="_blank"
              rel="noopener noreferrer"
            >
              Navigation Four - Link
            </a>
          </Menu.Item>
          <Menu.Item key="login">
            <OAuthLogin render={() => <div>LOGIN</div>}/>
          </Menu.Item>
        </Menu>
      </Col>
    </Row>
  );
};

export default Navbar;
