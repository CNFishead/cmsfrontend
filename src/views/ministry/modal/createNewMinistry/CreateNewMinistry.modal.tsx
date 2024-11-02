import React from "react";
import styles from "./CreateNewMinistry.module.scss";
import { Button, Card, Form, Input, Modal, Select } from "antd";
import selectableMinistryTypes from "@/data/selectableMinistryTypes";
import UserItem from "@/components/userItem/UserItem.component";
import PhotoUpload from "@/components/photoUpload/PhotoUpload.component";
import { FaSave } from "react-icons/fa";
import useFetchData from "@/state/useFetchData";
import MemberType from "@/types/MemberType";
import usePostData from "@/state/usePostData";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}
const CreateNewMinistry = ({ open, setOpen }: Props) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { data: selectedProfile } = queryClient.getQueryData("selectedProfile" as any) as any;

  const [leaderSearch, setLeaderSearch] = React.useState("");
  const selectableOptions = selectableMinistryTypes();
  const { data: membersListData, isLoading: loading } = useFetchData({
    url: `/member/${selectedProfile?.ministry?._id}`,
    key: "membersList",
    enabled: !!selectedProfile?.ministry?._id,
    keyword: leaderSearch,
  });
  // console.log(leaderSearch);
  const { mutate: createNewMinistry } = usePostData({
    url: `/ministry/${selectedProfile?.ministry?._id}`,
    key: "ministryCreate",
    successMessage: "Ministry created successfully",
    queriesToInvalidate: ["ministryList"],
  });
  const onFinish = (values: any) => {
    createNewMinistry(values);
    form.resetFields();
    setOpen(false);
  };

  React.useEffect(() => {
    // if leadersearch changes, invalidate members query
    if (leaderSearch !== "") {
      queryClient.invalidateQueries({ queryKey: ["membersList"] });
    }
  }, [leaderSearch]);
  return (
    <Modal
      className={styles.container}
      open={open}
      closeIcon={true}
      onCancel={() => {
        form.resetFields();
        setOpen(false);
      }}
      footer={[
        <Button key="submit" type="primary" icon={<FaSave />} onClick={() => form.submit()}>
          Save
        </Button>,
      ]}
    >
      <Card title="Create New Ministry" className={styles.container}>
        {form.getFieldsValue().leader && (
          <div className={styles.leaderInformation}>
            <h3>Ministry Leader</h3>
            <UserItem user={form.getFieldsValue().leader as any} />
          </div>
        )}
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
                label="Ministry Banner Image"
                name="ministryImageUrl"
                form={form}
                action={`${process.env.API_URL}/upload`}
                default={form.getFieldsValue().ministryImageUrl}
              />
            </div>
          </div>
          {/* firstName and lastName should be on the same line */}
          <Form.Item name="name" className={styles.inputParent}>
            <Input type="text" addonBefore="Ministry Name" className={styles.input} />
          </Form.Item>
          <Form.Item name="description" className={styles.inputParent}>
            <Input.TextArea rows={4} className={styles.input} placeholder="Ministry Bio/Mission" />
          </Form.Item>
          <Form.Item name="ministryType" className={styles.inputParent} label="Ministry Type">
            <Select
              placeholder="Select Ministry Type"
              className={styles.input}
              defaultValue={form.getFieldsValue().ministryType}
            >
              {selectableOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="leader" className={styles.inputParent} label="Ministry Leader">
            <Select
              // onChange={() => console.log("changed")}
              onSearch={(value) => {
                setLeaderSearch(value);
              }}
              showSearch
              placeholder="Select Ministry Leader"
              className={styles.input}
              defaultValue={form.getFieldsValue().leader}
              loading={loading}
            >
              {membersListData?.members.map((member: MemberType) => (
                <Select.Option key={member._id} value={member._id}>
                  {member.firstName} {member.lastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
};

export default CreateNewMinistry;
