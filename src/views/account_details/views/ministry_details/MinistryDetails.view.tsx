"use client";
import React from "react";
import styles from "./MinistryDetails.module.scss";
import { Button, Card, Divider, Form, Input, Modal, Select, Skeleton } from "antd";
import { FaSave } from "react-icons/fa";
import PhotoUpload from "@/components/photoUpload/PhotoUpload.component";
import UserItem from "@/components/userItem/UserItem.component";
import Error from "@/components/error/Error.component";
import selectableMinistryTypes from "@/data/selectableMinistryTypes";
import { useUser } from "@/state/auth";
import useFetchData from "@/state/useFetchData";
import useUpdateData from "@/state/useUpdateData";

const MinistryDetails = () => {
  const selectableOptions = selectableMinistryTypes();
  const [form] = Form.useForm();
  const { data: loggedInUser } = useUser();

  const { data: selectedProfile, isLoading: loading, isError, error } = useFetchData({
    url: `/ministry/${loggedInUser?.ministry}`,
    key: "selectedProfile",
    enabled: !!loggedInUser?.ministry,
  });

  const { mutate: updateMinistry } = useUpdateData({
    queriesToInvalidate: ["selectedProfile"],
  });

  const onFinish = (values: any) => {
    Modal.confirm({
      title: "Update Ministry Details",
      content: "Are you sure you want to update this ministry?",
      onOk: () => {
        updateMinistry({
          url: `/ministry/${selectedProfile?.ministry?._id}`,
          formData: values,
        });
      },
      okButtonProps: { type: "primary" },
    });
  };
  React.useEffect(() => {
    form.setFieldsValue({ ...selectedProfile?.ministry });
  }, [selectedProfile]);

  if (loading)
    return (
      <Card title="Main Ministry Details" className={styles.container}>
        <Skeleton active />
      </Card>
    );
  if (isError)
    return (
      <Card title="Main Ministry Details" className={styles.container}>
        <Error error={error} />
      </Card>
    );
  return (
    <Card title="Main Ministry Details" className={styles.container}>
      <div className={styles.leaderInformation}>
        <h3>Ministry Leader</h3>
        <UserItem user={selectedProfile?.ministry?.leader} />
      </div>
      <Form
        form={form}
        layout="vertical"
        className={styles.contentContainer}
        onFinish={() => onFinish(form.getFieldsValue())}
      >
        <div className={styles.imageUploadContainer}>
          <div className={styles.imageContainer}>
            <PhotoUpload
              listType="picture-card"
              isAvatar={false}
              name="ministryImageUrl"
              form={form}
              action={`${process.env.API_URL}/upload`}
              default={selectedProfile?.ministry?.ministryImageUrl}
            />
          </div>
        </div>
        <Form.Item name="ministryImageUrl">
          <Input />
        </Form.Item>
        <Divider />
        {/* firstName and lastName should be on the same line */}
        <Form.Item name="name" className={styles.inputParent}>
          <Input type="text" placeholder="Ministry Name" addonBefore="Ministry Name" className={styles.input} />
        </Form.Item>
        <Form.Item name="description" className={styles.inputParent}>
          <Input.TextArea rows={4} className={styles.input} />
        </Form.Item>
        <Form.Item name="donationLink" className={styles.inputParent}>
          <Input
            type="text"
            placeholder="https://tithely.com/donation"
            addonBefore="Donation Link"
            className={styles.input}
          />
        </Form.Item>
        <Form.Item name="ministryType" className={styles.inputParent} label="Ministry Type">
          <Select
            placeholder="Select Ministry Type"
            className={styles.input}
            defaultValue={selectedProfile?.ministry?.ministryType}
          >
            {selectableOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <div className={styles.buttonContainer}>
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              className={styles.button}
              // loading={loading}
              icon={<FaSave />}
            >
              Save
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
};

export default MinistryDetails;
