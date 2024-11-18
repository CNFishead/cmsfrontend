"use client";
import React, { useEffect } from "react";
import styles from "./CreateNewMember.module.scss";
import formStyles from "@/styles/Form.module.scss";
import { Button, Col, DatePicker, Divider, Form, Input, InputNumber, Radio, Row, Select, Tooltip } from "antd";
import PhotoUpload from "@/components/photoUpload/PhotoUpload.component";
import { states } from "@/data/states";
import { countries } from "@/data/countries";
import { useParams, useRouter } from "next/navigation"; 
import moment from "moment";
import FamilyType from "@/types/FamilyType";
import MinistryType from "@/types/Ministry"; 
import { useUser } from "@/state/auth";
import useApiHook from "@/state/useApi";

const CreateNewMember = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const router = useRouter();
  const [timer, setTimer] = React.useState<any>(null);
  const [familyKeyword, setFamilyKeyword] = React.useState<string>("");
  const [ministryKeyword, setMinistryKeyword] = React.useState<string>("");
  const [createFamilyModal, setCreateFamilyModal] = React.useState<boolean>(false);
  const [selectedFamily, setSelectedFamily] = React.useState<FamilyType>();
  const [image, setImage] = React.useState<any>(null); // the image that is uploaded
  const { data: loggedInData } = useUser();
  const { data: selectedProfile } = useApiHook({
    url: `/ministry/${loggedInData.user?.ministry?._id}`,
    key: "selectedProfile",
    enabled: !!loggedInData?.user?.ministry?._id,
    method: "GET",
  }) as any;
  const { data: memberInformation } = useApiHook({
    url: `/member/details/${id}`,
    key: "memberInformation",
    enabled: !!id,
    method: "GET",
  }) as any;
  const { data: familiesList, isFetching: familiesFetching } = useApiHook({
    url: `/family`,
    key: "familyList",
    keyword: familyKeyword,
    filter: `user;${loggedInData?.user?._id}`,
    method: "GET",
  }) as any;

  const { data: ministriesList, isLoading: ministriesLoading } = useApiHook({
    url: `/ministry/${selectedProfile?.ministry?._id}/subministries`,
    key: "ministryList",
    enabled: !!selectedProfile?.ministry?._id,
    keyword: ministryKeyword,
    filter: `user;${loggedInData?.user?._id}`,
    method: "GET",
  }) as any;

  const { mutate: updateMember } = useApiHook({
    successMessage: "Member updated successfully",
    queriesToInvalidate: ["memberInformation"],
    key: "updateMember",
    method: "PUT",
  }) as any;

  const { mutate: createMember } = useApiHook({
    successMessage: "Member created successfully",
    queriesToInvalidate: ["memberInformation"],
    key: "createMember",
    method: "POST",
  }) as any;

  const onFinish = (values: any) => {
    if (id) {
      // if the id exists, then we are updating the member
      updateMember(
        { url: `/member/${id}/update`, formData: { member: { ...values, _id: id } } },
        {
          onSuccess: () => {
            router.push("/members");
          },
        }
      );
    } else {
      // ministry, if their isnt a selectedMinistry, then use the mainMinistry
      // const ministryId = ministry ? ministry._id : mainMinistry._id;
      createMember({ url: `/member`, formData: { ...values } });
    }
  };

  const onSearch = (val: string, hook: any) => {
    // if val is an empty string, then dont search
    if (val === "") return;
    clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        hook(val);
      }, 1000) as any // wait 1000ms before searching
    );
  };

  useEffect(() => {
    if (memberInformation) {
      form.setFieldsValue({
        ...memberInformation?.data,
        birthday: moment(memberInformation?.data?.birthday),
        family: { _id: memberInformation?.data?.family?._id, name: memberInformation?.data?.family?.name },
        ministry: memberInformation?.data?.ministries?.map((ministry: MinistryType) => {
          return { value: ministry._id, label: ministry.name, _id: ministry._id };
        }),
      });
      setImage(memberInformation?.data?.profileImageUrl);
    }
  }, [memberInformation]);
  const handleFamilyChange = (value: any, option: any) => {
    // Set the selectedFamily state when the user makes a selection
    setSelectedFamily(option?.data);
    form.setFieldsValue({
      ...form.getFieldsValue(),
      family: { _id: option?.data?._id, name: option?.data?.name },
    });
  };

  useEffect(() => {
    return () => {
      // clear the form
      form.resetFields();
    };
  }, []);
  return (
    <div className={styles.container}>
      {/* <CreateFamilyModal dispatch={dispatch} open={createFamilyModal} onClose={() => setCreateFamilyModal(false)} /> */}
      <Form
        form={form}
        layout="vertical"
        className={formStyles.form}
        onFinish={() => onFinish(form.getFieldsValue())}
        initialValues={{
          // set the default values for the form
          sex: "male",
          maritalStatus: "single",
          location: {
            country: "United States",
            state: "Tennessee",
          },
          role: "member",
          isActive: true,
        }}
      >
        {/* family information */}
        <Row className={formStyles.editContainer}>
          <Col span={24}>
            <Divider orientation="center">
              <Tooltip title={`Easily identify Members from their profile photo!`}>Profile Photo</Tooltip>
            </Divider>
            {/* if there is an id, wait for the fetch before displaying the photo */}

            <div className={styles.imageUploadContainer}>
              <div className={styles.imageContainer}>
                <PhotoUpload
                  name="profileImageUrl"
                  listType="picture-card"
                  isAvatar={true}
                  form={form}
                  action={`${process.env.API_URL}/upload`}
                  default={image}
                  placeholder="Upload a profile photo"
                />
              </div>
            </div>
          </Col>
          <Row gutter={16}>
            <Col span={12}>
              <Divider orientation="center">Family Information</Divider>
              <Form.Item name={["family"]}>
                <Form.Item
                  name={
                    // create the family object field
                    ["family", "name"]
                  }
                  className={styles.inputParent}
                >
                  <Select
                    showSearch
                    placeholder="Select a family"
                    optionFilterProp="children"
                    onSearch={(value) => onSearch(value, setFamilyKeyword)}
                    onChange={(value, option) => handleFamilyChange(value, option)}
                    className={formStyles.input}
                    loading={familiesFetching}
                  >
                    {familiesList?.families?.map((family: FamilyType) => (
                      <Select.Option key={family._id} value={family._id} data={family}>
                        {family.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form.Item>
              <Col span={24} className={styles.mutedText}>
                Associates this member with a family, This is an optional step, but is recommended for better
                organization. if the member is a child, its required for them to be associated with a family, with at
                least one adult. If the family does not exist, you can create one by clicking{" "}
                <span onClick={() => setCreateFamilyModal(true)} className={styles.spanLink}>
                  here
                </span>
              </Col>
            </Col>
            <Col span={12}>
              <Divider orientation="center">Ministry Information</Divider>
              <Form.Item name={"ministry"}>
                <Select
                  showSearch
                  placeholder="Select a ministry"
                  optionFilterProp="children"
                  onSearch={(val: any) => onSearch(val, setMinistryKeyword)}
                  className={formStyles.input}
                  mode={"multiple"}
                  loading={ministriesLoading}
                >
                  {ministriesList?.ministries?.map((ministry: MinistryType) => (
                    <Select.Option key={ministry._id} value={ministry._id} name={ministry.name}>
                      {ministry.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Col span={24} className={styles.mutedText}>
                Associate this member with a ministry, This is an optional step, but is recommended for better
                organization.
              </Col>
            </Col>
          </Row>
        </Row>
        <div className={formStyles.editContainer}>
          <Divider orientation="center">Member Information</Divider>
          {/* firstName and lastName should be on the same line */}
          <div className={formStyles.group}>
            <Form.Item
              name="firstName"
              rules={[{ required: true, message: "Please enter a first name" }]}
              label="First Name"
            >
              <Input type="text" placeholder="First Name" className={`${formStyles.input} ${styles.addon}`} />
            </Form.Item>

            <Form.Item name="lastName" label="Last Name">
              <Input type="text" placeholder="Last Name" className={formStyles.input} />
            </Form.Item>
            <Form.Item label="Birthday" name="birthday">
              <DatePicker
                placeholder="Birthday"
                className={formStyles.input}
                name="birthday"
                // allow the user to type in the date
                format={"MM/DD/YYYY"}
              />
            </Form.Item>

            <Form.Item name="email" label="Email Address">
              <Input type="text" placeholder="example@test.com" className={formStyles.input} />
            </Form.Item>

            <Form.Item name="sex" label="Sex">
              <Select placeholder="Sex/Gender" className={formStyles.input}>
                <Select.Option value="male">Male</Select.Option>
                <Select.Option value="female">Female</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="phoneNumber" label="Phone Number">
              <InputNumber
                className={formStyles.input}
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
              />
            </Form.Item>
          </div>
          <div className={formStyles.group}>
            <Form.Item name="maritalStatus" label="Marital Status">
              <Select placeholder="Marital Status" className={formStyles.input}>
                <Select.Option value="single">Single</Select.Option>
                <Select.Option value="married">Married</Select.Option>
                <Select.Option value="divorced">Divorced</Select.Option>
                <Select.Option value="widowed">Widowed</Select.Option>
              </Select>
            </Form.Item>
            <Tooltip
              title="Tags are used to help you organize your members. You can use tags to filter members in the members page. You can also use tags to help denote special information about a member. For example, you can create a tag called 'Baptized' and add it to all members who have been baptized. Then you can filter members by the 'Baptized' tag to see all members who have been baptized."
              placement="topLeft"
            >
              <Form.Item name="tags" label="Tags/Hobbies" help="values are ( , ) seperated">
                <Select
                  mode="tags"
                  placeholder="Tags"
                  className={formStyles.input}
                  tokenSeparators={[","]}
                  filterOption={(input: string, option: any) =>
                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Tooltip>
          </div>
        </div>
        <div className={formStyles.editContainer}>
          {/* address information */}
          <Divider orientation="center">Address Information</Divider>
          <div className={formStyles.group}>
            <Form.Item name={["location", "address"]} label="Address">
              <Input type="text" placeholder="Address" className={styles.input} />
            </Form.Item>
            <Form.Item name={["location", "address2"]} label="Address Cont.">
              <Input type="text" placeholder="Address Continued" className={styles.input} />
            </Form.Item>
            <Form.Item name={["location", "city"]} label="City">
              <Input type="text" placeholder="City" className={styles.input} />
            </Form.Item>
            <Form.Item name={["location", "state"]} label="State">
              <Select
                placeholder="State"
                showSearch
                className={styles.input}
                filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                options={states.map((state) => ({
                  label: `${state.name} (${state.abbreviation})`,
                  value: state.abbreviation,
                }))}
                optionFilterProp="children"
              ></Select>
            </Form.Item>
            <Form.Item name={["location", "zipCode"]} label="Zip Code">
              <Input type="text" placeholder="Zip Code" className={styles.input} />
            </Form.Item>
            <Form.Item name={["location", "country"]} label="Country">
              <Select
                placeholder="Country"
                showSearch
                className={styles.input}
                filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                options={countries.map((country) => ({ label: `${country}`, value: country }))}
                optionFilterProp="children"
                allowClear={true}
              ></Select>
            </Form.Item>
          </div>
        </div>
        <div className={formStyles.editContainer}>
          {/* membership information */}
          <Divider orientation="center">Membership Information</Divider>
          <div className={formStyles.group}>
            <div className={formStyles.group}>
              <Form.Item name="role" label="Role in The Church">
                <Select placeholder="Role" className={styles.input}>
                  <Select.Option value="member">Member</Select.Option>
                  <Select.Option value="leader">Leader</Select.Option>
                  <Select.Option value="staff">Staff</Select.Option>
                  <Select.Option value="admin">Admin</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <Form.Item name="isActive" className={styles.radioContainer} label="Active Member">
              <Radio.Group className={styles.radioGroup}>
                <Radio value={true}>Active</Radio>
                <Radio value={false}>Inactive</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
        </div>
        <div
          style={{
            width: "100%",
          }}
        >
          <Button type="primary" htmlType="submit" className={formStyles.button} style={{ margin: "auto" }}>
            {id ? "Update Member" : "Create Member"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateNewMember;
