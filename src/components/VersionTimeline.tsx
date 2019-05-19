import React from "react";
import { Timeline, Icon, Tooltip } from "antd";
import styled from "styled-components";
import { IPackageVersion } from "../commons/interfaces";

interface IVersionTimelineProps {
  committedVersions: IPackageVersion[]; // assuming sorted from latest to oldest
  selectedVersionNumber: number; // -1 for staged version
  onSelect: (version: number) => void;
}

const SelectedClickableSpan = styled.span`
  font-weight: bold;
  font-style: italic;
  cursor: pointer;
`;

const ClickableSpan = styled.span`
  cursor: pointer;
`;

const CappedMaxHeightDiv = styled.div`
  max-height: 100vh;
  overflow: scroll;
`;

export class VersionTimeline extends React.Component<IVersionTimelineProps> {
  static wrapTooltip(item: JSX.Element, desc: string) {
    return (
      <Tooltip
        placement="right"
        title={desc}
        overlayStyle={{ fontWeight: "bold" }}
      >
        {item}
      </Tooltip>
    );
  }

  createPreviewItem() {
    const isSelected = this.props.selectedVersionNumber < 0;
    const SpanUsed = isSelected ? SelectedClickableSpan : ClickableSpan;
    return (
      <Timeline.Item key={-1} color="gray">
        <SpanUsed onClick={this.props.onSelect.bind(this, -1)}>
          Preview
        </SpanUsed>
      </Timeline.Item>
    );
  }

  renderItem(version: IPackageVersion) {
    const isSelected = this.props.selectedVersionNumber === version.id_num;
    const itemDecorations = {
      color: isSelected ? "green" : "blue"
    };
    const SpanUsed = isSelected ? SelectedClickableSpan : ClickableSpan;
    return (
      <Timeline.Item key={version.id_num} {...itemDecorations}>
        {VersionTimeline.wrapTooltip(
          <SpanUsed onClick={this.props.onSelect.bind(this, version.id_num)}>
            {version.id_num} - {version.title}
          </SpanUsed>,
          version.version_description
        )}
      </Timeline.Item>
    );
  }

  render() {
    const { committedVersions } = this.props;
    return (
      <CappedMaxHeightDiv>
        <Timeline>
          {this.createPreviewItem()}
          {committedVersions.map(item => this.renderItem(item))}
        </Timeline>
      </CappedMaxHeightDiv>
    );
  }
}
/*
export class DUMMY_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_VersionTimeline extends React.Component<
  {},
  { selected: number }
> {
  state = {
    selected: -1
  };

  render() {
    const committedVersions: IVersion[] = [];
    for (let i = 1; i < 1000; i++) {
      committedVersions.unshift({
        id: `DUMMY_${i}`,
        versionNumber: i,
        title: `This is the ${i}th version`,
        description: `For this ${i}th item, this is suppose to be a description that rocks. Unfortunately, you are using a component that should never have been in production, so basically you are now screwed. HAHAHAHAHAHAHA!`,
        date: new Date()
      });
    }

    return (
      <VersionTimeline
        committedVersions={committedVersions}
        selectedVersionNumber={this.state.selected}
        onSelect={selected => this.setState({ selected })}
      />
    );
  }
}
*/
