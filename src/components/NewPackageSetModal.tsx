import React, { FormEvent } from "react";
import { Modal, Form, Input, Button, Row, Col } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { GlobalState, IGlobalState } from "../providers";
import { ModelOperations } from "../api/ModelOperations";
import { isStatusSuccess } from "../util";
import { notifyOk } from "../commons/notify";

type INewPackageSetModalProps = {
  isOpen: boolean;
  setOpen: (cond: boolean) => void;
} & FormComponentProps;

const SLUG_KEY = "slug";

class BaseNewPackageSetModal extends React.Component<INewPackageSetModalProps> {
  handleSubmit = (gs: IGlobalState) => (e: FormEvent) => {
    e.preventDefault();
    const ops = gs.modelOps!;
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        return;
      }

      const res = await ops.createPackageSet({
        slug: values[SLUG_KEY]
      });

      // res == undefined if error (intercepted)
      if (res && isStatusSuccess(res.status)) {
        await gs.syncPackageSets();
        notifyOk(`Package set "${values[SLUG_KEY]}" created`);
        this.props.form.resetFields();
        this.closeModal();
      }
    });
  };

  closeModal = () => this.props.setOpen(false);

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        title="Create a new Package Set"
        visible={this.props.isOpen}
        onOk={() => {}}
        onCancel={this.closeModal}
        footer={null}
      >
        <GlobalState.Consumer>
          {gs => (
            <Form onSubmit={this.handleSubmit(gs)}>
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
