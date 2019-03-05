import { Button, Card, Icon, Input } from "antd";
import React from "react";
import styled from "styled-components";
import { IPackageSet } from "../commons/interfaces";
import { IGlobalState } from "../providers";

const ContextHeader = styled.div`
  font-weight: bold;
  padding-bottom: 0.5rem;
`;

const WarnText = styled.p`
  color: red;
  font-weight: bold;
`;

export class MetaInfoCard extends React.Component<
  { ps: IPackageSet } & { context: IGlobalState },
  { edit: boolean; gdrive_url?: string; gdrive_id?: string }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      edit: false,
      gdrive_url: undefined,
      gdrive_id: undefined
    };
  }

  async componentDidMount() {
    this.setState({
      edit: !!!this.props.ps.metadata.google_drive,
      gdrive_id: this.props.ps.metadata.google_drive
        ? this.props.ps.metadata.google_drive.folder_id
        : undefined,
      gdrive_url: this.props.ps.metadata.google_drive
        ? this.props.ps.metadata.google_drive.folder_url
        : undefined
    });
  }

  gdriveIsValid(): boolean {
    return !!this.state.gdrive_id && !!this.state.gdrive_url;
  }

  toggleEdit = () => {
    this.setState({
      edit: !this.state.edit
    });
  };

  handleChange = (key: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const target = event.target;
    const value = target.value;

    this.setState({
      [key]: value
    } as any);
  };

  handleUrlUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      gdrive_url: event.target.value
    });

    try {
      const url = new URL(event.target.value);
      const id = url.pathname.split("/").pop();
      if (id) {
        this.setState({
          gdrive_id: id
        });
      }
    } catch {}
  };

  handleSave = async () => {
    const response = await this.props.context.modelOps!.updatePackageSet(
      this.props.ps,
      {
        metadata: {
          google_drive: {
            folder_id: this.state.gdrive_id!,
            folder_url: this.state.gdrive_url!
          }
        }
      }
    );
    this.props.context.syncPackageSets();

    console.log(`Successfully updated package set: ${this.props.ps.slug}!`);
    console.log(response);

    this.toggleEdit();
  };

  render() {
    {
      return (
        <Card
          bordered={false}
          size="small"
          title={
            <>
              Source Information{" "}
              <a onClick={this.toggleEdit}>
                <Icon
                  style={{ float: "right", marginTop: "0.25em" }}
                  type="edit"
                />
              </a>
            </>
          }
        >
          <ContextHeader>
            <Icon type="google" />
            {"  "}Google Drive
            <a
              target="_blank"
              href={this.props.ps.metadata.google_drive!.folder_url}
            >
              <Icon
                style={{ float: "right", paddingTop: "0.25em" }}
                type="login"
              />
            </a>
          </ContextHeader>
          {!this.props.ps.metadata.google_drive && (
            <WarnText>Google Drive is not configured!</WarnText>
          )}
          <Input
            onChange={this.handleUrlUpdate}
            style={{ marginBottom: "0.5rem" }}
            placeholder="Folder URL"
            value={this.state.gdrive_url}
            disabled={!this.state.edit}
          />
          <Input
            onChange={this.handleChange("gdrive_id")}
            style={{ marginBottom: "0.5rem" }}
            placeholder="Folder ID"
            disabled={!this.state.edit}
            value={this.state.gdrive_id}
          />
          {this.state.edit && (
            <Button
              size="small"
              disabled={!this.gdriveIsValid()}
              onClick={this.handleSave}
            >
              Save
            </Button>
          )}
        </Card>
      );
    }
  }
}
