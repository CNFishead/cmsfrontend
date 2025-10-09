import React from "react";
import styles from "../Info.module.scss";
import formStyles from "@/styles/Form.module.scss";
import { Button, Card, Form, Input, Select } from "antd";
import useApiHook from "@/hooks/useApi";
import PhotoUpload from "@/components/photoUpload/PhotoUpload.component";
import MinistryType from "@/types/Ministry";
import selectableMinistryTypes from "@/data/selectableMinistryTypes";
import { useSelectedProfile } from "@/hooks/useSelectedProfile";

const BasicInfo = () => {
  const [ministryImage, setMinistryImage] = React.useState<string | undefined>(undefined);
  const { selectedProfile: profile } = useSelectedProfile();
  const [form] = Form.useForm();
  const selectableOptions = selectableMinistryTypes();

  const { mutate: updateProfile } = useApiHook({
    method: "PUT",
    key: "updateProfile",
    queriesToInvalidate: ["profile", "ministry"],
    successMessage: "Ministry profile updated successfully",
  }) as any;

  React.useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        ...profile,
      });
      setMinistryImage(profile?.ministryImageUrl);
    }
  }, [profile, form]);

  const handleSubmit = async (values: MinistryType) => {
    await updateProfile({
      url: `/ministry/${profile?._id}`,
      formData: values,
    });
  };
  return (
    <Card className={styles.container}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>Ministry Basic Information</h1>
        <p className={styles.description}>Update your ministry&apos;s essential details and contact information.</p>
      </div>

      <Form form={form} layout="vertical" className={styles.formContainer} onFinish={handleSubmit}>
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Essential Information</h3>
          <div className={styles.formGroup}>
            <div className={formStyles.row}>
              <div className={`${styles.imageContainer} ${formStyles.field}`}>
                <PhotoUpload
                  default={ministryImage}
                  name="ministryImageUrl"
                  label="Upload Ministry Image"
                  action={`${process.env.API_URL}/upload/cloudinary/file`}
                  isAvatar={false}
                  form={form}
                  aspectRatio={16 / 9}
                  placeholder="Upload ministry image"
                  tooltip="Upload a ministry banner or logo image"
                  imgStyle={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "300px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className={`${formStyles.row} ${formStyles.column}`}>
                <Form.Item
                  label="Ministry Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please enter the ministry name" },
                    { min: 2, message: "Ministry name must be at least 2 characters" },
                    { max: 100, message: "Ministry name cannot exceed 100 characters" },
                  ]}
                  className={formStyles.field}
                >
                  <Input type="text" size="large" placeholder="Enter ministry name" />
                </Form.Item>
                <Form.Item
                  label="Ministry Type"
                  name="ministryType"
                  rules={[{ required: true, message: "Please select a ministry type" }]}
                  className={formStyles.field}
                >
                  <Select size="large" placeholder="Select ministry type" options={selectableOptions} />
                </Form.Item>
              </div>
            </div>
            <Form.Item
              label="Ministry Description"
              name="description"
              rules={[
                { required: true, message: "Please provide a ministry description" },
                { min: 10, message: "Description must be at least 10 characters" },
                { max: 1000, message: "Description cannot exceed 1000 characters" },
              ]}
              className={formStyles.field}
            >
              <Input.TextArea
                rows={4}
                placeholder="Describe your ministry's mission and purpose..."
                showCount
                maxLength={1000}
              />
            </Form.Item>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Location Information</h3>
          <div className={styles.formGroup}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please enter the ministry address" }]}
              className={formStyles.field}
            >
              <Input type="text" size="large" placeholder="Street address" />
            </Form.Item>
            <div className={formStyles.row}>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: "Please enter the city" }]}
                className={formStyles.field}
              >
                <Input type="text" size="large" placeholder="City" />
              </Form.Item>
              <Form.Item
                label="State"
                name="state"
                rules={[{ required: true, message: "Please enter the state" }]}
                className={formStyles.field}
              >
                <Input type="text" size="large" placeholder="State" />
              </Form.Item>
            </div>
            <div className={formStyles.row}>
              <Form.Item
                label="ZIP Code"
                name="zipCode"
                rules={[{ required: true, message: "Please enter the ZIP code" }]}
                className={formStyles.field}
              >
                <Input type="text" size="large" placeholder="ZIP Code" />
              </Form.Item>
              <Form.Item
                label="Country"
                name="country"
                rules={[{ required: true, message: "Please enter the country" }]}
                className={formStyles.field}
              >
                <Input type="text" size="large" placeholder="Country" defaultValue="United States" />
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>

      <div className={styles.actionContainer}>
        <Button
          className={styles.button}
          size="large"
          onClick={() => form.submit()}
          onSubmit={(e) => e.preventDefault()}
          type="primary"
        >
          Update Ministry Information
        </Button>
      </div>
    </Card>
  );
};

export default BasicInfo;
