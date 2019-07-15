import { Button, Card, Icon, Input, List, Modal, Select, Tag } from "antd";
import React, { ChangeEvent } from "react";
import styled from "styled-components";
import {
  IPackageSet,
  IPackageSetDetailed,
  IIntegration,
  IIntegrationCreation
} from "../commons/interfaces";
import { IGlobalState } from "../providers";
import { SubHeader } from "./UIFragments";

const ContextHeader = styled.div`
  font-weight: bold;
  padding-bottom: 0.5rem;
`;

const WarnText = styled.p`
  color: red;
  font-weight: bold;
`;

interface IIntegrationsInfoCardState {
  showNewIntegration: boolean;
  isSubmitting: boolean;
  newIntegration: IIntegrationCreation;
}

const emptyNewIntegration: IIntegrationCreation = {
  name: "",
  integration_type: "wpc"
};

export class IntegrationsInfoCard extends React.Component<
  { ps: IPackageSetDetailed } & { context: IGlobalState },
  IIntegrationsInfoCardState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      showNewIntegration: false,
      isSubmitting: false,
      newIntegration: emptyNewIntegration
    };
  }

  openModal = () => {
    this.setState({
      showNewIntegration: true
    });
  };

  closeModal = () => {
    this.setState({
      showNewIntegration: false
    });
  };

  handleInputChange = (field: "name" | "integration_type") => (
    evt: string | ChangeEvent<HTMLInputElement>
  ) => {
    let value: string;
    if (typeof evt === "string") {
      value = evt as string;
    } else {
      value = (evt as ChangeEvent<HTMLInputElement>).target.value;
    }
    this.setState({
      newIntegration: {
        ...this.state.newIntegration,
        [field]: value
      } as Pick<IIntegrationCreation, "name" | "integration_type">
    });
  };

  handleSubmit = async () => {
    this.setState({
      isSubmitting: true
    });

    await this.props.context.modelOps!.createPackageSetIntegration(
      this.props.ps,
      this.state.newIntegration
    );

    await this.props.context.setPackageSet(this.props.ps.slug, true);
    this.setState({
      isSubmitting: false,
      showNewIntegration: false,
      newIntegration: emptyNewIntegration
    });
  };

  handleRequestLink = (integration: IIntegration) => async () => {
    const res = await this.props.context.modelOps!.getIntegrationOAuthLink(
      this.props.ps,
      integration
    );
    window.open(res.data.redirect_url);
  };

  showTitle = (integration: IIntegration) => {
    switch (integration.integration_type) {
      case "wpc":
        return <SubHeader>WORDPRESS.COM</SubHeader>;
    }
  };

  showActions = (integration: IIntegration) => {
    if (integration.active) {
      return <Tag>ACTIVE</Tag>;
    } else {
      return (
        <Button icon="link" onClick={this.handleRequestLink(integration)}>
          Link
        </Button>
      );
    }
  };

  render() {
    {
      return (
        <Card size="small" title={<>Publishing Integrations</>}>
          <Modal
            title="Add a new publishing Integration"
            visible={this.state.showNewIntegration}
            okText="Submit"
            onOk={this.handleSubmit}
            onCancel={this.closeModal}
            confirmLoading={this.state.isSubmitting}
          >
            <Input
              placeholder="Enter a name for the integration"
              onChange={this.handleInputChange("name")}
              style={{ marginBottom: "1em" }}
            />
            <Select
              placeholder="Select an integration Type"
              onChange={this.handleInputChange("integration_type")}
              style={{ width: "100%", marginBottom: "1em" }}
            >
              <Select.Option value="wpc">Wordpress.com</Select.Option>
            </Select>
          </Modal>

          <List
            footer={
              <div>
                <Button block onClick={this.openModal}>
                  <Icon type="plus" />
                  New Integration
                </Button>
              </div>
            }
            locale={{ emptyText: "No Integrations" }}
            itemLayout="horizontal"
            dataSource={this.props.ps.integrations}
            renderItem={(item: IIntegration) => (
              <List.Item actions={[this.showActions(item)]}>
                <List.Item.Meta
                  title={this.showTitle(item)}
                  description={item.name}
                />
              </List.Item>
            )}
          />
        </Card>
      );
    }
  }
}
