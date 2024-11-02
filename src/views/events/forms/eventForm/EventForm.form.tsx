"use client";
import React from "react";
import formStyles from "@/styles/Form.module.scss";
import { Button, DatePicker, Form, Input, Select } from "antd";
import { FormInstance } from "antd/lib";
import moment from "moment";
import { useUser } from "@/state/auth";
import useFetchData from "@/state/useFetchData";
import MinistryType from "@/types/Ministry";
import { useFormStore } from "@/state/ui/form";
import { label } from "framer-motion/client";
import usePostData from "@/state/usePostData";
import useUpdateData from "@/state/useUpdateData";
import useRemoveData from "@/state/useRemoveData";
import { FaTrash } from "react-icons/fa";
const { RangePicker } = DatePicker;

interface EventFormProps {
  setModalVisible: (visible: boolean) => void;
}

const EventForm = ({ setModalVisible }: EventFormProps) => {
  const { currentForm, setCurrentForm } = useFormStore();
  const [form] = Form.useForm();
  const [timer, setTimer] = React.useState<any>(null);
  const [keyword, setKeyword] = React.useState("");
  const { data: loggedInUser } = useUser();
  const { data: ministries } = useFetchData({
    url: `/ministry/${loggedInUser?.user?.ministry?._id}/subministries`,
    key: ["ministries", keyword],
    enabled: !!loggedInUser?.user?._id,
    keyword: keyword,
  });

  const { mutate: createEvent } = usePostData({
    url: `/event`,
    key: "eventCreate",
    queriesToInvalidate: ["events"],
  });

  const { mutate: updateEvent } = useUpdateData({
    queriesToInvalidate: ["events"],
    successMessage: "Event updated successfully",
  });

  const { mutate: deleteEvent } = useRemoveData({
    queriesToInvalidate: ["events"],
    successMessage: "Event deleted successfully",
  });

  const handleMinistrySearch = (value: string) => {
    // use a timer to prevent too many requests
    clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        setKeyword(value);
      }, 1500)
    );
  };

  const handleFinish = () => {
    const values = form.getFieldsValue();
    setCurrentForm(values);
  };

  // update component when keyword changes
  React.useEffect(() => {
    if (currentForm) {
      form.setFieldsValue(currentForm);
    }
  }, []);

  return (
    <Form
      form={form}
      className={formStyles.form}
      layout="vertical"
      preserve={false}
      initialValues={{
        ministry: currentForm?.ministry
          ? { label: currentForm?.ministry.name, value: JSON.stringify(currentForm?.ministry) }
          : undefined,
        name: "A new event",
        location: "Church",
        description: "A new event",
        dates: [moment().startOf("day"), moment().endOf("day")],
      }}
    >
      <Form.Item name="name" label="Title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name={"ministry"}
        label="Hosting ministry"
        tooltip="Leave this blank if the event is hosted by the church and not a sub ministry"
      >
        <Select
          showSearch
          onSearch={(value) => handleMinistrySearch(value)}
          options={ministries?.ministries?.map((ministry: MinistryType) => {
            return { label: ministry.name, value: JSON.stringify(ministry) };
          })}
          // clearable
          allowClear
          filterOption={false}
          optionLabelProp="label"
        ></Select>
      </Form.Item>
      <Form.Item name="location" label="Location of Event" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea />
      </Form.Item>
      <div className={formStyles.group}>
        <Form.Item name="dates" label="Event Dates" rules={[{ required: true }]}>
          <RangePicker
            // disable dates before today
            disabledDate={(current) => current && current < moment().startOf("day")}
            style={{ width: "100%" }}
            // time picker
            showTime
          />
        </Form.Item>
        {/* <Form.Item name="endDate" label="End Date" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} showTime />
        </Form.Item> */}
      </div>
      {/* button container */}
      <div className={formStyles.buttonContainer}>
        {currentForm?._id
          ? [
              <Button
                key="delete"
                danger
                onClick={() => {
                  // delete the event
                  deleteEvent({ url: `/event/${currentForm?._id} ` });
                  // close the modal
                  setModalVisible(false);
                }}
              >
                <FaTrash />
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={() => {
                  updateEvent({ url: `/event/${currentForm?._id}`, formData: form.getFieldsValue() });
                  setModalVisible(false);
                }}
              >
                Update
              </Button>,
            ]
          : [
              <Button key="cancel" onClick={() => setModalVisible(false)}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={() => {
                  createEvent(form.getFieldsValue(), {
                    onSuccess(data, variables, context) {
                      form.resetFields();
                      setModalVisible(false);
                    },
                  });
                }}
              >
                Create
              </Button>,
            ]}
      </div>
    </Form>
  );
};

export default EventForm;
