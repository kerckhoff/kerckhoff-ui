import React from "react";
import { Card } from "antd";
import { IPackage } from "../commons/interfaces";
import _ from "lodash";
import styled from "styled-components";

export const PreviewText = (props: { text: string; max: number }) => {
  const displayedText = props.text.slice(0, props.max);
  return (
    <p>
      {displayedText}
      {displayedText === props.text ? "" : "..."}
    </p>
  );
};

export const Slugspan = styled.span`
  font-size: 0.9em;
`;

export class PackageCard extends React.Component<{ package: IPackage }> {
  render() {
    return (
      <Card
        style={{
          width: "200px"
        }}
        hoverable
        title={<Slugspan>{this.props.package.slug}</Slugspan>}
      >
        <PreviewText
          max={100}
          text={`Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed, pariatur
        necessitatibus officiis tempora dolorem accusantium voluptatibus culpa
        quis fugit expedita velit cupiditate enim sapiente minima laborum
        facilis dolores impedit tempore?`}
        />
      </Card>
    );
  }
}
