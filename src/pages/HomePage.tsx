import { Col, Row } from "antd";
import React from "react";
import { RouteProps, RouteChildrenProps } from "react-router";
import { IPackage } from "../commons/interfaces";
import { GlobalState, IGlobalState } from "../providers";
import { MetaInfoCard } from "../components/PSMetaInfoCard";
import styled from "styled-components";
import { PackageCard } from "../components/PackageCard";
import { ScrollyRow, ScrollyItem, SubHeader } from "../components/UIFragments";
import { Link } from "react-router-dom";

export class Homepage extends React.Component<RouteChildrenProps> {
  render() {
    return (
      <GlobalState.Consumer>
        {context => <HomepageInternal {...this.props} context={context} />}
      </GlobalState.Consumer>
    );
  }
}

export class HomepageInternal extends React.Component<
  RouteChildrenProps & { context: IGlobalState },
  {
    displayedPackages: IPackage[];
    is404: boolean;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = { displayedPackages: [], is404: false };
  }

  componentDidUpdate(
    prevProps: RouteChildrenProps & { context: IGlobalState }
  ) {
    // use props
    if (
      prevProps.context.selectedPackageSet !==
        this.props.context.selectedPackageSet ||
      prevProps.match!.params !== this.props.match!.params
    ) {
      this.syncPackages();
    }
  }

  componentDidMount() {
    this.syncPackages();
  }

  async syncPackages(page = 1) {
    const ops = this.props.context.modelOps;
    const ps = this.props.context.packageSets;

    const params: any = this.props.match!.params;
    const currentPackageSetSlug = params.packageSetId;

    if (ops && ps) {
      const currentPs = currentPackageSetSlug
        ? await this.props.context.setPackageSet(currentPackageSetSlug)
        : this.props.context.selectedPackageSet;

      if (ps) {
        const packageResponse = await ops.getPackages(currentPs!);
        console.log("Got packages:", packageResponse);
        this.setState({
          displayedPackages: packageResponse.data.results
        });
      } else {
        this.setState({
          is404: true
        });
      }
    }
  }

  renderPackageCards = () => {
    if (this.state.displayedPackages) {
      return (
        <ScrollyRow>
          {this.state.displayedPackages.map(p => {
            return (
              <ScrollyItem key={p.id}>
                <Link
                  to={`/${this.props.context.selectedPackageSet!.slug}/${
                    p.slug
                  }`}
                >
                  <PackageCard package={p} />
                </Link>
              </ScrollyItem>
            );
          })}
        </ScrollyRow>
      );
    } else {
      return <h2>Loading...</h2>;
    }
  };

  refreshFromGdrive = () => {};

  render() {
    return (
      <>
        {this.props.context.selectedPackageSet ? (
          <Row gutter={32}>
            <Col span={6}>
              <SubHeader>PACKAGESET INFO</SubHeader>
              <h3>{this.props.context.selectedPackageSet!.slug}</h3>
              <MetaInfoCard
                context={this.props.context}
                ps={this.props.context.selectedPackageSet}
              />
            </Col>
            <Col span={18}>
              <h2>Recently Updated</h2>
              {this.renderPackageCards()}
            </Col>
          </Row>
        ) : (
          <h2>Log In First!</h2>
        )}
      </>
    );
  }
}

export default Homepage;
