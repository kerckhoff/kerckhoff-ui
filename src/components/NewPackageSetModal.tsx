import React, { FormEvent } from "react";
import { Modal, Form, Input, Button, Row, Col } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { GlobalState } from "../providers";
import { ModelOperations } from "../api/ModelOperations";
import { isStatusSuccess } from "../util";
import { notifyOk } from "../commons/notify";

type INewPackageSetModalProps = {
  isOpen: boolean;
  setOpen: (cond: boolean) => void;
} & FormComponentProps;

const SLUG_KEY = "slug";
const METADATA_KEY = "metadata";

class BaseNewPackageSetModal extends React.Component<INewPackageSetModalProps> {
  handleSubmit = (ops: ModelOperations) => (e: FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        return;
      }

      const res = await ops.createPackageSet({
        slug: values[SLUG_KEY],
        metadata: values[METADATA_KEY] || ""
      });

      // res == undefined if error (intercepted)
      if (res && isStatusSuccess(res.status)) {
        notifyOk(`Package set "${values[SLUG_KEY]}" created`);
        this.closeModal();
      }
    });
  };

  closeModal = () => this.props.setOpen(false);

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        title="Create a new package set"
        visible={this.props.isOpen}
        onOk={() => {}}
        onCancel={this.closeModal}
        footer={[]}
      >
        <GlobalState.Consumer>
          {gs => (
            <Form onSubmit={this.handleSubmit(gs.modelOps!)}>
              <Form.Item label="Slug">
                {getFieldDecorator(SLUG_KEY, {
                  rules: [
                    {
                      required: true,
                      message: "Please provide a slug!",
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Metadata">
                {getFieldDecorator(METADATA_KEY, {
                  rules: [
                    {
                      required: false,
                      message: "Package metadata",
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item>
                <Row>
                  <Col span={24}>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.closeModal}>
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          )}
        </GlobalState.Consumer>
      </Modal>
    );
  }
}

export const NewPackageSetModal = Form.create({})(BaseNewPackageSetModal);
