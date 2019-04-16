import React, { Component } from "react";
import AppRouter from "./router";

import Navbar from "./components/Navbar";
import { Layout } from "antd";

import styled, { css } from "styled-components/macro";
import { GlobalStateWrapper } from "./providers";
import { Router } from "react-router";
import { history } from "./commons/history";

const { Header, Content, Footer } = Layout;

const StyledHeader = styled(Header)`
  background: #fff;
`;

const StyledLayout = styled(Layout)`
  background: #fff;
`;

const StyledContent = styled(Content)`
  padding: 0 50px;
`;

const StyledFooter = styled(Footer)`
  background: #fff;
  text-align: center;
`;

const ContentDiv = styled.div`
  padding: 24;
  min-height: calc(100vh - 64px - 69px);
`;

class App extends Component {
  render() {
    return (
      <GlobalStateWrapper>
        <Router history={history}>
          <StyledLayout>
            <StyledHeader>
              <Navbar />
            </StyledHeader>
            <StyledContent>
              <ContentDiv>
                <AppRouter />
              </ContentDiv>
            </StyledContent>
            <StyledFooter>The Kerckhoff Project 2019</StyledFooter>
          </StyledLayout>
        </Router>
      </GlobalStateWrapper>
    );
  }
}

export default App;
