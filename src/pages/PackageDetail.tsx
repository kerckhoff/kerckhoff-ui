import React from "react";
import { RouteChildrenProps } from "react-router";
import { GlobalState, IGlobalState } from "../providers";
import {
  Row,
  Col,
  Button,
  Icon,
  Divider,
  Tree,
  Card,
  Collapse,
  Tabs
} from "antd";
import { SubHeader, ScrollyRow, ScrollyItem } from "../components/UIFragments";
import { IPackage, ICachedPackageItem } from "../commons/interfaces";
import styled from "styled-components";
import _ from "lodash";
import {
  configuredDayJs,
  mimeTypeToType,
  PackageSetItemType
} from "../commons/utils";
import CollapsePanel from "antd/lib/collapse/CollapsePanel";

const TreeNode = Tree.TreeNode;

const TabPane = Tabs.TabPane;

export class PackageDetailPage extends React.Component<RouteChildrenProps> {
  render() {
    return (
      <GlobalState.Consumer>
        {context => (
          <PackageDetailPageInternal {...this.props} context={context} />
        )}
      </GlobalState.Consumer>
    );
  }
}

const SlashSpan = styled.span`
  font-size: 1.2em;
  padding: 0 0.1em;
  color: #999;
`;

const SmallText = styled.p`
  font-size: 0.8em;
  font-style: italic;
  margin-bottom: 0.4em;
`;

const ContainedImage = styled.img`
  object-fit: contain;
  max-height: 180px;
`;

const ImageTitle = styled.span`
  font-size: 0.9em;
  text-overflow: ellipsis;
`;

const CollapseTitle = styled.h2`
  margin-bottom: 0;
`;

const TextInfoBox = ({ pi }: { pi: ICachedPackageItem }) => {
  return (
    <Col span={24} style={{ marginBottom: "1em" }}>
      <Col span={8}>Last modified by:</Col>
      <Col span={16}>{pi.last_modified_by}</Col>
    </Col>
  );
};

export class PackageDetailPageInternal extends React.Component<
  RouteChildrenProps & { context: IGlobalState },
  {
    package?: IPackage;
    is404: Boolean;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      package: undefined,
      is404: false
    };
  }

  async getPackageDetails() {
    const params: any = this.props.match!.params;
    const currentPackageSetSlug = params.packageSetId;

    const ops = this.props.context.modelOps;
    const ps = this.props.context.packageSets;

    const currentSlug = params.packageId;

    if (ops && ps) {
      const currentPs = await this.props.context.setPackageSet(
        currentPackageSetSlug
      );
      // @TODO: currently ignoring missing packageset, should display 404
      const packageResponse = await ops.getPackageDetails(
        currentPs!,
        currentSlug
      );
      if (packageResponse) {
        console.log("Got package:", packageResponse.data);
        this.setState({ package: packageResponse.data });
      } else {
        this.setState({ is404: true });
      }
    }
  }

  componentDidMount() {
    this.getPackageDetails();
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
      this.getPackageDetails();
    }
  }

  handlePreviewUpdate = async () => {
    const ops = this.props.context.modelOps!;

    const results = await ops.updatePackageCache(
      this.props.context.selectedPackageSet!,
      this.state.package!
    );

    console.log("Refreshed package from cache:", results.data);
    this.setState({ package: results.data });
  };

  sortedCachedProperties = () => {
    if (this.state.package)
      return (_.groupBy(this.state.package.cached, ci =>
        mimeTypeToType(ci.mimeType)
      ) as any) as {
        [key in PackageSetItemType]: ICachedPackageItem[] | undefined
      };
  };

  renderTree() {
    return (
      <Tree showIcon defaultExpandAll switcherIcon={<Icon type="down" />}>
        {_.map(
          this.sortedCachedProperties(),
          (value: ICachedPackageItem[], key) => {
            const items = value.map(i => {
              return <TreeNode isLeaf={true} key={i.title} title={i.title} />;
            });
            console.log(items);

            return (
              <TreeNode icon={<Icon type="smile-o" />} title={key} key={key}>
                {items}
              </TreeNode>
            );
          }
        )}
      </Tree>
    );
  }

  renderImageCards() {
    return _.map(this.sortedCachedProperties(), () => {});
  }

  render() {
    const lastFetchedDate =
      this.state.package && this.state.package.last_fetched_date
        ? configuredDayJs(this.state.package.last_fetched_date)
        : undefined;

    const cachedProperties = this.sortedCachedProperties();

    return (
      <>
        <Row gutter={32}>
          {this.state.package ? (
            <>
              <Col span={6}>
                <SubHeader>PACKAGE INFO</SubHeader>
                <h3>
                  {this.state.package.package_set}
                  <SlashSpan>/</SlashSpan>
                  {this.state.package.slug}
                </h3>
                <Divider />
                <Button
                  onClick={this.handlePreviewUpdate}
                  style={{ marginBottom: "1em", maxWidth: "160px" }}
                  block
                >
                  <Icon type="reload" />
                  Update Preview
                </Button>
                <SmallText>
                  {lastFetchedDate
                    ? `Last updated ${lastFetchedDate.fromNow()}`
                    : "The Package has never been synced before!"}
                </SmallText>
                <Divider />

                <SubHeader>CURRENT VERSION</SubHeader>
              </Col>
              <Col span={18}>
                {cachedProperties &&
                (cachedProperties.image || cachedProperties.text) ? (
                  <Collapse
                    bordered={false}
                    defaultActiveKey={["text", "images"]}
                  >
                    {cachedProperties.text && (
                      <CollapsePanel
                        header={<CollapseTitle>Text</CollapseTitle>}
                        key="text"
                      >
                        <Tabs defaultActiveKey="1" tabPosition="left">
                          {cachedProperties.text.map((pi, i) => {
                            return (
                              <TabPane tab={pi.title} key={`${i + 1}`}>
                                <TextInfoBox pi={pi} />
                                <Divider />
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit. Vero minus et corporis,
                                praesentium illo quae, dicta soluta aspernatur,
                                adipisci architecto omnis facilis? Deserunt,
                                dignissimos. Quam deserunt tempora officiis enim
                                eius.
                              </TabPane>
                            );
                          })}
                        </Tabs>
                      </CollapsePanel>
                    )}

                    {cachedProperties.image && (
                      <CollapsePanel
                        header={<CollapseTitle>Images</CollapseTitle>}
                        key="images"
                      >
                        <ScrollyRow>
                          {cachedProperties.image!.map(p => {
                            return (
                              <ScrollyItem key={p.title}>
                                <a href={p.altLink} target="_blank">
                                  <Card
                                    hoverable
                                    size="small"
                                    style={{ width: "240px" }}
                                    cover={
                                      <ContainedImage src={p.thumbnail_link} />
                                    }
                                  >
                                    <Card.Meta
                                      title={<ImageTitle>{p.title}</ImageTitle>}
                                      description={
                                        <SmallText>
                                          Last modified by {p.last_modified_by}
                                        </SmallText>
                                      }
                                    />
                                  </Card>
                                </a>
                              </ScrollyItem>
                            );
                          })}
                        </ScrollyRow>
                      </CollapsePanel>
                    )}
                  </Collapse>
                ) : (
                  <h2>Nothing to preview!</h2>
                )}
              </Col>
            </>
          ) : (
            <h2>Loading...</h2>
          )}
        </Row>
      </>
    );
  }
}
