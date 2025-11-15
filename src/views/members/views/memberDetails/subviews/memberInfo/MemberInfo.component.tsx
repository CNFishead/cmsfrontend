"use client";
import React from "react";
import styles from "./MemberInfo.module.scss";
import formStyles from "@/styles/Form.module.scss";
import { Button, DatePicker, Divider, Form, Input, InputNumber, Radio, Select, Tooltip } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/state/auth";
import useApiHook from "@/state/useApi";
import moment from "moment";
import MinistryType from "@/types/Ministry";
import PhotoUpload from "@/components/photoUpload/PhotoUpload.component";
import { states } from "@/data/states";
import { countries } from "@/data/countries";
import { useQueryClient } from "@tanstack/react-query";
import { useSelectedProfile } from "@/hooks/useSelectedProfile";

const MemberInfo = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [image, setImage] = React.useState<any>(null); // the image that is uploaded
  const { data: loggedInData } = useUser();
  const { selectedProfile } = useSelectedProfile();
  const { data: memberInformation } = useApiHook({
    url: `/ministry/member/${id}`,
    key: ["memberInformation", id as string],
    enabled: !!id,
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
        { url: `/ministry/member/${id}`, formData: { member: { ...values, _id: id } } },
        {
          onSuccess: () => {
            router.push("/members");
          },
        }
      );
    } else {
      // ministry, if their isn't a selectedMinistry, then use the mainMinistry
      // const ministryId = ministry ? ministry._id : mainMinistry._id;
      createMember({ url: `/ministry/member`, formData: { ...values } });
    }
  };

  React.useEffect(() => {
    if (memberInformation) {
      form.setFieldsValue({
        ...memberInformation?.payload,
        birthday: moment(memberInformation?.payload?.birthday),
        family: { _id: memberInformation?.payload?.family?._id, name: memberInformation?.payload?.family?.name },
        ministry: memberInformation?.payload?.ministries?.map((ministry: MinistryType) => {
          return { value: ministry._id, label: ministry.name, _id: ministry._id };
        }),
      });
      setImage(memberInformation?.payload?.profileImageUrl);
    }
  }, [memberInformation]);

  // clean up the form when the component unmounts
  React.useEffect(() => {
    return () => {
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["memberInformation"] });
    };
  }, []);
  return (
    <div className={styles.container}>
      <div className={`${styles.subContainer}`}>
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
          <div className={formStyles.editContainer}>
            <Divider orientation="center">
              <Tooltip title={`Easily identify Members from their profile photo!`}>Profile Photo</Tooltip>
            </Divider>
            {/* if there is an id, wait for the fetch before displaying the photo */}

            <div className={styles.imageUploadContainer}>
              <div className={styles.imageContainer}>
                <PhotoUpload
                  name="profileImageUrl"
                  listType="picture-card"
                  tooltip="Upload a photo of yourself! this is completely optional but it helps church staff identify you in our system!"
                  isAvatar={true}
                  aspectRatio={1 / 1}
                  form={form}
                  action={`${process.env.API_URL}/upload/cloudinary`}
                  default={image}
                  placeholder="Upload a photo of the member!"
                  bodyData={{
                    ministryName: selectedProfile?.name,
                  }}
                />
              </div>
            </div>
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
          <div className={styles.footer}>
            <div className={styles.buttonContainer}>
              <Button type="primary" htmlType="submit" className={formStyles.button} style={{ margin: "auto" }}>
                {id ? "Update Member" : "Create Member"}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default MemberInfo;
