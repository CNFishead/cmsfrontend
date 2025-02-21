"use client";
import React from "react";
import formStyles from "@/styles/Form.module.scss";
import styles from "../MinistryDetails.module.scss";
import { Button, Divider, Form, Input, Row, Select } from "antd";
import { useParams, useRouter } from "next/navigation";
import useApiHook from "@/state/useApi";
import { useUser } from "@/state/auth";
import PhotoUpload from "@/components/photoUpload/PhotoUpload.component";
import slugify from "slugify";
import UserItem from "@/components/userItem/UserItem.component";
import selectableMinistryTypes from "@/data/selectableMinistryTypes";
import { useSearchStore } from "@/state/search/search";
import { useQueryClient } from "@tanstack/react-query";
import MemberType from "@/types/MemberType";

const MinistryInfo = () => {
  const [form] = Form.useForm();
  const { data: loggedInUser } = useUser();
  const selectableOptions = selectableMinistryTypes();
  const { id } = useParams();
  const router = useRouter();
  const [leaderSearch, setLeaderSearch] = React.useState("");
  const { setSearch } = useSearchStore();
  const queryClient = useQueryClient();

  const { data: ministryData } = useApiHook({
    url: `/ministry/${id}`,
    key: "ministry",
    enabled: !!id,
    method: "GET",
  }) as any;

  const { data: selectedProfile } = useApiHook({
    url: `/ministry/${loggedInUser.user?.ministry?._id}`,
    key: "selectedProfile",
    enabled: !!loggedInUser?.user?.ministry?._id,
    method: "GET",
  });

  const { mutate: createNewMinistry } = useApiHook({
    successMessage: "Ministry created successfully",
    queriesToInvalidate: ["ministryList", "ministry", "membersList"],
    url: `/ministry/${selectedProfile?.ministry?._id}`,
    key: "ministryCreate",
    method: "POST",
  }) as any;
  const { mutate: updateMinistry } = useApiHook({
    successMessage: "Ministry updated successfully",
    queriesToInvalidate: ["ministryList", "ministry", "membersList"],
    key: "ministryUpdate",
    method: "PUT",
  }) as any;

  const { data: membersListData, isLoading: loading } = useApiHook({
    url: `/member/${selectedProfile?.ministry?._id}`,
    key: "membersList",
    enabled: !!selectedProfile?.ministry?._id,
    method: "GET",
    filter: `user;${loggedInUser?.user._id}`,
  }) as any;

  React.useEffect(() => {
    if (id) {
      form.setFieldsValue(ministryData?.ministry);
    }
  }, [ministryData]);
  React.useEffect(() => {
    if (leaderSearch !== "") setSearch(leaderSearch);
    queryClient.invalidateQueries(["membersList"] as any);
  }, [leaderSearch]);

  React.useEffect(() => {
    return () => {
      setSearch("");
      form.resetFields();
    };
  }, []);
  const onFinish = (values: any) => {
    if (id) {
      updateMinistry({ url: `/ministry/${id}`, formData: { ...values, _id: id } });
      return;
    }
    createNewMinistry(
      { url: `/ministry/${selectedProfile?.ministry?._id}`, formData: values },
      {
        onSuccess: () => {
          // redirect to ministries page
          router.push("/ministries");
        },
      }
    );
    form.resetFields();
  };
  return (
    <div className={styles.container}>
      <Form
        form={form}
        layout="vertical"
        className={formStyles.form}
        onFinish={() => onFinish(form.getFieldsValue())}
        initialValues={{
          ministryType: "Small Group",
        }}
      >
        <div className={formStyles.group}>
          <div className={formStyles.editContainer}>
            <Divider orientation="left">Ministry Banner Image</Divider>
            <div className={styles.imageUploadContainer}>
              <div className={styles.imageContainer}>
                <PhotoUpload
                  listType="picture-circle"
                  isAvatar={false}
                  imgStyle={{}}
                  label=""
                  name="ministryImageUrl"
                  form={form}
                  action={`${process.env.API_URL}/upload/cloudinary`}
                  default={form.getFieldsValue().ministryImageUrl}
                  bodyData={{
                    username: loggedInUser.user?.username,
                    folder: slugify(`${selectedProfile?.ministry?.name}`),
                  }}
                  aspectRatio={14/10}
                />
              </div>
            </div>
            <div className={styles.helperText}>
              <p>Upload a banner image for your ministry</p>
              <p>This will be used as an image placeholder when members sign-in</p>
            </div>
            {ministryData && (
              <div className={styles.leaderInformation}>
                <h3>Ministry Leader</h3>
                <UserItem user={ministryData?.ministry?.leader as any} />
              </div>
            )}
            <Divider orientation="left">Ministry Details</Divider>
            {/* firstName and lastName should be on the same line */}
            <Form.Item name="name">
              <Input type="text" addonBefore="Ministry Name" className={formStyles.input} />
            </Form.Item>
            <Form.Item name="description" className={styles.inputParent}>
              <Input.TextArea rows={4} className={formStyles.input} placeholder="Ministry Bio/Mission" />
            </Form.Item>
            <Form.Item name="ministryType" className={styles.inputParent} label="Ministry Type">
              <Select
                placeholder="Select Ministry Type"
                className={formStyles.input}
                defaultValue={form.getFieldsValue().ministryType}
              >
                {selectableOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              // name should be an object with the id and name of the leader
              name={["leader", "_id"]}
              className={styles.inputParent}
              label="Ministry Leader"
            >
              <Select
                // onChange={() => console.log("changed")}
                onSearch={(value) => {
                  setLeaderSearch(value);
                }}
                showSearch
                placeholder="Select Ministry Leader"
                className={formStyles.input}
                value={form.getFieldsValue().leader?.fullName}
                loading={loading}
              >
                {membersListData?.members?.map((member: MemberType) => (
                  <Select.Option key={member._id} value={member._id}>
                    {member.firstName} {member.lastName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Row justify={"center"}>
              <Button
                type="primary"
                onClick={() => form.submit()}
                className={formStyles.submitButton}
                loading={loading}
                disabled={loading}
              >
                {id ? "Update Ministry" : "Create Ministry"}
              </Button>
            </Row>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default MinistryInfo;
