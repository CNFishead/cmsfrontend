"use client";
import React from "react";
import styles from "./EventInfo.module.scss";
import formStyles from "@/styles/Form.module.scss";
import { Button, DatePicker, Form, Input, Select } from "antd";
import { useParams, useRouter } from "next/navigation";
import useApiHook from "@/state/useApi";
import { useUser } from "@/state/auth";
import TinyEditor from "@/components/tinyEditor/TinyEditor.component";
import parser from "html-react-parser";
import MinistryType from "@/types/Ministry";
import dayjs from "dayjs";
import Loader from "@/components/loader/Loader.component";
import { useQueryClient } from "@tanstack/react-query";
import { useSelectedProfile } from "@/hooks/useSelectedProfile";

const EventInfo = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const router = useRouter();
  const [keyword, setKeyword] = React.useState("");
  const [timer, setTimer] = React.useState<any>(null);
  const { data: userData } = useUser();
  const queryClient = useQueryClient();
  const { selectedProfile } = useSelectedProfile();

  const { data } = useApiHook({
    url: `/event`,
    key: ["eventInfo", `${id}`],
    method: "GET",
    enabled: !!id && !!userData?._id,
    filter: `user;${userData?._id}|_id;${id}`,
  }) as any;
  const { data: ministryData } = useApiHook({
    url: `/ministry/${selectedProfile?._id}/subministries`,
    key: ["ministries", keyword],
    enabled: !!selectedProfile?._id,
    keyword: keyword,
    filter: `user;${userData?._id}`,
    method: "GET",
  }) as any;

  const { mutate: createEvent, isLoading: createLoading } = useApiHook({
    key: "eventCreate",
    queriesToInvalidate: ["eventInfo", "events"],
    method: "POST",
    successMessage: "Event created successfully",
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
        if (data?.payload[0]?._id) {
          updateEvent({ url: `/event/${data?.payload[0]?._id}`, formData: payload });
        } else {
          createEvent(
            { url: `/event`, formData: payload },
            {
              onSuccess: (data) => {
                router.push(`/events/${data?.data?._id}`);
              },
            }
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    if (data?.payload[0]) {
      form.setFieldsValue({
        ...data.payload[0],
        ministry: data?.payload[0]?.ministry?._id,
        // set the dates splitting the date and time strings
        startDate: dayjs(new Date(`${data.payload[0].startDate}`)),
        endDate: dayjs(new Date(`${data.payload[0].endDate}`)),
      });
    }
    return () => {
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["eventInfo"] });
    };
  }, [data?.payload[0], form]);

  return (
    <Form
      form={form}
      className={`${formStyles.form} ${styles.container}`}
      layout="vertical"
      initialValues={{
        // set start date to today
        startDate: dayjs().startOf("hour"),
        // set end date to today
        endDate: dayjs().startOf("hour").add(1, "hour"),
      }}
      disabled={createLoading}
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
          <Form.Item
            label="Location"
            name="location"
            tooltip="Provide the location of the event, e.g. Church Hall, 123 main st, etc."
            rules={[{ required: true, message: "Please input the event location!" }]}
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
              initialContent={`${form.getFieldsValue().description}`}
              handleChange={(value) => {
                form.setFieldsValue({ description: value });
              }}
            />
          </Form.Item>
        </div>
      </div>
      <div className={formStyles.buttonContainer}>
        <Button className={formStyles.button} type="primary" onClick={onFinish}>
          {data?.payload[0] ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </Form>
  );
};

export default EventInfo;
