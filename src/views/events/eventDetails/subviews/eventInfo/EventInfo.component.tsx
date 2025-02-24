"use client";
import React from "react";
import styles from "./EventInfo.module.scss";
import formStyles from "@/styles/Form.module.scss";
import { Button, DatePicker, Form, Input, Select } from "antd";
import { useParams } from "next/navigation";
import useApiHook from "@/state/useApi";
import { useUser } from "@/state/auth";
import TinyEditor from "@/components/tinyEditor/TinyEditor.component";
import parser from "html-react-parser";
import { label, p } from "framer-motion/client";
import MinistryType from "@/types/Ministry";
import dayjs from "dayjs";
import moment from "moment";

const EventInfo = () => {
  const [form] = Form.useForm();
  const { id } = useParams();

  const [keyword, setKeyword] = React.useState("");
  const [timer, setTimer] = React.useState<any>(null);
  const { data: userData } = useUser();

  const { data } = useApiHook({
    url: `/event`,
    key: "eventInfo",
    method: "GET",
    enabled: !!id && !!userData?.user?._id,
    filter: `user;${userData?.user?._id}|_id;${id}`,
  }) as any;
  const { data: ministryData } = useApiHook({
    url: `/ministry/${userData?.user?.ministry?._id}/subministries`,
    key: ["ministries", keyword],
    enabled: !!userData?.user?._id,
    keyword: keyword,
    filter: `user;${userData?.user?._id}`,
    method: "GET",
  }) as any;

  const { mutate: createEvent } = useApiHook({
    url: `/event`,
    key: "eventCreate",
    queriesToInvalidate: ["eventInfo", "events"],
    method: "POST",
  }) as any;

  const { mutate: updateEvent } = useApiHook({
    queriesToInvalidate: ["events", "eventInfo"],
    successMessage: "Event updated successfully",
    method: "PUT",
    key: "eventUpdate",
  }) as any;
  const handleMinistrySearch = (value: string) => {
    // use a timer to prevent too many requests
    clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        setKeyword(value);
      }, 1500)
    );
  };

  const onFinish = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = {
          ...values,
        };
        if (data?.payload) {
          updateEvent({ url: `/event/${data?.payload?._id}`, formData: payload });
        } else {
          createEvent({ formData: payload });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    if (data?.payload) {
      form.setFieldsValue({
        ...data.payload,
        ministry: data?.payload?.ministry?._id,
        description: parser(`${parser(data.payload.description)}`),
        // set the dates splitting the date and time strings
        startDate: dayjs(new Date(`${data.payload.startDate}`)),
        endDate: dayjs(new Date(`${data.payload.endDate}`)),
      });
    }
  }, [data?.payload, form]);

  return (
    <Form
      form={form}
      className={`${formStyles.form} ${styles.container}`}
      layout="vertical"
      onFinish={(values) => {
        console.log(values);
      }}
      initialValues={{
        // set start date to today
        startDate: dayjs().startOf("hour"),
        // set end date to today
        endDate: dayjs().startOf("hour").add(1, "hour"),
      }}
    >
      <div className={formStyles.editContainer}>
        <div className={formStyles.group}>
          <Form.Item
            label="Event Name"
            name="name"
            rules={[{ required: true, message: "Please input the event name!" }]}
          >
            <Input type="text" className={formStyles.input} />
          </Form.Item>
          <Form.Item
            label="Event Tags"
            name="tags"
            tooltip="Tags are used to filter events. They are not visible to users. You can add multiple tags by separating them with a comma."
          >
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="children, youth, adults, etc."
              tokenSeparators={[","]}
            />
          </Form.Item>
          <Form.Item
            name={"ministry"}
            label="Hosting ministry"
            tooltip="Leave this blank if the event is hosted by the church and not a sub ministry"
          >
            <Select
              showSearch
              onSearch={(value) => handleMinistrySearch(value)}
              options={ministryData?.payload?.map((ministry: MinistryType) => {
                return { label: ministry.name, value: ministry._id };
              })}
              // clearable
              allowClear
              filterOption={false}
              optionLabelProp="label"
              defaultValue={form.getFieldValue("ministry._id")}
            ></Select>
          </Form.Item>
        </div>
        <div className={formStyles.group}>
          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[{ required: true, message: "Please input an event date!" }]}
          >
            <DatePicker
              showTime
              className={formStyles.input}
              // show time, exclude seconds
              showSecond={false}
            />
          </Form.Item>
          <Form.Item
            label="End Date"
            name="endDate"
            rules={[{ required: true, message: "Please input an event end date!" }]}
          >
            <DatePicker showTime className={formStyles.input} showSecond={false} />
          </Form.Item>
        </div>
        <div className={formStyles.group}>
          <Form.Item
            label="External Link"
            name="externalLink"
            tooltip="If this event is hosted externally, please provide the link to the event, on the check-in page, users will be redirected to this link"
          >
            <Input type="text" className={formStyles.input} />
          </Form.Item>
        </div>
        <div className={formStyles.group}>
          <Form.Item
            label="Event Description"
            name="description"
            rules={[{ required: true, message: "Please input the event name!" }]}
          >
            <TinyEditor
              initialContent={`${parser(`${data?.payload?.description || ""}`)}`}
              handleChange={(value) => {
                form.setFieldsValue({ decription: value });
              }}
            />
          </Form.Item>
        </div>
      </div>
      <div className={formStyles.buttonContainer}>
        <Button className={formStyles.button} type="primary" onClick={onFinish}>
          {data?.payload ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </Form>
  );
};

export default EventInfo;
