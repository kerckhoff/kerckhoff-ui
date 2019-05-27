import React from "react";
import { Collapse, Tabs, Card, Col, Divider, Alert } from "antd";
import CollapsePanel from "antd/lib/collapse/CollapsePanel";
import { ScrollyBox, ScrollyItem, SmallText } from "../components/UIFragments";
import { ICachedPackageItem } from "../commons/interfaces";
import styled from "styled-components";
import ReactJson from "react-json-view";

const TabPane = Tabs.TabPane;

const CollapseTitle = styled.h2`
  margin-bottom: 0;
`;

const TextContent = styled.div`
  max-height: 500px;
  overflow-y: scroll;
`;

const ContainedImage = styled.img`
  object-fit: contain;
  max-height: 180px;
`;

const ImageTitle = styled.span`
  font-size: 0.9em;
  text-overflow: ellipsis;
`;

const TextInfoBox = ({ pi }: { pi: ICachedPackageItem }) => {
  return (
    <Col span={24} style={{ marginBottom: "1em" }}>
      <Col span={8}>Last modified by:</Col>
      <Col span={16}>{pi.last_modified_by}</Col>
      <Col style={{ paddingTop: "10px" }} span={24}>
        <a href={pi.altLink} target="_blank">
          <SmallText>Edit in Google Drive</SmallText>
        </a>
      </Col>
    </Col>
  );
};

export const PackagePreviewDisplay = ({
  cachedProperties
}: {
  cachedProperties?: {
    image?: ICachedPackageItem[];
    text?: ICachedPackageItem[];
  };
}) => {
  return (
    <>
      <Alert
        style={{ marginBottom: "1em", maxWidth: "600px" }}
        message="You are currently viewing a preview of the contents of this package."
        description="To create a snapshot of the package contents, create a new version."
        type="info"
        showIcon
      />
      {cachedProperties && (cachedProperties.image || cachedProperties.text) ? (
        <Collapse bordered={false} defaultActiveKey={["text", "images"]}>
          {cachedProperties.text && (
            <CollapsePanel
              header={<CollapseTitle>Text/Data</CollapseTitle>}
              key="text"
            >
              <Tabs defaultActiveKey="1" tabPosition="left">
                {cachedProperties.text.map((pi, i) => {
                  return (
                    <TabPane tab={pi.title} key={`${i + 1}`}>
                      <TextInfoBox pi={pi} />
                      <Divider />
                      <ReactJson
                        style={{ marginBottom: "1em" }}
                        src={pi.content_plain.data}
                        name={"data"}
                        collapsed={1}
                        enableClipboard={false}
                      />
                      <TextContent
                        dangerouslySetInnerHTML={{
                          __html: pi.content_plain.html
                        }}
                      />
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
              <ScrollyBox>
                {cachedProperties.image!.map(p => {
                  return (
                    <ScrollyItem key={p.title}>
                      <a href={p.altLink} target="_blank">
                        <Card
                          hoverable
                          size="small"
                          style={{ width: "240px" }}
                          cover={<ContainedImage src={p.thumbnail_link} />}
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
              </ScrollyBox>
            </CollapsePanel>
          )}
        </Collapse>
      ) : (
        <h2>The package has never been synced before!</h2>
      )}
    </>
  );
};
