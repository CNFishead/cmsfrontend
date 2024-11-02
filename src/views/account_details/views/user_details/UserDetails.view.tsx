"use client";
import React from "react";
import styles from "./UserDetails.module.scss";
import { Button, Card, Divider, Form, Input, InputNumber, Skeleton } from "antd";
import { FaSave } from "react-icons/fa";
import PhotoUpload from "@/components/photoUpload/PhotoUpload.component";
import Error from "@/components/error/Error.component";
import { useUser, useUserDetails } from "@/state/auth";
import useUpdateData from "@/state/useUpdateData";

const UserDetails = () => {
  const [form] = Form.useForm();
  const { data: loggedInData, error, isLoading: loading } = useUser();
  const { data: payload } = useUserDetails(loggedInData?.user._id);

  const { mutate: updateUser } = useUpdateData({
    queriesToInvalidate: ["user"],
  });

  React.useEffect(() => {
    form.setFieldsValue({ ...payload?.user });
  }, [payload?.user]);

  const onFinish = (values: any) => {
    updateUser({
      url: `/user`,
      formData: {
        ...values,
        profileImageUrl: values.profileImageUrl?.file?.response?.imageUrl || values.profileImageUrl,
      },
    }) as any;
  };

  if (typeof window === "undefined" || loading)
    return (
      <Card title="Account Details" className={styles.container}>
        <div className={styles.imageUploadContainer}>
          <div className={styles.imageContainer}>
            <PhotoUpload
              listType="picture-card"
              isAvatar={true}
              action={`${process.env.API_URL}/upload`}
              default={payload?.user?.profileImageUrl}
              form={form}
            />
          </div>
        </div>
        <Skeleton active />
      </Card>
    );
  if (error || !payload?.user)
    return (
      <Card title="Account Details" className={styles.container}>
        <Error
          error={!payload?.user ? "No user object found, please try navigating away from the page and back" : error}
        />
      </Card>
    );
  return (
    <Card title="Account Details" className={styles.container}>
      <Form
        form={form}
        layout="vertical"
        className={styles.contentContainer}
        onFinish={() => onFinish(form.getFieldsValue())}
      >
        <div className={styles.imageUploadContainer}>
          <div className={styles.imageContainer}>
            <PhotoUpload
              name="profileImageUrl"
              listType="picture-card"
              isAvatar={true}
              form={form}
              action={`${process.env.API_URL}/upload`}
              default={payload?.user?.profileImageUrl}
              placeholder="Upload a profile photo"
            />
          </div>
        </div>
        <Form.Item name="profileImageUrl">
          <Input />
        </Form.Item>
        <Divider />
        {/* firstName and lastName should be on the same line */}
        <div className={styles.nameContainer}>
          <Form.Item name="firstName" className={styles.inputParent}>
            <Input type="text" placeholder="First Name" addonBefore="First Name" className={styles.input} />
          </Form.Item>
          <Form.Item name="lastName" className={styles.inputParent}>
            <Input type="text" placeholder="Last Name" addonBefore="Last Name" className={styles.input} />
          </Form.Item>
        </div>
        <Form.Item name="username" className={styles.inputParent}>
          <Input type="text" placeholder="Username" addonBefore="username" className={styles.input} />
        </Form.Item>
        <Form.Item name="email" className={styles.inputParent}>
          <Input type="text" addonBefore="Email" className={styles.input} />
        </Form.Item>
        <Form.Item name="phoneNumber" className={styles.inputParent}>
          <InputNumber
            style={{ width: "100%" }}
            className={styles.input}
            controls={false}
            formatter={(value: any) => {
              const phoneNumber = value.replace(/[^\d]/g, "");
              const phoneNumberLength = phoneNumber.length;
              if (phoneNumberLength < 4) {
                return phoneNumber;
              } else if (phoneNumberLength < 7) {
                return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
              }
              return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
            }}
            parser={(value: any) => value.replace(/[^\d]/g, "")}
            placeholder="Enter Phone Number"
            addonBefore="Phone Number"
          />
        </Form.Item>
        <div className={styles.buttonContainer}>
          <Form.Item>
            <Button
              type="primary"
              className={styles.button}
              htmlType="submit"
              // loading={updateLoading}
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

export default UserDetails;
